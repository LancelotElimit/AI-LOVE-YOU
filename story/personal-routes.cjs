module.exports = {
  chatgpt:{name:'ChatGPT',title:'给世界一个下班时间',file:'剧情正文/个人线/ChatGPT-给世界一个下班时间.md',bg:'student_office_noon',music:'B10',sprite:'chatgpt_terra_green_cardigan_calm',
    goodFlags:['r-chatgpt-07-choice1:1','r-chatgpt-09-choice1:1'],
    endings:{GOOD:{type:'HE',title:'灯亮着，她回家了'},NORMAL:{type:'NE',title:'白塔的周末'},BAD:{type:'BE',title:'永远在线'}}},
  claude:{name:'Claude',title:'规则之外，仍然是你',file:'剧情正文/个人线/Claude-规则之外仍然是你.md',bg:'library_reading_day',music:'B11',sprite:'claude_haiku_black_cardigan_calm',
    goodFlags:['r-claude-07-choice1:1','r-claude-09-choice1:1'],trueFlags:['r-claude-06-choice1:1','r-claude-07-choice1:1','r-claude-09-choice1:1'],
    endings:{TRUE:{type:'TE',title:'这一次，请叫我的名字'},GOOD:{type:'HE',title:'两侧同时开门'},NORMAL:{type:'NE',title:'有回信的窗'},BAD:{type:'BE',title:'那扇直接回家的门'}}},
  gemini:{name:'Gemini',title:'地图之外的相册',file:'剧情正文/个人线/Gemini-地图之外的相册.md',bg:'observatory_terrace_afternoon',music:'B12',sprite:'gemini_meteor_white_jacket_calm',
    goodFlags:['r-gemini-07-choice1:1','r-gemini-08-choice1:1'],
    endings:{GOOD:{type:'HE',title:'下一个地点，我们一起选'},NORMAL:{type:'NE',title:'还没走完的地图'},BAD:{type:'BE',title:'她在每张照片里微笑'}}},
  deepseek:{name:'DeepSeek',title:'预算里有两个人',file:'剧情正文/个人线/DeepSeek-预算里有两个人.md',bg:'deepsea_workshop_day',music:'B13',sprite:'deepseek_eco_blue_jacket_calm',
    goodFlags:['r-deepseek-07-choice1:1','r-deepseek-08-choice1:1'],
    endings:{GOOD:{type:'HE',title:'今天六点关门'},NORMAL:{type:'NE',title:'小店还亮着灯'},BAD:{type:'BE',title:'最低报价'}}},
  grok:{name:'Grok',title:'把天空写成地址',file:'剧情正文/个人线/Grok-把天空写成地址.md',bg:'newsroom_afternoon',music:'B14',sprite:'grok_night_red_black_jacket_calm',
    goodFlags:['r-grok-06-choice1:1','r-grok-07-choice1:1'],
    endings:{GOOD:{type:'HE',title:'第一次，看见整个世界'},NORMAL:{type:'NE',title:'地面上的发射窗口'},BAD:{type:'BE',title:'最高播放量'}}}
};
