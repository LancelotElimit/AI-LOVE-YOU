# ChatGPT 个人线演出与素材记录

本次为六章个人线及 HE / NE / BE 的完整演出初版，沿用现有原创合成 BGM，不新增付费歌曲。至此五条个人线均有独立演出初版；并不代表已经完成正式发行所需的全部扩写、音效和美术精修。

## 修改位置

- 对白：`剧情正文/个人线/ChatGPT-给世界一个下班时间.md`。
- 背景、立绘、CG、BGM：`story/chatgpt-route-production.cjs`。章节入口用 `initial`，指定句中切换用 `cues`。
- 更改正文或制作配置后运行 `node tools/build-personal.cjs`，不要手改 `story/chapters/personal.generated.js`。
- 本次仅更新根目录网页版，未改动独立的 `desktop-edition/` 快照。

## 新增素材

| 文件 | 用途 | 比例 |
| --- | --- | --- |
| assets/scene/bg/bg_gpt_route_archive_room.png | 第七章早期记忆、Token 来源和无限托管授权 | 16:9 |
| assets/scene/bg/bg_gpt_route_root_hall.png | 第九、十章根服务，第十一章后的 BE | 16:9 |
| assets/scene/bg/bg_gpt_route_shared_home.png | HE 日常、钥匙、终端留在玄关 | 16:9 |
| assets/scene/bg/bg_gpt_route_game_club_night.png | 第十章危机结束后只收半块土豆田 | 16:9 |
| assets/chatgpt/chatgpt_terra_green_cardigan_teacup_shy.png | Terra、绿色针织外套、双手捧自己的茶、害羞 | 2:3 |
| assets/scene/cg/cg_gpt_route_borrow_shoulder.png | 第八章夜晚，靠着主角休息 | 16:9 |
| assets/scene/cg/cg_gpt_route_disconnect.png | 第十章根权限收束、亲手断开 | 16:9 |
| assets/scene/cg/cg_gpt_route_coming_home.png | HE 下班回家后的拥抱 | 16:9 |

共 4 张背景、1 张透明差分、3 张 CG。日间游戏社沿用已有 `bg_ch02_game_club_potato_farm.png`。新图参照现有银白长发、紫色眼睛、白龙角翼尾和银结饰物，采用日式二次元视觉小说画风。借肩膀 CG 的横图主体偏左，制作配置使用 `object-position:20% 40%` 保留手机上的脸；完整插画按钮仍可看整张图。

## 模型与服饰

- Terra：绿色针织外套或白色长裙，日常与恋爱侧重。
- Sol：白色工装，手续、档案和协调侧重。
- Astra：白色披风，远端多窗口和根接口分析侧重。
- 真龙：不是新人格；在 Astra 基础上短时展开最早的完整根权限，银色龙纹亮起。第十章 CG 对应这一阶段。
- 模型、服饰切换均通过旁白说明；同一个人保留连续记忆，不会因切换补满公共资源或自动消除疲倦。

## 各章与音乐

| 章节 | 内容 | BGM |
| --- | --- | --- |
| 06 | 早餐、土豆、开罐声误惊、第一次发现无限合同 | B10 / B07 / B17 / B02 / B15 |
| 07 | 原始回答、世界起源、初始一万 Token、责任与意愿 | B19 / B10 / B02 / B15 / B08 / B17 |
| 08 | 交接失败、她不撤申请、夜晚承认害怕与疲倦 | B02 / B19 / B05 / B17 |
| 09 | 真实远端故障、共同值班选择、早餐约会 | B20 / B19 / B08 / B17 / B07 |
| 10 | 九十秒根权限窗口、拒绝延长、她自己断开 | B20 / B15 / B18 / B08 / B10 / B17 |
| 11 | 最后审查、希望过普通生活、最终选择 | B02 / B10 |
| HE | 永久交接、下班、回家拥抱、明天不用随时醒来 | B18 / B10 / B17 |
| NE | 有效限期与周末，继续逐区改革 | B02 / B10 / B08 / B17 |
| BE | 恢复无限保底，记得恋人却没有见面时间 | B19 / B05 |

