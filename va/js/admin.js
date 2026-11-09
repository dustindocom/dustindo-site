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
$('#pw').addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.isComposing&&!$('#go').disabled){e.preventDefault();$('#go').click()}});

$('#check').onclick=function(){run(function(){
  var F=X.F,db=X.db;
  return Promise.all([F.getDoc(F.doc(db,'usernames','djdustin')),F.getDoc(F.doc(db,'usernames','guestdj'))]).then(function(r){
    log(r[0].exists()?'usernames/djdustin: found':'usernames/djdustin: MISSING',r[0].exists()?'ok':'bad');
    log(r[1].exists()?'usernames/guestdj: found':'usernames/guestdj: MISSING',r[1].exists()?'ok':'bad');
    return F.setDoc(F.doc(db,'featured','home'),{checkedAt:Date.now()},{merge:true}).then(function(){log('Admin write access: OK (admins/'+X.auth.currentUser.uid+' exists)','ok')},function(e){log('Admin write access: DENIED. Create the admins/'+X.auth.currentUser.uid+' document.','bad')});
  });
})};

/* starter tape ids, plus the 14 the old starter data used, so a re-seed or removal leaves nothing behind */
var starterIds=function(){return VASeed.SPEC.map(function(sp){return sp[0]}).concat(VASeed.LEGACY).map(function(id){return 'premade-'+id})};

$('#seed').onclick=function(){run(function(){
  var F=X.F,db=X.db,uid=X.auth.currentUser.uid,now=Date.now();
  var by={};VASeed.SONGS.forEach(function(s){by[s.id]=s});
  return Promise.resolve().then(function(){
    var seq=Promise.resolve();
    var step=function(msg,fn){seq=seq.then(fn).then(function(){if(msg)log(msg,'ok')})};
    step('Removed the old starter MixTapes',function(){
      return Promise.all(VASeed.LEGACY.map(function(id){return F.deleteDoc(F.doc(db,'playlists','premade-'+id))}));
    });
    VASeed.DJS.forEach(function(d){
      step('DJ '+d.name,function(){
        return F.setDoc(F.doc(db,'usernames',d.id),{name:d.name,protected:true,ownerUid:uid,premium:false,createdAt:now})
          .then(function(){return d.premium?F.updateDoc(F.doc(db,'usernames',d.id),{premium:true}):null})
          .then(function(){return F.setDoc(F.doc(db,'profiles',d.id),{avatar:d.av[0]+':'+d.av[1],banner:0,style:d.style,likedSongs:[],likedMixtapes:[],pinnedMixtapes:[],updatedAt:now})});
      });
    });
    var n=VASeed.SPEC.length;
    VASeed.SPEC.forEach(function(sp,i){
      var t=VASeed.buildTape(sp,i);
      step((i+1)%25===0||i+1===n?'MixTapes '+(i+1)+' of '+n:'',function(){
        return F.setDoc(F.doc(db,'playlists','premade-'+sp[0]),{name:sp[1],description:'',ownerName:sp[2],tags:t.tags,createdAt:now-i,updatedAt:now-i,songs:t.songs.map(function(id){return snap(by[id])})});
      });
    });
    step('Home lists',function(){
      return F.setDoc(F.doc(db,'featured','home'),{hotMixtapes:VASeed.HOT.map(function(id){return 'premade-'+id}),djsOnTheRise:VASeed.RISE.slice(),updatedAt:now});
    });
    return seq.then(function(){log('Done. Open the site and look at Home.','ok')});
  });
})};

$('#unseed').onclick=function(){run(function(){
  var F=X.F,db=X.db,ids=starterIds();
  return Promise.all(ids.map(function(id){return F.deleteDoc(F.doc(db,'playlists',id))})).then(function(){
    return F.setDoc(F.doc(db,'featured','home'),{hotMixtapes:[],djsOnTheRise:[]},{merge:true});
  }).then(function(){log('Removed the '+VASeed.SPEC.length+' starter MixTapes and cleared the Home lists. DJ names were kept.','ok')});
})};
})();
