import { COMPANY } from '../data/company.js';

// ป้ายร้านแอป = ไฟล์ทางการของ Apple และ Google (ห้ามแก้รูปทรงหรือสี)
// มีลิงก์ใน company.js = กดได้ (เปิดแท็บใหม่) · ยังไม่มีลิงก์ = แสดงเป็นภาพ
const STORES = [
  ['App Store', 'appStoreUrl', 'badge-app-store.svg', 120, 40],
  ['Google Play', 'playStoreUrl', 'badge-google-play.webp', 564, 168],
];

export default function StoreBadges({ className = '' }) {
  return (
    <ul className={`stores ${className}`} aria-label={`ดาวน์โหลดแอป ${COMPANY.appName}`}>
      {STORES.map(([name, key, file, w, h]) => {
        const img = <img src={`/assets/${file}`} width={w} height={h} alt={`ดาวน์โหลด ${COMPANY.appName} บน ${name}`} loading="lazy" decoding="async" />;
        return <li key={name}>{COMPANY[key] ? <a href={COMPANY[key]} rel="noopener" target="_blank">{img}</a> : img}</li>;
      })}
    </ul>
  );
}
