// ข้อมูลบริการ — แหล่งเดียวของข้อความที่ต้อง "แสดงบนหน้าเว็บ" และ "ประกาศใน JSON-LD" ให้ตรงกัน
// (Google กำหนดให้ structured data ตรงกับเนื้อหาที่ผู้ใช้มองเห็น)
import { LAWS } from './laws.js';

// หมวดในคลังกฎหมาย
export const LAW_CATEGORIES = [
  'ความปลอดภัยในการทำงาน', 'อาชีวอนามัย', 'สิ่งแวดล้อม', 'วิศวกรรม', 'จราจรและขนส่ง', 'กฎหมายท้องถิ่น',
];

// จำนวนกฎหมายในคลัง — มาจาก src/data/laws.json ที่ซิงก์จากระบบสมาชิก (npm run sync:laws)
// ห้ามพิมพ์ตัวเลขเอง · ใช้ในโมชั่นหน้าแรก ข้อความหน้าแรก/ฟีเจอร์ กล่องสถิติ คำถามที่พบบ่อย และ llms.txt
export const LAW_LIBRARY = { count: LAWS.total, asOfIso: LAWS.syncedIso, asOfTh: LAWS.syncedTh };
// ตัวเลขปัดลงหลักร้อยสำหรับข้อความ "กว่า 1,400 ฉบับ"
export const lawCountRounded = () => (Math.floor(LAW_LIBRARY.count / 100) * 100).toLocaleString('en-US');

export const SERVICE = {
  name: 'SafeAct',
  // ประเภทบริการ (ใช้เป็น serviceType และในคำอธิบาย)
  type: 'แพลตฟอร์มออนไลน์แบบสมาชิกสำหรับติดตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน',
  audience: 'เจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.)',
};

// ฟีเจอร์ที่มีคำอธิบายอยู่บนหน้า /features/ — id คือ anchor บนหน้านั้น · shot คือชื่อไฟล์ใน /assets/features/
// ⚠ อย่าเพิ่มฟีเจอร์ที่ยังไม่มีคำอธิบายบนหน้าเว็บ
export const FEATURES = [
  { id: 'laws', name: 'อัปเดตกฎหมาย', nav: 'ติดตามและแจ้งเตือนกฎหมาย', shot: 'laws' },
  { id: 'notifications', name: 'กฎหมายที่ติดตามและการแจ้งเตือน', shot: 'notify' },
  { id: 'action-plan', name: 'Action Plan รายปี', nav: 'Action Plan รายปี', shot: 'actionplan' },
  { id: 'hearing', name: 'โปรแกรมอนุรักษ์การได้ยิน', nav: 'โปรแกรมอนุรักษ์การได้ยิน', shot: 'hearing' },
  { id: 'documents', name: 'คลังเอกสารและสไลด์ความปลอดภัย', nav: 'คลังเอกสารและสไลด์', shot: 'documents' },
  { id: 'ai', name: 'AI ผู้ช่วยกฎหมาย', nav: 'AI ผู้ช่วยกฎหมาย' },
];
// ⚠ ตัดออก 21 พ.ย. 2569 (ไม่มีระบบจริงในเว็บสมาชิกและแอป iOS): Training Matrix, บันทึกงานตรวจรับรอง, ระบบผู้รับเหมา,
//   Dashboard Compliance, Workflow Audit — ภาพ training/inspection/dashboard ใน public/assets/features/ ไม่ได้ใช้แล้ว
