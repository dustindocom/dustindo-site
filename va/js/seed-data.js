/* Starter data shared by the app (local demo mode) and the admin seeding page. Tapes and songs live in seed-tapes.js. */
(function(w){
'use strict';
var D=w.VASeedTapes;
/* id (lowercase name), name, style, avatar [tone, pattern], premium (up to 20 songs) */
var DJS=[
{id:"crateking_ray",name:"CrateKing_Ray",style:"Hip-Hop",av:["ochre","record"],premium:true},
{id:"velvetvee",name:"velvetvee",style:"R&B / Soul",av:["mauve","split"],premium:true},
{id:"honeyjune",name:"honeyjune",style:"Country / Pop",av:["sand","stripes"],premium:true},
{id:"mateo.fm",name:"mateo.fm",style:"Latin",av:["ochre","record"],premium:true},
{id:"auntiekeisha",name:"AuntieKeisha",style:"R&B / Soul",av:["teal","dots"],premium:true},
{id:"lofi.lena",name:"lofi.lena",style:"Electronic",av:["slate","rings"],premium:true},
{id:"big_randy",name:"BIG_RANDY",style:"Rock / Alt",av:["graphite","split"],premium:true},
{id:"juniper.skye",name:"Juniper.Skye",style:"Pop / Indie",av:["sage","stripes"],premium:true},
{id:"nightshiftnia",name:"NightShiftNia",style:"R&B / Soul",av:["rose","rings"]},
{id:"static_rae",name:"Static_Rae",style:"Rock / Alt",av:["mauve","stripes"]},
{id:"bluenotebenji",name:"BlueNoteBenji",style:"Jazz / Funk / Blues",av:["slate","rings"]},
{id:"bassline.theo",name:"Bassline.Theo",style:"Electronic",av:["teal","stripes"]},
{id:"lunaverde",name:"LunaVerde",style:"Latin",av:["clay","dots"]},
{id:"sunnymae",name:"SunnyMae",style:"Pop / Indie",av:["graphite","dots"]},
{id:"kofi.waves",name:"Kofi.Waves",style:"Afrobeats / Reggae",av:["sage","split"]},
{id:"jess.k",name:"jess.k",style:"Pop / Indie",av:["graphite","rings"]},
{id:"marcooo",name:"marcooo",style:"Hip-Hop",av:["sage","split"]},
{id:"dadjokesdave",name:"dadjokesdave",style:"Rock / Alt",av:["clay","stripes"]},
{id:"priya.plays",name:"priya.plays",style:"Pop / Indie",av:["rose","record"]},
{id:"tunde.wav",name:"tunde.wav",style:"Afrobeats / Reggae",av:["mauve","dots"]},
{id:"kayla_b",name:"KAYLA_B",style:"Pop / Hip-Hop",av:["sand","rings"]},
{id:"sadboyseb",name:"sadboyseb",style:"Rock / Alt",av:["ochre","split"]},
{id:"rosa.mx",name:"rosa.mx",style:"Latin",av:["teal","stripes"]},
{id:"ghostofjosh",name:"ghostofjosh",style:"Electronic",av:["slate","record"]},
{id:"mrspatterson",name:"MrsPatterson",style:"Pop / Indie",av:["graphite","dots"]},
{id:"coach.dre",name:"coach.dre",style:"Hip-Hop",av:["sage","rings"]},
{id:"nina.ny",name:"nina.ny",style:"Hip-Hop / Electronic",av:["clay","split"]},
{id:"willow.wren",name:"willow.wren",style:"Country / Folk",av:["rose","stripes"]},
{id:"hank_fiddle",name:"Hank_Fiddle",style:"Country / Folk",av:["mauve","record"]},
{id:"zoeyxo",name:"ZoeyXO",style:"Pop / Indie",av:["sand","dots"]},
{id:"oliiiver",name:"oliiiver",style:"Rock / Pop",av:["ochre","rings"]},
{id:"tallguykev",name:"tallguykev",style:"Hip-Hop",av:["teal","split"]},
{id:"lou.sixty",name:"Lou.Sixty",style:"Rock / Pop",av:["slate","stripes"]},
{id:"amara.af",name:"amara.af",style:"Afrobeats / Reggae",av:["graphite","record"]},
{id:"deshawndidit",name:"DeShawnDidIt",style:"Hip-Hop",av:["sage","dots"]},
{id:"kenji.k",name:"kenji.k",style:"Pop / Electronic",av:["clay","rings"]},
{id:"mo_rivera",name:"Mo_Rivera",style:"Latin / R&B",av:["rose","split"]}
];
/* DJs on the Rise (Home), Hot MixTapes (Home), and the tapes a brand-new local user starts out liking */
var RISE=["nightshiftnia","crateking_ray","auntiekeisha","mateo.fm","kofi.waves","velvetvee","hank_fiddle","juniper.skye"];
var HOT=["mt041","mt021","mt002","mt086","mt077","mt016"];
var LIKED=["mt058","mt087","mt049","mt011","mt064","mt178"];
/* ids of the 14 starter tapes this file used to ship, so the admin page can remove them */
var LEGACY=['t1','t2','t3','t4','t5','t6','t7','t8','t9','t10','t11','t12','t13','t14'];
var SONGS=Object.keys(D.S).map(function(id){var s=D.S[id];return {id:id,t:s[0],a:s[1],g:s[2],art:/^https?:/.test(s[3])?s[3]:D.P+s[3]+D.X}});
/* SPEC rows: [id, title, owner, mood tags, main genre, song ids] */
var SPEC=D.T;
function buildTape(sp,i){
  return {id:sp[0],title:sp[1],owner:sp[2],tags:sp[3].slice(),genre:sp[4],songs:sp[5].slice(),updated:1000-i,premade:true};
}
function mine(songs,id,title,genres,n,u){
  var ids=[];
  genres.forEach(function(g){songs.forEach(function(s){ if(s.g===g&&ids.length<n&&ids.indexOf(s.id)<0)ids.push(s.id)})});
  return {id:id,title:title,owner:'me',genre:genres[0],songs:ids,updated:u};
}
w.VASeed={DJS:DJS,RISE:RISE,HOT:HOT,LIKED:LIKED,LEGACY:LEGACY,SONGS:SONGS,SPEC:SPEC,buildTape:buildTape,mine:mine};
})(window);
