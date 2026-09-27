// เซิร์ฟเวอร์ local แบบเดียวกับ server.js ของ safesiri-new — เสิร์ฟไฟล์ที่ build แล้วใน dist/
// ใช้: npm start (build + เปิด http://localhost:8125)
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'dist'), PORT=Number(process.env.PORT)||8125;
const TYPES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json','.webp':'image/webp','.mp4':'video/mp4','.ico':'image/x-icon','.woff2':'font/woff2'};
http.createServer((req,res)=>{
  let p;
  try{p=decodeURIComponent(req.url.split('?')[0]);}catch{res.writeHead(400);return res.end('400');}
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
    const h={'Content-Type':TYPES[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store','Accept-Ranges':'bytes'};
    // Safari เล่นวิดีโอได้เฉพาะเมื่อเซิร์ฟเวอร์ตอบ Range เป็น 206
    const m=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range||'');
    if(m&&(m[1]||m[2])){
      const s=m[1]?Number(m[1]):Math.max(0,d.length-Number(m[2]));
      const t=m[1]&&m[2]?Math.min(Number(m[2]),d.length-1):d.length-1;
      if(s>t){res.writeHead(416,{'Content-Range':'bytes */'+d.length});return res.end();}
      res.writeHead(206,{...h,'Content-Range':'bytes '+s+'-'+t+'/'+d.length,'Content-Length':t-s+1});
      return res.end(d.subarray(s,t+1));
    }
    res.writeHead(200,{...h,'Content-Length':d.length});
    res.end(d);
  });
}).listen(PORT,()=>console.log('serving '+ROOT+' on http://localhost:'+PORT));
