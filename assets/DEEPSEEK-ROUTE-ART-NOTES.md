# DeepSeek 个人线演出素材

本轮使用内置图像生成工具制作，原图保留在生成目录；游戏引用的是本项目中的副本。没有覆盖之前的立绘与背景。

| 文件 | 用途 |
| --- | --- |
| `scene/bg/bg_ds_route_workshop_evening.png` | 第六章赴约、交接下班、结局前讨论；工坊傍晚 |
| `scene/bg/bg_ds_route_cafe_evening.png` | 双人晚饭、加蛋庆功、热饮休息 |
| `scene/bg/bg_ds_route_workshop_midnight.png` | 试运行故障、加班与排他收购坏结局 |
| `deepseek/deepseek_eco_blue_jacket_hotdrink.png` | 日常形态，蓝外套，双手捧热饮，害羞微笑；真正透明背景 |
| `scene/cg/cg_ds_route_today_six.png` | HE：六点下班、两杯热饮、牵手；全屏，不叠加立绘 |

背景与 CG 为 1672 × 941，约 16:9；立绘沿用原角色比例。统一日式动漫视觉小说风格，蓝发、鲸尾、蓝外套的人物识别特征不变。其余表情复用现有工程围裙、日常害羞与迟疑差分。

## 修改位置

- 对白与选择：`剧情正文/个人线/DeepSeek-预算里有两个人.md`。
- 场景、音乐、服装差分：`story/deepseek-route-production.cjs`。每章有初始演出状态，`cues` 以正文中的短句为定位点，从该句开始切换。定位句改掉时会提示未匹配，不会默默错位。
- 结局门槛：`story/personal-routes.cjs`。HE 要求第七章正常工时报价、第八章轮班与停工时间两个选择。
- 修改后更新：`node tools/build-personal.cjs`。不要直接修改 `personal.generated.js`。
- 本轮不修改 `desktop-edition/` 独立目录，它的既有副本未同步。

## 生成提示词

以下为本轮五次调用的提示词记录；人物两次调用都以 `assets/deepseek/deepseek_eco_blue_jacket_calm.png` 为身份参考。只有抱杯立绘启用透明背景。

### 工坊傍晚

Create a 16:9 landscape Japanese anime visual novel background illustration, no people, no text. A tiny independent electronics repair workshop in a friendly futuristic school-town at early evening. Two workbenches with neatly labeled (but illegible) component drawers, a soldering station, three old customer terminals, blue whale-shaped small mascot ornament, pegboard tools, modest worn stools. Warm amber practical lamps contrasted with cool turquoise twilight through a street-facing window; small plants and two ceramic drink cups by the window. Believable cozy working business, NOT secret super corporation or magical laboratory. Detailed clean anime linework, painterly cel shaded backgrounds, crisp legible environment, full-bleed composition with open middle foreground for character sprites and uncluttered lower quarter for dialogue overlay. No logos, no readable signage, no borders, no watermark.

### 约会面馆

16:9 landscape full bleed Japanese anime visual novel background, no characters. Interior of a modest cozy noodle cafe in a futuristic university neighborhood at evening, small wooden two-person tables, two steaming bowls of noodles with egg and two hot drink mugs on the nearest table, other tables empty, warm hanging lights, broad window looking onto softly lit pedestrian street, small green plants, emerald tiles and burgundy cushions, clean painterly anime linework and cel shading, inviting ordinary date setting, clear sharp environment, no readable text, no logos, no borders. Middle space suitable for a visual novel character, lower quarter not cluttered.

### 抱热饮立绘

Identity-preserve visual novel sprite variation of the exact adult female character in the reference. Keep her long flowing cobalt blue hair with cyan tips, whale fin ears, hair bow, blue eyes, dark blue whale tail, pale blue cropped blazer, white blouse, dark bow with blue gem, charcoal trousers and loafers exactly. Full body including shoes and tail entirely inside canvas, front three-quarter view, same anime drawing detail and proportions. Change pose to holding a small warm ceramic mug with both hands near her chest, shoulders relaxed, genuinely happy bashful smile with slight pink cheeks while looking at the viewer. Real transparent alpha background, isolated character only, no floor shadow or rectangular backdrop, no frame, no text. Avoid glow outlines.

### 六点下班 CG

Create a 16:9 landscape Japanese anime visual novel romantic happy ending CG. Preserve exact adult woman identity from reference: cobalt blue hair with cyan tips, whale fin ears and blue bow, blue eyes, large dark whale tail, pale blue blazer over white blouse with dark bow and blue gem, charcoal trousers. Early evening outside her small independent electronics repair workshop, door freshly closed, warm sunset with mint and pink sky, modest street and plants and repaired terminals visible inside. Medium shot of her facing viewer, joyful bashful smile, holding one steaming ceramic cup in her left hand while her right hand holds protagonist's hand coming from bottom foreground in first person. A second cup is held in protagonist's other hand in foreground. Hands anatomically correct. Character upper body and emotional face centered high enough not to be covered by lower-quarter dialogue. Whole scene warm, intimate and earned, not grand wealth or corporate empire, clean detailed anime linework, painterly background, no readable text, no other visible characters, no border, no watermark.

### 工坊深夜

16:9 full bleed landscape Japanese anime visual novel background, no people. Tiny independent electronics repair workshop after midnight, two wooden workbenches, soldering iron switched off, old customer terminals showing tiny abstract error symbols (no legible writing), tools, open invoice ledger, cold tea mug, one amber desk lamp, dark teal rainy street beyond large windows. A believable modest small company with limited money, not science fiction megacorporation. Tense lonely overtime mood but sharply visible working surfaces and detailed clean painterly anime artwork, muted gray green and amber colors, unoccupied central foreground suitable for character sprite, lower quarter clear for dialogue. No readable text, logos, border, watermark.
