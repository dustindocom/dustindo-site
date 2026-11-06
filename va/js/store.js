/* VAStore: one interface, two backends.
   - Firebase (Auth + Firestore) when js/firebase-config.js has a config.
   - Local demo mode (localStorage) when it doesn't.
   Song objects stored in the database: {trackId, title, artist, artworkUrl, genre}. */
(function(w){
'use strict';
var CFG=w.VA_FIREBASE, FB_ON=!!(CFG&&CFG.apiKey&&CFG.projectId);
var SDK='10.14.1', BASE='https://www.gstatic.com/firebasejs/'+SDK+'/';
var RESERVED=['djdustin','dj-dustin','dj_dustin','dj.dustin','guestdj','guest-dj','guest_dj','guest.dj','admin','moderator','support','null','undefined'];
var NAME_RE=/^[a-z0-9]([a-z0-9]|[_.-](?=[a-z0-9]))*$/i;
var emailFor=function(lo){return lo+'@vabydd.users'};
var ls={get:function(k){try{return localStorage.getItem(k)}catch(e){return null}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}},del:function(k){try{localStorage.removeItem(k)}catch(e){}}};
var err=function(code,msg){var e=new Error(msg||code);e.code=code;return e};
function checkName(name){
  if(name.length<3||name.length>20||!NAME_RE.test(name)||!/[a-z0-9]$/i.test(name)) throw err('bad-name','Use 3 to 20 letters or numbers. You can add _ - . between them, no spaces.');
}

/* ---------------- local demo backend ---------------- */
var Local=(function(){
  var cur=null;
  var key=function(){return 'va.local.'+cur.name.toLowerCase()};
  var state={mine:{},profile:null};
  var flush=function(){ls.set(key(),JSON.stringify(state))};
  return {
    mode:'local',
    resume:function(){var n=ls.get('va.localuser');if(!n)return Promise.resolve(null);try{cur=JSON.parse(n)}catch(e){return Promise.resolve(null)}return Promise.resolve(cur)},
    signIn:function(name,pw){
      var lo=name.toLowerCase();
      if(lo!=='guestdj'){checkName(name);if(RESERVED.indexOf(lo)>=0)throw err('reserved','That name is reserved. Try another.');if(w.VASeed&&w.VASeed.DJS.some(function(d){return d.id===lo}))throw err('taken','That name belongs to a DJ on the Rise. Try another.')}
      cur={name:lo==='guestdj'?'GuestDJ':name,protected:!!pw&&lo!=='guestdj',premium:false};
      ls.set('va.localuser',JSON.stringify(cur));
      return Promise.resolve({user:cur});
    },
    signOut:function(){ls.del('va.localuser');cur=null;return Promise.resolve()},
    newId:function(){return 'm'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)},
    load:function(){
      var raw=ls.get(key());state={mine:{},profile:null};
      if(raw){try{state=JSON.parse(raw)}catch(e){}}
      return Promise.resolve({tapes:null,mine:Object.keys(state.mine).map(function(k){var t=state.mine[k];return {id:t.id,title:t.name,owner:'me',songs:t.songs,updated:t.updatedAt||0}}),profile:state.profile,hot:null,djs:null,first:!raw});
    },
    saveTape:function(t){t.updatedAt=Date.now();state.mine[t.id]=t;flush();return Promise.resolve()},
    deleteTape:function(id){delete state.mine[id];flush();return Promise.resolve()},
    saveProfile:function(p){state.profile=p;flush();return Promise.resolve()}
  };
})();

