import { Link, NavLink } from 'react-router-dom';
import { checkoutLink } from '../data/company.js';

// Local nav แบบหน้า product ของ Apple: ชื่อบริการซ้าย · เมนูย่อย + ปุ่ม pill ขวา · ติดขอบบนเมื่อเลื่อน
const ITEMS = [
  ['/', 'ภาพรวม'],
  ['/features/', 'ฟีเจอร์'],
  ['/pricing/', 'แผนและราคา'],
  ['/contact/', 'ติดต่อทีมขาย'],
];

export default function LocalNav() {
  return (
    <nav className="ln" aria-label="เมนูบริการ SafeAct">
      <div className="container ln__inner">
        <Link className="ln__title" to="/"><img className="ln__mark" src="/assets/safeact-mark.svg" alt="SafeAct หน้าแรก" width="832" height="928" /></Link>
        <div className="ln__right">
          <ul className="ln__menu">
            {ITEMS.map(([to, label]) => (
              <li key={to}><NavLink to={to} end>{label}</NavLink></li>
            ))}
          </ul>
          <a className="btn btn--sm" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>
        </div>
      </div>
    </nav>
  );
}
