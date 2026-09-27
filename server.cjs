// เซิร์ฟเวอร์ของเว็บ SafeAct — เสิร์ฟไฟล์ที่ build แล้วใน dist/ (ใช้ทั้งบนเครื่องและบนเว็บจริงหลัง Cloudflare)
// ใช้: npm start (build + เปิด http://localhost:8125)
//
// หน้าที่ด้าน SEO ของไฟล์นี้
//   • โดเมนเดียว: www.safeact.com → safeact.com (301) และ http → https (301)
//   • /pricing → /pricing/ (301) ให้ตรงกับ canonical
//   • ส่งต่อ URL ของเว็บเดิมตาม dist/_redirects (มาจาก public/_redirects)
//   • URL ที่ไม่มีอยู่ตอบสถานะ 404 ด้วย 404.html
//   • แคช: /build/* ถาวร (ชื่อไฟล์มี hash) · /assets/* 30 วัน · HTML ตรวจกับเซิร์ฟเวอร์ทุกครั้ง
const http=require('http'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'dist'), PORT=Number(process.env.PORT)||8125;
const TYPES={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.json':'application/json','.xml':'application/xml; charset=utf-8','.txt':'text/plain; charset=utf-8','.webmanifest':'application/manifest+json','.webp':'image/webp','.mp4':'video/mp4','.ico':'image/x-icon','.woff2':'font/woff2'};

const read=(f)=>{try{return fs.readFileSync(path.join(ROOT,f),'utf8');}catch{return '';}};
// โดเมนหลัก: อ่านจาก robots.txt ที่ build สร้างจาก SITE_URL (src/data/company.js) — ไม่เขียนโดเมนซ้ำที่นี่
const SITE=(/^Sitemap:\s*(https?:\/\/[^\/\s]+)/mi.exec(read('robots.txt'))||[])[1]||'';
const HOST=SITE.replace(/^https?:\/\//,'');
// ตารางส่งต่อ: บรรทัดละ "ต้นทาง ปลายทาง สถานะ" (รูปแบบเดียวกับ Cloudflare Pages)
const REDIRECTS=new Map(read('_redirects').split('\n').map((l)=>l.trim().split(/\s+/))
  .filter((c)=>c.length>=2&&c[0].startsWith('/')).map(([from,to,code])=>[from,[to,Number(code)||301]]));
const SECURE={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'};
const moved=(res,to,code=301)=>{res.writeHead(code,{Location:to,'Cache-Control':'no-cache'});res.end();};

http.createServer((req,res)=>{
  let p;
  try{p=decodeURIComponent(req.url.split('?')[0]);}catch{res.writeHead(400);return res.end('400');}
  const host=String(req.headers.host||'').toLowerCase().replace(/:\d+$/,'');
  const live=!!HOST&&(host===HOST||host==='www.'+HOST);   // คำขอจากโดเมนจริง (ไม่ใช่ localhost)
  // Cloudflare บอกโปรโตคอลที่ผู้ชมใช้ผ่านส่วนหัว CF-Visitor: {"scheme":"http"|"https"}
  const viaHttp=/"scheme"\s*:\s*"http"/.test(String(req.headers['cf-visitor']||''));
  if(live&&(host!==HOST||viaHttp))return moved(res,SITE+req.url);

  const old=REDIRECTS.get(p);
  if(old)return moved(res,old[0],old[1]);

  const notFound=()=>fs.readFile(path.join(ROOT,'404.html'),(e,d)=>{
    res.writeHead(404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store',...SECURE});res.end(e?'404 '+p:d);
  });
  if(p.startsWith('/_'))return notFound();   // _headers / _redirects เป็นไฟล์ตั้งค่า ไม่ใช่หน้าเว็บ

  if(p.endsWith('/'))p+='index.html';
  const f=path.join(ROOT,path.normalize(p).replace(/^(\.\.[\/\\])+/,''));
  // /pricing → /pricing/ (ให้ตรงกับ canonical ของเว็บจริง)
  if(!path.extname(f)&&fs.existsSync(path.join(f,'index.html')))return moved(res,p+'/'+(req.url.includes('?')?req.url.slice(req.url.indexOf('?')):''));

  fs.stat(f,(e,st)=>{
    if(e||!st.isFile())return notFound();
    // บนเครื่อง (localhost) ไม่แคช จะได้เห็นไฟล์ที่เพิ่งแก้ทันที
    const cache=!live?'no-store':p.startsWith('/build/')?'public, max-age=31536000, immutable':p.startsWith('/assets/')?'public, max-age=2592000':'no-cache';
    const etag='"'+st.size.toString(16)+'-'+Math.floor(st.mtimeMs).toString(16)+'"';
    const h={'Content-Type':TYPES[path.extname(f)]||'application/octet-stream','Cache-Control':cache,'Accept-Ranges':'bytes',ETag:etag,...SECURE};
    if(p.startsWith('/assets/fonts/'))h['Access-Control-Allow-Origin']='*';
    if(live&&!req.headers.range&&req.headers['if-none-match']===etag){res.writeHead(304,{'Cache-Control':cache,ETag:etag});return res.end();}
    fs.readFile(f,(e2,d)=>{
      if(e2)return notFound();
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
  });
}).listen(PORT,()=>console.log('serving '+ROOT+' on http://localhost:'+PORT+(SITE?' · โดเมนหลัก '+SITE+' · ส่งต่อ '+REDIRECTS.size+' รายการ':'')));
