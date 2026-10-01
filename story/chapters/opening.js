// Story nodes for the shared first-chapter opening.
window.STORY_UTILS.sequence('intro','room',null,[
    ['narration','凌晨两点十七分。你又看了一眼右下角的时间，决定不看了。报错还是那一行，桌边的水也还是凉的。'],
    ['you','再改一处。就一处。能跑起来我就睡。'],
    ['narration','浏览器里挤着五个平台的标签页。为了省钱，你把每家的免费额度都留了一点。此刻，它们同时亮起。'],
    ['narration','报错下面多出一条链接：“零号中转站 · 跨域会话恢复”。没有域名，却带着刚才那段代码的校验值。'],
    ['you','这个校验值……是刚才复制的那段？我什么时候开过共享？'],
    ['narration','你点开链接。五个窗口安静地叠成一页，屏幕中央只剩一个用户名输入框。光标在里面闪烁，像是在等你很久了。'],
    ['system','访客连接待确认。目的地正在请求一个名字。',{inputName:true}],
    ['system','欢迎，{name}。访客身份已确认。检测到五份试用额度，正在合并……可用 Token：10,000。'],
    ['narration','页面边缘短暂浮出一串参数：目标区域，Tokenia 学园都市；身份状态，未登记；返回出口，未确认。'],
    ['you','只是输入了一个名字……等等，怎么连我的桌面都关不掉了？']
  ],'crossing.0');

window.STORY_UTILS.sequence('crossing','room',null,[
    ['narration','你按下 Escape。没有反应。屏幕中的光标忽然向前移动，越过玻璃，在你的指尖投下一个清晰的影子。'],
    ['system','断开连接将导致目的地姓名为空。{name}，中转通道已开启。'],
    ['you','我只是想登录看看，不是要把自己也上传——'],
    ['narration','你伸手去碰电源键，指尖却陷进了像水一样的屏幕。房间被拉成细长的光线，未提交的代码连同椅子一起远去。',{portal:true}],
    ['system','用户名已写入目的地。{name}，欢迎来到屏幕的另一边。']
  ],'repair-morning.0');

window.STORY_UTILS.sequence('repair-morning','prologue_deepseek_work',null,[
    ['narration','同一时刻，Tokenia 外环。DeepSeek 将第三颗螺丝放进纸杯，低头找第四颗。它没有滚远，就藏在她鞋尖下面。',{delivery:'DeepSeek 视角'}],
    ['narration','再装好这一块盖板，今天最麻烦的维修单就能划掉了。她已经想好了：先把热饮喝完，再去送工具箱。杯盖上那点热气越来越薄，实在不值得再等。'],
    ['narration','登记机又亮了一次。她伸手压住松动的接口，没有抬头。昨天报过的重复提交还没修，值班人员却只给故障说明添了一行“请耐心等待”。'],
    ['narration','耐心当然可以有。反复扣钱可不行。她把那行说明往下拖，继续寻找能让请求真正停住的地方。'],
    ['narration','身后的大厅传来一声闷响。她回过头，看见一个没有行李的人坐在地上，像刚从什么地方摔下来。那一带没有台阶。'],
    ['narration','她把螺丝刀放下，准备过去。那人却自己站起来，掸了掸衣服，向路过的学生问了句什么。学生指了一个方向，他点头道谢，神情看起来比刚才还茫然。'],
    ['narration','能站稳，也能说话。可能只是没找到接待台。她稍稍放下心，低头把最后一颗螺丝拧回去，还是忍不住再往那边看了一眼。'],
    ['narration','那个人走向了登记机。'],
    ['narration','偏偏是那一台。她还没来得及喊，确认键已经亮了。杯里的饮料暂时不用惦记了。']
  ],'arrival.0');

