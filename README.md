# AI Love You · 全线文本原型

一个无需引擎、无需构建、双击即可运行的轻量 Galgame 原型。玩家是喜欢敲代码的学生，通过“零号中转站”抵达 Tokenia 学园都市外环换乘厅，偶遇正在维修登记机的 DeepSeek，并在她的带领下选择第一位临时同行见证人。

## CG 预览

以下包含个人线结局画面。

| ChatGPT · 灯亮着，她回家了 | Claude · 两侧同时开门 |
| --- | --- |
| <img src="assets/scene/cg/cg_gpt_route_coming_home.png" width="480" alt="ChatGPT 下班后回家的拥抱"> | <img src="assets/scene/cg/cg_cl_route_reunion.png" width="480" alt="Claude 与主角跨世界重逢"> |
| **DeepSeek · 今天六点关门** | **Gemini · 下一个地点，一起选** |
| <img src="assets/scene/cg/cg_ds_route_today_six.png" width="480" alt="DeepSeek 关门后与主角一起离开工坊"> | <img src="assets/scene/cg/cg_gm_route_next_departure.png" width="480" alt="Gemini 与主角开始下一段旅程"> |
| **Grok · 第一次，看见整个世界** | **第四章 · ChatGPT 与 DeepSeek 对抗** |
| <img src="assets/scene/cg/cg_gr_route_orbital_window.png" width="480" alt="Grok 在舷窗前与主角一起看 Tokenia"> | <img src="assets/scene/cg/cg_ch04_chatgpt_deepseek_domain_clash.png" width="480" alt="ChatGPT 与 DeepSeek 的红蓝对抗画面"> |

仓库内容：

- `index.html`、`style.css`、`game.js`、`story/`、`scenes.js`：可直接运行的 Demo。
- `characters/`：五位角色的独立设定，包含组织背景、性格、能力与后续模型形态。
- `剧情脚本.md`：序章与后续企划结构的剧情稿。
- `assets/`：原始立绘、透明底立绘、表情差分、图标和素材说明。
- `tests/`：剧情图、存档、输入、响应式布局和素材透明度检查。

## 运行

直接用 Edge 或 Chrome 打开 `index.html`。不需要 Unity、虚幻、Node.js、服务器或网络连接。浏览器第一次允许播放声音，需要点击一次页面。

直接双击 `index.html`，使用 Edge 或 Chrome 打开。不需要 Unity、虚幻、安装依赖、联网或启动服务。

从标题页选择「开始旅程」进入序章。主角发现「零号中转站」的异常登录页，输入用户名并建立连接后，被屏幕拉进异世界。用户名支持 1–12 个文字、数字、空格或 `_ · . -`，会用于主角发言、角色称呼、入学登记和存档。

当前可游玩序章及共同篇第一至第五章。新增第四章《没有人申请过的权限》、第五章《系统不承认的那个人》。章节结束后选择「继续故事」进入下一章；旧版第三章结尾存档也可继续。第二至第四章各有两次自由相处，第五章有一次自由相处，各完成一次记录 10 点好感，不改变序章见证人。

见证人选择不锁定个人路线。第五章末，仅好感至少 40、且完成过该角色第四章或第五章独处事件的角色会开放正式邀请。选择后继续进入对应第六章。始终保留「今晚先回宿舍」作为未锁线结局，不强迫玩家选择。

五条个人线已完成凝练的完整文本首稿，共 26 章、16 个结局：ChatGPT 与 Claude 各 6 章，Gemini 与 DeepSeek 各 5 章，Grok 4 章。每条有幸福、普通、坏结局，Claude 另有真结局。正文在 `剧情正文/个人线/`，完整章节、伏笔与结局条件见该目录的 `全线章节与结局总览.md`。幸福／真结局依赖实际关键选择，普通／坏结局始终可选；没有因余额不足而锁死的恋爱结局。五条线均已加入独立背景、差分、CG 与逐段 BGM 的演出初版，仍可继续扩写与美术精修。

Token 已实际记账：第三章争议扣款 800、午餐 60；第四章住宿 240、晚餐 120；第五章工作收入 360、可选垫付缓冲区 600、退回实际发生的争议扣款。公共应急方案不扣玩家余额，也不惩罚好感。必要生活费不足由临时生补助抵扣。每笔仅执行一次，旧版已经过争议扣款的存档会补记一次；读档不重复扣款。垫付的 600 仅留下报销凭证，目前尚未到账。

## 操作

- 点击对话区：补全文字 / 下一句。
- 数字 1–6：选择当前选项。
- 空格 / Enter：推进。A：自动。H：回看。S：存档。L：读档。Escape：设置。
- 快进仅跳过已读内容，遇到未读内容或选择会停止。
- 顶部扬声器开关控制全部声音。第一次点击后，浏览器才允许播放音频。
- 顶部心形按钮查看五位角色的当前好感度；不同模型形态共用同一角色的记录。
- 顶部菜单与底部操作栏默认隐藏，鼠标靠近对应屏幕边缘时浮现，移开后收起；触屏点击上下边缘即可展开，键盘聚焦菜单项时也会显示。
- 从标题页开始或继续旅程时尝试进入浏览器全屏，拒绝或不支持全屏不会阻断阅读；可用底部全屏按钮切换，退出后不会在推进对白时强制重入。

每句自动保存；另外有三个手动存档。重新打开时先显示标题页，通过「继续旅程」恢复自动记录；游戏内顶部房屋图标可返回标题。用户名随存档保存，旧版无名字的存档会使用「旅人」。存档保存在当前浏览器的本地存储。换浏览器、移动整个目录或清除浏览数据可能使原记录不可见，可通过存档页导出 / 导入 JSON 备份。