/* ---------------- Firebase backend ---------------- */
var Fire=(function(){
  var m=null,cur=null;
  function boot(){
    if(m) return m;
    m=Promise.all([import(BASE+'firebase-app.js'),import(BASE+'firebase-auth.js'),import(BASE+'firebase-firestore.js')]).then(function(r){
      var app=r[0].initializeApp(CFG), auth=r[1].getAuth(app), db=r[2].getFirestore(app);
      return auth.authStateReady().then(function(){return {app:app,auth:auth,db:db,A:r[1],F:r[2]}});
    });
    return m;
  }
  function ensureAuth(x){return x.auth.currentUser?Promise.resolve():x.A.signInAnonymously(x.auth)}
  function djView(id,u,p){
    var av=(p&&p.avatar||'graphite:dots').split(':');
    return {id:id,name:(u&&u.name)||id,style:(p&&p.style)||'',av:[av[0],av[1]||'dots'],premium:!!(u&&u.premium)};
  }
  return {
    mode:'firebase',
    fb:boot,
    emailFor:emailFor,
    resume:function(){
      var n=ls.get('va.name');if(!n)return Promise.resolve(null);
      return boot().then(function(x){
        var lo=n.toLowerCase();
        return x.F.getDoc(x.F.doc(x.db,'usernames',lo)).then(function(s){
          if(!s.exists()) return null;
          var d=s.data();
          if(d.protected&&!(x.auth.currentUser&&x.auth.currentUser.email===emailFor(lo))) return null;
          if(!d.protected&&!x.auth.currentUser) return null;
          cur={name:d.name,protected:!!d.protected,premium:!!d.premium};return cur;
        });
      }).catch(function(){return null});
    },
    signIn:function(name,pw){
      var lo=name.toLowerCase();
      return boot().then(function(x){
        var ref=x.F.doc(x.db,'usernames',lo);
        return x.F.getDoc(ref).then(function(s){
          if(s.exists()){
            var d=s.data();
            if(d.protected){
              if(!pw) throw err('need-password','This name is locked. Enter its password.');
              return x.A.signInWithEmailAndPassword(x.auth,emailFor(lo),pw).then(function(){return {user:{name:d.name,protected:true,premium:!!d.premium}}});
            }
            return ensureAuth(x).then(function(){return {user:{name:d.name,protected:false,premium:!!d.premium},notice:lo==='guestdj'?'':'This name is shared, so anyone using it can edit its MixTapes.'}});
          }
          if(lo==='guestdj') throw err('setup','Guest DJ is not set up in the database yet. See the setup guide.');
          checkName(name);
          if(RESERVED.indexOf(lo)>=0) throw err('reserved','That name is reserved. Try another.');
          return ensureAuth(x).then(function(){
            var uid=x.auth.currentUser.uid, data={name:name,protected:!!pw,premium:false,createdAt:Date.now()};
            var link=pw?x.A.linkWithCredential(x.auth.currentUser,x.A.EmailAuthProvider.credential(emailFor(lo),pw)):Promise.resolve();
            if(pw) data.ownerUid=uid;
            return link.then(function(){return x.F.setDoc(ref,data)}).then(function(){return {user:{name:name,protected:!!pw,premium:false}}});
          });
        });
      }).then(function(r){cur=r.user;ls.set('va.name',cur.name);return r});
    },
    signOut:function(){ls.del('va.name');cur=null;return boot().then(function(x){return x.A.signOut(x.auth)})},
    newId:function(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,7)},
    load:function(user){
      var lo=user.name.toLowerCase();
      return boot().then(function(x){
        var F=x.F,db=x.db;
        return Promise.all([
          F.getDocs(F.collection(db,'playlists')),
          F.getDoc(F.doc(db,'featured','home')),
          F.getDoc(F.doc(db,'profiles',lo))
        ]).then(function(r){
          var tapes=r[0].docs.map(function(d){var v=d.data();return {id:d.id,title:v.name,owner:v.ownerName,songs:v.songs||[],updated:v.updatedAt||0,desc:v.description||''}});
          var feat=r[1].exists()?r[1].data():{};
          var names=feat.djsOnTheRise||[];
          return Promise.all(names.map(function(n){
            return Promise.all([F.getDoc(F.doc(db,'usernames',n)),F.getDoc(F.doc(db,'profiles',n))]).then(function(z){
              return djView(n,z[0].exists()?z[0].data():null,z[1].exists()?z[1].data():null);
            });
          })).then(function(djs){
            return {tapes:tapes,mine:null,profile:r[2].exists()?r[2].data():null,hot:feat.hotMixtapes||[],djs:djs};
          });
        });
      });
    },
    saveTape:function(t){
      var lo=cur.name.toLowerCase();
      return boot().then(function(x){return x.F.setDoc(x.F.doc(x.db,'playlists',t.id),{name:t.name,description:t.description||'',ownerName:lo,createdAt:t.createdAt||Date.now(),updatedAt:Date.now(),songs:t.songs})});
    },
    deleteTape:function(id){return boot().then(function(x){return x.F.deleteDoc(x.F.doc(x.db,'playlists',id))})},
    saveProfile:function(p){
      var lo=cur.name.toLowerCase();
      return boot().then(function(x){var d=Object.assign({},p,{updatedAt:Date.now()});return x.F.setDoc(x.F.doc(x.db,'profiles',lo),d,{merge:true})});
    }
  };
})();

w.VAStore=FB_ON?Fire:Local;
w.VAStore.RESERVED=RESERVED;
w.VAStore.emailFor=emailFor;
})(window);
