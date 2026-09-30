/**
 * BACKEND GOOGLE APPS SCRIPT - SMK PINTAR
 * Sheets yang digunakan: Users, Answers, Progress.
 * Deploy sebagai Web App -> Execute as Me -> Who has access: Anyone.
 */
function doGet(){return ContentService.createTextOutput(JSON.stringify({ok:true,service:'SMK PINTAR API'})).setMimeType(ContentService.MimeType.JSON);}
function doPost(e){try{var d=JSON.parse(e.postData.contents||'{}');return json(route(d));}catch(err){return json({ok:false,error:String(err)});}}
function json(x){return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
function sheet(name,headers){var ss=SpreadsheetApp.getActiveSpreadsheet(),s=ss.getSheetByName(name)||ss.insertSheet(name);if(s.getLastRow()===0)s.appendRow(headers);return s;}
function route(d){var ss=SpreadsheetApp.getActiveSpreadsheet();
  if(d.action==='register'){
    var u=sheet('Users',['username','password','nama','kelas']);var username=String(d.username||'').trim(),password=String(d.password||'');
    if(!/^[A-Za-z0-9._-]{3,30}$/.test(username))return {ok:false,error:'Username tidak valid.'};if(password.length<6)return {ok:false,error:'Password minimal 6 karakter.'};
    var rows=u.getDataRange().getValues();for(var i=1;i<rows.length;i++)if(String(rows[i][0]).trim().toLowerCase()===username.toLowerCase())return {ok:false,error:'Username sudah digunakan.'};
    u.appendRow([username,hashPassword(password),String(d.nama||''),String(d.kelas||'')]);return {ok:true,user:{username:username,nama:String(d.nama||''),kelas:String(d.kelas||'')}};
  }
  if(d.action==='login'){
    var sh=ss.getSheetByName('Users');if(!sh)return {ok:false,error:'Sheet Users belum dibuat.'};var v=sh.getDataRange().getValues(),h=hashPassword(String(d.password||''));
    for(var i=1;i<v.length;i++){var stored=String(v[i][1]||'');if(String(v[i][0]).trim().toLowerCase()===String(d.username||'').trim().toLowerCase()&&(stored===h||stored===String(d.password||'')))return {ok:true,user:{username:String(v[i][0]),nama:String(v[i][2]||''),kelas:String(v[i][3]||'')}};}return {ok:false,error:'Username/password salah.'};
  }
  if(d.action==='saveAnswer'){sheet('Answers',['timestamp','username','level','question','answer','correct']).appendRow([new Date(),d.username,d.level,d.question,d.answer,d.correct]);return {ok:true};}
  if(d.action==='saveProgress'){sheet('Progress',['timestamp','username','level','score','books','answers']).appendRow([new Date(),d.username,d.level,d.score,d.books,d.answers]);return {ok:true};}
  if(d.action==='leaderboard'){
    var ps=ss.getSheetByName('Progress'),us=ss.getSheetByName('Users');if(!ps||ps.getLastRow()<2)return {ok:true,rows:[]};var pv=ps.getDataRange().getValues(),uv=us?us.getDataRange().getValues():[],profiles={};
    for(var i=1;i<uv.length;i++)profiles[String(uv[i][0]).toLowerCase()]={nama:String(uv[i][2]||''),kelas:String(uv[i][3]||'')};
    var best={};for(var r=1;r<pv.length;r++){var un=String(pv[r][1]||'').trim();if(!un)continue;var key=un.toLowerCase(),score=Number(pv[r][3])||0,books=String(pv[r][4]||'').split(',').filter(String).length;if(!best[key]||score>best[key].score)best[key]={username:un,score:score,books:books};else best[key].books=Math.max(best[key].books,books);}
    var rows=Object.keys(best).map(function(k){var x=best[k],p=profiles[k]||{};return {username:x.username,nama:p.nama||x.username,kelas:p.kelas||'-',score:x.score,books:x.books};});rows.sort(function(a,b){return b.score-a.score||b.books-a.books||a.nama.localeCompare(b.nama);});return {ok:true,rows:rows.slice(0,50)};
  }
  return {ok:false,error:'Action tidak dikenal.'};
}
function hashPassword(password){var bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,password,Utilities.Charset.UTF_8);return bytes.map(function(b){var v=(b<0?b+256:b).toString(16);return v.length===1?'0'+v:v;}).join('');}
