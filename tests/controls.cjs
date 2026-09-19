async function clickControl(page,id) {
  const top=['home','relationships','sound','settings','brand'].includes(id);
  const size=await page.evaluate(()=>({width:innerWidth,height:innerHeight}));
  await page.mouse.move(size.width/2,top?2:size.height-2);
  await page.locator('#'+id).click();
}
module.exports={clickControl};