window.STORY_UTILS.sequence('arrival','transit',null,[
    ['narration','膝盖先碰到地面。你撑着手坐起来，瓷砖凉得很真实。头顶的广播正在报站，拖着行李的人绕过你，没人停下来等你解释。远处一座高塔亮在晨雾里。',{delivery:'你的视角'}],
    ['you','……我刚才还坐在椅子上。'],
    ['narration','你摸遍口袋。手机没有信号，钱包和学生证不见了。掌心却浮起一枚半透明的数字：10,000 TK。'],
    ['system','欢迎来到 Tokenia 学园都市外环换乘厅。跨域试用额度已兑换为通用 Token。身份状态：未登记。'],
    ['you','免费额度能当钱用？先别高兴。一万够住几天，我还不知道。'],
    ['narration','自动售货机上的热饮标价 120 TK，旁边贴着“低推理糖分 / 高上下文咖啡因”的新品广告。你看了半天，决定先不把救命钱花在看不懂的饮料上。'],
    ['narration','你向路过的学生问路。对方听到“我从电脑屏幕里来”之后，沉默两秒，礼貌地指向了医务室。'],
    ['you','谢谢。我先……找登记处。'],
    ['system','外环闸机需要学生证、教职权限或临时同行见证。'],
    ['you','要找人带我进去。可我谁也不认识啊。'],
    ['narration','你转向自动登记机。它建议你申请临时身份，但确认条款滚得很快，费用预估也开始一跳一跳地上涨。'],
    ['system','临时登记请求重试中。预计费用：120 TK。预计费用：240 TK。预计费用：480 TK。'],
    ['narration','你又按了一次确认。机器尖叫起来，连旁边的人都回了头。维修区里，一位蓝发少女猛地站起，膝盖撞到桌沿，零件盒跟着滚了下来。她顾不上捡，拎起工具箱向这边跑。'],
    ['deepseek','别按了别按了！它不是没反应，是快被你按坏了！',{char:'deepseek',sprite:'angry'}],
    ['narration','蓝发少女抱着工具箱冲出来，尾巴差点扫倒路边的提示牌。她蹲到登记机前，把维护线插进接口，手忙脚乱地按住不断上涨的费用预估。'],
    ['deepseek','停住了……还好，没扣成功。你余额一万？等等，你是刚兑换的新账户？',{char:'deepseek',sprite:'hello'}],
    ['you','如果“从电脑里掉出来”也算新账户的话。'],
    ['deepseek','电脑……你等一下，我先把这一页存下来。别走，可能还要问你刚才按了什么。',{char:'deepseek',sprite:'hello'}],
    ['narration','她把你带到维修区旁边的小桌。那张桌子一半堆着螺丝和电路板，另一半勉强空出来，放下一杯还冒热气的饮料。'],
    ['deepseek','这杯还没喝过。你要是不介意，先坐一会儿。你脸色不太好。',{char:'deepseek',sprite:'happy'}],
    ['you','谢谢。那个 TK……就是钱吗？我看饮料也用它。'],
    ['deepseek','日常买东西，是。申请服务、开一些设备，也从里面扣。刚才涨的是重试预估，不该每按一次都算一遍。',{char:'deepseek',sprite:'hello'}],
    ['deepseek','这台我昨天就报过了，说它老重复提交……算了，先不说这个。你后面还按过别的没有？',{char:'deepseek',sprite:'angry'}],
    ['you','外环？那里面是内校区？'],
    ['deepseek','对。这里不用证，里面要。你先别再试闸机，我给接待窗口发个消息。',{char:'deepseek',sprite:'hello'}],
    ['narration','她说到这里，登记机又轻轻响了一声。DeepSeek 立刻扑过去拔掉一根线，然后若无其事地把工具箱盖上。'],
    ['deepseek','刚才那个不算。它旧了，脾气不好。',{char:'deepseek',sprite:'angry'}],
    ['you','你是这里的工作人员？'],
    ['deepseek','DeepSeek。DeepSea 深海工坊，外环维护协助。说是协助，其实就是哪里坏了往哪里跑。',{char:'deepseek',sprite:'hello'}],
    ['narration','她在维修单背面写下自己的名字，撕掉沾过油的那一角，递给你。纸很小，你却终于有了一个不需要猜的称呼。'],
    ['you','我叫 {name}。刚才……谢谢。'],
    ['deepseek','嗯，我看见了。机器一直在喊你的名字。',{char:'deepseek',sprite:'happy'}],
    ['narration','你低头捧住杯子。她也低头整理零件。中间没有人说话，登记机彻底静下来以后，广播声反而变得很大。'],
    ['you','我应该先去哪儿？'],
    ['deepseek','接待台。不过先把这口喝了，你手还在抖。等我把工具箱扣好，带你去拿号。',{char:'deepseek',sprite:'hello'}],
    ['narration','你这才发现，她连你的来历都还没问完。她确实也不知道怎么把你送回去，但此刻至少知道下一张椅子在哪里。']
  ],'first-counter.0');

