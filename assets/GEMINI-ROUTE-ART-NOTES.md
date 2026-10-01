# Gemini 个人线演出素材

本轮使用内置图像生成工具制作；八张成品均复制到项目，原有素材没有覆盖。身份参考为 `assets/gemini/gemini_meteor_white_jacket_calm.png`；雨后夜景以新生成的雨天驿站为布局参考。

## 成品清单

| 文件 | 用途 |
| --- | --- |
| `scene/bg/bg_gm_route_station_day.png` | 城外的小车站、首次合照、NE 周末短途旅行 |
| `scene/bg/bg_gm_route_coastal_village.png` | 海边采风、居民家门边界、雨棚和面包 |
| `scene/bg/bg_gm_route_mountain_inn_rain.png` | 山间大雨暂住、宣传工作压力、救援后整理地图 |
| `scene/bg/bg_gm_route_valley_after_rain.png` | 雨后安全集合点、观测与救援合作 |
| `scene/bg/bg_gm_route_mountain_inn_night.png` | 驿站夜景、灯闪后的停顿、救援结束后的合同讨论 |
| `gemini/gemini_meteor_white_jacket_camera_shy.png` | Meteor，白夹克，双手拿相机，害羞微笑；透明背景 |
| `scene/cg/cg_gm_route_rainy_pause.png` | 第八章雨夜独处，她拒绝拍照但愿意靠近；全屏，不叠立绘 |
| `scene/cg/cg_gm_route_next_departure.png` | HE 新旅程列车，她主动邀请你拍一张；全屏，不叠立绘 |

背景与 CG 为约 16:9（1672 × 941），立绘为竖幅（1024 × 1536）。统一日式动漫视觉小说画风，人物保留蓝紫渐变长发、猫耳与尾巴、星饰、异色瞳（画面左侧粉色、右侧金色）。不把不同模型当成不同人物；星图披肩用于路线核对、观测与救援，白夹克用于旅行和私人相处，切换处有旁白和回应。

## 路线与结局

第六至十章，共五章。顺序为第一次短途约会、海边地图更正、雨天独处、山谷救援与合同提案、校园放映及结局选择。

- HE：第七章让居民确认通行范围，第八章让她决定作品并保留真实的雨天，然后发布独立作品。主题是创作与私人生活可以共存，不是放弃一切赞助。
- NE：保留私人相册，继续小范围旅行，暂时不将个人情绪公开；不是失败的 HE。
- BE：接受永久展示合同，宣传版本覆盖真实感受；她终止后续合作，拒绝继续同行，仍保有能力与选择。

玩家不得在她拒绝时继续拍摄。第八章 CG 展示相机关闭后的相处，不作为人物拍摄并公开的照片。救援需要当地知识、向导与救援人员，不让主角单独冲进危险山谷。

## 手动修改位置

- 对白：`剧情正文/个人线/Gemini-地图之外的相册.md`。
- 场景、差分、BGM：`story/gemini-route-production.cjs`。每章初始状态与正文短句定位的 `cues` 分开；定位短句删改时，编排会提示未匹配。
- 结局门槛：`story/personal-routes.cjs`。
- 修改后更新：`node tools/build-personal.cjs`，不要直接改生成的 `personal.generated.js`。
- 验证：`node tests/personal-routes.cjs` 和 `node tests/gemini-production.cjs`。
- 其他角色仅在放映与专业协助时出现，没有占据旅行独处段落。
- 本轮不改动或同步 `desktop-edition/` 的独立副本。

## 生成提示词

相机立绘启用透明背景；其他七张均为不透明背景。以下为本轮完整提示词。

### 城外车站

Use case: illustration-story. Asset type: 16:9 full-bleed Japanese anime visual novel background, no people. A charming small regional railway station outside Tokenia university city at early afternoon, a short platform and old wooden station building, cream and pale mint paint, flower pots recently watered on a sunny ticket-office windowsill, wooden benches, a little local train stopped in the distance, clean metal rails leading toward green hills. Believable ordinary place worth visiting, not huge futuristic terminal or luxury resort. Crisp detailed painterly anime environment, clear blue sky, bright soft daylight, mint green, white and warm red accents. Eye-level wide framing with open central foreground for character sprites and uncluttered bottom for dialogue. No readable station names, timetable text, logos, watermarks or decorative borders.

### 海边村落

Use case: illustration-story. Asset type: 16:9 full-bleed Japanese anime visual novel background, no people. A lived-in coastal fishing village in Tokenia on an overcast late afternoon just after light rain. View from under a small timber awning with two plain bread rolls in paper bags on a bench, wet stone pedestrian lane leading down to a modest old jetty, teal sea and small fishing boats. Nearby resident houses have lit windows, plants and closed garden gates, clearly inhabited. A closed photography lookout has repair barriers and an illegible notice board. Not a tropical resort, not ruins. Detailed crisp painterly anime environment, cool sea green and silver sky with warm coral household accents, visible everyday working village. Clear central space for character sprite, unobtrusive lower quarter for dialogue, no readable text, no logos, watermark or frame.

### 雨天驿站