## 素材与范围

- `assets/chatgpt/` 等五个角色目录：分别保存对应角色的原始立绘、透明底立绘和表情立绘。
- `assets/*/*-transparent.png`：使用内置 imagegen 的 background-extraction 模式生成的透明底副本，用于标题页群像和剧情中央立绘。提示词与源文件记录见 `assets/ART-NOTES.md`；未设计新衣服或改变角色姿势。
- 表情差分使用建议见 `assets/SPRITE-DIFF-GUIDE.md`；这些标注只供制作使用，不写入剧情文本。
- 序章暂不正式介绍模型形态；第一章以核对登记材料、给主角添水的日常场景介绍 Terra / Sol 切换，模型变化不重置记忆或好感。
- `scenes.js`：原创 SVG 场景，共八个场景定义（校园、房间、图书馆、温室、咖啡部、旧校舍、大厅与夕照等），在浏览器中绘制，无远程素材请求。
- `assets/scene/bg/`、`assets/scene/cg/`：共同篇接入 29 张背景、17 张剧情插画。新增五张背景、五张 CG 均已用于剧情。插画默认等比铺满视口，不叠加人物立绘；可在底部切换完整插画。保留用户原文件名，包括取货点图片的双 `.png` 后缀。
- 第三章已接入独立的旧街、旧书摊和旧桥背景，外出途中不再使用校内饮料店或校园步道替代。可选插画需求见 `剧情正文/第三章演出与素材需求.md`。
- `music.js`、`game.js`：Web Audio 本地合成原创暂定配乐，支持淡入淡出与静默段。本次新增 8 首约会、告白、跨世界通信、雨夜、赶工、发射、起源与回家主题，已用于五条个人线。完整曲目与切换位置见 [新增 BGM 说明](assets/BGM-EXPANSION.md)。仍非正式录音音源，无配音或环境音；两段恶搞演出另使用用户提供的本地 MP3，公开发布前需核实授权。
- `assets/lucide.min.js`：Lucide 0.468.0，ISC License；版权声明见 `assets/lucide-LICENSE.txt`。
- 角色、家系和能力是文学虚构；形态名称为本 Demo 的原创称呼，不是现实产品型号列表。

## 编辑

手动修改立绘、BGM、场景及正文的具体位置和示例见 [演出手动修改指南](剧情正文/演出手动修改指南.md)。

- `story/`：剧本节点、分支、人物资料、路线结尾；共同开场、五位见证人反馈和章节结尾分文件维护。
- `style.css`：界面、移动端排版与动画。
- `scenes.js`：场景画面。
- `game.js`：对话播放器、选择、存档与声音。

游玩无需构建。第一至第五章正文在 `剧情正文/`，新插入的小事件放在 `剧情正文/事件/`。演出标注在 `tools/build-common.cjs`，第三章标注在 `story/chapter-three-production.cjs`，新增事件、第四五章演出与交易在 `story/common-expansion.cjs`。修改后运行 `node tools/build-common.cjs` 更新生成的剧情文件再刷新。不要直接编辑 `story/chapters/common.generated.js`。生成时复用同一场次中说话人、正文与条件未变的节点 ID；改写或删除原句的存档兼容仍需另行处理。

个人线修改后运行 `node tools/build-personal.cjs`。默认现有素材、幸福结局门槛在 `story/personal-routes.cjs`，生成文件为 `story/chapters/personal.generated.js`。共同篇与个人线分别生成，页面加载时自动接续第五章结尾。无需重新开始，旧第五章已选线的结尾存档可继续。

个人线独立演出配置在 `story/deepseek-route-production.cjs`、`story/claude-route-production.cjs`、`story/gemini-route-production.cjs`、`story/grok-route-production.cjs`、`story/chatgpt-route-production.cjs`。每条新增素材和完整生成提示词记录在 `assets/` 下对应的 `*-ROUTE-ART-NOTES.md`；本次 ChatGPT 新增 4 张背景、1 张差分、3 张 CG。根目录网页与 `desktop-edition/` 为独立副本，后者未同步本次修改。

`node tests/personal-routes.cjs` 验证五线关键选择组合、全部 16 个结局的可达性、实际逐句阅读、旧第五章存档续接、见证人与恋爱线分离、结局条件、工资不重复入账、保存恢复及结局屏幕布局。

验证：`node tests/common.cjs` 检查前两章全部 250 组组合、实际阅读流程、旧存档续接、好感归属、素材和桌面/移动端布局；`node tests/chapter-three.cjs` 检查第三章 50 组组合、继承已有好感、换形态、章节衔接、存档和稳定生成；`node tests/smoke.cjs`、`node tests/entry.cjs` 检查原序章、输入与存档行为。

新增验证：`node tests/expanded-common.cjs` 覆盖五个锁线结局与未锁线结局、Token 收支、重复读档、旧存档补记、余额不足、好感门槛、十张新素材和桌面/手机布局。

第四章对抗已改为 DeepSeek 看似获胜、Grok 提前宣判、ChatGPT 最终反转取胜。该段使用用户提供的 `assets/bgm/yuai_fixed.mp3`，离开演示时淡出 1.2 秒，再恢复正常配乐。`node tests/duel-music.cjs` 验证真实本地 MP3 播放、段内连续性、静音恢复及淡出衔接；公开发布前需另行核实该歌曲授权。

