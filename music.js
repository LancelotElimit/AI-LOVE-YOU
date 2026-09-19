// Original local mock-up scores. Replace these arrangements with mastered audio when available.
window.SCORES = (() => {
  const make = (name,bpm,root,melody,chords,voice='sine',sparse=false) => ({name,bpm,root,melody,chords,voice,sparse});
  const major=[[0,7,12,16],[-3,4,9,12],[-7,0,5,9],[-5,2,7,14]];
  const minor=[[0,7,12,15],[-4,3,8,12],[-7,0,5,8],[-5,2,7,10]];
  const tea=[12,null,16,19,17,null,16,null,14,12,null,9,12,null,null,null];
  return {
    prologue:make('屏幕另一边',64,48,[28,null,31,26,null,24,null,19,24,null,28,31,null,28,26,null],major),
    B01:make('门里的早晨',82,48,[16,null,19,21,19,null,16,14,12,null,14,16,19,null,null,null],major),
    B02:make('窗边的问询',68,50,[12,null,null,16,14,null,null,null,9,null,12,null,14,null,null,null],major,'sine',true),
    B03:make('先别按确认',96,48,[12,19,null,16,14,19,null,14,12,16,null,19,17,14,null,null],major,'triangle'),
    B04:make('热饭与路灯',72,45,[19,null,16,14,12,null,9,null,12,14,16,null,14,12,null,null],major),
    B05:make('窗帘背后的夜',60,45,[12,null,null,null,15,null,14,null,10,null,null,7,12,null,null,null],minor,'sine',true),
    B06:make('第二节课的铃声',102,48,[12,16,null,19,21,null,19,16,14,null,12,9,12,null,14,null],major,'triangle'),
    B07:make('差一点就对了',106,50,[16,null,12,null,19,17,null,16,14,null,9,12,14,null,null,null],major,'triangle'),
    B08:make('檐下还有位置',88,46,[12,null,16,19,16,null,14,null,9,12,null,14,12,null,null,null],major),
    B09:make('明天的集合地点',78,48,[16,null,19,null,21,null,19,16,14,null,12,null,14,16,null,null],major,'sine',true),
    B10:make('茶还温着',76,48,tea,major),
    'B10-Sol':make('茶还温着 · Sol',80,48,tea,major,'triangle'),
    B11:make('书签停在这里',72,53,[12,null,14,17,16,null,12,null,9,null,11,14,12,null,null,null],major,'sine',true),
    B12:make('窗外多一条路',108,50,[19,21,null,24,21,19,null,16,14,16,null,19,16,14,null,null],major,'triangle'),
    B13:make('桌角留半杯',94,43,[12,null,19,16,14,12,null,9,12,null,14,16,14,null,12,null],major,'triangle'),
    B14:make('草稿背面的天空',112,45,[12,null,12,19,17,null,15,12,10,12,null,15,14,null,12,null],minor,'triangle'),
    B15:make('页码之间',64,48,[19,null,null,null,13,null,null,19,12,null,null,null,10,null,null,null],minor,'sine',true)
  };
})();
