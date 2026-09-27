import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

const root = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
// hydrate เฉพาะเมื่อ HTML ที่ prerender ตรงกับ URL จริง (หรือเป็นหน้า 404 ที่โฮสต์เสิร์ฟให้ทุก URL ที่ไม่มี)
// กรณีอื่น เช่น โฮสต์ fallback ไป index.html → render ใหม่ทั้งหมด เพื่อไม่ให้ hydration mismatch
const ssr = root.dataset.ssr;
const here = location.pathname.endsWith('/') ? location.pathname : `${location.pathname}/`;
if (ssr && (ssr === here || ssr === '/404/')) hydrateRoot(root, app);
else { root.textContent = ''; createRoot(root).render(app); }
