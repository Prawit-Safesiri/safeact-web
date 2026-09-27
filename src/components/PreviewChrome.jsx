import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// แถบ URL จำลองสำหรับบิลด์ VITE_PREVIEW เท่านั้น (หน้าตัวอย่างไม่มีช่อง URL ของเบราว์เซอร์จริง)
// ย้อนกลับ/ไปต่อ/โหลดใหม่ และพิมพ์ path แล้วกด Enter เพื่อไปหน้านั้น
const HOST = 'www.safeact.com';

export default function PreviewChrome() {
  const loc = useLocation();
  const nav = useNavigate();
  const current = `${HOST}${loc.pathname}${loc.hash}`;
  const [value, setValue] = useState(current);
  useEffect(() => setValue(current), [current]);

  const go = (e) => {
    e.preventDefault();
    let p = value.trim().replace(/^https?:\/\//, '').replace(HOST, '');
    if (!p.startsWith('/')) p = `/${p}`;
    const [path, hash] = p.split('#');
    nav(`${path.endsWith('/') ? path : `${path}/`}${hash ? `#${hash}` : ''}`);
  };

  return (
    <div className="pv-bar" role="navigation" aria-label="แถบที่อยู่ (โหมดตัวอย่าง)">
      <button type="button" onClick={() => nav(-1)} aria-label="ย้อนกลับ">
        <svg viewBox="0 0 16 16"><path d="M10 3L5 8l5 5" /></svg>
      </button>
      <button type="button" onClick={() => nav(1)} aria-label="ไปต่อ">
        <svg viewBox="0 0 16 16"><path d="M6 3l5 5-5 5" /></svg>
      </button>
      <button type="button" onClick={() => { nav(loc.pathname + loc.hash, { replace: true }); window.scrollTo(0, 0); }} aria-label="โหลดใหม่">
        <svg viewBox="0 0 16 16"><path d="M13 8a5 5 0 1 1-1.5-3.5M13 2.5V5h-2.5" /></svg>
      </button>
      <form onSubmit={go}>
        <label htmlFor="pv-url" className="visually-hidden">ที่อยู่หน้าเว็บ</label>
        <input id="pv-url" value={value} onChange={(e) => setValue(e.target.value)} spellCheck={false} autoComplete="off" />
      </form>
    </div>
  );
}
