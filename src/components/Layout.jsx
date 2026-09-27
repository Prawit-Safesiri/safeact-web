import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { COMPANY, fullAddress, appLink } from '../data/company.js';
import { metaFor } from '../seo.js';
import LocalNav from './LocalNav.jsx';

const NAV = [
  ['/features/', 'ฟีเจอร์'],
  ['/pricing/', 'แผนและราคา'],
  ['/about/', 'เกี่ยวกับเรา'],
  ['/contact/', 'ติดต่อเรา'],
  ['/refund-policy/', 'นโยบายคืนเงิน'],
];

const CRUMB = {
  '/features/': 'ฟีเจอร์',
  '/pricing/': 'แผนและราคา',
  '/refund-policy/': 'นโยบายการยกเลิกและการคืนเงิน',
  '/terms/': 'ข้อกำหนดการใช้บริการ',
  '/privacy/': 'นโยบายความเป็นส่วนตัว',
  '/about/': 'เกี่ยวกับเรา',
  '/contact/': 'ติดต่อเรา',
};

// อัปเดต head ตอนเปลี่ยนหน้าในเบราว์เซอร์ (ตอน build ทุกหน้าถูก prerender head ไว้แล้ว)
function useHead(pathname) {
  useEffect(() => {
    const m = metaFor(pathname);
    document.title = m.title;
    const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
    const url = `${location.origin}${pathname}`;
    set('meta[name="description"]', 'content', m.description);
    set('meta[property="og:title"]', 'content', m.title);
    set('meta[property="og:description"]', 'content', m.description);
    set('meta[name="twitter:title"]', 'content', m.title);
    set('meta[name="twitter:description"]', 'content', m.description);
    set('link[rel="canonical"]', 'href', `https://www.safeact.com${pathname}`);
    set('meta[property="og:url"]', 'content', url);
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
          {NAV.map(([to, label]) => <li key={to}><NavLink to={to}>{label}</NavLink></li>)}
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
  const here = CRUMB[pathname];
  const year = 2026;
  return (
    <footer className="gf" aria-labelledby="gf-title">
      <h2 id="gf-title" className="visually-hidden">ส่วนท้ายเว็บไซต์</h2>
      <div className="gf__inner">
        <div className="gf__notes">
          <ol>
            <li>ราคาทั้งหมดเป็นเงินบาท ยังไม่รวมภาษีมูลค่าเพิ่ม 7% ยอดชำระคำนวณจากราคาแผนในระบบ ณ เวลาทำรายการ</li>
            <li>แผน Free ทดลองใช้ได้ 30 วัน อาจต้องยืนยันบัตรโดยไม่มีการเรียกเก็บเงิน เมื่อครบกำหนดบัญชีจะถูกจำกัดการใช้งานจนกว่าจะเลือกแผนแบบชำระเงิน</li>
            <li>ขอคืนเงินเต็มจำนวนได้ภายใน 14 วันนับจากวันชำระเงินครั้งแรก ตามเงื่อนไขใน <Link to="/refund-policy/">นโยบายการยกเลิกและการคืนเงิน</Link></li>
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
              <li><Link to="/features/#laws">อัปเดตกฎหมาย</Link></li>
              <li><Link to="/features/#workflow">ระบบงาน จป.</Link></li>
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
            </ul>
          </div>
        </nav>

        <address className="gf__company" style={{ fontStyle: 'normal' }}>
          <span><strong>{COMPANY.nameTh}</strong> ({COMPANY.nameEn}) · เลขประจำตัวผู้เสียภาษี {COMPANY.taxId}</span>
          <span>{fullAddress()}</span>
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
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหาหลัก</a>
      <GlobalNav />
      <LocalNav />
      <Outlet />
      <Footer pathname={pathname} />
    </>
  );
}
