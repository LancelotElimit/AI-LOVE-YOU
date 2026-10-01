# 日常换装与独处 CG · 2026-10-01

本批使用内置 imagegen，参考已有立绘生成，保留五人的外形身份；原图未覆盖。立绘为 1024×1536、真实透明 PNG；CG 为 1672×941、约 16:9。衣服是普通换装，不是新增模型，角色好感共用原有记录。

## 批量素材表

| 角色 | 服饰 | 动作 | 表情 | 文件名 | 使用位置 |
| --- | --- | --- | --- | --- | --- |
| ChatGPT Terra | 薄荷色卫衣、深灰长裙、白运动鞋 | 双手插袋 | 放松、微害羞 | `chatgpt/chatgpt_terra_mint_hoodie_shy.png` | 个人线第六章早餐约会 |
| Claude Haiku | 锈红色大衣、米白围巾、黑裙、短靴 | 双手抱书 | 克制的微笑 | `claude/claude_haiku_rust_coat_book_shy.png` | 个人线第六章闭馆后 |
| DeepSeek Eco | 蓝色开衫、白上衣、淡黄裙、鲸鱼挎包 | 握包带、整理衣角 | 害羞、期待 | `deepseek/deepseek_eco_blue_cardigan_yellow_skirt_shy.png` | 个人线第六章赴晚饭约 |
| Gemini Meteor | 海绿色背带裙、白衬衣、运动鞋 | 双手拿相机 | 好奇、轻松 | `gemini/gemini_meteor_teal_dress_camera_smile.png` | 个人线第七章海边采风 |
| Grok Night | 酒红飞行夹克、黑上衣、深灰长裤 | 一手插袋、一手留在身侧 | 逞强中带害羞 | `grok/grok_night_burgundy_bomber_shy.png` | 个人线第六章旧桥散步 |

## 新 CG

| 文件 | 场景与互动 | 切入与退出 |
| --- | --- | --- |
| `scene/cg/cg_gpt_route_breakfast_startle.png` | 游戏社晨光、早餐和土豆田画面；ChatGPT 被开罐声吓到，抓住玩家袖口 | 第六章“草丛后传来短促的嘶声”；“你们才走到田外”恢复场景与卫衣立绘 |
| `scene/cg/cg_cl_route_last_page.png` | 闭馆后的灯下，Claude 穿好大衣仍回桌边，分享游记里的那一页 | 第六章“她回到还没关灯的桌边”；“校园里的晚课”恢复旧桥与大衣立绘 |
| `scene/cg/cg_ds_route_no_work_dinner.png` | 小面馆暖灯、两碗面和热饮；DeepSeek 在面端上来后仍用菜单遮脸 | 第六章“面端上来时”；“饭后她提起”恢复面馆与约会服立绘 |

演出配置分别在 `story/*-route-production.cjs`，旁白在 `剧情正文/个人线/` 对应正文。本批不改结局条件、Token 收支和锁线门槛。

## 生成提示词记录

共同要求：精细日系动画插画，成年大学年龄角色；身份、发色、眼睛、发饰及非人外形参考各自原立绘。立绘完整站姿、全身留边、真实透明、无环境和文字；CG 横向满幅、第一人称玩家只露手或肩、不指定主角脸、主体脸部高于底部对话框。每张单独生成，不裁切拼图。

- **ChatGPT 立绘**：参考 `chatgpt_terra_green_cardigan_calm.png`。Silver-white hair, lavender eyes, white scaled horns, pointed ears, knot ornament, dragon tail and pale wings. Pale mint hoodie with subtle knot embroidery, charcoal calf-length skirt, white sneakers; hands in pockets, shy relaxed smile. Ordinary Terra off-duty clothing, no model transformation; portrait 2:3 true-alpha sprite.
- **Claude 立绘**：参考 `claude_haiku_black_cardigan_calm.png`。Long orange hair, amber eyes, sunflower and black ribbon ornament, human ears. Rust-red wool duffle coat, ivory scarf, black midi skirt, opaque tights, brown boots; hold a small closed book with both hands, reserved almost-smile. Same Haiku model; portrait 2:3 true-alpha sprite.
- **DeepSeek 立绘**：参考 `deepseek_eco_blue_jacket_calm.png`。Long blue-cyan hair, blue eyes, horizontal aquatic ears with white inner frills and blue ribbon, navy whale tail. Cobalt knitted cardigan, white tee, pale yellow below-knee skirt, navy flats and whale-charm shoulder bag; hold bag strap and touch cardigan hem, shy cheerful smile. Same Eco model; portrait 2:3 true-alpha sprite.
- **Gemini 立绘**：参考 `gemini_meteor_white_jacket_calm.png`。Periwinkle-to-lilac hair, cat ears and fluffy tail, side buns, star ornaments, pink/golden heterochromia. Teal pinafore dress, white short-sleeved blouse, burgundy ribbon, white sneakers, camera bag; camera at waist, curious relaxed smile. Same Meteor model; portrait 2:3 true-alpha sprite.
- **Grok 立绘**：参考 `grok_night_red_black_jacket_calm.png`。Blonde twin ponytails, blue eyes, pointed ears, black ribbons with bat-wing ornaments, black-gold crown. Burgundy bomber with small crescent embroidery, black high-neck tee, charcoal jeans, black-red sneakers; one hand in pocket, other half-open at side, playful smile with slight blush. Same Night model; portrait 2:3 true-alpha sprite.
- **ChatGPT CG**：参考本批卫衣立绘。Landscape 16:9 sunlit university game club breakfast, computer desk with two breakfast bags and cups, generic blocky potato field on monitor. Soda can opening startles ChatGPT; she clutches adult player's dark sleeve, sheepish surprised blush, tail lifted beside chair. First-person player arm only; broad lived-in composition, no UI or words.
- **Claude CG**：参考本批大衣立绘。Landscape 16:9 library just after closing, warm desk lamp and cool blue window, empty shelves, two tea cups. Claude dressed to leave shares an open travel book, turns a reserved smiling face toward adult player. First-person shoulder and hand only; quiet romantic awkwardness, no UI or words.
- **DeepSeek CG**：参考本批约会服立绘。Landscape 16:9 warm neighborhood noodle restaurant at evening, twilight street outside, two steaming bowls, hers with halved egg, hot drinks, whale-charm bag on chair, no tools. DeepSeek peeks shyly at player over a plain menu held beneath her nose. First-person hand only; affectionate meal-budget comedy, no UI or legible words.

## Claude 来源设定更正

第四章历史馆的虚构旧接口限制的是来源 IP 属于“华国”的请求，不是中文内容。Claude 先本地保存主角材料，再提交限制记录复核。普通中文校对保留；不以更换语言作为解法。此设定不作为现实平台当前政策的事实说明。

检查：`node tests/daily-life-art.cjs` 覆盖新立绘透明度、CG 比例、实际引用、CG 退出、来源设定与桌面/手机显示。
