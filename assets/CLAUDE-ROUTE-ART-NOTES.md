# Claude 个人线演出素材

本轮使用内置图像生成工具，所有游戏引用的成品已复制进项目。原有图片没有覆盖；第一张抱书立绘作为尝试保留在生成目录，游戏使用再次清理后的版本。

## 本轮成品

| 文件 | 用途 |
| --- | --- |
| `scene/bg/bg_cl_route_library_night.png` | Tokenia 闭馆后的阅览桌；校准、工作与分别 |
| `scene/bg/bg_cl_route_real_room_dawn.png` | 主角现实房间，清晨；意外返回与通道测试 |
| `scene/bg/bg_cl_route_real_room_night.png` | 同一现实房间，夜晚；旧时间线来信 |
| `claude/claude_haiku_black_cardigan_book_shy.png` | Haiku，黑色针织外套与长裙，双手抱书，害羞微笑；透明背景 |
| `scene/cg/cg_cl_route_crossworld_call.png` | 现实清晨与 Tokenia 夜晚通过笔记本视频通话；不叠加立绘 |
| `scene/cg/cg_cl_route_reunion.png` | HE / TE：双向门打开，Claude 进入现实并牵手；不叠加立绘 |

背景和 CG 约为 16:9（1672 × 941），人物为竖幅（1024 × 1536）。日式动漫视觉小说画风，沿用橙色长发、花饰、黑金植物刺绣和流苏的人物特征。其他服装复用 Opus 工作披肩与 Sonnet 书页裙；正文在切换时有说明，不将切换模型混同于其他时间线。

## 剧情与结局

六章为 06–11，四个结局为 TE、HE、NE、BE。第六章保留完整来信、第七章双侧手写确认、第九章尊重当前 Claude 重新核验，是 TE 的三个前置选择；HE 要求后两个选择。其余情况下仍可保留通信进入 NE，或选择未经确认的门进入 BE。

当前 Claude 与旧时间线 Claude 的记忆不合并，好感不继承。旧频道的对白标记为“旧时间线 · 消息”，不使用当前 Claude 的视频通话 CG。旧时间线人物也保留自己的生活与寄信地址，不作为开启通道的消耗品。

## 手动修改位置

- 对白：`剧情正文/个人线/Claude-规则之外仍然是你.md`。
- 场景、服装差分、音乐：`story/claude-route-production.cjs`。每章初始状态和正文短句定位的 `cues` 分开维护。
- `remoteSpeaker` 只用于从 Tokenia 侧展现当前 Claude 的工作形态，发消息时仍明确标记“消息”；旧频道永远不冒用当前人物立绘。
- 门槛：`story/personal-routes.cjs`。
- 更新对白后运行 `node tools/build-personal.cjs`；定位短句被删改时会报告未匹配，避免演出静默错位。
- 验证：`node tests/personal-routes.cjs` 和 `node tests/claude-production.cjs`。
- 本轮不改动或同步 `desktop-edition/` 的独立副本。

## 生成提示词

人物与 CG 以 `assets/claude/claude_haiku_black_cardigan_calm.png` 为身份参考。透明清理引用第一次生成的抱书立绘；现实夜景引用本轮现实清晨背景。抱书两次调用启用透明背景，其余均为不透明背景。

### 图书馆夜景

Use case: illustration-story. Asset type: 16:9 full-bleed anime visual novel background, no characters. A quiet university library reading and archive room in Tokenia after closing, tall bookshelves, one broad oak reading desk near a large arched window, old terminal with soft pale teal indicator lights, two handwritten notebooks with illegible marks, two distinct small clocks, blank bookmark, porcelain tea cup, single orange flower in a slim glass vase. Outside moonlit campus roofs. Warm desk lamp against cool teal night, elegant detailed painterly anime background with crisp linework. Ordinary intimate research room, not enormous fantasy machinery, not abandoned horror. Desk and environment clearly visible, clear central foreground for character sprite, uncluttered lower quarter for dialogue. No readable text, no logos, no watermarks or frame.

### 现实房间清晨

Use case: illustration-story. Asset type: 16:9 full-bleed anime visual novel background, no people. The protagonist's ordinary contemporary real-world bedroom study at dawn, a simple wood desk with laptop, smartphone laid beside handwritten notebook, single glass of water, inexpensive adjustable desk light, office chair, books and headphones, curtains open onto pale morning apartment rooftops. Laptop displays an abstract dark interface with a small amber connection indicator, no readable words. This is REAL WORLD, no fantasy architecture, no portals or magical glow, no luxury gamer setup. Clear detailed painterly Japanese anime linework, soft cool morning light with warm desk accents, quiet room that looks almost unchanged after one night. Wide eye-level view with clear lower quarter for dialogue, no readable text, no logos, no watermark or frame.

