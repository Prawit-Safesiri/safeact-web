import { Link, NavLink } from 'react-router-dom';
import { checkoutLink } from '../data/company.js';

// Local nav แบบหน้า product ของ Apple: โลโก้โล่ซ้าย · ลิงก์ "อัปเดตกฎหมาย" + ปุ่ม pill ขวา · ติดขอบบนเมื่อเลื่อน
// เมนูย่อยเดิม (ภาพรวม / ฟีเจอร์ / แผนและราคา / ติดต่อทีมขาย) เจ้าของสั่งลบ 29 ก.ย. 2569 — แทนด้วยลิงก์เดียว แสดงทุกขนาดจอ
export default function LocalNav() {
  return (
    <nav className="ln" aria-label="เมนูบริการ SafeAct">
      <div className="container ln__inner">
        <Link className="ln__title" to="/" reloadDocument><img className="ln__mark" src="/assets/safeact-mark.svg" alt="SafeAct หน้าแรก" width="832" height="928" /></Link>
        <div className="ln__right">
          <NavLink className="ln__link" to="/law-updates/" end caseSensitive>อัปเดตกฎหมาย</NavLink>
          <a className="btn btn--sm" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>
        </div>
      </div>
    </nav>
  );
}