Use case: illustration-story. Asset type: 16:9 full-bleed Japanese anime visual novel background, no characters. Interior shared sitting room of a small mountain travelers' inn during heavy afternoon rain, two adjacent ordinary wooden chairs beside a wide fogged rain-streaked window, small table with two mugs of hot water, a folded paper map, an open photo album with a genuinely blank page, and a switched-off compact terminal. Sturdy wood walls, green woven cushions, shelf of local guidebooks, warm practical lamps, wet jackets on hooks by doorway, hazy green valley visible outside. Safe unpretentious shelter, no luxury hotel, no bedroom or intimate bed scene. Detailed crisp painterly anime environment, soft warm lamps versus cool green rain, calm slightly melancholy pause. Clear space for a character sprite and lower dialogue overlay. No readable text, no logos, no watermark or border.

### 雨后山谷

Use case: illustration-story. Asset type: 16:9 full-bleed Japanese anime visual novel background, no people. A safe mountain trail junction in Tokenia the morning after rain, low timber ranger shelter and marked safe assembly area overlooking a lush green valley, a wet stone trail with rope safety railing and two branching paths, folded rescue stretcher and radio on a bench inside shelter, distant old greenhouse and a few tiny amber maintenance lights visible across forest slopes. Soft mist lifting, broken clouds and fresh pale sunlight, believable rescue staging area not dangerous heroic cliff jump. Detailed clean painterly anime art, rich varied greens, pale gray stone and small red safety accents, clear foreground for character sprite, lower quarter not cluttered. Any sign markings abstract and illegible, no readable text, logos, watermark or frame.

### 相机立绘

Use case: identity-preserve. Asset type: full-body Japanese anime visual novel character sprite, true transparent alpha cutout. Reference is character identity and exact costume only, NOT its colored halo background. Preserve adult Gemini's long wavy blue hair fading to lavender and pink at tips, cat ears, fluffy blue-purple tail, star hair ornament and earrings, heterochromia (viewer-left eye pink magenta, viewer-right eye golden yellow), white cropped off-shoulder jacket, burgundy cropped top, charcoal shorts, star charms and white burgundy platform boots. Same detailed anime proportions. Pose: holding a compact black camera carefully with both hands at waist level, standing relaxed, affectionate slightly bashful smile with lightly pink cheeks, looking toward viewer, ears perked. Full body including boots, hair and tail fully inside canvas. Remove ALL surroundings and glow; outside her actual silhouette must be fully transparent, including between hair strands. No purple or blue aura, no vignette, no floor shadow, no text, no frame, no watermark.

### 雨夜独处 CG

Use case: identity-preserve narrative illustration. Asset type: 16:9 full-bleed Japanese anime visual novel romantic quiet CG, nonsexual. Reference gives exact adult Gemini identity and travel costume only, do not copy colored halo. Preserve long wavy blue hair with lavender-pink tips, cat ears, fluffy blue-purple tail, star ornaments, heterochromia viewer-left magenta and viewer-right golden iris, white cropped jacket over burgundy top and charcoal shorts. She sits beside protagonist at a small mountain inn shared sitting-room window at night while rain falls outside. First-person seated protagonist viewpoint, her upper body centered, head tilted slightly toward viewer, a small relieved shy smile, she lightly rests one hand over protagonist's visible hand on chair arm, shoulders relaxed. No exposed intimacy, no bed, no swimsuit. Camera switched off on nearby table, open photo album with a blank page and two hot water mugs, warm lamps, cool rainy green valley night behind glass. Detailed expressive clean anime lines and painterly environment. Her face upper-middle safe for mobile center crop, hands above bottom dialogue quarter. Only one visible character, exactly two arms, no readable words, no logos, watermark or frame.

### 下一次出发 CG

Use case: identity-preserve narrative illustration. Asset type: 16:9 full-bleed Japanese anime visual novel happy ending CG, nonsexual. Preserve adult Gemini from reference: long wavy blue hair with lavender-pink ends, cat ears, fluffy blue-purple tail, star ornaments, heterochromia viewer-left pink magenta iris and viewer-right golden yellow iris, white cropped travel jacket over burgundy top and charcoal shorts. She sits across from protagonist inside an ordinary regional train departing for their next trip in Tokenia, bright morning green hills and sky through broad window. First-person seated protagonist viewpoint. Medium waist-up shot, her face centered upper middle and safe for mobile crop, warm genuinely happy slightly shy smile looking directly at viewer. She offers a compact black camera toward protagonist with one hand, other hand resting on an open photo album with a blank next page on her lap; no third arm. Hair slightly wind-tousled, a small travel bag beside seat, gentle natural sunlight, emerald and red train upholstery, hopeful ordinary shared journey rather than completed grand world tour. Clean detailed anime linework, painterly full environment, lower dialogue quarter free of essential face detail, no readable words, logo, watermark or frame.

### 雨后驿站夜景

Use case: lighting-weather. Asset type: 16:9 full-bleed anime visual novel background variant. Change only time and weather of the reference mountain inn public sitting room to a quiet NIGHT AFTER THE RAIN HAS STOPPED. Preserve exact room layout, wood chairs with green cushions, table with two mugs, album, folded map, compact terminal, lamps, shelf, coats on hooks, window position and framing. Outside window a dark green mountain valley with thin lifting mist and a few village lights, no falling rain, no daylight sky; small residual droplets on glass are okay. Warm practical lamps clearly illuminate table and paperwork, calm thoughtful atmosphere suitable for reviewing a creative contract. No characters, no new bed or bedroom, no readable text, logos, watermark, border or fantasy effects. Match same detailed crisp painterly Japanese anime style.

