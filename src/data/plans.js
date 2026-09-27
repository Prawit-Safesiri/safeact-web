// แผนบริการ — คัดลอกตรงจากระบบสมาชิกจริง
// safeact-connect-hub/src/lib/plans.ts (ชุดเดียวกับตาราง plans ใน Supabase ที่แอป iOS ดึงไปแสดง)
// ราคาเป็นเงินบาท ยังไม่รวม VAT 7% (ตามข้อกำหนดการใช้งาน ข้อ 3 และ CheckoutView.swift)
export const VAT_RATE = 0.07;

export const PLANS = [
  {
    key: 'free',
    name: 'Free',
    subtitle: 'ทดลองใช้งาน 30 วัน',
    monthly: 0,
    yearly: 0,
    features: ['อัปเดตกฎหมาย', 'รายการกฎหมายที่ติดตาม', 'ใช้งานเมนูพื้นฐาน', 'หลังครบ 30 วันบัญชีจะถูกระงับ'],
    badge: 'ทดลองฟรี',
    cta: 'เริ่มทดลองฟรี',
  },
  {
    key: 'student',
    name: 'Student',
    subtitle: 'เฉพาะนิสิต และ นักศึกษา',
    monthly: 100,
    yearly: 1000,
    features: ['อัปเดตกฎหมาย', 'คลังเอกสารความปลอดภัย', 'ส่วนลดสินค้าและบริการ', 'โมบายแอพแจ้งเตือน'],
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'basic',
    name: 'Basic',
    subtitle: 'สำหรับบุคคลและทีมเล็ก',
    monthly: 250,
    yearly: 2500,
    features: ['ทุกอย่างใน Student', 'ระบบบันทึกการฝึกอบรม', 'ระบบจัดการผู้รับเหมา', 'แจ้งเตือน'],
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'business',
    name: 'Business',
    subtitle: 'สำหรับ SME และ โรงงาน',
    monthly: 400,
    yearly: 4000,
    features: ['ทุกอย่างใน Basic', 'Dashboard Compliance', 'รองรับผู้ใช้งานหลายคน', 'Workflow Audit', 'AI ผู้ช่วยกฎหมาย'],
    featured: true,
    badge: 'ได้รับความนิยม',
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    subtitle: 'สำหรับองค์กรหลายสาขา',
    monthly: null,
    yearly: null,
    features: ['ทุกอย่างใน Business', 'รองรับหลายสาขา', 'เชื่อมต่อ HR / LMS', 'ที่ปรึกษาเฉพาะองค์กร', 'SLA การตอบสนอง'],
    cta: 'ติดต่อทีมขาย',
  },
];

// ตารางเปรียบเทียบ: แต่ละแถวระบุแผนแรกที่ได้สิทธิ์ (สิทธิ์สะสมขึ้นไปตามลำดับแผน)
const ORDER = PLANS.map((p) => p.key);
export const COMPARE = [
  { group: 'กฎหมาย', rows: [
    ['อัปเดตกฎหมาย', 'free'],
    ['รายการกฎหมายที่ติดตาม', 'free'],
    ['โมบายแอพแจ้งเตือน', 'student'],
    ['ระบบแจ้งเตือน', 'basic'],
    ['AI ผู้ช่วยกฎหมาย', 'business'],
  ]},
  { group: 'เอกสารและสิทธิพิเศษ', rows: [
    ['คลังเอกสารความปลอดภัย', 'student'],
    ['ส่วนลดสินค้าและบริการ', 'student'],
  ]},
  { group: 'ระบบงานความปลอดภัย', rows: [
    ['ระบบบันทึกการฝึกอบรม', 'basic'],
    ['ระบบจัดการผู้รับเหมา', 'basic'],
    ['Dashboard Compliance', 'business'],
    ['Workflow Audit', 'business'],
  ]},
  { group: 'องค์กร', rows: [
    ['รองรับผู้ใช้งานหลายคน', 'business'],
    ['รองรับหลายสาขา', 'enterprise'],
    ['เชื่อมต่อ HR / LMS', 'enterprise'],
    ['ที่ปรึกษาเฉพาะองค์กร', 'enterprise'],
    ['SLA การตอบสนอง', 'enterprise'],
  ]},
];
export const hasFeature = (planKey, fromKey) => ORDER.indexOf(planKey) >= ORDER.indexOf(fromKey);

const fmt = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 2, minimumFractionDigits: 0 });
export const baht = (n) => `฿${fmt.format(n)}`;
export const withVat = (n) => Math.round(n * (1 + VAT_RATE) * 100) / 100;
export const yearlySaving = (p) => (p.monthly && p.yearly ? p.monthly * 12 - p.yearly : 0);
