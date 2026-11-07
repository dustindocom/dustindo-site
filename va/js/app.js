(function(){
'use strict';
/* ---------- helpers ---------- */
var $=function(s,r){return (r||document).querySelector(s)};
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var TONES={rose:['#8E6A66','#6F514E'],sage:['#5F7A67','#475E50'],slate:['#566B80','#3F5164'],ochre:['#7F6A40','#615130'],mauve:['#73607F','#584864'],clay:['#94604A','#744A38'],graphite:['#5B5F66','#43474D'],teal:['#4F7476','#3A5859'],sand:['#86745E','#675948']};
var art=function(k){return 'background:linear-gradient(145deg,'+TONES[k][0]+','+TONES[k][1]+')'};
var AVK=function(k,kind){
  var c1=TONES[k][0],c2=TONES[k][1];
  var m={
    rings:'repeating-radial-gradient(circle at 50% 50%,'+c1+' 0 7px,'+c2+' 7px 14px)',
    stripes:'repeating-linear-gradient(135deg,'+c1+' 0 9px,'+c2+' 9px 18px)',
    dots:'radial-gradient(circle at 50% 50%,#F4F1EA 0 9%,transparent 10%),radial-gradient(circle at 50% 50%,'+c2+' 0 55%,'+c1+' 56%)',
    split:'linear-gradient(90deg,'+c1+' 50%,'+c2+' 50%)',
    record:'radial-gradient(circle at 50% 50%,'+c1+' 0 14%,transparent 15%),repeating-radial-gradient(circle at 50% 50%,#15171B 0 3px,#1E2126 3px 6px)'
  };
  return 'background:'+m[kind];
};
var BANNERS=[
  function(){return 'background:repeating-linear-gradient(120deg,#566B80 0 22px,#3F5164 22px 44px)'},
  function(){return 'background:radial-gradient(circle at 20% 30%,#94604A 0 12%,transparent 13%),radial-gradient(circle at 70% 60%,#744A38 0 20%,transparent 21%),#8E6A66'},
  function(){return 'background:repeating-radial-gradient(circle at 80% 120%,#4F7476 0 16px,#3A5859 16px 32px)'},
  function(){return 'background:linear-gradient(135deg,#5B5F66 0 50%,#43474D 50% 100%)'}
];
var AVPRESETS=[['rose','rings'],['teal','stripes'],['ochre','record'],['clay','dots'],['sage','split'],['slate','rings'],['mauve','stripes'],['graphite','dots']];
 
var LOGO=function(w,h){return '<svg viewBox="4 2 261 179" width="'+w+'" height="'+h+'" fill="var(--accent)" fill-rule="evenodd" role="img" aria-label="VA by DD">'+
'<path d="M182.89,147.16c.41.67.61,1.43.61,2.26,0,.78-.2,1.51-.61,2.17s-.97,1.19-1.69,1.57c.85.29,1.55.82,2.11,1.58.56.77.84,1.62.84,2.54,0,.83-.21,1.6-.62,2.3-.42.7-.97,1.25-1.66,1.63-.35.19-.74.34-1.18.43s-1.01.14-1.73.14h-7.01v-16.7h6.67c1.06,0,1.9.16,2.52.48.75.38,1.33.91,1.74,1.58v.02ZM182.13,151.21c.34-.54.5-1.14.5-1.8,0-.74-.19-1.38-.58-1.93-.38-.55-.87-.96-1.46-1.21-.45-.19-1.2-.29-2.26-.29h-5.52v6.86h5.95c.83,0,1.5-.13,1.99-.38.58-.29,1.03-.7,1.37-1.25h.01ZM182.75,159.22c.35-.58.53-1.22.53-1.91s-.18-1.37-.55-1.96c-.37-.58-.86-1.02-1.49-1.31-.48-.22-1.13-.34-1.94-.34h-6.48v7.22h6.17c.61,0,1.09-.03,1.44-.1s.66-.16.91-.29c.59-.3,1.06-.75,1.42-1.33v.02Z"/>'+
'<path d="M189.64,145.09l5.93,8.93,5.88-8.93h1.06l-6.5,9.86v6.84h-.89v-6.84l-6.53-9.86h1.06,0Z"/>'+
'<path d="M225.06,161.8v-16.7h6.22c1.22,0,2.34.3,3.37.91s1.85,1.43,2.46,2.46c.61,1.03.91,2.16.91,3.37v3.22c0,1.22-.3,2.34-.91,3.37s-1.43,1.85-2.46,2.46c-1.03.61-2.16.91-3.37.91h-6.22Z"/>'+
'<path d="M242.82,161.8v-16.7h6.22c1.22,0,2.34.3,3.37.91s1.85,1.43,2.46,2.46c.61,1.03.91,2.16.91,3.37v3.22c0,1.22-.3,2.34-.91,3.37s-1.43,1.85-2.46,2.46c-1.03.61-2.16.91-3.37.91h-6.22Z"/>'+
'<path d="M54.88,134.33h47.82L178.19,3.59h-12.7l-69.15,119.74L53.05,48.33H5.23l49.65,86ZM83.9,122.82h-16.97L29.98,58.82h16.97s36.95,64,36.95,64Z"/>'+
'<path d="M213.48,48.33h-47.77l-75.49,130.74h12.7l69.15-119.74,43.29,75h47.77l-49.65-86h0ZM184.5,59.84h16.97l36.95,64h-16.97s-36.95-64-36.95-64Z"/>'+
'<path d="M171.95,91.61c-10.68,0-19.33,8.65-19.33,19.33s8.65,19.33,19.33,19.33,19.33-8.65,19.33-19.33-8.65-19.33-19.33-19.33ZM171.95,117.47c-3.61,0-6.53-2.92-6.53-6.53s2.92-6.53,6.53-6.53,6.53,2.92,6.53,6.53-2.92,6.53-6.53,6.53Z"/></svg>'};
 
var P={
  home:'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  charts:'M5 20V10M12 20V4M19 20v-7',
  x:'M6 6l12 12M18 6 6 18',
  crate:'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16-4-4',
  me:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9c0-4 3.6-6 8-6s8 2 8 6',
  heart:'M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z',
  pin:'M12 17v5M9 3h6l-1 6 3 3v2H7v-2l3-3z',
  plus:'M12 5v14M5 12h14',
  back:'M15 5l-7 7 7 7',
  check:'M5 12.5l4.5 4.5L19 7.5',
  gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.3 1a7.5 7.5 0 0 0-1.7-1L15 3.5h-4l-.4 2.6a7.5 7.5 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7.5 7.5 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.5 7.5 0 0 0 1.7-1l2.3 1 2-3.4z',
  trash:'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  down:'M6 9l6 6 6-6',
  note:'M9 18V6l10-2v12M9 18a3 3 0 1 1-3-3 3 3 0 0 1 3 3zm10-2a3 3 0 1 1-3-3 3 3 0 0 1 3 3z',
  link:'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  logout:'M10 4H5v16h5M15 8l4 4-4 4M19 12H9',
  user:'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9c0-4 3.6-6 8-6s8 2 8 6',
  brush:'M4 20c3 0 5-1 5-3a3 3 0 0 0-3-3c-2 0-2 3-2 6zM9 14 20 3l1 1-11 11'
};
var ic=function(n,s,o){o=o||{};s=s||22;return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="'+(o.fill||'none')+'" stroke="'+(o.nostroke?'none':'currentColor')+'" stroke-width="'+(o.sw||1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+P[n]+'"/></svg>'};
var PLAY='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
var PAUSE='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
var NEXT='<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M6 5l10 7-10 7zM18 5h2v14h-2z"/></svg>';
var PREV='<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M18 5L8 12l10 7zM4 5h2v14H4z"/></svg>';
var DOTS='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>';
 
/* ---------- data (all names are made up) ---------- */
var G={pop:'Pop / Indie',rock:'Rock / Alt',rnb:'R&B / Soul',elec:'Electronic',jazz:'Jazz / Funk / Blues',hip:'Hip-Hop',lat:'Latin',afro:'Afrobeats / Reggae',ctry:'Country / Folk'};
var GORDER=['hip','rnb','elec','pop','rock','ctry','lat','jazz','afro'];
var TONE_G={pop:'rose',rock:'graphite',rnb:'clay',elec:'teal',jazz:'slate',hip:'ochre',lat:'mauve',afro:'sage',ctry:'sand'};
var RAW=[
['pop','Marigold Static','Tin Cathedral'],['pop','Glass Hours','Oona Vale'],['rock','Low Tide Radio','The Quiet Parade'],
['rnb','Copper Sky','Hollow Fern'],['elec','Satellite Lullaby','Juno Marsh'],['jazz','Paper Moons','Delphine Arc'],
['pop','Sugar Weather','Pastel Harbor'],['pop','Hello Daylight','Rue & the Lanterns'],['pop','Kites at Noon','Maren Finch'],
['rock','Rust Belt Hymn','Cinder Row'],['rock','Static Bloom','Kid Lantern'],['rock','Loud Weather','Hexwood'],['rock','Highway Ghosts','The Sparrow Club'],
['rnb','Slow Dissolve','Ivy Marlowe'],['rnb','Dusk Letters','Nia Calder'],['rnb','Tender Static','Amara Voss'],['rnb','Honey Clock','Lou Bellamy'],
['elec','Warehouse Pulse','Grid Theory'],['elec','4AM Platform','Neon Almanac'],['elec','Tunnel Light','Kasper Wren'],['elec','Afterglow Loop','Deep Orchard'],
['jazz','Blue Corridor','Quartet Nine'],['jazz','Midnight Groove Club','The Brass Parlor'],['jazz','Slow Elevator','Ona Reyes'],['jazz','Funk Drawer','Sunday Fellas'],
['hip','Concrete Poetry','Riko Vance'],['hip','Golden Ticket','Marlo B.'],['hip','Backpack Anthem','The Cipher Club'],['hip','Rooftop Freestyle','Ace Delano'],['hip','Vinyl Sermon','Judge Mercer'],
['lat','Verano Eterno','Luz Marina'],['lat','Bailamos Tarde','Los Faroles'],['lat','Corazón de Neón','Sol Ibarra'],['lat','Noche de Cumbia','Río Tamarindo'],['lat','Calor','Dani Castell'],
['afro','Lagos Lights','Tunde Ade'],['afro','Palm Wine Sunday','Ama Serwaa'],['afro','Accra Nights','Yaw Fontaine'],['afro','Sunset Highlife','Ndidi Okoro'],['afro','Dancehall Rain','Zuri Blake']
];
/* SONGS = the catalog used for charts and the premade MixTapes. CAT = every song the app has seen (charts, search, MixTapes). */
var SAMPLE=RAW.map(function(r,i){return {id:'p'+i,g:r[0],t:r[1],a:r[2],tone:TONE_G[r[0]],hot:100-((i*37)%61)}});
var SONGS=SAMPLE.slice(),CAT={},CHARTS={all:[],byGenre:{},updated:null,live:false};
SAMPLE.forEach(function(x){CAT[x.id]=x});
var SB=function(id){return CAT[id]};
var sart=function(x){return x&&x.art?"background:url('"+x.art+"') center/cover no-repeat,"+art(x.tone||'graphite').slice(11):art(x?x.tone:'graphite')};
 
var DJS=VASeed.DJS.slice();
var DB=function(id){for(var i=0;i<DJS.length;i++)if(DJS[i].id===id)return DJS[i]};
 
/* ---------- state ---------- */
var S={
  user:null,tab:'home',stack:[],sheet:null,pop:false,
  liked:{},
  tapes:[],
  likedTapes:[],
  pinned:[],
  hot:[],booting:true,sg:{items:[],active:-1,open:false},
  playing:null,isPlaying:false,prog:0,
  vt:'system',chartL:'hot',chartG:'all',chartE:'all',chartD:'any',chartS:'any',chartM:'any',chartN:50,crateQ:'',meTab:'tapes',xCount:2341,xState:'idle',xMuted:true,
  avatar:0,banner:0,newName:false
};
var CTX={};
var uid=0;
 
/* ---------- storage + preferences ---------- */
var Store=window.VAStore;
var PREFS={sugg:null,recent:true};
try{var _pv=JSON.parse(localStorage.getItem('va.prefs')||'{}');if(_pv.sugg)PREFS.sugg=_pv.sugg;if(_pv.recent===false)PREFS.recent=false}catch(e){}
if(!PREFS.sugg)PREFS.sugg=(window.matchMedia&&matchMedia('(pointer:coarse)').matches)?'dropdown':'both';
var RECENT=[];try{RECENT=JSON.parse(localStorage.getItem('va.recent')||'[]')}catch(e){}
function savePrefs(){try{localStorage.setItem('va.prefs',JSON.stringify(PREFS))}catch(e){}}
function addRecent(q){
  q=(q||'').trim(); if(q.length<2||!PREFS.recent) return;
  RECENT=[q].concat(RECENT.filter(function(x){return x.toLowerCase()!==q.toLowerCase()})).slice(0,8);
  try{localStorage.setItem('va.recent',JSON.stringify(RECENT))}catch(e){}
}
function snap(id){var x=SB(id);return x?{trackId:String(id),title:x.t,artist:x.a,artworkUrl:x.art||'',genre:x.g||'pop'}:null}
function unsnap(o){
  var id=String(o.trackId);
  if(!CAT[id]) CAT[id]={id:id,t:o.title,a:o.artist,art:o.artworkUrl||'',g:o.genre||'pop',tone:TONE_G[o.genre||'pop']||'graphite',prev:'',url:''};
  return id;
}
function tapeOut(t){return {id:t.id,name:t.title,description:'',createdAt:t.created||t.updated||Date.now(),songs:t.songs.map(snap).filter(Boolean)}}
function profileOut(){var a=AVPRESETS[S.avatar];return {avatar:a[0]+':'+a[1],banner:S.banner,likedSongs:Object.keys(S.liked).map(snap).filter(Boolean),likedMixtapes:S.likedTapes.slice(),pinnedMixtapes:S.pinned.slice()}}
function saveFail(e){console.warn(e);toast('Could not save. Check your connection and try again.')}
function persistTape(t){if(t&&t.owner==='me'&&S.user)Store.saveTape(tapeOut(t)).catch(saveFail)}
function persistProfile(){if(S.user)Store.saveProfile(profileOut()).catch(saveFail)}
function friendly(e){
  var c=(e&&e.code)||'',m=(e&&e.message)||'';
  if(/wrong-password|invalid-credential|invalid-login/.test(c)) return 'Wrong password for this name.';
  if(/weak-password/.test(c)) return 'Passwords need at least 6 characters.';
  if(/network/.test(c)) return 'Cannot reach the database. Check your connection.';
  if(/permission-denied/.test(c)) return 'The database refused that. Check the security rules.';
  if(/email-already-in-use|credential-already-in-use/.test(c)) return 'That name is already locked. Enter its password.';
  return m||'Something went wrong. Try again.';
}
function applyLoad(r){
  var me=S.user.name.toLowerCase(), seedMine=[];
  if(r.tapes){
    DJS=r.djs||[];
    S.tapes=r.tapes.map(function(t){return {id:t.id,title:t.title,owner:t.owner===me?'me':t.owner,songs:t.songs.map(unsnap),updated:t.updated||0,premade:!!DB(t.owner)}});
  }else{
    DJS=VASeed.DJS.slice();
    var mt=r.mine.map(function(t){return {id:t.id,title:t.title,owner:'me',songs:t.songs.map(unsnap),updated:t.updated}});
    if(r.first&&!mt.length){mt=[VASeed.mine(SONGS,'m1','Late Night Drive',['elec','rnb'],8,2000),VASeed.mine(SONGS,'m2','Neo-Soul Sunday',['rnb','jazz'],7,1900)];seedMine=mt}
    S.tapes=VASeed.SPEC.map(function(sp,i){return VASeed.buildTape(sp,i,SONGS)}).concat(mt);
  }
  S.tapes.forEach(function(t){if(!t.genre){var f=t.songs.length&&SB(t.songs[0]);t.genre=f?f.g:'pop'}});
  S.hot=(r.hot||VASeed.HOT).slice();
  var pr=r.profile;
  if(pr){
    S.liked={};(pr.likedSongs||[]).forEach(function(o){S.liked[unsnap(o)]=1});
    S.likedTapes=(pr.likedMixtapes||[]).slice();S.pinned=(pr.pinnedMixtapes||[]).slice();
    var ai=AVPRESETS.map(function(a){return a.join(':')}).indexOf(pr.avatar);S.avatar=ai<0?0:ai;S.banner=pr.banner||0;
  }else if(!r.tapes){
    S.liked={};if(SONGS.length>3){S.liked[SONGS[1].id]=1;S.liked[SONGS[3].id]=1}
    S.likedTapes=['t7','t8','t9','t10','t11','t12'];S.pinned=[];
    S.tapes.filter(function(t){return t.owner==='me'}).forEach(function(t){S.likedTapes.unshift(t.id);S.pinned.push(t.id)});
    S.avatar=0;S.banner=0;
    seedMine.forEach(persistTape);persistProfile();
  }else{S.liked={};S.likedTapes=[];S.pinned=[];S.avatar=0;S.banner=0}
  hydrate();
}
/* songs read from the database only carry names and artwork; fetch their preview links in one batch so tapping play works at once */
function hydrate(){
  var ids=Object.keys(CAT).filter(function(id){return !CAT[id].prev&&/^\d+$/.test(id)});
  if(!ids.length) return;
  VAApi.lookupMany(ids).then(function(list){
    list.forEach(function(x){var c=CAT[x.id];if(c){c.prev=x.prev;c.url=x.url;if(x.art)c.art=x.art}});
    if(S.user)render({keep:1});
  });
}
 
/* ---------- derived ---------- */
var tapeBy=function(id){for(var i=0;i<S.tapes.length;i++)if(S.tapes[i].id===id)return S.tapes[i]};
var ownerName=function(t){return t.owner==='me'?S.user.name:(DB(t.owner)||{name:t.owner}).name};
var limitOf=function(t){return t.owner==='me'?(S.user&&S.user.premium?20:12):((DB(t.owner)||{}).premium?20:12)};
var isGuest=function(){return S.user&&S.user.name.toLowerCase()==='guestdj'};
var mineTapes=function(){return S.tapes.filter(function(t){return t.owner==='me'}).sort(function(a,b){return b.updated-a.updated})};
function favTapes(){
  var liked=S.likedTapes.filter(function(id){return tapeBy(id)});
  var pins=S.pinned.filter(function(id){return liked.indexOf(id)>=0});
  return pins.concat(liked.filter(function(id){return pins.indexOf(id)<0})).map(tapeBy);
}
function mostMixed(){
  var c={};
  S.tapes.forEach(function(t){t.songs.forEach(function(id){c[id]=(c[id]||0)+1})});
  return Object.keys(c).map(function(k){return {id:k,n:c[k]}}).filter(function(m){return SB(m.id)}).sort(function(a,b){return b.n-a.n}).slice(0,5);
}
function songCount(id){var n=0;S.tapes.forEach(function(t){if(t.songs.indexOf(id)>=0)n++});return n}
var curSong=function(){return S.playing?SB(S.playing.songId):null};
var meAv=function(){var a=AVPRESETS[S.avatar];return AVK(a[0],a[1])};
var coverStyle=function(t){
  var arts=[];(t.songs||[]).forEach(function(id){var x=SB(id);if(x&&x.art&&arts.length<4&&arts.indexOf(x.art)<0)arts.push(x.art)});
  var f=t.songs&&t.songs.length&&SB(t.songs[0]);
  var g=art(TONE_G[t.genre]||(f&&TONE_G[f.g])||'graphite').slice(11);
  var u=function(x){return "url('"+x+"')"};
  if(arts.length>=4) return 'background:'+u(arts[0])+' 0 0/50% 50% no-repeat,'+u(arts[1])+' 100% 0/50% 50% no-repeat,'+u(arts[2])+' 0 100%/50% 50% no-repeat,'+u(arts[3])+' 100% 100%/50% 50% no-repeat,'+g;
  if(arts.length) return 'background:'+u(arts[0])+' center/cover no-repeat,'+g;
  return 'background:'+g;
};
var sartBig=function(x){return x&&x.art?"background:url('"+x.art.replace('300x300','600x600')+"') center/cover no-repeat,"+art(x.tone||'graphite').slice(11):art(x?x.tone:'graphite')};
 
/* ---------- components ---------- */
function row(s,o){
  o=o||{};
  var on=S.playing&&S.playing.songId===s.id;
  var key=o.key||'x'; if(o.list) CTX[key]=o.list;
  var left=on?'<div class="eq'+(S.isPlaying?'':' paused')+'" role="img" aria-label="Now playing"><i></i><i></i><i></i></div>':(o.rank!=null?'<span class="rk">'+o.rank+'</span>':'');
  var sub=on?esc(s.a)+' · Now playing':(o.sub?o.sub:esc(s.a));
  var liked=!!S.liked[s.id];
  return '<div class="row'+(on?' on':'')+'">'+
   '<button class="rmain" data-a="play:'+s.id+':'+key+'" aria-label="Play '+esc(s.t)+' by '+esc(s.a)+'">'+
   (o.rank!=null||on||o.pad?'<div class="l">'+left+'</div>':'')+
   '<div class="art" style="'+sart(s)+'"></div>'+
   '<div class="tx"><div class="ti ell">'+(s.e?'<span aria-label="Explicit" title="Explicit" style="display:inline-block;font-size:10px;font-weight:700;line-height:15px;padding:0 4px;margin-right:6px;border-radius:3px;background:var(--muted);color:var(--bg,#0D0F12);vertical-align:1px">E</span>':'')+esc(s.t)+'</div><div class="su ell">'+sub+'</div></div></button>'+
   '<button class="ib heart'+(liked?' liked':'')+'" data-a="like:'+s.id+'" aria-label="'+(liked?'Unlike':'Like')+'" aria-pressed="'+liked+'" style="color:'+(liked?'var(--hi)':'var(--text)')+'">'+ic('heart',22,{fill:liked?'currentColor':'none'})+'</button>'+
   '<button class="ib" data-a="more:'+s.id+':'+(o.tape||'')+'" aria-label="More options for '+esc(s.t)+'">'+DOTS+'</button></div>';
}
function header(){
  return '<header class="hdr"><div>'+LOGO(82,56)+'</div>'+
   '<button class="avbtn btn0" data-a="account" aria-label="Account menu for '+esc(S.user.name)+'" aria-haspopup="menu" aria-expanded="'+S.pop+'"><div class="av" style="'+meAv()+';width:40px;height:40px"></div></button></header>';
}
function topbar(title,right){
  return '<div class="top"><button class="ib" style="color:var(--text)" data-a="back" aria-label="Back">'+ic('back',24)+'</button><div class="ttl">'+esc(title||'')+'</div><div style="min-width:44px;display:flex;justify-content:flex-end">'+(right||'')+'</div></div>';
}
 
/* ---------- views ---------- */
function viewHome(){
  var favs=favTapes(), list=favs.length?favs:S.hot.map(tapeBy).filter(Boolean);
  var pinCount=S.pinned.filter(function(id){return S.likedTapes.indexOf(id)>=0}).length;
  var tiles=list.map(function(t){
    var p=S.pinned.indexOf(t.id)>=0&&S.likedTapes.indexOf(t.id)>=0;
    return '<button class="ftile" style="'+coverStyle(t)+'" data-a="tape:'+t.id+'" data-lp="tapemore:'+t.id+'" aria-label="'+esc(t.title)+(p?', pinned':'')+'"><div class="scr"></div>'+
     (p?'<div class="pin">'+ic('pin',12,{sw:2})+'</div>':'')+'<div class="tt">'+esc(t.title)+'</div></button>';
  }).join('');
  var mm=mostMixed();
  var mmList=mm.map(function(m){return m.id});
  var mmRows=mm.map(function(m,i){return row(SB(m.id),{rank:i+1,key:'mm',list:mmList,sub:esc(SB(m.id).a)+' · In '+m.n+' MixTapes'})}).join('');
  var hot=S.hot.filter(tapeBy).map(function(id){var t=tapeBy(id);
    return '<button class="hcard" data-a="tape:'+t.id+'"><div class="hcover" style="'+coverStyle(t)+'"><div class="chip">'+t.songs.length+' songs</div></div><div class="n ell">'+esc(t.title)+'</div><div class="b ell">'+esc(ownerName(t))+'</div></button>'}).join('');
  var djs=DJS.map(function(d){return '<button class="dj" data-a="dj:'+d.id+'"><div class="c" style="'+AVK(d.av[0],d.av[1])+'"></div><div class="n ell">'+d.name+'</div><div class="s ell">'+d.style+'</div></button>'}).join('');
  return header()+
   '<section style="padding-top:14px"><div class="sh" style="align-items:center"><h2>'+(favs.length?'Favorite MixTapes':'Hot MixTapes')+'</h2><div class="cap" style="display:flex;align-items:center;gap:5px">'+ic('pin',14)+pinCount+' pinned · hold a tile to pin</div></div><div class="fgrid hs">'+tiles+'</div></section>'+
   '<section class="sec"><div class="sh"><h2>Hot MixTapes</h2><div class="cap">Picked by DJDustin</div></div>'+(hot?'<div class="hrow hs">'+hot+'</div>':'<div class="empty" style="padding:8px 20px">No Hot MixTapes yet. They appear here once the admin picks them.</div>')+'</section>'+
   '<section class="sec"><div class="sh" style="padding-bottom:4px"><h2>Most Mixed</h2><div class="cap">Songs in the most MixTapes</div></div>'+mmRows+'</section>'+
   '<section style="padding-top:26px"><div class="sh" style="padding-bottom:14px"><h2>DJs on the Rise</h2></div><div class="djs hs">'+djs+'</div></section>';
}
 
/* Charts: era (All / Classics / Modern) → decade → genre. Song order in SONGS is hot chart first, then library popularity. */
var DECS=['50s','60s','70s','80s','90s','00s','10s','20s'];
var DECL={'50s':'50s & earlier','60s':'60s','70s':'70s','80s':'80s','90s':'90s','00s':'2000s','10s':'2010s','20s':'2020s'};
var ERAL={all:'All',classics:'Classics',modern:'Modern'};
function decEra(d){return DECS.indexOf(d)<DECS.indexOf('00s')?'classics':'modern'}
/* Lists: Hot now is Apple's chart. The others rank the whole library by one signal from scripts/build-charts.mjs. */
var fmtN=function(n){return n>=1e6?(Math.round(n/1e5)/10)+'M':n>=1e3?Math.round(n/1e3)+'K':String(n)};
var LISTS={
  hot:{label:'Hot now'},
  alltime:{label:'All-time',has:function(x){return x.ls>0},by:function(x){return x.ls},
    note:function(x){return fmtN(x.ls)+' listeners'},desc:'The songs the most people have ever played, counted by Last.fm'},
  ever:{label:'Evergreens',has:function(x){return x.ev>0},by:function(x){return x.ev},
    note:function(x){return CHARTS.hot[x.id]?'Still on the chart':x.cd?x.cd+' days on the chart':x.vn+' releases'},
    desc:'Songs five years old or more that people keep coming back to: still on the chart, back again and again, or reissued many times'},
  repeat:{label:'On repeat',has:function(x){return x.ls>=50000&&x.rp>0},by:function(x){return x.rp},
    note:function(x){return x.rp+' plays per listener'},desc:'The songs people put on again and again, by plays per listener'},
  sing:{label:'Singalongs',has:function(x){return x.kv>=3},by:function(x){return x.kv},
    note:function(x){return x.kv+' karaoke and tribute versions'},desc:'The songs most made into karaoke and tribute versions'}
};
var LORDER=['hot','alltime','ever','repeat','sing'];
var hasStyle=function(x,k){return !!(x.st&&x.st.indexOf(k)>=0)};
var hasMood=function(x,k){return !!(x.md&&x.md.indexOf(k)>=0)};
function chartPool(e,d,g,st,m,l){
  var L=LISTS[l||'hot'];
  return SONGS.filter(function(x){
    if(e!=='all'&&x.era!==e)return false;
    if(d!=='any'&&x.dec!==d)return false;
    if(g!=='all'&&x.g!==g)return false;
    if(st&&st!=='any'&&!hasStyle(x,st))return false;
    if(m&&m!=='any'&&!hasMood(x,m))return false;
    if(L.has&&!L.has(x))return false;
    return true;
  });
}
/* One chip per value present in a pool, most songs first. */
function tagChips(pool,field,labels,cur,act,allLabel,aria,max){
  var n={};pool.forEach(function(x){(x[field]||[]).forEach(function(k){if(labels[k])n[k]=(n[k]||0)+1})});
  var ks=Object.keys(n).sort(function(a,b){return n[b]-n[a]}).slice(0,max||14);
  if(cur!=='any'&&ks.indexOf(cur)<0&&labels[cur])ks.unshift(cur);
  if(!ks.length)return '';
  var lab=function(k){var v=labels[k];return typeof v==='string'?v:v[0]};
  return '<div class="chips hs" role="group" aria-label="'+aria+'"><button class="cb" data-a="'+act+':any" aria-pressed="'+(cur==='any')+'">'+esc(allLabel)+'</button>'+
    ks.map(function(k){return '<button class="cb" data-a="'+act+':'+k+'" aria-pressed="'+(cur===k)+'">'+esc(lab(k))+'</button>'}).join('')+'</div>';
}
function viewCharts(){
  var l=S.chartL,e=S.chartE,d=S.chartD,g=S.chartG,st=S.chartS,m=S.chartM,n=S.chartN,L=LISTS[l];
  var V=CHARTS.vocab||{styles:{},moods:{}};
  var hotOnly=l==='hot'&&e==='all'&&d==='any'&&st==='any'&&m==='any';
  var pool=hotOnly?(g==='all'?CHARTS.all:(CHARTS.byGenre[g]||[])).map(SB).filter(Boolean):chartPool(e,d,g,st,m,l);
  if(L.by) pool=pool.slice().sort(function(a,b){return L.by(b)-L.by(a)});
  var list=pool.slice(0,n),ids=list.map(function(s){return s.id});
  var lists=LORDER.filter(function(k){return k==='hot'||k===l||SONGS.some(LISTS[k].has)});
  var segL=lists.length>1?'<div class="chips hs" role="group" aria-label="List">'+lists.map(function(k){return '<button class="cb" data-a="cl:'+k+'" aria-pressed="'+(l===k)+'">'+LISTS[k].label+'</button>'}).join('')+'</div>':'';
  var segE='<div style="padding:4px 20px 10px"><div class="seg" role="group" aria-label="Era">'+['all','classics','modern'].map(function(k){return '<button data-a="ce:'+k+'" aria-pressed="'+(e===k)+'">'+ERAL[k]+'</button>'}).join('')+'</div></div>';
  var decs=(CHARTS.decades||[]).filter(function(k){return e==='all'||decEra(k)===e});
  var chipsD=decs.length?'<div class="chips hs" role="group" aria-label="Decade"><button class="cb" data-a="cd:any" aria-pressed="'+(d==='any')+'">Any decade</button>'+decs.map(function(k){return '<button class="cb" data-a="cd:'+k+'" aria-pressed="'+(d===k)+'">'+DECL[k]+'</button>'}).join('')+'</div>':'';
  var base=hotOnly?null:chartPool(e,d,'all',st,m,l);
  var gs=GORDER.filter(function(k){return !base||k===g||base.some(function(x){return x.g===k})});
  var chipsG='<div class="chips hs" role="group" aria-label="Genre"><button class="cb" data-a="cg:all" aria-pressed="'+(g==='all')+'">All genres</button>'+gs.map(function(k){return '<button class="cb" data-a="cg:'+k+'" aria-pressed="'+(g===k)+'">'+G[k]+'</button>'}).join('')+'</div>';
  // Styles sit under a genre, so they show once a genre is picked. Moods cut across genres and always show.
  var chipsS=g==='all'?'':tagChips(chartPool(e,d,g,'any',m,l),'st',V.styles,st,'cs','All '+G[g],'Style');
  var chipsM=tagChips(chartPool(e,d,g,st,'any',l),'md',V.moods,m,'cm','Any mood','Mood',8);
  var what=(d!=='any'?DECL[d]:(e==='all'?'':ERAL[e]))+(g!=='all'?(d!=='any'||e!=='all'?' ':'')+G[g]:'');
  var tag=[st!=='any'&&V.styles[st]?V.styles[st][0]:'',m!=='any'&&V.moods[m]?V.moods[m]:''].filter(Boolean).join(', ');
  var sub=L.desc?L.desc+([what,tag].filter(Boolean).length?' · '+[what,tag].filter(Boolean).join(' · '):''):
    hotOnly?'What\'s hot right now'+(g==='all'?', across every genre':' in '+G[g]):
    'The most played '+(what||'songs')+(tag?' · '+tag:'')+(e==='classics'&&d==='any'?', before '+(CHARTS.eraCutoff||2000):e==='modern'&&d==='any'?', '+(CHARTS.eraCutoff||2000)+' and later':'');
  var src=CHARTS.live?'. '+(l==='alltime'||l==='repeat'||m!=='any'||st!=='any'?'Last.fm and Apple Music':'Apple Music')+', updated '+new Date(CHARTS.updated).toLocaleDateString()+'.':'. Sample data: the live chart did not load.';
  var more=pool.length>n?'<div style="padding:14px 20px 24px;text-align:center"><button class="pill" data-a="cmore">Show more <span class="muted">('+(pool.length-n)+')</span></button></div>':'';
  var empty=!list.length?'<div class="empty"><b>No songs here yet</b>'+(L.desc?'This list fills in as the library is tagged every few hours. Try fewer filters.':'The library grows every few hours. Try another decade or genre.')+'</div>':'';
  return '<div class="pagehead"><h1>Charts</h1><p>'+esc(sub)+src+'</p></div>'+segL+segE+chipsD+chipsG+chipsS+chipsM+
   list.map(function(s,i){return row(s,{rank:i+1,key:'ch',list:ids,sub:L.note?esc(s.a)+' · '+esc(L.note(s)):null})}).join('')+empty+more;
}

function appleLink(s,cls,inner,style){
  if(s.url) return '<a class="'+cls+'" href="'+esc(s.url)+'" target="_blank" rel="noopener" style="text-decoration:none;color:inherit;'+(style||'')+'">'+inner+'</a>';
  return '<button class="'+cls+'" data-a="apple" style="'+(style||'')+'">'+inner+'</button>';
}
var GTERM={hip:'hip hop',rnb:'r&b soul',elec:'house electronic',pop:'indie pop',rock:'alternative rock',lat:'reggaeton latin',jazz:'jazz funk',afro:'afrobeats',ctry:'country'};
function viewCrate(){
  var chips=GORDER.map(function(k){return '<button class="cb" data-a="cq:'+GTERM[k]+'">'+G[k]+'</button>'}).join('');
  return '<div class="pagehead"><h1>Crate</h1><p>Dig for songs to put in your MixTapes.</p></div>'+
   '<div id="sw" style="padding:8px 20px 0;position:relative"><input id="q" class="field" type="search" placeholder="Songs, artists, genres" value="'+esc(S.crateQ)+'" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" role="combobox" aria-autocomplete="list" aria-controls="sugg" aria-expanded="false" aria-label="Search songs" style="padding-left:42px"><span style="position:absolute;left:34px;top:22px;color:var(--muted)">'+ic('crate',18)+'</span><div id="sugg" class="sugg" role="listbox" hidden></div></div>'+
   '<div class="chips hs" id="cchips">'+chips+'</div><div id="cres">'+crateResults()+'</div>';
}
/* ---- search autofill: suggestions dropdown + optional inline completion ---- */
var MINC=2,sgT=null,sgCache={};
function suggHtml(){
  var sg=S.sg; if(!sg.open||!sg.items.length) return '';
  var head=!S.crateQ.trim()?'<div class="sgh"><span>Recent searches</span><button class="btn0" data-a="sugclear">Clear</button></div>':'';
  return head+sg.items.map(function(it,i){
    var lead=it.type==='song'&&it.art?'<span class="sgart" style="background:url(\''+esc(it.art)+'\') center/cover,var(--surface2)"></span>':'<span class="sgico">'+ic(it.type==='recent'?'back':'crate',16).replace('<svg','<svg style="'+(it.type==='recent'?'transform:rotate(0)':'')+'"')+'</span>';
    var sub=it.type==='song'?esc(it.sub):(it.type==='artist'?'Artist':'');
    return '<button class="sg'+(i===sg.active?' on':'')+'" role="option" id="sg'+i+'" aria-selected="'+(i===sg.active)+'" data-a="sug:'+i+'">'+lead+'<span class="sgt ell">'+esc(it.text)+'</span>'+(sub?'<span class="sgs ell">'+sub+'</span>':'')+'</button>';
  }).join('');
}
function suggUpdate(){
  var n=$('#sugg'),q=$('#q'); if(!n) return;
  var h=suggHtml(); n.innerHTML=h; n.hidden=!h;
  if(q){q.setAttribute('aria-expanded',h?'true':'false');if(S.sg.active>=0)q.setAttribute('aria-activedescendant','sg'+S.sg.active);else q.removeAttribute('aria-activedescendant')}
}
function suggClose(){S.sg={items:[],active:-1,open:false};suggUpdate()}
function mergeRecent(q,items){
  if(!PREFS.recent) return items;
  var lq=q.toLowerCase();
  var rec=RECENT.filter(function(r){return r.toLowerCase().indexOf(lq)===0&&r.toLowerCase()!==lq}).slice(0,2).map(function(r){return {type:'recent',text:r}});
  var seen={};rec.forEach(function(r){seen[r.text.toLowerCase()]=1});
  return rec.concat(items.filter(function(i){return !seen[i.text.toLowerCase()]})).slice(0,8);
}
function inlineComplete(typed,items){
  var q=$('#q'); if(!q||PREFS.sugg!=='both'||document.activeElement!==q) return;
  if(q.value!==typed||q.selectionStart!==typed.length||q.selectionEnd!==typed.length) return;
  var lt=typed.toLowerCase(),c=null;
  for(var i=0;i<items.length;i++){var t=items[i].text;if(items[i].type!=='song'||true){if(t.toLowerCase().indexOf(lt)===0&&t.length>typed.length){c=t;break}}}
  if(!c) return;
  q.value=typed+c.slice(typed.length);
  q.setSelectionRange(typed.length,c.length);
}
function suggestSoon(typedInput){
  if(PREFS.sugg==='off'){suggClose();return}
  var raw=S.crateQ,q=raw.trim();
  if(!q){S.sg={items:PREFS.recent?RECENT.map(function(r){return {type:'recent',text:r}}):[],active:-1,open:true};suggUpdate();return}
  if(q.length<MINC){suggClose();return}
  clearTimeout(sgT);
  var key=q.toLowerCase(), show=function(items){
    if(S.crateQ.trim()!==q) return;
    var m=mergeRecent(q,items);S.sg={items:m,active:-1,open:true};suggUpdate();
    if(typedInput) inlineComplete(raw,m);
  };
  if(sgCache[key]){show(sgCache[key]);return}
  sgT=setTimeout(function(){
    VAApi.suggest(q).then(function(items){sgCache[key]=items;show(items)}).catch(function(){});
  },160);
}
function commitSearch(text){
  S.crateQ=text;var q=$('#q');if(q){q.value=text;try{q.setSelectionRange(text.length,text.length)}catch(e){}}
  addRecent(text);suggClose();crateSearchSoon(0);
}
function pickSuggestion(i){
  var it=S.sg.items[i]; if(!it) return;
  commitSearch(it.type==='song'?(it.text+' '+it.sub):it.text);
}
S.cs={items:null,loading:false,fail:false};
function crateResults(){
  var q=S.crateQ.trim().toLowerCase();
  if(!q) return '<div class="sh" style="padding-top:12px"><h2 style="font-size:15px">Browse the crate</h2><div class="cap">From the charts</div></div>'+rowsFor(SONGS.slice(0,12),'cr0');
  if(S.cs.loading) return '<div class="empty">Searching Apple Music…</div>';
  if(S.cs.items){
    if(!S.cs.items.length) return '<div class="empty"><b>No songs found</b>Nothing matches "'+esc(S.crateQ)+'". Try an artist or a different spelling.</div>';
    return '<div class="sh" style="padding-top:12px"><h2 style="font-size:15px">'+S.cs.items.length+' results</h2><div class="cap">Clean versions only</div></div>'+rowsFor(S.cs.items,'cr1');
  }
  var res=SONGS.filter(function(x){return (x.t+' '+x.a+' '+G[x.g]).toLowerCase().indexOf(q)>=0});
  var note=S.cs.fail?'<div class="help" style="padding:10px 20px 0">Live search is unavailable right now. Showing songs from the charts.</div>':'';
  if(!res.length) return note+'<div class="empty"><b>No songs found</b>Nothing matches "'+esc(S.crateQ)+'".</div>';
  return note+rowsFor(res,'cr1');
}
var searchT=null;
function crateUpdate(){var n=$('#cres');if(n)n.innerHTML=crateResults()}
function crateSearchSoon(ms){
  clearTimeout(searchT);
  var q=S.crateQ.trim();
  if(q.length<2){S.cs={items:null,loading:false,fail:false};crateUpdate();return}
  searchT=setTimeout(function(){
    S.cs={items:null,loading:true,fail:false};crateUpdate();
    VAApi.search(q).then(function(items){
      if(S.crateQ.trim()!==q) return;
      items.forEach(function(x){x.tone=TONE_G[x.g]||'graphite';CAT[x.id]=x});
      S.cs={items:items,loading:false,fail:false};crateUpdate();
    }).catch(function(){ if(S.crateQ.trim()!==q) return; S.cs={items:null,loading:false,fail:true};crateUpdate(); });
  },ms);
}
function rowsFor(list,key){var ids=list.map(function(s){return s.id});return list.map(function(s){return row(s,{key:key,list:ids,pad:true})}).join('')}
 
function viewMe(){
  var mt=mineTapes();
  var body;
  if(S.meTab==='tapes'){
    body='<div class="tgrid">'+mt.map(function(t){return '<button class="tg" data-a="tape:'+t.id+'"><div class="c" style="'+coverStyle(t)+'"></div><div class="n ell">'+esc(t.title)+'</div><div class="b">'+t.songs.length+'/'+limitOf(t)+' songs</div></button>'}).join('')+
      '<div><button class="newt" data-a="newtape"><span>'+ic('plus',26)+'</span>New MixTape</button></div></div>';
  }else{
    var ls=Object.keys(S.liked).map(SB).filter(Boolean);
    body=ls.length?rowsFor(ls,'liked'):'<div class="empty"><b>No liked songs yet</b>Tap the heart on any song to keep it here.</div>';
  }
  var count=Object.keys(S.liked).length;
  return '<div class="banner" style="'+BANNERS[S.banner]()+'"><button class="gear" data-a="settings" aria-label="Settings">'+ic('gear',22)+'</button><div class="bavatar" style="'+meAv()+'"></div></div>'+
   '<div class="mhead"><h1>'+esc(S.user.name)+'</h1><p>'+(isGuest()?'Shared name · anyone using Guest DJ can edit these MixTapes':(S.user.protected?'Locked name · ':'Open name · ')+'up to 12 songs per MixTape')+'</p></div>'+
   '<div style="padding:16px 20px 0"><div class="seg"><button data-a="metab:tapes" aria-pressed="'+(S.meTab==='tapes')+'">My MixTapes</button><button data-a="metab:liked" aria-pressed="'+(S.meTab==='liked')+'">Liked music ('+count+')</button></div></div>'+body;
}
 
function viewTape(id){
  var t=tapeBy(id); if(!t) return topbar('')+'<div class="empty"><b>MixTape not found</b></div>';
  var own=t.owner==='me', lim=limitOf(t), liked=S.likedTapes.indexOf(t.id)>=0, pinned=S.pinned.indexOf(t.id)>=0&&liked;
  var ids=t.songs.slice();
  var rows=t.songs.length?t.songs.map(function(sid,i){return row(SB(sid),{rank:i+1,key:'tp'+t.id,list:ids,tape:own?t.id:''})}).join(''):
    '<div class="empty"><b>No songs yet</b>Find songs in Crate and add them from the ⋯ menu.<div style="margin-top:14px"><button class="pill" data-a="tab:crate">Open Crate</button></div></div>';
  return topbar('',own?'':'')+
   '<div class="tcover" style="'+coverStyle(t)+'"></div>'+
   '<div class="tmeta"><h1>'+esc(t.title)+'</h1><div class="by">by '+(own?'<span style="font-weight:600;color:var(--text)">'+esc(ownerName(t))+'</span>':'<button data-a="dj:'+t.owner+'">'+esc(ownerName(t))+'</button>')+'</div>'+
   '<span class="cnt'+(t.songs.length>=lim?' full':'')+'">'+t.songs.length+'/'+lim+' songs'+(t.songs.length>=lim?' · full':'')+'</span></div>'+
   '<div class="acts"><button class="pill" data-a="playtape:'+t.id+'"'+(t.songs.length?'':' disabled style="opacity:.4"')+'>'+PLAY+' Play</button>'+
   '<button class="round'+(liked?' on':'')+'" data-a="liketape:'+t.id+'" aria-label="'+(liked?'Unlike MixTape':'Like MixTape')+'" aria-pressed="'+liked+'">'+ic('heart',22,{fill:liked?'currentColor':'none'})+'</button>'+
   '<button class="round'+(pinned?' on':'')+(liked?'':'" disabled style="opacity:.4')+'" data-a="pintape:'+t.id+'" aria-label="'+(pinned?'Unpin':'Pin to top of Favorites')+'" aria-pressed="'+pinned+'">'+ic('pin',20,{fill:pinned?'currentColor':'none'})+'</button>'+
   '<button class="round" data-a="tapemore:'+t.id+'" aria-label="More options">'+DOTS+'</button></div>'+rows;
}
 
function viewDj(id){
  var d=DB(id)||{id:id,name:id,style:'',av:['graphite','dots']}, ts=S.tapes.filter(function(t){return t.owner===id});
  return topbar('')+
   '<div style="text-align:center;padding:4px 20px 0"><div class="av" style="'+AVK(d.av[0],d.av[1])+';width:96px;height:96px;margin:0 auto"></div><h1 style="font-size:24px;font-weight:700;margin-top:12px">'+d.name+'</h1><div class="muted" style="font-size:14px;margin-top:2px">'+d.style+(d.premium?' · Premium · up to 20 songs':'')+'</div></div>'+
   '<div class="sh" style="padding-top:22px"><h2>MixTapes</h2><div class="cap">'+ts.length+'</div></div><div class="tgrid" style="padding-top:0">'+
   ts.map(function(t){return '<button class="tg" data-a="tape:'+t.id+'"><div class="c" style="'+coverStyle(t)+'"></div><div class="n ell">'+esc(t.title)+'</div><div class="b">'+t.songs.length+' songs</div></button>'}).join('')+'</div>';
}
 
function viewSettings(){
  var seg=['system','light','dark'].map(function(v){return '<button data-a="theme:'+v+'" aria-pressed="'+(S.vt===v)+'">'+v[0].toUpperCase()+v.slice(1)+'</button>'}).join('');
  return topbar('Settings')+
   '<div class="cap2">Appearance</div><div class="card" style="padding:12px"><div class="seg">'+seg+'</div><div class="help">System follows your phone. The choice is remembered in this prototype until you reload.</div></div>'+
   '<div class="cap2">Profile</div><div class="card"><button class="crow" data-a="customize"><span style="display:flex;align-items:center;gap:12px">'+ic('brush',20)+'Avatar and banner</span>'+ic('back',18).replace('<svg','<svg style="transform:rotate(180deg)"')+'</button></div>'+
   '<div class="cap2">Search</div><div class="card" style="padding:12px"><div class="seg">'+[['off','Off'],['dropdown','Suggestions'],['both','Suggestions + inline']].map(function(o){return '<button data-a="pref:sugg:'+o[0]+'" aria-pressed="'+(PREFS.sugg===o[0])+'">'+o[1]+'</button>'}).join('')+'</div><div class="help">Suggestions shows matching artists and songs as you type. Inline also completes your text in place: press Tab or the right arrow to accept it (desktop keyboards).</div></div><div class="card" style="padding:12px"><div class="seg">'+[['1','Remember searches'],['0','Do not remember']].map(function(o){return '<button data-a="pref:recent:'+o[0]+'" aria-pressed="'+((PREFS.recent?'1':'0')===o[0])+'">'+o[1]+'</button>'}).join('')+'</div><button class="crow" data-a="sugclear" style="margin-top:8px;border:0;padding:0;min-height:40px"><span>Clear recent searches</span><span class="muted">'+RECENT.length+'</span></button></div>'+'<div class="cap2">Account</div><div class="card"><div class="crow"><span>DJ name</span><b>'+esc(S.user.name)+'</b></div><div class="crow"><span>Name status</span><span class="muted">'+(isGuest()?'Shared':(S.user.protected?'Locked with a password':'Open: anyone can edit'))+'</span></div><div class="crow"><span>MixTape limit</span><span class="muted">12 songs</span></div></div>'+
   '<div style="padding:4px 20px"><button class="pill ghost" style="width:100%" data-a="logout">'+ic('logout',20)+' Log out</button></div>'+
   '<p class="help" style="padding:16px 28px">Songs, charts and 30-second previews come from Apple Music. MixTapes, likes and your name are kept on this device until the database is connected.</p>';
}
 
function viewX(){
  var st=S.xState;
  var label=st==='deny'?'ACCESS DENIED':'SWIPE TO ENTER';
  return '<div class="xscene"><div class="door"></div><div class="reader"><div class="led'+(st==='deny'?' deny':'')+'"></div><div class="slot"></div><div style="font-size:9px;letter-spacing:.14em;color:#59626D;margin-top:auto">STATION</div></div>'+
   '<div class="shadow"></div><div class="gap"></div>'+
   '<div class="xtxt'+(st==='deny'?' shake':'')+'"><div class="st" style="color:'+(st==='deny'?'#FF7A70':'#E9ECEF')+'">'+label+'</div><div class="ct">'+S.xCount.toLocaleString('en-US')+' denied today</div></div>'+
   '<button class="xbtn" data-a="swipe">Swipe card</button>'+
   (S.xMuted?'':'<div style="position:absolute;left:0;right:0;bottom:150px;text-align:center;font-size:11px;color:#59626D">Muffled music from the other side</div>')+'</div>';
}
 
function viewSplash(){return '<div style="display:flex;align-items:center;justify-content:center;height:100%">'+LOGO(150,103)+'</div>'}
function viewSignin(){
  return '<div class="signin">'+LOGO(150,103)+'<h1>Who\'s playing?</h1><p>Pick a DJ name, or leave it blank to join as Guest DJ. You can start building MixTapes right away.</p>'+
   '<form id="sf" style="width:100%" novalidate><label class="l2" for="uname">DJ name <span class="muted" style="font-weight:400">(optional)</span></label>'+
   '<input id="uname" class="field" autocomplete="off" autocapitalize="off" maxlength="20" placeholder="GuestDJ">'+
   '<label class="l2" for="upass">Want to lock this name with a password?</label>'+
   '<input id="upass" class="field" type="password" placeholder="Optional" autocomplete="new-password">'+
   '<div class="help" id="uhelp">Without a password, anyone who signs in as this name can edit its playlists.</div><div class="err" id="uerr" role="alert"></div>'+
   '<button class="pill" type="submit" style="width:100%;margin-top:6px">Continue</button></form></div>';
}
 
/* ---------- sheets / overlays ---------- */
function sheetHtml(){
  var sh=S.sheet; if(!sh) return '';
  var wrap=function(inner){return '<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>'+inner+'</div>'};
  if(sh.type==='song'){
    var s=SB(sh.id), liked=!!S.liked[s.id];
    return wrap('<div style="display:flex;gap:12px;align-items:center;padding:0 20px 10px"><div class="art" style="width:44px;height:44px;border-radius:9px;'+sart(s)+'"></div><div style="min-width:0"><div class="ell" style="font-weight:600">'+esc(s.t)+'</div><div class="ell muted" style="font-size:13px">'+esc(s.a)+' · '+G[s.g]+'</div></div></div>'+
     '<button class="srow" data-a="add:'+s.id+'"><span class="ico">'+ic('plus',22)+'</span>Add to MixTape</button>'+
     '<button class="srow" data-a="like:'+s.id+':keep"><span class="ico" style="color:'+(liked?'var(--hi)':'')+'">'+ic('heart',22,{fill:liked?'currentColor':'none'})+'</span>'+(liked?'Remove from liked music':'Add to liked music')+'</button>'+
     (sh.tape?'<button class="srow danger" data-a="rmsong:'+s.id+':'+sh.tape+'"><span class="ico" style="color:inherit">'+ic('trash',22)+'</span>Remove from this MixTape</button>':'')+
     appleLink(s,'srow','<span class="ico">'+ic('link',22)+'</span>Listen on Apple Music'));
  }
  if(sh.type==='add'){
    var s2=SB(sh.id), ts=mineTapes();
    var rows=ts.map(function(t){
      var has=t.songs.indexOf(s2.id)>=0, full=t.songs.length>=limitOf(t);
      return '<button class="srow'+(full&&!has?' dis':'')+'" data-a="addto:'+t.id+':'+s2.id+'"><div class="sm" style="'+coverStyle(t)+'"></div><span class="ell" style="flex:1;min-width:0">'+esc(t.title)+'</span><span class="rt">'+(has?ic('check',20,{sw:2.4}).replace('<svg','<svg style="vertical-align:middle;color:var(--hi)"')+' Added':(full?'Full':t.songs.length+'/'+limitOf(t)))+'</span></button>';
    }).join('');
    var create=sh.creating?'<div style="padding:4px 20px 10px;display:flex;gap:8px"><input id="newname" class="field" maxlength="40" placeholder="MixTape name" style="height:44px"><button class="pill" data-a="create:'+s2.id+'" style="flex:none;height:44px">Create</button></div>':
      '<button class="srow" data-a="newfor:'+s2.id+'"><span class="ico" style="color:var(--text)">'+ic('plus',22,{sw:2.4})+'</span><b>New MixTape</b></button>';
    return wrap('<h3>Add to MixTape</h3><div class="muted ell" style="padding:0 20px 8px;font-size:13px">'+esc(s2.t)+' · '+esc(s2.a)+'</div>'+create+rows);
  }
  if(sh.type==='newtape'){
    return wrap('<h3>New MixTape</h3><div style="padding:4px 20px 10px;display:flex;gap:8px"><input id="newname" class="field" maxlength="40" placeholder="MixTape name" style="height:44px"><button class="pill" data-a="create:" style="flex:none;height:44px">Create</button></div>');
  }
  if(sh.type==='tape'){
    var t=tapeBy(sh.id), liked=S.likedTapes.indexOf(t.id)>=0, pinned=S.pinned.indexOf(t.id)>=0&&liked, own=t.owner==='me';
    return wrap('<h3>'+esc(t.title)+'</h3>'+
     '<button class="srow" data-a="liketape:'+t.id+':keep"><span class="ico" style="color:'+(liked?'var(--hi)':'')+'">'+ic('heart',22,{fill:liked?'currentColor':'none'})+'</span>'+(liked?'Remove from Favorites':'Add to Favorites')+'</button>'+
     '<button class="srow'+(liked?'':' dis')+'" data-a="pintape:'+t.id+':keep"><span class="ico">'+ic('pin',22,{fill:pinned?'currentColor':'none'})+'</span>'+(pinned?'Unpin from the top':'Pin to the top of Favorites')+'</button>'+
     (own?'<button class="srow danger" data-a="askdel:'+t.id+'"><span class="ico" style="color:inherit">'+ic('trash',22)+'</span>Delete MixTape</button>':''));
  }
  if(sh.type==='del'){
    var t2=tapeBy(sh.id);
    return wrap('<h3>Delete "'+esc(t2.title)+'"?</h3><div class="muted" style="padding:0 20px 14px;font-size:14px">This removes the MixTape and its '+t2.songs.length+' songs list. The songs themselves stay in Crate.</div><div style="display:flex;gap:10px;padding:0 20px"><button class="pill ghost" style="flex:1" data-a="close">Cancel</button><button class="pill danger" style="flex:1" data-a="del:'+t2.id+'">Delete</button></div>');
  }
  if(sh.type==='custom'){
    return wrap('<h3>Avatar</h3><div class="pgrid">'+AVPRESETS.map(function(a,i){return '<button data-a="setav:'+i+'" aria-pressed="'+(S.avatar===i)+'" aria-label="Avatar '+(i+1)+'" style="'+AVK(a[0],a[1])+'"></button>'}).join('')+'</div>'+
     '<h3>Banner</h3><div class="pgrid bn">'+BANNERS.map(function(b,i){return '<button data-a="setbn:'+i+'" aria-pressed="'+(S.banner===i)+'" aria-label="Banner '+(i+1)+'" style="'+b()+'"></button>'}).join('')+'</div>'+
     '<div style="padding:0 20px"><button class="pill" style="width:100%" data-a="close">Done</button></div>');
  }
  return '';
}
function popHtml(){
  if(!S.pop) return '';
  return '<div class="scrim" data-a="close" style="background:transparent"></div><div class="pop" role="menu"><div class="who"><b>'+esc(S.user.name)+'</b><span>'+(isGuest()?'Shared Guest DJ name':'Standard DJ')+'</span></div>'+
   '<button class="srow" role="menuitem" data-a="settings" style="min-height:46px"><span class="ico">'+ic('gear',20)+'</span>Settings</button>'+
   '<button class="srow" role="menuitem" data-a="logout" style="min-height:46px"><span class="ico">'+ic('logout',20)+'</span>Log out</button></div>';
}
function playerHtml(){
  if(!S.sheet||S.sheet.type!=='player') return '';
  var s=curSong(); if(!s) return '';
  var liked=!!S.liked[s.id], el=S.prog*30;
  return '<div class="player" role="dialog" aria-label="Now playing"><div class="top" style="padding:6px 0 0"><button class="ib" style="color:var(--text)" data-a="close" aria-label="Close player">'+ic('down',26)+'</button><div class="ttl" style="font-size:13px;font-weight:600;color:var(--muted)">Now playing</div><button class="ib" data-a="more:'+s.id+':" aria-label="More options">'+DOTS+'</button></div>'+
   '<div class="big" style="'+sartBig(s)+'"></div>'+
   '<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;min-width:0"><h1 class="ell">'+esc(s.t)+'</h1><div class="ar ell">'+esc(s.a)+'</div></div><button class="ib heart" data-a="like:'+s.id+'" aria-label="'+(liked?'Unlike':'Like')+'" style="margin-top:20px;color:'+(liked?'var(--hi)':'var(--text)')+'">'+ic('heart',26,{fill:liked?'currentColor':'none'})+'</button></div>'+
   '<div class="scrub" data-a="seek" role="slider" aria-label="Seek" aria-valuemin="0" aria-valuemax="30" aria-valuenow="'+Math.round(el)+'"><i data-prog style="width:'+(S.prog*100)+'%"></i></div>'+
   '<div class="tm"><span data-el>0:'+('0'+Math.floor(el)).slice(-2)+'</span><span>0:30</span></div>'+
   '<div class="ctl"><button class="sk" data-a="prev" aria-label="Previous">'+PREV+'</button><button class="pbtn" data-a="toggle" aria-label="'+(S.isPlaying?'Pause':'Play')+'">'+(S.isPlaying?PAUSE:PLAY).replace(/width="22" height="22"/,'width="28" height="28"')+'</button><button class="sk" data-a="next" aria-label="Next">'+NEXT+'</button></div>'+
   '<div style="text-align:center;margin-top:auto;padding-top:18px">'+appleLink(s,'pill ghost',ic('link',18)+' Listen on Apple Music','height:40px;font-size:14px')+'<div class="help" style="margin-top:10px">'+(S.sim?'No preview for this song, so playback is simulated.':'30-second previews from Apple Music.')+'</div></div></div>';
}
 
/* ---------- render ---------- */
var lastSig='',scrolls={};
function render(opts){
  opts=opts||{};
  var top=S.stack[S.stack.length-1];
  var screen=$('#screen'), sig=(S.user?S.tab:'signin')+JSON.stringify(top||{});
  scrolls[lastSig]=screen.scrollTop;
  CTX={};
  var html,nonav=false;
  if(!S.user){html=S.booting?viewSplash():viewSignin();nonav=true}
  else if(top){
    html= top.type==='tape'?viewTape(top.id): top.type==='dj'?viewDj(top.id): top.type==='settings'?viewSettings():'';
  }else{
    html={home:viewHome,charts:viewCharts,x:viewX,crate:viewCrate,me:viewMe}[S.tab]();
  }
  var isX=S.user&&!top&&S.tab==='x';
  if(!isX) xStop();
  screen.className=(nonav?'nonav':'');
  screen.innerHTML=html;
  screen.scrollTop=(sig===lastSig||opts.keep)?(scrolls[sig]||0):(scrolls[sig]||0);
  lastSig=sig;
  $('#nav').style.display=nonav?'none':'flex';
  $('#nav').innerHTML=nonav?'':[['home','Home'],['charts','Charts'],['x','Station X'],['crate','Crate'],['me','Me']].map(function(t){
    var cur=S.tab===t[0]&&!(top&&0);
    return '<div class="tabw"><button class="tab" data-a="tab:'+t[0]+'" aria-current="'+(cur?'page':'false')+'"><div class="bar"></div>'+ic(t[0],24,{sw:t[0]==='x'?3.2:1.8})+'<div>'+t[1]+'</div></button></div>';
  }).join('');
  var s=curSong();
  $('#mini').style.display=(nonav||!s||isX)?'none':'block';
  $('#mini').innerHTML=(!nonav&&s)?'<div class="mp"><button class="btn0" data-a="player" aria-label="Open player" style="display:flex;align-items:center;gap:12px;flex:1;min-width:0;text-align:left"><div style="width:44px;height:44px;border-radius:9px;flex:none;'+sart(s)+'"></div><div class="meta"><div class="t ell">'+esc(s.t)+'</div><div class="a ell">'+esc(s.a)+'</div></div></button>'+
    '<button class="pbtn" data-a="toggle" aria-label="'+(S.isPlaying?'Pause':'Play')+'">'+(S.isPlaying?PAUSE:PLAY).replace(/width="22" height="22"/,'width="20" height="20"')+'</button><div class="track"><i data-prog style="width:'+(S.prog*100)+'%"></i></div></div>':'';
  var layer=$('#layer');
  layer.innerHTML=playerHtml()||(sheetHtml()+popHtml());
  var nn=$('#newname'); if(nn&&!opts.noFocus) setTimeout(function(){nn.focus()},60);
  wireSignin();
}
 
/* ---------- actions ---------- */
function toast(msg,undo){
  var t=$('#toast'); t.innerHTML='<div class="toast"><span>'+msg+'</span>'+(undo?'<button data-a="undo">Undo</button>':'')+'</div>';
  S._undo=undo||null; clearTimeout(toast.t);
  toast.t=setTimeout(function(){t.innerHTML='';S._undo=null},4200);
}
var AU=new Audio();AU.preload='auto';
var retried='';
function startAudio(){
  var sg=curSong(); if(!sg) return;
  S.prog=0;S.sim=false;
  if(!sg.prev&&String(sg.id).charAt(0)==='p'){AU.pause();AU.removeAttribute('src');S.sim=true;return}
  retried='';
  /* set src and play inside the tap, so phones allow it; a stale preview link is refreshed on error */
  if(sg.prev){AU.src=sg.prev;var pr=AU.play();if(pr&&pr.catch)pr.catch(function(){});return}
  refreshPreview(sg);
}
function refreshPreview(sg){
  VAApi.lookup(sg.id).then(function(r){
    if(curSong()!==sg) return;
    if(r&&r.prev){sg.prev=r.prev;AU.src=r.prev;var pr=AU.play();if(pr&&pr.catch)pr.catch(function(){S.isPlaying=false;render({keep:1})})}
    else{S.sim=true;AU.pause()}
  }).catch(function(){S.sim=true;render({keep:1})});
}
AU.addEventListener('error',function(){var sg=curSong();if(sg&&retried!==sg.id&&AU.src){retried=sg.id;refreshPreview(sg)}});
function progUpdate(){
  var d=(AU.duration&&isFinite(AU.duration))?AU.duration:30, w=(S.prog*100)+'%';
  document.querySelectorAll('[data-prog]').forEach(function(n){n.style.width=w});
  var el=document.querySelector('[data-el]'); if(el)el.textContent='0:'+('0'+Math.floor(S.prog*d)).slice(-2);
}
AU.addEventListener('timeupdate',function(){if(S.sim||!S.isPlaying)return;var d=(AU.duration&&isFinite(AU.duration))?AU.duration:30;S.prog=Math.min(1,AU.currentTime/d);progUpdate()});
AU.addEventListener('ended',function(){step(1);render({keep:1})});
function play(songId,key){
  var list=CTX[key]||[songId]; if(list.indexOf(songId)<0) list=[songId];
  S.playing={songId:songId,ctx:list.slice(),ctxKey:key};S.isPlaying=true;startAudio();
}
function step(d){
  if(!S.playing) return;
  var c=S.playing.ctx, i=c.indexOf(S.playing.songId); if(i<0)i=0;
  var n=(i+d+c.length)%c.length;
  S.playing.songId=c[n];S.isPlaying=true;startAudio();
}
function addSong(tid,sid){
  var t=tapeBy(tid); if(!t||t.songs.indexOf(sid)>=0||t.songs.length>=limitOf(t)) return false;
  t.songs.push(sid);t.updated=Date.now();return true;
}
function newTape(name){
  var id=Store.newId();
  var t={id:id,title:name,owner:'me',genre:'pop',songs:[],updated:Date.now()};
  S.tapes.push(t);S.likedTapes.unshift(id);return t;
}
function closeSheet(){S.sheet=null;S.pop=false}
function go(v){S.stack.push(v);closeSheet()}
 
function act(a,p,el,e){
  switch(a){
    case 'tab': S.tab=p[0];S.stack=[];closeSheet();if(p[0]!=='x')xStop();break;
    case 'back': S.stack.pop();break;
    case 'tape': go({type:'tape',id:p[0]});break;
    case 'dj': go({type:'dj',id:p[0]});break;
    case 'settings': go({type:'settings'});break;
    case 'account': S.pop=!S.pop;break;
    case 'close': closeSheet();break;
    case 'play': play(p[0],p[1]);break;
    case 'playtape': var t=tapeBy(p[0]);CTX['pt']=t.songs.slice();play(t.songs[0],'pt');break;
    case 'toggle':
      if(!S.playing)break;
      S.isPlaying=!S.isPlaying;
      if(!S.sim){ if(S.isPlaying){ if(!AU.src||AU.ended)startAudio(); else{var tp=AU.play();if(tp&&tp.catch)tp.catch(function(){})} } else AU.pause(); }
      break;
    case 'next': step(1);break;
    case 'prev': step(-1);break;
    case 'player': S.sheet={type:'player'};break;
    case 'seek': var r=el.getBoundingClientRect();S.prog=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width));if(!S.sim&&AU.duration&&isFinite(AU.duration))AU.currentTime=S.prog*AU.duration;break;
    case 'like':
      var id=p[0]; if(S.liked[id]){delete S.liked[id]}else{S.liked[id]=1}
      persistProfile();
      if(p[1]==='keep'){closeSheet()}
      break;
    case 'more': S.sheet={type:'song',id:p[0],tape:p[1]||''};break;
    case 'add': S.sheet={type:'add',id:p[0]};break;
    case 'newfor': S.sheet={type:'add',id:p[0],creating:true};break;
    case 'addto':
      var tt=tapeBy(p[0]),sid=p[1];
      if(tt.songs.indexOf(sid)>=0){toast('Already on '+esc(tt.title));break}
      if(addSong(tt.id,sid)){persistTape(tt);closeSheet();toast('Added to '+esc(tt.title),function(){tt.songs=tt.songs.filter(function(x){return x!==sid});persistTape(tt)});}
      break;
    case 'create':
      var nm=($('#newname')||{}).value; nm=(nm||'').trim();
      if(!nm){toast('Name your MixTape first');return render({noFocus:1})}
      var nt=newTape(nm),sid2=p[0]!==''?p[0]:null;
      closeSheet();
      if(sid2!=null){addSong(nt.id,sid2);persistTape(nt);persistProfile();toast('Added to '+esc(nt.title),function(){nt.songs=[];persistTape(nt)})}
      else{persistTape(nt);persistProfile();toast('Created '+esc(nt.title))}
      break;
    case 'newtape': S.sheet={type:'newtape'};break;
    case 'rmsong':
      var rt=tapeBy(p[1]),rs=p[0],ri=rt.songs.indexOf(rs);rt.songs.splice(ri,1);closeSheet();persistTape(rt);
      toast('Removed from '+esc(rt.title),function(){rt.songs.splice(ri,0,rs);persistTape(rt)});break;
    case 'liketape':
      var lid=p[0],li=S.likedTapes.indexOf(lid);
      if(li>=0){S.likedTapes.splice(li,1);S.pinned=S.pinned.filter(function(x){return x!==lid})}else{S.likedTapes.push(lid)}
      persistProfile();
      if(p[1]==='keep')closeSheet();break;
    case 'pintape':
      var pid=p[0];if(S.likedTapes.indexOf(pid)<0)break;
      var pi=S.pinned.indexOf(pid);
      if(pi>=0){S.pinned.splice(pi,1);toast('Unpinned')}else{S.pinned.push(pid);toast('Pinned to the top of Favorites')}
      persistProfile();
      if(p[1]==='keep')closeSheet();break;
    case 'tapemore': S.sheet={type:'tape',id:p[0]};break;
    case 'askdel': S.sheet={type:'del',id:p[0]};break;
    case 'del':
      var delT=tapeBy(p[0]); if(delT&&delT.owner==='me')Store.deleteTape(p[0]).catch(saveFail);
      S.tapes=S.tapes.filter(function(x){return x.id!==p[0]});S.likedTapes=S.likedTapes.filter(function(x){return x!==p[0]});S.pinned=S.pinned.filter(function(x){return x!==p[0]});
      S.stack=S.stack.filter(function(v){return !(v.type==='tape'&&v.id===p[0])});persistProfile();closeSheet();toast('MixTape deleted');break;
    case 'sug': pickSuggestion(+p[0]);return;
    case 'sugclear': RECENT=[];try{localStorage.removeItem('va.recent')}catch(x){}suggUpdate();S.sg={items:[],active:-1,open:false};suggUpdate();return;
    case 'pref':
      if(p[0]==='sugg')PREFS.sugg=p[1];
      if(p[0]==='recent'){PREFS.recent=p[1]==='1';if(!PREFS.recent){RECENT=[];try{localStorage.removeItem('va.recent')}catch(x){}}}
      savePrefs();break;
    case 'cl': S.chartL=p[0];S.chartN=50;break;
    case 'cs': S.chartS=p[0];S.chartN=50;break;
    case 'cm': S.chartM=p[0];S.chartN=50;break;
    case 'cg': S.chartG=p[0];S.chartS='any';S.chartN=50;break;
    case 'ce': S.chartE=p[0];S.chartN=50;if(S.chartD!=='any'&&p[0]!=='all'&&decEra(S.chartD)!==p[0])S.chartD='any';break;
    case 'cd': S.chartD=p[0];S.chartN=50;if(p[0]!=='any'&&S.chartE!=='all'&&decEra(p[0])!==S.chartE)S.chartE=decEra(p[0]);break;
    case 'cmore': S.chartN+=50;break;
    case 'cq': S.crateQ=p.join(':');addRecent(S.crateQ);crateSearchSoon(0);break;
    case 'metab': S.meTab=p[0];break;
    case 'theme': S.vt=p[0];applyTheme();break;
    case 'customize': S.sheet={type:'custom'};break;
    case 'setav': S.avatar=+p[0];persistProfile();break;
    case 'setbn': S.banner=+p[0];persistProfile();break;
    case 'apple': toast('No Apple Music link for this song.');break;
    case 'undo': if(S._undo){S._undo();S._undo=null;$('#toast').innerHTML=''}break;
    case 'logout': Store.signOut().catch(function(){});S.user=null;S.tapes=[];S.liked={};S.likedTapes=[];S.pinned=[];S.playing=null;S.stack=[];S.tab='home';closeSheet();S.isPlaying=false;AU.pause();xStop();seedPlaying();break;
    case 'swipe': S.xState='deny';S.xCount++;xStart();setTimeout(function(){if(S.xState==='deny'){S.xState='idle';if(S.tab==='x'&&!S.stack.length)render()}},1800);break;
  }
  render({keep:1});
}
function applyTheme(){
  var r=document.documentElement;
  if(S.vt==='system') r.removeAttribute('data-vt'); else r.setAttribute('data-vt',S.vt);
}
 
document.addEventListener('click',function(e){
  var el=e.target.closest('[data-a]'); if(!el) return;
  if(el.dataset.lpFired){delete el.dataset.lpFired;e.preventDefault();return}
  var parts=el.dataset.a.split(':');
  act(parts[0],parts.slice(1),el,e);
});
/* long press on Favorites tiles opens pin menu; right click does the same */
var lpT=null;
document.addEventListener('pointerdown',function(e){
  var el=e.target.closest('[data-lp]'); if(!el) return;
  lpT=setTimeout(function(){el.dataset.lpFired='1';var p=el.dataset.lp.split(':');act(p[0],p.slice(1),el,e)},480);
});
['pointerup','pointercancel','pointermove','pointerleave'].forEach(function(n){document.addEventListener(n,function(){clearTimeout(lpT)})});
document.addEventListener('contextmenu',function(e){var el=e.target.closest('[data-lp]');if(el){e.preventDefault()}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&(S.sheet||S.pop)){closeSheet();render({keep:1})}});
 
