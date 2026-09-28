import { COMPANY } from '../data/company.js';

// ปุ่ม "เพิ่มเพื่อน" LINE Official Account ของ SafeAct · เปิดในแท็บใหม่
export default function LineAddFriend() {
  return (
    <a className="line-add" href={COMPANY.line.url} target="_blank" rel="noopener noreferrer">
      <img src={COMPANY.line.button} alt="เพิ่มเพื่อน LINE Official Account ของ SafeAct" height="42" loading="lazy" decoding="async" />
    </a>
  );
}
