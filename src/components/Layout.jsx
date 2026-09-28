import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { COMPANY, fullAddress, appLink } from '../data/company.js';
import { headModel, headEntries, HEAD_KEYS, LD_ID, ROUTES, metaFor, normPath } from '../seo.js';
import NotFound from '../pages/NotFound.jsx';
import LocalNav from './LocalNav.jsx';
import LineAddFriend from './LineAddFriend.jsx';
import { initStaggered } from '../staggered.js';

const NAV = [
  ['/features/', 'ฟีเจอร์'],
  ['/pricing/', 'แผนและราคา'],
  ['/about/', 'เกี่ยวกับเรา'],
  ['/contact/', 'ติดต่อเรา'],
  ['/refund-policy/', 'นโยบายคืนเงิน'],
];

// อัปเดต head ตอนเปลี่ยนหน้าในเบราว์เซอร์ ด้วยข้อมูลชุดเดียวกับที่ prerender ใช้ (headModel ใน src/seo.js)
// • โหลดหน้าโดยตรง: ไม่แตะ head ที่ prerender ไว้เลย (Google แนะนำไม่ให้ JS เปลี่ยน canonical จากค่าใน HTML)
// • URL ที่ไม่มีอยู่: ใส่ noindex และลบ canonical / Open Graph / JSON-LD (กันกรณีโฮสต์ตอบ 200 แทน 404)
function useHead(pathname) {
  const first = useRef(true);
  useEffect(() => {
    const prerendered = first.current && document.getElementById('root')?.dataset.ssr === normPath(pathname);
    first.current = false;
    if (prerendered) return;

    const h = headModel(pathname);
    document.title = h.title;
    const head = document.head;
    const find = (tag, attr, key) => head.querySelector(`${tag}[${attr}="${key}"]`);
    const entries = headEntries(h);
    const wanted = new Set(entries.map(([tag, attr, key]) => `${tag}|${attr}|${key}`));
    // ลบแท็กที่หน้านี้ไม่ควรมี
    HEAD_KEYS.forEach(([tag, attr, key]) => { if (!wanted.has(`${tag}|${attr}|${key}`)) find(tag, attr, key)?.remove(); });
    // ตั้งค่าแท็กที่ต้องมี (สร้างใหม่ถ้ายังไม่มี เช่น เข้ามาทางหน้า 404 แล้วกดไปหน้าอื่น)
    entries.forEach(([tag, attr, key, val]) => {
      let el = find(tag, attr, key);
      if (!el) { el = document.createElement(tag); el.setAttribute(attr, key); head.appendChild(el); }
      el.setAttribute(tag === 'link' ? 'href' : 'content', val);
    });
    let ld = document.getElementById(LD_ID);
    if (h.jsonLd) {
      if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; ld.id = LD_ID; head.appendChild(ld); }
      ld.textContent = h.jsonLd;
    } else ld?.remove();
  }, [pathname]);
}

function GlobalNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [open]);

  return (
    <header className="gn" data-open={open}>
      <nav className="gn__inner" aria-label="เมนูหลัก">
        <Link className="gn__brand" to="/" aria-label="SafeAct หน้าแรก">
          <img src="/assets/safeact-logo.png" alt="SafeAct" width="1000" height="161" />
        </Link>
        <ul className="gn__links">
          {NAV.map(([to, label]) => <li key={to}><NavLink to={to} end caseSensitive>{label}</NavLink></li>)}
        </ul>
        <div className="gn__actions">
          <a className="gn__signin" href={appLink('/auth')}>เข้าสู่ระบบ</a>
          <button className="gn__burger" type="button" aria-expanded={open} aria-controls="gn-sheet"
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'} onClick={() => setOpen((o) => !o)}>
            <svg viewBox="0 0 18 18" aria-hidden="true">
              <line className="l1" x1="2" y1="5.5" x2="16" y2="5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <line className="l2" x1="2" y1="12.5" x2="16" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>
      <div className="gn__sheet" id="gn-sheet" aria-hidden={!open}>
        <ul>
          <li><Link to="/" tabIndex={open ? 0 : -1}>หน้าแรก</Link></li>
          {NAV.map(([to, label]) => <li key={to}><Link to={to} tabIndex={open ? 0 : -1}>{label}</Link></li>)}
        </ul>
        <ul className="gn__sheet-sub">
          <li><a href={appLink('/auth')} tabIndex={open ? 0 : -1}>เข้าสู่ระบบสมาชิก</a></li>
          <li><a href={`tel:${COMPANY.phoneE164}`} tabIndex={open ? 0 : -1}>โทร {COMPANY.phone}</a></li>
        </ul>
      </div>
    </header>
  );
}