document.addEventListener('focusin',function(e){if(e.target.id==='q')suggestSoon(false)});
document.addEventListener('focusout',function(e){if(e.target.id==='q')setTimeout(function(){if(document.activeElement!==$('#q'))suggClose()},140)});
document.addEventListener('mousedown',function(e){if(e.target.closest&&e.target.closest('#sugg'))e.preventDefault()});
document.addEventListener('keydown',function(e){
  if(!e.target||e.target.id!=='q') return;
  var q=e.target,sg=S.sg,n=sg.items.length;
  var hasCompletion=q.selectionStart!==q.selectionEnd&&q.selectionEnd===q.value.length;
  if(e.key==='ArrowDown'&&n){e.preventDefault();sg.open=true;sg.active=(sg.active+1)%n;suggUpdate();var el=$('#sg'+sg.active);if(el&&el.scrollIntoView)el.scrollIntoView({block:'nearest'})}
  else if(e.key==='ArrowUp'&&n){e.preventDefault();sg.active=sg.active<=0?n-1:sg.active-1;suggUpdate()}
  else if(e.key==='Enter'){
    e.preventDefault();
    if(sg.active>=0){pickSuggestion(sg.active)}else{commitSearch(q.value)}
  }
  else if((e.key==='Tab'||e.key==='ArrowRight')&&hasCompletion){e.preventDefault();commitSearch(q.value)}
  else if(e.key==='Escape'){
    if(hasCompletion){q.value=S.crateQ;q.setSelectionRange(q.value.length,q.value.length)}
    suggClose();
  }
});
document.addEventListener('input',function(e){
  if(e.target.id==='q'){S.crateQ=e.target.value;crateSearchSoon(350);suggestSoon(e.inputType&&e.inputType.indexOf('insert')===0);}
  if(e.target.id==='uname'){
    var g=e.target.value.trim().toLowerCase()==='guestdj'||e.target.value.trim()==='';
    var pw=$('#upass'),h=$('#uhelp');
    pw.disabled=e.target.value.trim().toLowerCase()==='guestdj'; if(pw.disabled)pw.value='';
    h.textContent=e.target.value.trim().toLowerCase()==='guestdj'?'Guest DJ is a shared name, so passwords are off.':'Without a password, anyone who signs in as this name can edit its playlists.';
  }
});
function wireSignin(){
  var f=$('#sf'); if(!f||f._w) return; f._w=1;
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=$('#uname').value.trim(),pw=$('#upass').value,err=$('#uerr'),btn=f.querySelector('button[type=submit]');
    var name=v===''?'GuestDJ':v;
    err.textContent='';btn.disabled=true;btn.textContent='Signing in…';
    Promise.resolve().then(function(){return Store.signIn(name,name.toLowerCase()==='guestdj'?'':pw)}).then(function(r){
      S.user=r.user;
      return Store.load(r.user).then(function(d){return DATA_READY.then(function(){applyLoad(d);S.tab='home';S.stack=[];render();if(r.notice)toast(esc(r.notice))})});
    }).catch(function(e){
      S.user=null;btn.disabled=false;btn.textContent='Continue';err.textContent=friendly(e);
      if(e&&e.code==='need-password'){var pi=$('#upass');if(pi)pi.focus()}
    });
  });
}
 