### 抱书立绘身份与动作

Use case: identity-preserve. Asset type: full-body anime visual novel character sprite with genuine transparent alpha background. Reference image gives exact adult female identity and costume. Keep long copper-orange hair, amber eyes, orange flower ornament and black ribbon with cream tassels, black floral embroidered cardigan, cream ruffled blouse with black bow and gold brooch, long black skirt with gold/orange botanical embroidery, waist ornament and black lace-up heeled boots. Same proportions and detailed anime linework. Change only pose and expression: she holds a closed small dark teal book against her chest with both hands, shoulders slightly drawn inward, a small sincere shy smile and lightly pink cheeks, looking towards viewer rather than coldly judging. Whole body and hair visible inside canvas including boots. No scene, no colored glow, no vignette, no drop shadow, no floor, no border, no watermark. Transparent background, not black background.

### 抱书立绘透明清理

Use case: background-extraction. Edit the reference image: remove ALL background including the entire orange/brown halo and black vignette, replacing every area outside the woman's actual hair, clothes, hands, book and boots with fully transparent alpha. Keep the character's identity, drawing, expression, full-body pose and costume unchanged. The area between hair strands must also be transparent. No glow, no aura, no gradient, no floor shadow, no solid color backdrop. This is a clean isolated game sprite cutout, not a portrait with decorative lighting. Preserve the book-holding shy smile and every costume detail.

### 跨世界通话 CG

Use case: identity-preserve, narrative illustration. Asset type: 16:9 full-bleed Japanese anime visual novel CG. Reference identifies the adult woman Claude only; do not copy its dark backdrop. Preserve long copper-orange hair, amber eyes, orange flower and black ribbon with cream tassels, black cardigan and long black skirt with orange/gold botanical embroidery, cream ruffled blouse and black bow. Scene: first-person view from protagonist's REAL contemporary bedroom desk at dawn, laptop dominates central upper part and shows a live video call of Claude sitting in Tokenia library at NIGHT. Only ONE Claude appears, entirely inside the laptop screen, looking towards camera with a small tired but affectionate smile, hands around a porcelain teacup, one orange flower and books visible behind her under warm lamp. In real room foreground an open handwritten notebook and a glass of water, protagonist's resting hand visible near keyboard. Contrast pale dawn window in real room with warm night library inside screen. Her face must be high and central enough to remain visible on a portrait mobile crop and above lower dialogue area. Screen physical boundaries clear, no magical duplicate characters, no split-face collage. Detailed anime linework and painterly environments, clear expressive eyes, bittersweet distance, no readable text, no logos, no watermarks or border.

### 重逢 CG

Use case: identity-preserve narrative illustration. Asset type: 16:9 full-bleed Japanese anime visual novel romantic reunion CG. Preserve exact adult Claude from reference: copper-orange long hair, amber eyes, orange flower with black bow and cream tassels, black botanical embroidered cardigan, cream ruffled blouse with black neck bow, black long skirt with gold/orange embroidery. She has just stepped from Tokenia library through an ordinary rectangular open wooden doorway into protagonist's contemporary room at dawn. The doorway reveals warm lamp-lit bookshelves and nighttime arched library window, while real-world side has pale morning curtain and desk. No giant glowing ring, no battle. First person protagonist viewpoint, Claude leaning close reaching forward to hold one visible protagonist hand, shy relieved smile with moist eyes but no dramatic crying, her other arm relaxed, exactly two arms. Medium shot, her face at center upper third, clear enough for mobile center crop, hands just above bottom quarter, cinematic but quiet earned tenderness. Paper bookmark tucked in her hand, two little clocks on nearby desk subtly hint time difference. Keep character appearance and outfit, detailed clean anime linework and painterly environmental art, no readable text, no logos, no watermark or decorative border.

### 现实房间夜景

Use case: lighting-weather. Asset type: 16:9 anime visual novel background variant. Change ONLY time and lighting of the reference contemporary bedroom study from dawn to late night. Preserve exactly the same room geometry, desk, laptop, notebook, chair, bed, curtains, glass of water, headphones and furnishings. Outside window dark apartment roofs with scattered lit windows and gentle rain, NO sunrise or daytime sky. Warm desk lamp and modest laptop glow illuminate working surfaces clearly, cool gray green night shadows, quietly lonely but not horror or ruined. No people, no magical effects, no portals, no readable text or logos, no borders or watermark. Same crisp painterly Japanese anime background style and full-bleed framing.

