import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { ROUTES, normPath } from './seo.js';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

// VITE_PREVIEW: บิลด์ไฟล์เดียวสำหรับเปิดดูตัวอย่าง (ไม่มีเซิร์ฟเวอร์) → ใช้ MemoryRouter แทน URL จริง
// /pricing หรือ /pricing/index.html → /pricing/ ก่อนเริ่มแอป: URL ที่เห็น, เมนู และ canonical จะตรงกับ HTML ที่ prerender ไว้
if (!import.meta.env.VITE_PREVIEW) {
  const n = normPath(location.pathname);
  if (n !== location.pathname && ROUTES[n]) history.replaceState(history.state, '', n + location.search + location.hash);
}
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;
const root = document.getElementById('root');
const app = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
// hydrate เฉพาะเมื่อ HTML ที่ prerender ตรงกับ URL จริง (หรือเป็นหน้า 404 ที่โฮสต์เสิร์ฟให้ทุก URL ที่ไม่มี)
// กรณีอื่น เช่น โฮสต์ fallback ไป index.html → render ใหม่ทั้งหมด เพื่อไม่ให้ hydration mismatch
const ssr = root.dataset.ssr;
const here = normPath(location.pathname);
if (ssr && (ssr === here || ssr === '/404/')) hydrateRoot(root, app);
else { root.textContent = ''; createRoot(root).render(app); }
