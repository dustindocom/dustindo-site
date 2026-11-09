/* Catalog status for the admin page. Reads charts.json from the repo's charts branch (the "Refresh charts"
   workflow commits it there), or a local data/charts.json. Needs no sign-in and works with or without Firebase. */
(function(){
'use strict';
var REPO='https://github.com/dustindocom/dustindo-site';
var DATA_URL='https://raw.githubusercontent.com/dustindocom/dustindo-site/charts/charts.json', src='';
var $=function(s){return document.querySelector(s)};
var box=$('#catalog'), body=$('#catbody');
var esc=function(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var n=function(x){return Number(x||0).toLocaleString()};
var pct=function(a,b){return b?Math.round(a*100/b):0};

function ago(iso){
  var m=Math.round((Date.now()-new Date(iso))/6e4);
  if(m<60)return m+' min ago';var h=Math.round(m/60);if(h<48)return h+' h ago';return Math.round(h/24)+' days ago';
}
function bars(rows,max){
  return '<div class="bars">'+rows.map(function(r){
    return '<div class="bar"><span class="bl">'+esc(r[0])+'</span><span class="bt"><i style="width:'+Math.max(2,pct(r[1],max))+'%"></i></span><span class="bn">'+n(r[1])+'</span></div>';
  }).join('')+'</div>';
}

function render(d){
  var S=d.songs||[], st=d.status||null, c=function(f){return S.filter(f).length};
  var hours=(Date.now()-new Date(d.updated))/36e5;
  var fresh=hours<8?['ok','Up to date']:hours<24?['warn','A run was missed']:['bad','Stale: the workflow may be failing'];
  var tags={style:c(function(s){return s.st&&s.st.length}),mood:c(function(s){return s.md&&s.md.length}),ls:c(function(s){return s.ls}),ev:c(function(s){return s.ev})};
  var noLfm=st?!st.lastfm:(tags.style+tags.mood+tags.ls===0);
  var G=(d.vocab&&d.vocab.genres)||{}, byG={}, byD={};
  S.forEach(function(s){byG[s.g]=(byG[s.g]||0)+1;byD[s.dec]=(byD[s.dec]||0)+1});
  var gRows=Object.keys(byG).sort(function(a,b){return byG[b]-byG[a]}).map(function(k){return [G[k]||k,byG[k]]});
  var dRows=(d.decades||Object.keys(byD)).map(function(k){return [k,byD[k]||0]});
  var h='';
  h+='<div class="stat"><span class="dot '+fresh[0]+'"></span><b>'+fresh[1]+'</b><span class="muted"> · built '+esc(ago(d.updated))+' ('+esc(new Date(d.updated).toLocaleString())+') · from '+esc(src)+'</span></div>';
  h+='<div class="kpis">'+
     '<div><b>'+n(S.length)+'</b><span>songs</span></div>'+
     '<div><b>'+(st?'+'+n(st.added):'–')+'</b><span>new last run</span></div>'+
     '<div><b>'+n((d.all||[]).length)+'</b><span>on the hot chart</span></div>'+
     '<div><b>'+n(c(function(s){return s.e}))+'</b><span>explicit</span></div></div>';
  if(st){
    h+='<h3>Artist crawl</h3><div class="bar wide"><span class="bt"><i style="width:'+pct(st.artistsDone,st.artists)+'%"></i></span><span class="bn">'+n(st.artistsDone)+' / '+n(st.artists)+'</span></div>'+
       '<p class="note">Artists searched in the last 90 days. Each run searches up to 45 more.'+(st.hotFresh===false?' <span class="bad">The hot chart failed last run and was kept from before.</span>':'')+'</p>';
  }
  h+='<h3>Tagging</h3>'+bars([['Style',tags.style],['Mood',tags.mood],['Listeners',tags.ls],['Evergreen',tags.ev]],S.length);
  if(noLfm)h+='<p class="note bad">Last.fm did not run, so styles, moods, All-time and On repeat are empty. Add a repo secret named <code>LASTFM_KEY</code> (<a href="'+REPO+'/settings/secrets/actions" target="_blank" rel="noopener">Secrets</a>).</p>';
  h+='<div class="two"><div><h3>By decade</h3>'+bars(dRows,Math.max.apply(null,dRows.map(function(r){return r[1]}).concat(1)))+'</div>'+
     '<div><h3>By genre</h3>'+bars(gRows,Math.max.apply(null,gRows.map(function(r){return r[1]}).concat(1)))+'</div></div>';
  body.innerHTML=h;
}

function load(){
  body.innerHTML='<p class="muted">Loading the catalog from the charts branch…</p>';
  var get=function(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error(r.status);return r.json()})};
  get(DATA_URL).then(function(d){src='GitHub charts branch';return d},function(){
    return get('data/charts.json').then(function(d){src='local data/charts.json';return d});
  }).then(render).catch(function(){
    body.innerHTML='<p class="bad">Could not load the catalog from the charts branch or data/charts.json. Run Refresh charts, or locally run: node va/scripts/get-data.mjs</p>';
  });
}
$('#catrun').href=REPO+'/actions/workflows/charts.yml';
$('#cathist').href=REPO+'/commits/charts';
$('#catreload').onclick=load;
box.hidden=false;
load();
})();
