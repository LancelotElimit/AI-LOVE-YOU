# Grok 个人线演出与素材记录

本次为四章个人线及 HE / NE / BE 的完整演出初版，不新增付费音乐。五章共同篇之后进入，仍使用第六、七章已有选择记录判断 HE 资格。

## 剧情与演出位置

- 对白：`剧情正文/个人线/Grok-把天空写成地址.md`。
- 背景、立绘、CG、BGM 切换：`story/grok-route-production.cjs`，通过独特对白片段定位切换。
- 生成游戏对白：`node tools/build-personal.cjs`。不要直接手改 `story/chapters/personal.generated.js`。
- 本次仅更新根目录网页版，未改动独立的 `desktop-edition/` 快照。

## 新增素材

| 文件 | 用途 | 比例 |
| --- | --- | --- |
| assets/scene/bg/bg_gr_route_test_field.png | 第六章水火箭、NE 回校园试验场 | 16:9 |
| assets/scene/bg/bg_gr_route_private_studio.png | 画稿意外撞见、预算、回到日常、BE 私人告别 | 16:9 |
| assets/scene/bg/bg_gr_route_control_room.png | 专业合作试验、血月分析、发射窗口 | 16:9 |
| assets/scene/bg/bg_gr_route_crew_cabin.png | HE 发射前舱段；不叠加普通服饰立绘 | 16:9 |
| assets/grok/grok_night_red_black_jacket_sketchbook_shy.png | 夜色形态，黑红外套，抱住闭合画册，害羞防备；真实透明背景 | 2:3 |
| assets/scene/cg/cg_gr_route_after_failure.png | 试验失败当晚递甜饮，不再强撑胜利标题 | 16:9 |
| assets/scene/cg/cg_gr_route_orbital_window.png | HE 舷窗看 Tokenia、握住主角的手 | 16:9 |

画风为日式二次元视觉小说；新立绘和 CG 参照现有 Grok 的金色双马尾、蓝眼睛、尖耳、黑蝴蝶结与星月饰物。工作形态用现有血月立绘，切换前均有旁白。飞行服是任务装备，不是新模型；登舱后只显示舱段和 CG，避免普通服饰立绘与装备冲突。绘画副业仅通过台词和闭合画册表现，不生成露骨画面。

## 章节与音乐

| 章节 | 主要内容 | BGM |
| --- | --- | --- |
| 06 | 水火箭、画稿秘密、公开预算、桥边牵手 | B14 / B07 / B02 / B08 / B17 |
| 07 | 一起写作业、测试叫停、失败记录、夜晚陪伴 | B14 / B07 / B02 / B19 / B05 / B17 |
| 08 | 拒绝私人跟拍、专业合作、血月分析、第一次亲吻 | B19 / B02 / B07 / B14 / B18 / B17 |
| 09 | 最后窗口、虚假宣传诱惑、结局选择 | B20 / B19 / B14 |
| HE | 长期训练、任务装备、真实飞行、回家吃饭 | B20 / B18 / B17 / B09 |
| NE | 继续无人任务，在地面共同追梦 | B14 / B08 / B09 |
| BE | 假成功片段曝光，公开更正并终止合作 | B19 / B05 |

沿用已有音乐切换机制。本线不使用共同篇的 `yuai_fixed.mp3` 或 `pipaqu_fixed.mp3`。

## 结局条件

- HE：第六章选“公开预算与目标”，第七章选“报告失败，推迟下一轮”，最后选择正式升级飞行。
- NE：最后选择继续无人任务，不因尚未准备好就强行载人；恋情继续。
- BE：最后选择发布未核实的成功片段；不是事故死亡，而是信任破裂。

## 生成模式与提示词

使用内置 imagegen；背景为全新生成，立绘与 CG 为现有 Grok 形象参考生成。所有结果复制到上表项目路径，保留生成源文件；未覆盖旧图。以下保存完整提示词，方便以后替换。

### 校园试验场

Japanese anime visual novel background, landscape 16:9. Empty university water-rocket trial field in Tokenia in clear afternoon. Foreground low white worktable with a small harmless student water rocket painted red and white, safety goggles and a clipboard without readable writing. Center open green lawn, recovery net and marked safe boundary, chain link perimeter fence; school laboratories beyond, white buildings, green trees, vivid sky. A small astronomical star sticker on rocket. Ordinary modest campus experiment, not missile base. Detailed crisp hand-painted anime environment, natural varied colors, eye-level perspective, open central area for character sprite. No people, no text, no logos, no watermark.

### 私人工作间

