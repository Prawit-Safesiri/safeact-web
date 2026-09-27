// แผนบริการ — ซิงก์จากตาราง plans ใน Supabase ของระบบสมาชิกจริง (แหล่งข้อมูลที่หน้าราคา/ชำระเงินของแอปใช้ผ่าน usePlans)
// ⚠ safeact-connect-hub/src/lib/plans.ts เป็นแค่ค่าสำรอง (fallback) ไม่ใช่ราคาจริง — ราคาจริงแก้ได้ที่ /admin/plans ในแอป
// ซิงก์ล่าสุด: 27 ก.ย. 2569 · ราคาเป็นเงินบาท ยังไม่รวม VAT 7%
export const VAT_RATE = 0.07;

export const PLANS = [
  {
    key: 'free',
    name: 'Free',
    subtitle: 'ครบ 30 วันบัญชีจะถูกระงับ',
    monthly: 0,
    yearly: 0,
    features: ['อัปเดตกฎหมาย', 'อัปเดตมาตรฐานสากล', 'รายการกฎหมายที่ติดตาม', 'ใช้งานเมนูพื้นฐาน'],
    badge: 'ทดลองฟรี',
    cta: 'เริ่มทดลองฟรี',
  },
  {
    key: 'student',
    name: 'Student',
    subtitle: 'เฉพาะนิสิต และ นักศึกษา',
    monthly: 200,
    yearly: 1900,
    features: ['อัปเดตกฎหมาย', 'อัปเดตมาตรฐานสากล', 'คลังดาวน์โหลดเอกสาร', 'Mobile app แจ้งเตือน'],
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'basic',
    name: 'Basic',
    subtitle: 'สำหรับบุคคลและทีมเล็ก',
    monthly: 250,
    yearly: 3500,
    features: ['ทุกอย่างใน Student', 'ระบบ Report record', 'ระบบ Action plan', 'การตั้งค่าขั้นสูง', 'ส่วนลด ร้านค้าที่ร่วมรายการบนแพลตฟอร์ม'],
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'business',
    name: 'Business',
    subtitle: 'สำหรับ SME และ โรงงานอุตสาหกรรม',
    monthly: 400,
    yearly: 5500,
    features: ['ทุกอย่างใน Basic', 'Dashboard มืออาชีพ', 'ระบบ สุขภาพพนักงาน', 'ระบบ ผู้รับเหมา', 'ระบบ Work Permit', 'Workflow Audit', 'AI ผู้ช่วยกฎหมาย', 'แจ้งเตือนรองรับแบบทีม'],
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
    features: ['ทุกอย่างใน Business', 'รองรับหลายสาขา', 'รองรับการทำงานแบบทีม', 'เชื่อมต่อ HR / LMS', 'ที่ปรึกษาเฉพาะองค์กร', 'เชื่อมต่อ API', 'ฝ่าย Support ส่วนตัว'],
    cta: 'ติดต่อทีมขาย',
  },
];

// ตารางเปรียบเทียบ: แต่ละแถวระบุแผนแรกที่ได้สิทธิ์ (สิทธิ์สะสมขึ้นไปตามลำดับแผน) — สร้างจาก features ของแต่ละแผนด้านบน
const ORDER = PLANS.map((p) => p.key);
export const COMPARE = [
  { group: 'กฎหมายและมาตรฐาน', rows: [
    ['อัปเดตกฎหมาย', 'free'],
    ['อัปเดตมาตรฐานสากล', 'free'],
    ['รายการกฎหมายที่ติดตาม', 'free'],
    ['Mobile app แจ้งเตือน', 'student'],
    ['AI ผู้ช่วยกฎหมาย', 'business'],
    ['แจ้งเตือนรองรับแบบทีม', 'business'],
  ]},
  { group: 'เอกสารและสิทธิพิเศษ', rows: [
    ['คลังดาวน์โหลดเอกสาร', 'student'],
    ['ส่วนลด ร้านค้าที่ร่วมรายการบนแพลตฟอร์ม', 'basic'],
  ]},
  { group: 'ระบบงานความปลอดภัย', rows: [
    ['ระบบ Report record', 'basic'],
    ['ระบบ Action plan', 'basic'],
    ['การตั้งค่าขั้นสูง', 'basic'],
    ['Dashboard มืออาชีพ', 'business'],
    ['ระบบ สุขภาพพนักงาน', 'business'],
    ['ระบบ ผู้รับเหมา', 'business'],
    ['ระบบ Work Permit', 'business'],
    ['Workflow Audit', 'business'],
  ]},
  { group: 'องค์กร', rows: [
    ['รองรับหลายสาขา', 'enterprise'],
    ['รองรับการทำงานแบบทีม', 'enterprise'],
    ['เชื่อมต่อ HR / LMS', 'enterprise'],
    ['ที่ปรึกษาเฉพาะองค์กร', 'enterprise'],
    ['เชื่อมต่อ API', 'enterprise'],
    ['ฝ่าย Support ส่วนตัว', 'enterprise'],
  ]},
];
export const hasFeature = (planKey, fromKey) => ORDER.indexOf(planKey) >= ORDER.indexOf(fromKey);

// จำนวนเต็มไม่แสดงทศนิยม · มีเศษสตางค์แสดง 2 ตำแหน่งเสมอ (฿267.50 ไม่ใช่ ฿267.5)
const fmt = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const baht = (n) => `฿${(Number.isInteger(n) ? fmt : fmt2).format(n)}`;
export const withVat = (n) => Math.round(n * (1 + VAT_RATE) * 100) / 100;
export const yearlySaving = (p) => (p.monthly && p.yearly ? p.monthly * 12 - p.yearly : 0);

// ราคาเริ่มต้นที่ใช้โฆษณา: แผนสำหรับธุรกิจที่ถูกที่สุด (ไม่นับแผนนักศึกษา) — คำนวณจากราคาจริง ไม่เขียนตัวเลขตายตัว
export const fromPrice = (keys = ['basic', 'business']) =>
  Math.min(...PLANS.filter((p) => keys.includes(p.key) && p.monthly > 0).map((p) => p.monthly));
export const STUDENT_PRICE = PLANS.find((p) => p.key === 'student')?.monthly;

// แผนแรกที่ได้สิทธิ์ฟีเจอร์ (อ่านจาก COMPARE) — หน้าฟีเจอร์ใช้ค่านี้แทนข้อความที่เขียนตายตัว จะได้ตรงกับตารางเปรียบเทียบเสมอ
export const planFrom = (label) => {
  const row = COMPARE.flatMap((g) => g.rows).find(([l]) => l === label);
  const plan = row && PLANS.find((p) => p.key === row[1]);
  if (!plan) throw new Error(`planFrom: ไม่พบฟีเจอร์ "${label}" ในตารางเปรียบเทียบ`);
  return `${plan.name} ขึ้นไป`;
};
