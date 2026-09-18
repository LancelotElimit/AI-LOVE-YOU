// Story nodes for this chapter segment.
window.STORY_UTILS.sequence('gemini','observatory','gemini',[
    ['gemini','停！左边第三块地砖！踩上去会被今天的喷灌系统判成一盆花！'],
    ['narration','你收回脚。细密的水雾准时从地砖边喷了出来。栏杆上的紫发少女满意地晃了晃尾巴。'],
    ['you','谢谢。你怎么知道我会走这边？'],
    ['gemini','我看见你抬脚了呀。别把所有观察都当预言，会显得我平时很闲。'],
    ['gemini','Gemini，观测部。你的终端名是{name}？记住啦。现在轮到你了：你为什么在所有地图里都没有轨迹？'],
    ['narration','她举起一块星形终端。上面同时展开道路、气象、课程表，还有你面前那台售货机的实时库存。'],
    ['you','你家到底是做什么的？'],
    ['gemini','地图、通讯、影像、终端……还有我想逃掉、但逃不掉的家族早餐会。'],
    ['gemini','他们觉得，只要把世界上所有窗口打开，就不会漏掉任何事。'],
    ['narration','她说着又开了三个窗口。你刚讲完自己穿过屏幕的经历，温室的星图突然旋转起来。'],
    ['gemini','欸？怎么把你匹配成三十七个不同的人了？'],
    ['narration','一条路线穿过天花板，另一条直通地下。太多图层重叠，连她的声音也急促起来。'],
    ['gemini','切换：流星。我先把错误的实时流截住！',{shift:{name:'流星形态',detail:'多源感知同步 · 迅速分离冲突的观测结果'}}],
    ['narration','她的猫耳紧张地往后压。你看着那些争抢焦点的窗口，想起自己同时开了几十个标签页的时候。',{choices:[
      {text:'关掉地图，只保留眼前的实时画面',detail:'减少输入 · 帮她确认当下',to:'gemini-focus.0',affinity:2},
      {text:'把冲突结果分组，给她逐个核对',detail:'整理信息 · 一起完成排查',to:'gemini-sort.0',affinity:1}
    ]}]
  ],null);
window.STORY_UTILS.sequence('gemini-focus','observatory','gemini',[
    ['you','先看我。我就站在这里。你不需要同时确认三十七个版本。'],
    ['narration','她眨了眨眼，关掉窗口。喧闹的提示声消失后，只剩喷灌水滴落到叶片上的声音。'],
    ['gemini','……嗯。这里，有一个。还挺会打断别人胡思乱想的。']
  ],'gemini-end.0');
window.STORY_UTILS.sequence('gemini-sort','observatory','gemini',[
    ['you','同一个来源的结果先放一起，别让重复数据冒充多数意见。我来标记，你来验证。'],
    ['gemini','哦？新来的同学，和我配合得很快嘛。'],
    ['narration','错误路线一条条消失。最后留下的定位点，安静地停在你们脚下。']
  ],'gemini-end.0');
window.STORY_UTILS.sequence('gemini-end','observatory','gemini',[
    ['gemini','别动，拍一张。'],
    ['you','这又是检测？'],
    ['gemini','不是。是纪念。地图都认不出你，但我现在认识了。'],
    ['narration','她把终端收起来，跳下栏杆。'],
    ['gemini','走，去中央讲堂。先让他们给你一个学号。然后你得认真讲讲，你那边的星星是什么样子的。']
  ],'hall.0');
