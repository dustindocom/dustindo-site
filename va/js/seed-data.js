/* Starter data shared by the app (local demo mode) and the admin seeding page. */
(function(w){
'use strict';
var DJS=[
{id:'nightshiftnia',name:'NightShiftNia',style:'R&B / Soul',av:['rose','rings']},
{id:'bassline.theo',name:'Bassline.Theo',style:'House',av:['teal','stripes']},
{id:'crateking_ray',name:'CrateKing_Ray',style:'Hip-Hop',av:['ochre','record'],premium:true},
{id:'lunaverde',name:'LunaVerde',style:'Latin',av:['clay','dots']},
{id:'kofi.waves',name:'Kofi.Waves',style:'Afrobeats',av:['sage','split']},
{id:'static_rae',name:'Static_Rae',style:'Alt Rock',av:['mauve','stripes']},
{id:'bluenotebenji',name:'BlueNoteBenji',style:'Jazz / Funk',av:['slate','rings']},
{id:'sunnymae',name:'SunnyMae',style:'Pop / Indie',av:['graphite','dots']}
];
/* id, title, DJ, genre keys (main, second), song count */
var SPEC=[
['t1','Warehouse Hours','bassline.theo',['elec','hip'],12],
['t2','Golden Era','crateking_ray',['hip','rnb'],20],
['t3','Verano Latino','lunaverde',['lat','pop'],12],
['t4','Lagos to London','kofi.waves',['afro','jazz'],12],
['t5','Garage Days','static_rae',['rock','pop'],12],
['t6','Golden Hour Pop','sunnymae',['pop','lat'],12],
['t7','Sunrise Set','sunnymae',['pop','jazz'],12],
['t8','Funk Breaks','bluenotebenji',['jazz','hip'],12],
['t9','Blue Hour','bluenotebenji',['jazz','rnb'],12],
['t10','French Touch','bassline.theo',['elec','pop'],12],
['t11','Bedroom Pop','sunnymae',['pop','rock'],12],
['t12','Salsa Roots','lunaverde',['lat','afro'],12],
['t13','Slow Burn','nightshiftnia',['rnb','pop'],12],
['t14','Afterhours Loop','bassline.theo',['elec','rnb'],12]
];
var HOT=['t1','t2','t3','t4','t5','t6'];
/* songs: catalog array of {id,g}. A few anchor songs repeat across tapes so Most Mixed has a clear top list. */
function buildTape(sp,i,songs){
  var ids=[],seen={};
  var add=function(id){if(!seen[id]){seen[id]=1;ids.push(id)}};
  for(var k=0;k<6&&k<songs.length;k++){ if((i+k)%4!==0) add(songs[k].id) }
  songs.forEach(function(s){ if(s.g===sp[3][0]) add(s.id) });
  songs.forEach(function(s){ if(s.g===sp[3][1]) add(s.id) });
  songs.forEach(function(s){ add(s.id) });
  return {id:sp[0],title:sp[1],owner:sp[2],genre:sp[3][0],songs:ids.slice(0,sp[4]),updated:1000-i,premade:true};
}
function mine(songs,id,title,genres,n,u){
  var ids=[];
  genres.forEach(function(g){songs.forEach(function(s){ if(s.g===g&&ids.length<n&&ids.indexOf(s.id)<0)ids.push(s.id)})});
  return {id:id,title:title,owner:'me',genre:genres[0],songs:ids,updated:u};
}
w.VASeed={DJS:DJS,SPEC:SPEC,HOT:HOT,buildTape:buildTape,mine:mine};
})(window);
