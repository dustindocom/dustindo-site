(function(){
'use strict';
var $=function(s){return document.querySelector(s)};
var S=window.VAStore, X=null, logEl=$('#log'), first=true;
function log(m,cls){
  if(first){logEl.textContent='';first=false}
  var d=document.createElement('div');if(cls)d.className=cls;d.textContent=m;logEl.appendChild(d);logEl.scrollTop=logEl.scrollHeight;
}
if(S.mode!=='firebase'){$('#nocfg').hidden=false;$('#box').hidden=true;return}
var busy=function(on){['#go','#check','#seed','#unseed'].forEach(function(s){$(s).disabled=on})};
var run=function(fn){busy(true);return Promise.resolve().then(fn).catch(function(e){log('Failed: '+(e&&e.code?e.code+' · ':'')+(e&&e.message||e),'bad')}).then(function(){busy(false)})};
var snap=function(s){return {trackId:s.id,title:s.t,artist:s.a,artworkUrl:s.art||'',genre:s.g||'pop'}};

$('#go').onclick=function(){run(function(){
  return S.fb().then(function(x){
    return x.A.signInWithEmailAndPassword(x.auth,S.emailFor('djdustin'),$('#pw').value).then(function(){
      X=x;log('Signed in as DJDustin ('+x.auth.currentUser.uid+').','ok');$('#tools').hidden=false;
    });
  });
})};

$('#check').onclick=function(){run(function(){
  var F=X.F,db=X.db;
  return Promise.all([F.getDoc(F.doc(db,'usernames','djdustin')),F.getDoc(F.doc(db,'usernames','guestdj'))]).then(function(r){
    log(r[0].exists()?'usernames/djdustin: found':'usernames/djdustin: MISSING',r[0].exists()?'ok':'bad');
    log(r[1].exists()?'usernames/guestdj: found':'usernames/guestdj: MISSING',r[1].exists()?'ok':'bad');
    return F.setDoc(F.doc(db,'featured','home'),{checkedAt:Date.now()},{merge:true}).then(function(){log('Admin write access: OK (admins/'+X.auth.currentUser.uid+' exists)','ok')},function(e){log('Admin write access: DENIED. Create the admins/'+X.auth.currentUser.uid+' document.','bad')});
  });
})};

function catalog(){
  return fetch('data/charts.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('data/charts.json not found. Run the Refresh charts workflow first.');return r.json()}).then(function(d){
    if(!d.songs||d.songs.length<30)log('Only '+(d.songs||[]).length+' songs in charts.json. Tapes may repeat songs.','bad');
    return d.songs;
  });
}

$('#seed').onclick=function(){run(function(){
  var F=X.F,db=X.db,uid=X.auth.currentUser.uid,now=Date.now();
  return catalog().then(function(songs){
    var seq=Promise.resolve();
    var step=function(msg,fn){seq=seq.then(fn).then(function(){log(msg,'ok')})};
    VASeed.DJS.forEach(function(d){
      step('DJ '+d.name,function(){
        return F.setDoc(F.doc(db,'usernames',d.id),{name:d.name,protected:true,ownerUid:uid,premium:false,createdAt:now})
          .then(function(){return d.premium?F.updateDoc(F.doc(db,'usernames',d.id),{premium:true}):null})
          .then(function(){return F.setDoc(F.doc(db,'profiles',d.id),{avatar:d.av[0]+':'+d.av[1],banner:0,style:d.style,likedSongs:[],likedMixtapes:[],pinnedMixtapes:[],updatedAt:now})});
      });
    });
    VASeed.SPEC.forEach(function(sp,i){
      var t=VASeed.buildTape(sp,i,songs), by={};songs.forEach(function(s){by[s.id]=s});
      step('MixTape '+sp[1]+' ('+t.songs.length+' songs)',function(){
        return F.setDoc(F.doc(db,'playlists','premade-'+sp[0]),{name:sp[1],description:'',ownerName:sp[2],createdAt:now-i,updatedAt:now-i,songs:t.songs.map(function(id){return snap(by[id])})});
      });
    });
    step('Home lists',function(){
      return F.setDoc(F.doc(db,'featured','home'),{hotMixtapes:VASeed.HOT.map(function(id){return 'premade-'+id}),djsOnTheRise:VASeed.DJS.map(function(d){return d.id}),updatedAt:now});
    });
    return seq.then(function(){log('Done. Open the site and look at Home.','ok')});
  });
})};

$('#unseed').onclick=function(){run(function(){
  var F=X.F,db=X.db,ids=VASeed.SPEC.map(function(sp){return 'premade-'+sp[0]});
  return Promise.all(ids.map(function(id){return F.deleteDoc(F.doc(db,'playlists',id))})).then(function(){
    return F.setDoc(F.doc(db,'featured','home'),{hotMixtapes:[],djsOnTheRise:[]},{merge:true});
  }).then(function(){log('Removed '+ids.length+' starter MixTapes and cleared the Home lists. DJ names were kept.','ok')});
})};
})();