function Footer({ pathname }) {
  const here = metaFor(pathname).crumb;
  const year = 2026;
  return (
    <footer className="gf" aria-labelledby="gf-title">
      <h2 id="gf-title" className="visually-hidden">ส่วนท้ายเว็บไซต์</h2>
      <div className="gf__inner">
        <div className="gf__notes">
          <ol>
            <li>ราคาทั้งหมดเป็นเงินบาท ยังไม่รวมภาษีมูลค่าเพิ่ม 7% ยอดชำระคำนวณจากราคาแผนในระบบ ณ เวลาทำรายการ</li>
            <li>แผน Free ทดลองใช้ได้ 30 วัน อาจต้องยืนยันบัตรโดยไม่มีการเรียกเก็บเงิน เมื่อครบกำหนดบัญชีจะถูกจำกัดการใช้งานจนกว่าจะเลือกแผนแบบชำระเงิน</li>
            <li>ขอคืนเงินเต็มจำนวนได้ภายใน 7 วันนับจากวันชำระเงินครั้งแรก ตามเงื่อนไขใน <Link to="/refund-policy/">นโยบายการยกเลิกและการคืนเงิน</Link></li>
            <li>ข้อมูลกฎหมายบน SafeAct เป็นสรุปเพื่อความสะดวก โปรดตรวจสอบกับแหล่งต้นทางอย่างเป็นทางการที่แนบไว้ก่อนนำไปใช้อ้างอิงทางกฎหมาย</li>
          </ol>
        </div>

        <nav className="gf__crumbs" aria-label="เส้นทางหน้า">
          <ol className="crumbs">
            <li><Link to="/" aria-label="หน้าแรก SafeAct"><img src="/assets/safeact-logo.png" alt="SafeAct" width="1000" height="161" /></Link></li>
            {here && <li aria-current="page">{here}</li>}
          </ol>
        </nav>

        <nav className="gf__dir" aria-label="แผนผังเว็บไซต์">
          <div>
            <h3>บริการ</h3>
            <ul>
              <li><Link to="/features/">ฟีเจอร์ทั้งหมด</Link></li>
              <li><Link to="/features/#laws">อัปเดตกฎหมายความปลอดภัย</Link></li>
              <li><Link to="/features/#action-plan">Action Plan รายปี</Link></li>
              <li><Link to="/features/#training">Training Matrix</Link></li>
              <li><Link to="/features/#workflow">ระบบบริหารงานความปลอดภัย</Link></li>
              <li><Link to="/features/#ai">AI ผู้ช่วยกฎหมาย</Link></li>
            </ul>
          </div>
          <div>
            <h3>แผนและราคา</h3>
            <ul>
              <li><Link to="/pricing/">เปรียบเทียบแผน</Link></li>
              <li><a href={appLink('/auth/signup-free')}>ทดลองใช้ฟรี 30 วัน</a></li>
              <li><Link to="/contact/">ขอใบเสนอราคาองค์กร</Link></li>
              <li><a href={appLink('/auth')}>เข้าสู่ระบบสมาชิก</a></li>
            </ul>
          </div>
          <div>
            <h3>นโยบาย</h3>
            <ul>
              <li><Link to="/refund-policy/">การยกเลิกและการคืนเงิน</Link></li>
              <li><Link to="/terms/">ข้อกำหนดการใช้บริการ</Link></li>
              <li><Link to="/privacy/">ความเป็นส่วนตัว (PDPA)</Link></li>
            </ul>
          </div>
          <div>
            <h3>บริษัท</h3>
            <ul>
              <li><Link to="/about/">เกี่ยวกับเรา</Link></li>
              <li><Link to="/contact/">ติดต่อเรา</Link></li>
              <li><a href={`tel:${COMPANY.phoneE164}`}>{COMPANY.phone}</a></li>
              <li><a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              <li><LineAddFriend /></li>
              {COMPANY.appStoreUrl && <li><a href={COMPANY.appStoreUrl} rel="noopener">แอป {COMPANY.appName} บน App Store</a></li>}
              {COMPANY.sameAs.map((u) => <li key={u}><a href={u} rel="noopener">{new URL(u).host.replace(/^www\./, '')}</a></li>)}
            </ul>
          </div>
        </nav>

        <address className="gf__company" style={{ fontStyle: 'normal' }}>
          <span className="t-lines">{COMPANY.footerLines.map((t, i) => <span key={i}>{i > 0 && ' '}{t}</span>)}</span>{' '}
          <span><strong>{COMPANY.nameTh}</strong> ({COMPANY.nameEn}) · เลขประจำตัวผู้เสียภาษี {COMPANY.taxId}</span>{' '}
          <span>{fullAddress()}</span>{' '}
          <span>โทร <a href={`tel:${COMPANY.phoneE164}`}>{COMPANY.phone}</a> · อีเมล <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></span>
        </address>

        <div className="gf__legal">
          <span>Copyright © {year} {COMPANY.nameTh} สงวนลิขสิทธิ์</span>
          <ul>
            <li><Link to="/privacy/">นโยบายความเป็นส่วนตัว</Link></li>
            <li><Link to="/terms/">ข้อกำหนดการใช้บริการ</Link></li>
            <li><Link to="/refund-policy/">การยกเลิกและการคืนเงิน</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname, hash } = useLocation();
  useHead(pathname);
  // เลื่อนกลับบนสุดเฉพาะตอน "เปลี่ยนหน้า" — ตอนโหลดหน้าครั้งแรกปล่อยให้เบราว์เซอร์คืนตำแหน่งเดิม (reload) หรือเลื่อนไปยังข้อความที่ลิงก์มา
  const last = useRef(pathname + hash);
  useEffect(() => {
    const key = pathname + hash;
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else if (last.current !== key) window.scrollTo(0, 0);
    last.current = key;
  }, [pathname, hash]);
  // กล่องใน section ทยอยเฟดขึ้นตอนเลื่อนถึง แบบ StaggeredFadeIn ของ apple.com
  useEffect(() => initStaggered(), [pathname]);

  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหาหลัก</a>
      <GlobalNav />
      <LocalNav />
      {/* URL ที่ไม่ตรงกับหน้าจริงแบบตรงตัว (เช่น /Pricing/ หรือ /pricing//) แสดงหน้า 404 ให้ตรงกับ head ที่เป็น noindex */}
      {ROUTES[normPath(pathname)] ? <Outlet /> : <NotFound />}
      <Footer pathname={pathname} />
    </>
  );
}
