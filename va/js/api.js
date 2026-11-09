/* Apple Music data for VA by DD: charts (prebuilt JSON), search and preview lookup (iTunes, via JSONP so no CORS setup is needed). */
(function(w){
'use strict';
var jid=0;
function jsonp(url,ms){
  return new Promise(function(res,rej){
    var n='__va'+(++jid)+'_'+Date.now().toString(36),sc=document.createElement('script');
    var t=setTimeout(function(){done();rej(new Error('timeout'))},ms||8000);
    function done(){clearTimeout(t);try{delete w[n]}catch(e){w[n]=undefined}if(sc.parentNode)sc.parentNode.removeChild(sc)}
    w[n]=function(d){done();res(d)};
    sc.onerror=function(){done();rej(new Error('load'))};
    sc.src=url+(url.indexOf('?')<0?'?':'&')+'callback='+n;
    document.head.appendChild(sc);
  });
}
var GMAP=[
  [/hip.?hop|rap/i,'hip'],[/r&b|soul/i,'rnb'],[/country|folk|americana|bluegrass/i,'ctry'],[/electronic|dance|house|techno|edm/i,'elec'],
  [/latin|reggaeton|urbano|salsa|bachata/i,'lat'],[/jazz|funk|blues/i,'jazz'],
  [/afro|reggae|dancehall|world/i,'afro'],[/rock|alternative|metal|punk/i,'rock'],[/pop|indie/i,'pop']
];
function genreKey(name){
  name=name||'';
  for(var i=0;i<GMAP.length;i++)if(GMAP[i][0].test(name))return GMAP[i][1];
  return 'pop';
}
function bigArt(u){return u?u.replace(/\d+x\d+(bb)?(?=\.)/,'300x300bb'):''}
function mapTrack(r){
  return {id:String(r.trackId),t:r.trackName,a:r.artistName,art:bigArt(r.artworkUrl100),prev:r.previewUrl||'',url:r.trackViewUrl||'',g:genreKey(r.primaryGenreName),e:r.trackExplicitness==='explicit'?1:0};
}
var ok=function(r){return r&&r.kind==='song'&&r.trackId&&r.previewUrl};
/* explicit songs are allowed, but when Apple also has a clean version of the same song, keep only the clean one */
function nk(s){return (s||'').toLowerCase().replace(/\(.*?\)|\[.*?\]/g,'').replace(/[^a-z0-9]/g,'')}
function preferClean(rs){
  var clean={};rs.forEach(function(r){if(r.trackExplicitness!=='explicit')clean[nk(r.artistName)+'|'+nk(r.trackName)]=1});
  return rs.filter(function(r){return r.trackExplicitness!=='explicit'||!clean[nk(r.artistName)+'|'+nk(r.trackName)]});
}
w.VAApi={
  genreKey:genreKey,
  /* The catalog lives on the repo's `charts` branch (the bot commits it there every 6 hours), read straight from GitHub.
     Falls back to a local data/charts.json (node va/scripts/get-data.mjs) for working offline. */
  CHARTS_URL:'https://raw.githubusercontent.com/dustindocom/dustindo-site/charts/charts.json',
  loadCharts:function(){
    var get=function(u){return fetch(u,{cache:'no-cache'}).then(function(r){if(!r.ok)throw new Error('charts '+r.status);return r.json()})};
    return get(w.VAApi.CHARTS_URL).catch(function(){return get('data/charts.json')});
  },
  search:function(term){
    var u='https://itunes.apple.com/search?media=music&entity=song&country=US&limit=40&term='+encodeURIComponent(term);
    return jsonp(u).then(function(d){return preferClean((d.results||[]).filter(ok)).slice(0,25).map(mapTrack)});
  },
  lookupMany:function(ids){
    var chunks=[];for(var i=0;i<ids.length;i+=50)chunks.push(ids.slice(i,i+50));
    return Promise.all(chunks.map(function(c){
      return jsonp('https://itunes.apple.com/lookup?country=US&id='+c.join(',')).then(function(d){return (d.results||[]).filter(function(r){return r.trackId}).map(mapTrack)}).catch(function(){return []});
    })).then(function(r){return [].concat.apply([],r)});
  },
  /* type-ahead: artists and songs that match what has been typed so far */
  suggest:function(term){
    var base='https://itunes.apple.com/search?media=music&country=US&term='+encodeURIComponent(term);
    return Promise.all([
      jsonp(base+'&entity=musicArtist&limit=4').catch(function(){return {results:[]}}),
      jsonp(base+'&entity=song&limit=8').catch(function(){return {results:[]}})
    ]).then(function(r){
      var out=[],seen={};
      (r[0].results||[]).forEach(function(x){var k='a:'+x.artistName.toLowerCase();if(x.artistName&&!seen[k]){seen[k]=1;out.push({type:'artist',text:x.artistName})}});
      preferClean((r[1].results||[]).filter(ok)).forEach(function(x){var k='s:'+x.trackName.toLowerCase()+x.artistName.toLowerCase();if(!seen[k]){seen[k]=1;out.push({type:'song',text:x.trackName,sub:x.artistName,art:bigArt(x.artworkUrl100).replace('300x300','100x100')})}});
      return out.slice(0,8);
    });
  },
  lookup:function(id){
    return jsonp('https://itunes.apple.com/lookup?country=US&id='+encodeURIComponent(id)).then(function(d){
      var r=(d.results||[])[0];return r?mapTrack(r):null;
    });
  }
};
})(window);
 