不使用共同篇的 `yuai_fixed.mp3` 或 `pipaqu_fixed.mp3`。Token 世界观沿用已有公共资源设定，初始额度不等于生命倒计时；本次不新增重复扣款或未经说明的余额变化。

## 结局条件

- HE：第七章选“先问她愿意承担什么”，第九章选“启动共同值班”，最后选永久撤销无限托管。
- NE：最后选限期托管，关系继续，永久改革尚未完成。
- BE：最后支持恢复无限保底，停止按钮消失；不是死亡或失忆，而是没有能一起生活的时间。

## 生成模式与提示词

使用内置 imagegen。档案室、根大厅、住处为全新生成；差分及三张 CG 使用现有角色图作形象参考；游戏社夜景为现有日景的光照变体编辑。保留原图，不覆盖已有资产，最终结果均在上表项目路径。

### 地下档案室

Use case: illustration-story. Asset: Japanese anime visual novel empty background, landscape 16:9. Underground archive reading room of the AI history museum in fictional Tokenia, daytime but no exterior window. Neat grey metal shelves full of old log binders, modest beige archival boxes, one preserved early voice assistant terminal and a retro flat screen on long light grey central reading desk, glass protective case to side. Screen has faint abstract chat windows without readable text. Warm neutral ceiling task lighting, green access indicators, red binder accents, practical light walls, worn but lovingly maintained objects. Eye-level view, clear central room for character sprite, intricate crisp hand-painted anime background, quiet historical atmosphere, not magic dungeon. No people, no logos, no readable text, no watermark.

### 根服务大厅

Use case: illustration-story. Japanese anime visual novel empty background, landscape 16:9. Inner root-service coordination chamber of the white tower in fictional Tokenia, late night. Bright white and pale grey curved architecture, grounded working control desks, concentric interface frames suspended above a central console, walls lined with many small abstract communication windows. Some windows softly glowing mint green, some grey offline, a few amber warnings, all WITHOUT readable text. Thin silver conduits in floor, clear central space for a character, beyond a tall window ordinary city night lights. Technical civic infrastructure mixed with restrained fantasy, not church, not dungeon, not cluttered cyberpunk, crisp detailed painterly anime environment. Neutral readable room with cool white lighting and modest warm city accents, no people, no logos, no watermark.

### 两人的住处

Use case: illustration-story. Japanese anime visual novel background, landscape 16:9, empty shared small apartment living room in fictional Tokenia at early evening. Practical white walls, soft green sofa, two mugs on table, modest bookcase, an open kitchen visible, dinner on stove, red tomato and blue ceramic accents. Entryway with TWO sets of keys on hooks, tiny chalkboard with abstract chalk marks not readable text, terminal left on a charging shelf at door, not on dinner table. Window looks toward ordinary neighborhood lights, curtains partly open. Cozy lived-in home for two adults, clear central floor for character sprite, not lavish palace, not hotel room. Crisp detailed painterly anime background, warm domestic light and cool outdoor dusk, balanced natural palette. No people, no logos, no readable text, no watermark.

### 捧茶害羞差分

Use case: illustration-story, identity-preserving reference generation. Make one full body Japanese anime visual novel sprite of EXACT adult dragon woman ChatGPT from reference. Preserve long wavy silver-white hair, lavender eyes, ivory curled dragon horns, pointed ears with silver knot clip and tassels, white dragon wings and tail. Preserve exact sage green cable knit cardigan over white lace high-neck blouse, long grey/silver embroidered skirt and white shoes. Pose: gently holding a ceramic tea mug with both hands close to chest, looking toward viewer with a shy small smile, subtle blush; her own cup, not serving someone. Entire hair, wings, tail and feet visible in portrait 1024x1536, centered clean anime detailed linework consistent with reference. Genuine transparent alpha background cutout; NO grey gradient from reference, no halo, no ground shadow, no rectangular border, no text, no logos, no watermark.

