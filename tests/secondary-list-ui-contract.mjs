import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const [app,design,version]=await Promise.all([
  readFile(new URL("../src/app.js",import.meta.url),"utf8"),
  readFile(new URL("../src/design-system.css",import.meta.url),"utf8"),
  readFile(new URL("../version.json",import.meta.url),"utf8")
]);

let checks=0;
function equal(actual,expected,message){checks+=1;assert.equal(actual,expected,message)}
function match(source,pattern,message){checks+=1;assert.match(source,pattern,message)}
function ok(value,message){checks+=1;assert.ok(value,message)}

const build=JSON.parse(version).build;
equal(build,"1.03.18");

equal((app.match(/fieldListHeader10316/g)||[]).length,4,"All four secondary lists must use the shared header.");
match(app,/contactsScreen[\s\S]*?fieldListHeader10316[\s\S]*?Contacts & Access/);
match(app,/equipmentScreen[\s\S]*?fieldListHeader10316[\s\S]*?Equipment Vault/);
match(app,/tasksScreen422[\s\S]*?fieldListHeader10316[\s\S]*?Task Center/);
match(app,/deficiencyScreen439[\s\S]*?fieldListHeader10316[\s\S]*?Deficiency Center/);
for(const label of ["Add contact","Add equipment","Add task","Add deficiency"]) match(app,new RegExp(`aria-label="${label}"`));

match(app,/class="card contactsHero"/);
match(app,/class="contactStats"/);
match(app,/class="card contactItem"/);
match(app,/class="row contactItemTop"/);
match(app,/class="contactQuickActions"/);
for(const action of ["Call","Email","Edit"]) match(app,new RegExp(`>${action}<\\/button>`));
match(app,/\.contactItem"\)\.forEach\(b=>b\.onclick/);
match(app,/\.contactEditBtn"\)\.forEach/);
match(app,/\.contactCallBtn"\)\.forEach/);
match(app,/\.contactEmailBtn"\)\.forEach/);

match(app,/class="card equipmentHero equipmentHero429"/);
match(app,/class="equipmentStats"/);
match(app,/class="card equipmentItem equipmentItem429"/);
match(app,/class="row equipmentItemTop"/);
match(app,/class="equipmentQuickActions"/);
for(const action of ["Checked OK","Flag Issue","Replaced"]) match(app,new RegExp(`>${action}<\\/button>`));
match(app,/\.equipmentItem"\)\.forEach\(b=>b\.onclick/);
match(app,/\.eqQuickBtn"\)\.forEach/);

match(app,/class="taskFilterRail"/);
equal((app.match(/taskFilterPill/g)||[]).length>=2,true);
match(app,/class="card taskCard/);
match(app,/class="taskCardMain"/);
match(app,/class="taskQuickActions"/);
match(app,/>Site<\/button><button[\s\S]*?>\$\{taskIsDone\(r\.t\)\?"Reopen":"Done"\}<\/button>/);
match(app,/\.taskFilterPill"\)\.forEach/);
match(app,/\.taskDoneBtn"\)\.forEach/);
match(app,/\.taskSiteBtn"\)\.forEach/);

match(app,/class="card defHero439"/);
match(app,/class="defFilterRail"/);
match(app,/class="card siteItem deficiencyCard439/);
match(app,/class="defCardTop"/);
match(app,/class="defQuickActions"/);
for(const action of ["Site","＋ Photo"]) match(app,new RegExp(`>${action}<\\/button>`));
match(app,/\$\{closed\?"Reopen":"Close"\}<\/button>/);
match(app,/\.defFilterPill"\)\.forEach/);
match(app,/\.defResolveBtn"\)\.forEach/);
match(app,/\.defSiteBtn"\)\.forEach/);
match(app,/\.defAddPhotoBtn525"\)\.forEach/);
match(app,/\.defPhotoThumb525"\)\.forEach/);

const marker="Build 1.03.16 — compact secondary workflow lists";
const previousMarker="Build 1.03.15 — consistent secondary field forms";
const updateMarker="Build 1.03.7 — canonical Update Ready geometry";
ok(design.includes(marker));
ok(design.indexOf(marker)>design.indexOf(previousMarker),"List cleanup must follow the secondary form contract.");
ok(design.indexOf(marker)<design.indexOf(updateMarker),"List cleanup must remain before the final Update Ready geometry contract.");
match(design,/\.fieldListHeader10316\{[\s\S]*?grid-template-columns:44px minmax\(0,1fr\) 44px!important;[\s\S]*?min-height:62px!important;/);
match(design,/\.fieldListHeader10316 \.back,[\s\S]*?width:44px!important;[\s\S]*?height:44px!important;/);
match(design,/\.fieldListHeader10316 h1\{[\s\S]*?font-size:21px!important;/);
match(design,/\.fieldListHeader10316 p\{[\s\S]*?text-overflow:ellipsis!important;/);
match(design,/\.contactQuickActions\{grid-template-columns:repeat\(auto-fit,minmax\(74px,1fr\)\)!important\}/);
match(design,/\.equipmentQuickActions,[\s\S]*?\.defQuickActions\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important\}/);
match(design,/\.taskQuickActions\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important\}/);
match(design,/\.contactQuickActions \.smallBtn,[\s\S]*?min-height:44px!important;[\s\S]*?white-space:normal!important;/);
match(design,/\.taskFilterPill,[\s\S]*?\.defFilterPill\{min-height:44px!important;/);
match(design,/@media\(max-width:430px\)\{[\s\S]*?\.contactsHero>p,[\s\S]*?display:none!important[;}][\s\S]*?\.equipmentQuickActions,[\s\S]*?grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
match(design,/@media\(max-width:360px\)\{[\s\S]*?\.contactItemTop,[\s\S]*?\.defCardTop\{grid-template-columns:1fr!important;/);
ok(!/@media\(max-width:430px\)[\s\S]*?\.equipmentQuickActions\{grid-template-columns:1fr!important/.test(design.slice(design.indexOf(marker))),"Final phone rules must not restore the retired Equipment action stack.");
ok(!/@media\(max-width:430px\)[\s\S]*?\.contactQuickActions\{grid-template-columns:1fr!important/.test(design.slice(design.indexOf(marker))),"Final phone rules must not restore the retired Contact action stack.");

console.log(JSON.stringify({status:"passed",build,checks}));