window.STORY_UTILS.sequence('first-counter','transit',null,[
    ['narration','大厅另一端比维修区吵。有人拿着课表找教室，有人把证件落在了昨天的衣服里。DeepSeek 带你走到队尾，自己先腾出一只手，扶正那根歪掉的隔离带。'],
    ['narration','隔着前面几个人的肩膀，你看见服务台后的白发女孩。她把一张纸质地图摊开，手指沿着路画了一遍；问路的学生刚点头，又从包里找出另一张课表。',{bg:'prologue_chatgpt_work'}],
    ['chatgpt','这间换过了，去东楼。你跟刚才那位同学不在同一栋，别一路跟着她走。',{bg:'prologue_chatgpt_work'}],
    ['narration','学生匆匆离开。她抬手想碰一下放在终端后面的早餐，下一位已经把材料递到桌边。她收回手，先把那张皱掉的表铺平。',{bg:'prologue_chatgpt_work'}],
    ['you','她是不是一直没吃上？',{bg:'prologue_chatgpt_work'}],
    ['deepseek','ChatGPT。我们可以晚一点问。先拿号，不用挤过去。',{bg:'prologue_chatgpt_work'}],
    ['narration','你们等了两次叫号。你试着给家里发消息，圆圈转完，还是留在发送中。你把手机按灭，又忍不住点亮。'],
    ['narration','轮到取等候号时，ChatGPT 正好起身补纸。她看了一眼你的申请，又看见膝盖上的灰。'],
    ['chatgpt','刚才摔了？现在走路疼不疼？',{char:'chatgpt',sprite:'chatgpt_terra_white_dress_calm'}],
    ['you','不疼。我想问回去……'],
    ['chatgpt','回哪边？'],
    ['narration','你指向身后，却说不出一个方向。她没有替你把那句没说完的话补上，只把等候号放到你手里。'],
    ['chatgpt','先在旁边坐着，别重新排队。等我处理完这两份，再听你说。',{char:'chatgpt',sprite:'chatgpt_terra_white_dress_calm'}],
    ['narration','下一位已经走近。你让开一步，她还来得及提醒你：椅子在右边，不是出口旁那排。'],
    ['deepseek','那边背光，坐下就不容易被人撞。你先过去，我把缺的维修记录补上。',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['narration','你坐到椅子上。隔离带围出的路弯了两次，谁也没有在这里等你揭晓什么惊天动地的秘密。你试着让自己也暂时只等一个号码。']
  ],'first-call.0');

window.STORY_UTILS.sequence('first-call','transit',null,[
    ['narration','过了一会儿，DeepSeek 抱着工具箱回到你旁边。箱盖没扣严，她试着用膝盖顶住，终端却在这时候响了。'],
    ['deepseek','Gemini？能看见我刚上传的那段吗？不是终端的位置，是请求最早从哪儿进来。',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['narration','她把终端架在箱盖上。蓝色光框升起，里面先出现半张地图，接着是一只把地图推开的手。女孩的脸离镜头太近，额前的星形发饰几乎碰到画面边缘。',{bg:'prologue_gemini_call'}],
    ['gemini','听见了。等一下，我这边还在对刚才那班车的路线。',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['narration','她退后一点。画面里有一扇高窗和望远镜，你却看不见它们在大厅的任何地方。那是另一间屋子，连窗边的光都比这里亮些。',{bg:'prologue_gemini_call'}],
    ['you','她不在这边？',{bg:'prologue_gemini_call'}],
    ['gemini','我在观测室。你把终端往左转一点好不好？现在只能看见你旁边那只箱子。',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['narration','你扶住终端。她在另一边侧了侧头，像这样就能绕过挡着镜头的工具箱。你也跟着侧头，才意识到自己做了同样没用的事。',{bg:'prologue_gemini_call'}],
    ['gemini','嗯，现在看见了。刚才登记机前是你？',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['you','是。你看见我怎么来的了吗？',{bg:'prologue_gemini_call'}],
    ['narration','她没有立刻答。几张地图从她手边移开，你第一次看见她桌上还压着一本翻到一半的书。她将画面停在你落地前的位置，来回看了两次。',{bg:'prologue_gemini_call'}],
    ['gemini','这里只记到你站起来。前面那一段是空的。你还记得脚下先碰到了什么吗？',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['you','地砖。之前是在自己的房间里。',{bg:'prologue_gemini_call'}],
    ['gemini','连走廊也没有？',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['you','没有。我还试着去关电脑。',{bg:'prologue_gemini_call'}],
    ['narration','她的手停在地图上。你等着一句解释，她却先拿起桌边的笔，在刚才那片空白外面画了一个圈。',{bg:'prologue_gemini_call'}],
    ['gemini','我把原图留住。现在乱补一条路，之后会更难找。你别为了回答我，再去试那台机器。',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['deepseek','对，这个一定别试。',{bg:'prologue_gemini_call'}],
    ['gemini','还有，DeepSeek，你的箱子快开了。',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['narration','DeepSeek 赶紧按住箱盖。画面里的女孩笑了一下，想说什么，观测室门口却有人喊她核对下一份路线。她扭头应了一声，重新看向你。',{bg:'prologue_gemini_call'}],
    ['gemini','我叫 Gemini。记录整理好就发给你们，你先坐着。我这边还有一件要交。',{bg:'prologue_gemini_call',delivery:'视频通话'}],
    ['narration','窗口收起，大厅的声音重新填满了那一小块空处。你下意识说了声谢谢，说完才发现通话已经结束。'],
    ['deepseek','收到记录以后再发也行。她看得到，不用在这里对着箱子说。',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['narration','你终于笑了一下。DeepSeek 把箱扣扣紧，指向旁边的资料窗口：她的维修单需要交接，你的申请也缺一份原始记录。']
  ],'first-records.0');

window.STORY_UTILS.sequence('first-records','transit',null,[
    ['narration','资料窗口里，Claude 正改今天第三份日期写错的申请。有人把“昨天”直接写进表格，又在落款处填了今天。她拿起铅笔，准备圈出来。',{delivery:'Claude 视角'}],
    ['narration','旁边的书车又响了。左侧轮子上周就开始吱呀叫，维修登记还挂着“已受理”。她想起这件事，顺手把催办单夹到待交的材料上。'],
    ['narration','新的申请跳到屏幕边角：未登记访客，建议分类“入侵风险”。Claude 把铅笔放下，先展开了附件。只有重试记录，没有越过闸机的记录。'],
    ['narration','大概又有人想用一个醒目的词，替还没查清的事起名字。她删掉预填分类，留下空栏，等送材料的人过来。'],
    ['narration','你跟着 DeepSeek 停在敞开的窗口外。橙发女孩没有先看你，她读完维修单，才用笔尖点了点那处缺少签名的地方。',{delivery:'你的视角'}],
    ['claude','这段停机是谁操作的？'],
    ['deepseek','我。签这儿？'],
    ['claude','对。签完还给你一份，原件我留着。'],
    ['narration','DeepSeek 把工具箱放下，找笔时又把刚收好的小票带了出来。女孩等她签完，才转向你。'],
    ['claude','{name}？你刚才进过闸机吗？',{bg:'transit',char:'claude',sprite:'claude_haiku_black_cardigan_calm'}],
    ['you','没有。它说我没有证。'],
    ['claude','我这里也是这样记的。那“入侵”不能用，先登记成访客。',{bg:'transit',char:'claude',sprite:'claude_haiku_black_cardigan_calm'}],
    ['you','刚才差点把我写成入侵？'],
    ['claude','是预填，不是结论。你可以看修改记录。',{bg:'transit',char:'claude',sprite:'claude_haiku_black_cardigan_calm'}],
    ['narration','她把终端转过来，没有继续解释自己为什么这样做。你看见那个词确实被划掉，下面保留着更正人的名字。'],
    ['you','Claude……是你？'],
    ['claude','嗯。上面那段经过，是你亲口说的，还是别人替你填的？',{bg:'transit',char:'claude',sprite:'claude_haiku_black_cardigan_calm'}],
    ['you','我说的。不过我说的是从屏幕里掉出来，不是“异常传输”。'],
    ['narration','她把四个字也划掉，在旁边写回你的说法，随后将确认页推给你。'],
    ['claude','那就这样留。之后问询时，可以从你记得的那一刻开始讲，不用为了听起来像这里的事，换成别的词。',{bg:'transit',char:'claude',sprite:'claude_haiku_black_cardigan_calm'}],
    ['narration','你握着笔，认真地把名字写在纸上。写完才发现这一回没有按钮闪烁，也没有费用往上涨。她等墨干了一点，才收走属于窗口的那一份。'],
    ['narration','下一份材料已经送到。你们离开窗口时，她拿起那支铅笔，继续圈刚才没有圈完的日期。']
  ],'first-headlines.0');

window.STORY_UTILS.sequence('first-headlines','transit',null,[
    ['narration','回等候区的路上，DeepSeek 停下来重新系鞋带。你拿着刚才的材料站在一边，公共屏上的小照片忽然让你觉得眼熟。'],
    ['narration','像你。背景也像刚才那台登记机。你往屏幕下面走了两步，照片却突然消失，标题只剩“来源待核”。'],
    ['narration','屏幕下方的长椅上，金发女孩夹着电话，膝盖上摊着一台小电脑。她的另一只手在触控板上划得飞快，语气比动作更不耐烦。',{bg:'prologue_grok_work'}],
    ['grok','先撤图。没说不能写，问你照片谁给的。'],
    ['narration','电话里说了很长一串。她抬头看了一眼屏幕，又低头确认时间，没接对方那个像是笑话的解释。',{bg:'prologue_grok_work'}],
    ['grok','收到匿名图片就能发？你下次收到一张我的退学通知，也打算先挂上去？'],
    ['narration','她按掉电话。椅边放着收起的三脚架，还没用过。你站到她面前，她先把电脑稍微向自己拉了一点。',{bg:'prologue_grok_work'}],
    ['you','那张照片，是我。',{bg:'prologue_grok_work'}],
    ['grok','你看见了？我刚撤，可能还是晚了一点。',{char:'grok',sprite:'grok_night_red_black_jacket_calm'}],
    ['narration','DeepSeek 系好鞋带赶过来，看见女孩，先喊了声 Grok。她们没寒暄，Grok 将刚才的发布时间转给她看。'],
    ['deepseek','这时候他还在我那边坐着。你们写他已经进校？',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['grok','所以撤了。现在连拍照的人都找不到。',{char:'grok',sprite:'grok_night_red_black_jacket_unimpressed'}],
    ['you','我需要说些什么吗？'],
    ['grok','你想说再说。我先查谁发的。',{char:'grok',sprite:'grok_night_red_black_jacket_calm'}],
    ['narration','你看了看那支三脚架，又看她。她顺着你的目光低头，干脆把它往椅子里侧推了一截。'],
    ['grok','不是来拍你的。早上本来约了一场访谈，对方还没到。',{char:'grok',sprite:'grok_night_red_black_jacket_amused'}],
    ['you','那他现在可以晚点到。'],
    ['narration','她短促地笑了一声，像本来没准备笑。终端又响起来，她看见名字，直接把提示翻了过去。'],
    ['grok','这个倒真可以晚点回。你先办自己的事。原图我不发你，里面还带了位置；时间记录可以留一份。',{char:'grok',sprite:'grok_night_red_black_jacket_calm'}],
    ['narration','她仍坐在原处，对着那条没能联系上的来源记录皱眉。下一次电话响起时，她换了一种客气得多的语气。你没听完，跟着 DeepSeek 回了等候区。']
  ],'witness-choice.0');

window.STORY_UTILS.sequence('witness-choice','transit',null,[
    ['narration','杯里的饮料已经不烫了。你慢慢喝完，才发现刚才拇指一直压在杯盖上，留下一道浅浅的红印。'],
    ['narration','DeepSeek 将取回的维修副本放在你旁边。接着是 Gemini 发来的原图，Claude 校对过的经过，还有 Grok 留下的发布时间。它们不是五份答案，只是让刚才那段混乱不至于什么也没剩下。'],
    ['deepseek','我这箱要送进校内。你如果也过去，应该能少绕一段。',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['you','不等叫号了吗？'],
    ['narration','她把等候号翻过来，正要找说明，ChatGPT 从队列另一边走来。桌上那两份材料已经交给值班同学，她手里终于拿着自己的早餐。'],
    ['chatgpt','我看过更正了。你的情况得去中央讲堂问询，这里办不了正式证。',{char:'chatgpt',sprite:'chatgpt_terra_white_dress_calm'}],
    ['you','你能带我过去？'],
    ['chatgpt','可以，我这边已经交接好了。刚才核过材料的人也能签同行申请，你有还想问的，可以先找她们。',{char:'chatgpt',sprite:'chatgpt_terra_white_dress_calm'}],
    ['narration','资料窗口的 Claude 听见叫号，抬手示意自己的交接也快结束了。Grok 正把三脚架收进包里。Gemini 的消息说她已交完路线，准备下楼；她还没从通话画面走到你面前。'],
    ['deepseek','申请在这里。我先把那台登记机的入口关了，这个不会重复扣款。你看完再按。',{char:'deepseek',sprite:'deepseek_eco_blue_jacket_calm'}],
    ['narration','你没有马上点。刚才分别说过话的人，现在都有一个你能够记住的小动作：被打断的早餐，铅笔划去的词，挪开的地图，没扣好的箱盖，以及收起来的相机架。'],
    ['narration','一万 Token 还在。回去的路仍没有。你把手从杯盖上移开，选一个人，陪你走过眼前这道门。',{choices:[
      {text:'和 ChatGPT 一起去讲堂',detail:'先问清楚今天能在哪里落脚',to:'chatgpt.0',route:'chatgpt',affinity:1},
      {text:'请 Claude 陪我去问询',detail:'想把刚才的经过原原本本说清楚',to:'claude.0',route:'claude',affinity:1},
      {text:'等 Gemini 过来，一起走',detail:'地图上缺掉的那一段，让人在意',to:'gemini.0',route:'gemini',affinity:1},
      {text:'和 DeepSeek 一起送工具箱',detail:'她也要进去，先帮她拿好维修单',to:'deepseek.0',route:'deepseek',affinity:1},
      {text:'请 Grok 带我过去',detail:'还想问问那张突然出现的照片',to:'grok.0',route:'grok',affinity:1}
    ]}]
  ],null);

for (const [prefix,start,end,bg] of [
  ['first-records',0,8,'prologue_claude_work'],
  ['first-headlines',2,7,'prologue_grok_work']
]) {
  for(let i=start;i<=end;i++) {
    const node=window.STORY[prefix+'.'+i];
    node.bg=bg;
    if(prefix==='first-records'&&i<4) node.delivery='Claude 视角';
  }
}

for (const [prefix,music] of Object.entries({'repair-morning':'B13',arrival:'B01','first-counter':'B01','first-call':'B12','first-records':'B11','first-headlines':'B14','witness-choice':'B04'})) {
  for (const node of Object.values(window.STORY)) if(node.id.startsWith(prefix+'.')) {
    node.music=music;
    node.prologueShared=true;
    if(prefix==='repair-morning') node.delivery='DeepSeek 视角';
  }
}