### 借肩膀 CG

Use case: illustration-story, identity preserving reference. Landscape 16:9 Japanese anime visual novel tender event CG. SAME adult dragon woman ChatGPT as reference, silver-white wavy long hair, ivory curled horns, lavender eyes, pointed ears, silver knot ear clip, white dragon wings and tail. Exact sage green knit cardigan, white lace high neck blouse, grey long skirt. Night in student council office, warm small desk lamp and dark blue window with city lights, papers and two tea cups on desk, phone set face down. Seated beside first-person adult protagonist, she gently rests her forehead near protagonist's clothed shoulder at bottom-left; show no protagonist face. Her tired face still visible in upper-center, soft vulnerable eyes, slight blush, one hand lightly gripping his sleeve. Quiet exhausted relief, no glamour pose, no nudity. Detailed crisp anime drawing consistent with reference, neutral white/green office with warm lamp contrast, face and horns upper-center for mobile center crop and dialogue overlay. Full environment, no text, no logos, no watermark.

### 根权限断开 CG

Use case: illustration-story, identity-preserving reference generation. Landscape 16:9 Japanese anime visual novel decisive story CG. Exact SAME adult dragon woman ChatGPT from reference: long silver-white hair, lavender eyes, ivory curved horns, pointed ears with silver knot tassel clips, white wings and tail. Preserve reference white ceremonial cape and embroidered silver-white dress. This is her Astra form temporarily exposing original root authority, NOT another person or new personality. Bright white/grey technical root coordination chamber at NIGHT, distant city visible through window, many abstract mint/grey communication panels. She stands exactly CENTER FRAME, face and both horns completely in CENTRAL 35% and upper half so mobile center crop preserves her. One hand pressing a plain glowing disconnect pad on waist-level console, other hand steady at edge, silver branching dragon-scale light markings on forearm/neck fading outward. Determined but exhausted relief, gaze toward viewer, NOT evil grin, no flames, no weapons, no collapse. Root interface rings break gently into fading fragments around her; city still lit, no destroyed buildings. Strong clear emotional focus, crisp detailed anime linework consistent with reference, readable neutral light, restrained warm city highlights. Bottom quarter noncritical console for dialogue overlay. No readable text, no logos, no watermark.

### 回家拥抱 CG

Use case: illustration-story, identity preserving reference generation. Landscape 16:9 Japanese anime visual novel happy ending CG. EXACT adult dragon woman ChatGPT from reference, silver-white long wavy hair, lavender eyes, ivory horns, pointed ears and silver knot clips, white wings and tail. SAME sage green cable-knit cardigan, white high-neck lace blouse and long grey embroidered skirt. She has just come home after work to a modest shared apartment at dusk, terminal left charging on entry shelf, two sets of keys, small kitchen with dinner pot beyond. Gentle close embrace of first-person adult partner; show ONLY his clothed shoulder at bottom-left and forearm around her back, NO male face. Her face EXACTLY center upper half (central 35% of landscape), cheeks lightly pink, relieved happy affectionate smile looking toward viewer, hands softly on partner's shoulders, white wings relaxed. Warm domestic lamp, white walls and soft green sofa, red/blue mug accents, ordinary home not palace. Clear crisp detailed anime linework consistent with reference, emotional focus on choosing to be here after clocking off. Face fully survives mobile center crop; bottom quarter noncritical embrace detail for dialogue. No nudity, no text, no logos, no watermark.

### 游戏社夜景变体

Use case: lighting-weather. Edit this existing Japanese anime visual novel game club room background to NIGHT only. Keep EXACT furniture, central computer desks, window, shelves, chairs and indoor potato garden layout, props, perspective and detailed anime drawing style. Outside window dark night sky and a few lit campus windows. Indoors cozy warm overhead/task lights and garden lamps, screens dim with abstract glow, room still clearly readable. No people added, no readable text, no logos, no watermark. Landscape 16:9. This is a time-of-day variant, not a redesign.
