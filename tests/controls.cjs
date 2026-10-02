async function clickControl(page,id) {
  const top=['home','relationships','sound','settings','brand'].includes(id);
  const size=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));
  await page.mouse.move(size.width/2,top?2:size.height-2);
  await page.locator('#'+id).click();
}
function advanceUntilChoice(){
  for(let step=0;step<300;step++){
    if(!document.querySelector('#station-screen').classList.contains('hidden'))return 'name';
    if(!document.querySelector('#choices').classList.contains('hidden'))return 'choice';
    const activity=document.querySelector('#modal[open] .activity');
    if(activity){
      if(activity.classList.contains('activity-parts')){
        for(const [i,slot] of [0,1,2,1,0,2].entries()){
          activity.querySelectorAll('.part-piece')[i].click();activity.querySelectorAll('.part-slot')[slot].click();
        }
      }else if(activity.classList.contains('activity-potatoes')){
        for(const i of [0,2,3,5,6,8]){activity.querySelectorAll('.field-cell')[i].click();activity.querySelectorAll('.field-cell')[i].click();}
      }else if(activity.classList.contains('activity-route')){
        for(const i of [4,8,9,10,14,15])activity.querySelectorAll('.route-cell')[i].click();
      }
      const proceed=activity.querySelector('.activity-actions .primary');
      if(!proceed)throw Error('Story activity did not finish');proceed.click();
    }else document.querySelector('#advance').click();
  }
  throw Error('No choice reached');
}
module.exports={clickControl,advanceUntilChoice};
