# 序章初见重排 · 2026-10-01

## 叙事节奏

穿越过程中先切至 DeepSeek 的第三人称限知视角：修盖板、找螺丝、惦记饮料，看见有人摔在大厅里。她并不知道主角的来历，等登记机故障才正式过去干预。回到主角视角后，保留最初的落地、问路和维修救场。

其余初见不再连续接通五个窗口：

1. 接待台排队，从远处看见 ChatGPT 给别的学生指路。等待期间，主角再次尝试联系家里。
2. DeepSeek 为故障记录联系 Gemini。全程远程通讯 CG，先有挪地图、扶终端和核对来路，再有自我介绍。Gemini 未在此刻抵达大厅。
3. 送维修副本到资料窗口，短暂切 Claude 视角。她原本在处理别人的错填日期和坏书车，新申请只是工作中的下一份材料。回到主角视角，她更正分类和原话，不主动宣告信任或好感。
4. 回等候区，看见自己的照片出现又消失，才遇到正在处理新闻的 Grok。她有原本的采访安排，不以主角为全天工作的中心。
5. 坐下来喝完已经凉的饮料，整理材料，再选择同行见证人。仍不锁恋爱线，不改初始好感、10,000 Token 或匿名消息伏笔。

心理活动限于当时掌握的事，不泄露未来 Claude、时间线真相或个人线结局。视角切换在对话框副标题明确标记。参考用户提供 EPUB 中场景组织、日常细节引出疑问等通用手法；没有移植原文或复刻独特文风。

## 新 CG

内置 imagegen 单张生成，参考已有角色立绘，原素材未覆盖。五张均为约 16:9 横向满幅 CG，文件在 `assets/scene/cg/`。

| 文件 | 地点、时间 | 角色、服饰、动作、表情 | 节点 |
| --- | --- | --- | --- |
| `cg_prologue_deepseek_workbench.png` | 外环换乘厅维修区、早晨 | DeepSeek、蓝色工作外套与深色长裤、蹲着检修接口、专注略疲倦；维修台有纸杯装的螺丝与未喝的热饮 | `repair-morning.0` 起 |
| `cg_prologue_chatgpt_reception.png` | 外环接待台、早晨 | ChatGPT、原白裙、弯身指纸质地图、忙碌但耐心；前景是排队学生，早餐在终端后 | `first-counter.1` 至 `.5` |
| `cg_prologue_gemini_video_call.png` | 外环终端连接校内观测室、上午 | Gemini、原白夹克与酒红上衣、移开地图看镜头、好奇稍分心；身体只存在于有边界的通讯画面，观测室也在画面内部 | `first-call.2` 至 `.20`；`gemini.0` 至 `.7` |
| `cg_prologue_claude_records.png` | 外环资料窗口、上午 | Claude、黑色金线针织外套与长裙、拿铅笔校对表格、冷静专注；门边有书车，桌上有茶 | `first-records.0` 至 `.8` |
| `cg_prologue_grok_news_edit.png` | 外环等候长椅、上午 | Grok、原黑红外套与深色袜、夹电话同时处理电脑上的新闻、烦躁认真；三脚架未展开 | `first-headlines.2` 至 `.7` |

## 生成提示词

共同规范：`Use case illustration-story. ONE landscape 16:9 full-bleed visual novel CG, fine detailed anime painting. Match the referenced adult heroine's face, hair, eyes, accessories, nonhuman traits and existing outfit. Wide candid work scene, not looking at viewer or posing. Main face and hands above the bottom dialogue area. No other named heroines or identifiable protagonist face. No legible writing, logos, UI overlay, captions, watermark or artwork border.`

- **DeepSeek**：参考 `deepseek_eco_blue_jacket_calm.png`。Morning outer-ring transit hall maintenance alcove. Crouching beside an open faulty terminal, screwdriver in one hand, other steadying panel; paper cups sorting screws, open tool case, one hot-drink cup. Blue jacket white blouse dark trousers, blue-cyan hair, aquatic ears and navy whale tail. Wide view from several metres away, tired practical concentration, no transformation.
- **ChatGPT**：参考 `chatgpt_terra_white_dress_calm.png`。Morning reception desk viewed through a gap in queue stanchions and anonymous adult students. ChatGPT in white layered dress points along a paper campus map for a lost student, forms waiting nearby, untouched wrapped breakfast behind terminal. Silver-white hair, horns, knot ornament, wings and dragon tail. Attentive ordinary work, no magic spectacle.
- **Gemini**：参考 `gemini_meteor_white_jacket_calm.png`。Portable terminal on a maintenance toolbox projects a cyan-edged bounded VIDEO pane, all pane corners visible. Gemini's upper body and her observatory background appear ONLY inside the feed, no physical legs or silhouette in the transit hall. Blue-lilac hair, cat ears, stars, pink/golden eyes; white jacket burgundy top. Moving a map aside, curious distracted face, slight digital breakup at edge only. Partial DeepSeek blue sleeve and hot drink outside feed.
- **Claude**：参考 `claude_haiku_black_cardigan_calm.png`。Through open archival-reception doorway, morning, seated side-on at oak desk checking forms with pencil, work boxes, book trolley, tea. Long orange hair amber eyes sunflower ribbon ornament, black gold-floral cardigan white blouse long black skirt. Composed slightly weary focus, no glasses or magical symbols added.
- **Grok**：参考 `grok_night_red_black_jacket_calm.png`。Morning transit-hall bench below public screen, phone at ear, irritatedly pointing at laptop, notebook and unused folded tripod beside her. Blonde twin tails blue eyes, bat-wing hair ribbons little crown, black-red embroidered jacket shorts and opaque tights. Anonymous commuters, screen abstract blocks not photographs or readable headlines, no seductive posing.

## 编辑与检查

- 初见正文、段落顺序和分段 BGM：`story/chapters/opening.js`。
- 工作 CG 场景注册：`scenes.js`；沿用现有插画展示。`game.js` 的存档检查同步识别新序章场次，允许选择见证人之前保存和恢复。
- Gemini 通讯与实际到场的衔接：`story/chapters/gemini.js`；直到 `gemini.8` 才换回普通立绘。
- Claude、Grok 见证人反馈已跟随实际见面方式调整。
- 保留 `intro.*`、`crossing.*`、最初一段 `arrival.*`、五条见证人分支与序章结尾入口。原序章后半段已拆成新场次，旧中段存档不能保证逐句对齐；体验新节奏建议从序章开头阅读。后续章节入口不改。
- `node tests/prologue-encounters.cjs` 检查视角、节奏、素材、CG 退出、远程与实际到场的区别和桌面/手机显示。