/* ---------- playback simulation + Studio X sound ---------- */
setInterval(function(){
  if(!S.sim||!S.isPlaying||!S.playing) return;
  S.prog+=.2/30;
  if(S.prog>=1){step(1);render({keep:1});return}
  progUpdate();
},200);
 
var AC=null,xT=null;
function xStart(){
  if(document.hidden||!document.hasFocus()) return;
  S.xMuted=false;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended')AC.resume();
    if(xT)return;
    var beat=function(){
      var o=AC.createOscillator(),g=AC.createGain(),f=AC.createBiquadFilter(),t=AC.currentTime;
      o.type='sine';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(42,t+.25);
      f.type='lowpass';f.frequency.value=110;
      g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.22,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.34);
      o.connect(f);f.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.4);
    };
    beat();xT=setInterval(beat,500);
  }catch(err){}
}
function xStop(){
  if(xT){clearInterval(xT);xT=null}
  S.xMuted=true;
  try{if(AC&&AC.state==='running')AC.suspend()}catch(e){}
}
/* Station X sound only plays while the tab is open, visible and focused */
function xGuard(force){
  if(force===true||document.hidden||!document.hasFocus()){
    var was=!S.xMuted; xStop();
    if(was&&S.user&&S.tab==='x'&&!S.stack.length) render({keep:1});
  }
}
document.addEventListener('visibilitychange',function(){xGuard()});
window.addEventListener('blur',function(){xGuard(true)});
window.addEventListener('pagehide',function(){xGuard(true)});
 
