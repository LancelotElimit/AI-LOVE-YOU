const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '..');
const target = path.join(__dirname, 'game');
fs.mkdirSync(target, {recursive: true});
function copyEntry(from, to) {
  if (fs.statSync(from).isDirectory()) {
    fs.mkdirSync(to, {recursive: true});
    for (const name of fs.readdirSync(from)) copyEntry(path.join(from, name), path.join(to, name));
  } else {
    if (fs.existsSync(to)) fs.chmodSync(to, 0o666);
    fs.copyFileSync(from, to);
    fs.chmodSync(to, 0o666);
  }
}
for (const entry of ['assets', 'story', 'style.css', 'game.js', 'music.js', 'scenes.js']) {
  copyEntry(path.join(source, entry), path.join(target, entry));
}
const html = fs.readFileSync(path.join(source, 'index.html'), 'utf8')
  .replace('</head>', '  <link rel="stylesheet" href="desktop.css">\n</head>');
fs.writeFileSync(path.join(target, 'index.html'), html);
fs.copyFileSync(path.join(__dirname, 'desktop.css'), path.join(target, 'desktop.css'));
console.log('Desktop snapshot prepared; original game files unchanged.');
