import { COMPANY } from '../data/company.js';
import { APP_PLAN } from '../data/plans.js';

// ป้ายร้านแอป = ไฟล์ทางการของ Apple (ห้ามแก้รูปทรงหรือสี)
// มีลิงก์ใน company.js = กดได้ (เปิดแท็บใหม่) · ยังไม่มีลิงก์ = แสดงเป็นภาพ
// แอปมีบน iPhone อย่างเดียว (ระบบสมาชิกตัด Android ออก 21 พ.ย. 2569) — ป้าย Google Play เอาออก (ไฟล์ badge-google-play.webp เก็บไว้ ถ้ามีแอป Android ค่อยเพิ่มกลับ)
// 26 พ.ย. 2569 เจ้าของ: แอปมือถือใช้ได้เฉพาะแผน Business ขึ้นไป → ทุกจุดที่มีป้ายต้องมีคำบอกต่อท้าย (.stores__note)
//   ไม่ให้ลูกค้าแผน Free / Basic ดาวน์โหลดไปแล้วใช้ไม่ได้ · แผนอ่านจากตารางเปรียบเทียบ (APP_PLAN) ห้ามพิมพ์ตายตัว
const STORES = [
  ['App Store', 'appStoreUrl', 'badge-app-store.svg', 120, 40],
];

export default function StoreBadges({ className = '' }) {
  return (
    <ul className={`stores ${className}`} aria-label={`ดาวน์โหลดแอป ${COMPANY.appName}`}>
      {STORES.map(([name, key, file, w, h]) => {
        const img = <img src={`/assets/${file}`} width={w} height={h} alt={`ดาวน์โหลด ${COMPANY.appName} บน ${name}`} loading="lazy" decoding="async" />;
        return <li key={name}>{COMPANY[key] ? <a href={COMPANY[key]} rel="noopener" target="_blank">{img}</a> : img}</li>;
      })}
      <li className="stores__note">สำหรับลูกค้าองค์กรแผน {APP_PLAN}</li>
    </ul>
  );
}