function seedPlaying(){var ids=SONGS.slice(0,6).map(function(x){return x.id});S.playing=ids.length?{songId:ids[1]||ids[0],ctx:ids,ctxKey:'seed'}:null}
function seedTapes(){seedPlaying()}
var DATA_READY=VAApi.loadCharts().then(function(d){
  if(!d||!d.songs||!d.songs.length) throw new Error('empty');
  d.songs.forEach(function(x){x.tone=TONE_G[x.g]||'graphite';CAT[x.id]=x});
  SONGS=d.songs.slice();
  CHARTS={all:d.all||d.songs.map(function(x){return x.id}),byGenre:d.byGenre||{},decades:d.decades||[],eraCutoff:d.eraCutoff||2000,vocab:d.vocab||null,hot:{},updated:d.updated,live:true};
  CHARTS.all.forEach(function(id){CHARTS.hot[id]=1});
  if(d.vocab&&d.vocab.genres)Object.keys(d.vocab.genres).forEach(function(k){if(G[k])G[k]=d.vocab.genres[k]});
}).catch(function(){
  CHARTS={all:SAMPLE.map(function(x){return x.id}),byGenre:{},hot:{},updated:null,live:false};
  GORDER.forEach(function(g){CHARTS.byGenre[g]=SAMPLE.filter(function(x){return x.g===g}).map(function(x){return x.id})});
}).then(seedTapes);
render();
Store.resume().then(function(u){
  if(!u) return;
  S.user=u;
  return Store.load(u).then(function(d){return DATA_READY.then(function(){applyLoad(d)})});
}).catch(function(){S.user=null}).then(function(){S.booting=false;render()});
})();
 