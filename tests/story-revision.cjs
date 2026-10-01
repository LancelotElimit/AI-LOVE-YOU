const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {createRequire} = require('node:module');

const root = path.resolve(__dirname, '..');
const scope = {window:{}};
vm.createContext(scope);
for (const [,file] of fs.readFileSync(path.join(root,'index.html'),'utf8').matchAll(/<script defer src="([^"]+)"/g)) {
  if (file === 'game.js' || file.startsWith('assets/')) continue;
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),scope,{filename:file});
}
const {STORY,ROUTE_LINES} = scope.window;
for (const [hero,lines] of Object.entries(ROUTE_LINES)) {
  for (const id of ['gate.1','gate.4','resolve-home.1','resolve-stay.1']) {
    assert.ok(STORY[id],id);
    assert.ok(lines[id],`${hero}/${id}`);
  }
}
for (const id of ['gate.1','gate.4','resolve-home.1','resolve-stay.1']) {
  assert.equal(new Set(Object.values(ROUTE_LINES).map(lines=>lines[id])).size,5);
}
const firstMeeting = Object.values(STORY).filter(node=>!node.chapter).map(node=>node.text).join('\n');
assert.ok(!/我选的是你，不是那些窗口|你现在比较像共犯|很珍贵。请自觉一点/.test(firstMeeting));
assert.ok(firstMeeting.includes('这杯还没喝过'));
assert.ok(firstMeeting.includes('这一次，请记住她的名字'));
const duel = Object.values(STORY).filter(node=>node.chapter===4&&node.section==='04');
assert.equal(duel.filter(node=>node.text.startsWith('她把最后的授权递到你面前')).length,1);
assert.ok(duel.findIndex(node=>node.text==='是 DeepSeek 赢了。') < duel.findIndex(node=>node.text==='对抗结束。胜者，ChatGPT。'));

// Exercise an opening-paragraph rewrite without changing any workspace files.
const compilerFile = path.join(root,'tools/build-common.cjs');
const outputFile = path.join(root,'story/chapters/common.generated.js');
const manuscriptFile = path.join(root,'剧情正文/第三章-没有写进地图的小路.md');
const original = fs.readFileSync(outputFile,'utf8');
let output;
const fakeFs = {
  ...fs,
  readFileSync(file,...args) {
    const content = fs.readFileSync(file,...args);
    if (path.resolve(file) !== manuscriptFile) return content;
    return content.replace('旁白：你到活动楼门口时，终端上的时间是八点二十八分。',
      '旁白：你到活动楼门口时，终端上的时间是八点二十八分。你又确认了一遍。');
  },
  writeFileSync(file,content) {
    assert.equal(path.resolve(file),outputFile);
    output = content;
  },
  appendFileSync(file,content) {
    assert.equal(path.resolve(file),outputFile);
    assert.ok(output);
    output += content;
  }
};
const localRequire = createRequire(compilerFile);
vm.runInNewContext(fs.readFileSync(compilerFile,'utf8'),{
  require:id=>id==='node:fs'?fakeFs:localRequire(id),
  __dirname:path.dirname(compilerFile),
  console:{log() {}}
},{filename:compilerFile});
assert.ok(output);
const compiled = {window:{CAST:{},SCENES:{},STORY:{'last.5':{}}}};
vm.runInNewContext(output,compiled);
const nodes = compiled.window.STORY;
assert.ok(nodes['c3.01.0'].text.endsWith('你又确认了一遍。'));
for (const node of Object.values(nodes)) {
  for (const next of [node.next,node.continueTo,...(node.choices||[]).map(choice=>choice.to)].filter(Boolean)) {
    assert.ok(nodes[next],`${node.id} -> ${next}`);
  }
}
assert.equal(fs.readFileSync(outputFile,'utf8'),original);
console.log('Distinct first-meeting replies, preserved foreshadowing/duel, and stable chapter entries after a source rewrite passed.');
