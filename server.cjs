// เซิร์ฟเวอร์ local แบบเดียวกับ server.js ของ safesiri-new — เสิร์ฟไฟล์ที่ build แล้วใน dist/
// ใช้: npm start (build + เปิด http://localhost:8125)
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'dist'), PORT=Number(process.env.PORT)||8125;
const TYPES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{
  let p=decodeURIComponent(req.url.split('?')[0]);
  if(p.endsWith('/'))p+='index.html';
  let f=path.join(ROOT,path.normalize(p).replace(/^(\.\.[\/\\])+/,''));
  // /pricing → /pricing/ (ให้ตรงกับ canonical ของเว็บจริง)
  if(!path.extname(f)&&fs.existsSync(path.join(f,'index.html'))){res.writeHead(301,{Location:p+'/'});return res.end();}
  fs.readFile(f,(e,d)=>{
    if(e){
      return fs.readFile(path.join(ROOT,'404.html'),(e2,d2)=>{
        res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(e2?'404 '+p:d2);
      });
    }
    res.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(d);
  });
}).listen(PORT,()=>console.log('serving '+ROOT+' on http://localhost:'+PORT));