Japanese anime visual novel background, landscape 16:9. Empty cozy private illustration workspace in the back room of a university student newspaper, early evening. Window at left with violet sunset and trees, warm desk lamp. Desk has a drawing tablet angled away with only abstract pastel swatches (no explicit art), pen, closed black sketchbook with little gold star charm, neatly stacked commission envelopes without readable text, mug and red ribbon. Bookshelf with comics, model rocket and paper star maps; jacket hook, two ordinary chairs, cream walls, grey floor, muted green and red accents. Detailed hand-painted anime environment, clear usable space centrally for character sprite, intimate ordinary lived-in room not luxury office. No people, no readable text, no watermark, no logos.

### 专业控制室

Japanese anime visual novel painted background, landscape 16:9. Empty professional civilian spaceflight mission control room in fictional Tokenia at dusk. Rows of white and grey consoles, padded chairs, practical overhead lighting, muted green indicators and amber/red accents, abstract unreadable telemetry on screens. Large center observation window shows a distant launch tower and civilian spacecraft across a broad safe exclusion zone, sky darkening purple-blue, pad lights white. Show a developed professional partnership facility, not a campus toy rocket. Sharp clearly visible room detail, eye-level perspective, central open floor for dialogue sprites, balanced colors, no people, no logos, no text, no watermark. No weapons, no technical construction diagrams.

### 害羞画册差分

Create one full-body Japanese anime visual novel character sprite of the SAME adult woman Grok in the reference. Preserve exact blonde long wavy twin tails, black bows, blue eyes, pointed ears, dark small bat wing hair ornaments and crescent crown. Preserve reference black/red ornate cropped jacket with gold celestial patterns, white ruffled top, black shorts, stockings and boots. Change pose and expression only: she presses a CLOSED black sketchbook to her chest with both hands, shoulders slightly hunched, looking aside at viewer, bright embarrassed blush, lips pursed as though caught doing a secret illustration side job. Charming defensive awkwardness, no nudity or explicit content, sketchbook closed with small star charm. All limbs/hair/boots in frame, centered portrait 1024x1536, thin clear detailed anime lines consistent with reference. Actual fully transparent background alpha, isolated cutout, NO backdrop, no dark gradient, no halo or ground shadow, no border, no white frame, no text.

### 失败后的陪伴 CG

Japanese anime visual novel romantic event CG, landscape 16:9. Same adult woman Grok from reference, preserve blonde wavy twin tails, blue eyes, pointed ears, black bows, small bat wing ornaments, crescent crown and EXACT black/red ornate jacket, white ruffled top, black shorts/stockings. Night in a quiet university student newspaper room. Sitting close beside first-person protagonist at a bench by desk, Grok's upper body and face central upper half, her head lightly leaning near viewer's shoulder (do not show protagonist face, just a clothed shoulder at lower edge). Tired subdued vulnerable expression, slight watery eyes and a small honest smile, no exaggerated crying. She slides a capped sweet drink toward viewer across desk with one hand. A cold meal box and closed laptop at lower edge, failed-project papers without readable text. Warm desk lamp against cool moonlit window, ordinary office, muted green and white walls. Tender support after a failed test, not triumphant glamour. Clean detailed anime linework consistent with reference, full-bleed complete environment, face safely upper-center for dialogue overlay/mobile crop, no text, logos, watermark.

### 轨道舷窗 CG

Japanese anime visual novel ending CG, landscape 16:9, full-bleed illustration. Inside pressurized professional civilian orbital spacecraft cabin, adult Grok and first person adult partner seeing whole fictional planet Tokenia together. Exact heroine face from reference: long blonde wavy twin tails tied black bows, blue eyes, pointed ears, small dark bat wing ornaments; remove crescent crown and dangling decorative chains for mission. Grok sits beside viewer, face at upper-center, soft amazed smile and slight blush, one hand gently holding viewer's hand in center foreground (viewer face not shown, only clothed forearm). Black/red full-length technical flight suit derived from reference workwear, fitted safe mission harness, communications earpiece, no readable labels. Large observation window behind to left reveals entire sunlit blue-green spherical Tokenia with unfamiliar fictional continents, clouds, thin atmosphere and stars. White/silver cabin, clean green indicators, realistic seat restraints, neutral warm face light from planet, crisp detailed anime linework, majestic but tender, not dark blurry. Globe fully visible enough and face placed for mobile center crop, bottom quarter reserved for dialogue overlay with noncritical hand/seat detail. No nudity, no logos, no text, no watermark.

### 发射前舱段

Japanese anime visual novel background, landscape 16:9. Empty interior of professional civilian crew spacecraft capsule on the launch pad, before takeoff, fictional Tokenia. Two high backed dark grey astronaut seats with red harnesses and white/silver cabin walls, muted green console indicator lights, small observation window showing launch tower metal structure and early morning sky at ground level. Ordinary flight checklist tablet with abstract marks but no readable text. Eye-level view from aisle, central negative space for character sprite. Clearly practical pressurized cabin, no people, no planet view, no space outside yet. Crisp hand-painted detailed anime environment, bright neutral whites contrasted dark grey/red/green, no logos or watermark, no instructional construction diagrams.

