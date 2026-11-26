// แผนบริการ — ซิงก์จากตาราง plans ใน Supabase ของระบบสมาชิกจริง (แหล่งข้อมูลที่หน้าราคา/ชำระเงินของแอปใช้ผ่าน usePlans)
// ⚠ safeact-connect-hub/src/lib/plans.ts เป็นแค่ค่าสำรอง (fallback) ไม่ใช่ราคาจริง — ราคาจริงแก้ได้ที่ /admin/plans ในแอป
// ซิงก์ล่าสุด: 26 พ.ย. 2569 (Basic: "ดูการแจ้งเตือนกฎหมายในแอปมือถือ" → "แจ้งเตือนกฎหมายทางเว็บและอีเมล" · Business: เพิ่ม "ใช้งานแอปมือถือ SafeAct Club บน iPhone" เป็นข้อสุดท้าย)
//   ก่อนหน้า 21 พ.ย. 2569 (เลิกขาย Student · Business เหลือฟีเจอร์ที่มีจริง · AI ตามโควตาแต่ละแผน) · ราคาเป็นเงินบาท ยังไม่รวม VAT 7%
// 26 พ.ย. 2569 เจ้าของ: แอปมือถือใช้ได้เฉพาะแผน Business ขึ้นไป — แผน Free (ทดลอง 30 วัน) และ Basic ใช้งานผ่านเว็บอย่างเดียว
// ขายแบบรายปีอย่างเดียว (เจ้าของสั่งปิดแผนรายเดือน 22 พ.ย. 2569) — ไม่มีราคารายเดือนบนเว็บ แม้ตาราง plans ยังเก็บคอลัมน์ monthly ไว้
export const VAT_RATE = 0.07;

// โควตา AI ผู้ช่วยกฎหมาย (ข้อความ/เดือน) — ตาราง ai_plan_limits ของระบบสมาชิก (Basic ใช้แถว default) · Free ไม่มี AI
export const AI_QUOTA = { basic: 30, business: 200, enterprise: 500 };

export const PLANS = [
  {
    key: 'free',
    name: 'Free',
    subtitle: 'ครบ 30 วันบัญชีจะถูกระงับ',
    yearly: 0,
    features: ['อัปเดตกฎหมาย', 'อัปเดตมาตรฐานสากล', 'รายการกฎหมายที่ติดตาม', 'ใช้งานเมนูพื้นฐาน'],
    badge: 'ทดลองฟรี',
    cta: 'เริ่มทดลองฟรี',
  },
  {
    key: 'basic',
    name: 'Basic',
    subtitle: 'สำหรับบริษัทและทีมขนาดเล็ก',
    yearly: 2500,
    features: ['อัปเดตกฎหมาย', 'อัปเดตมาตรฐานสากล', 'คลังดาวน์โหลดเอกสาร', 'แจ้งเตือนกฎหมายทางเว็บและอีเมล', `AI ผู้ช่วยกฎหมาย ${AI_QUOTA.basic} ข้อความ/เดือน`],
    // เจ้าของสั่ง 21 พ.ย. 2569: ลบ "ส่วนลด ร้านค้าที่ร่วมรายการบนแพลตฟอร์ม" (ไม่มีระบบจริง)
    //   และย้าย Report record / Action plan / การตั้งค่าขั้นสูง ไปเริ่มที่แผน Business (ขีดฆ่าช่อง Basic ในตารางเปรียบเทียบ)
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'business',
    name: 'Business',
    subtitle: 'สำหรับ SME และ โรงงานอุตสาหกรรม',
    yearly: 4000,
    features: ['ทุกอย่างใน Basic', 'ระบบ Report record', 'ระบบ Action plan', 'การตั้งค่าขั้นสูง', `AI ผู้ช่วยกฎหมาย ${AI_QUOTA.business} ข้อความ/เดือน`, 'ใช้งานแอปมือถือ SafeAct Club บน iPhone'],
    featured: true,
    badge: 'ได้รับความนิยม',
    cta: 'เลือกแผนนี้',
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    subtitle: 'สำหรับองค์กรหลายสาขา',
    yearly: null,
    features: ['ทุกอย่างใน Business', 'รองรับหลายสาขา', 'รองรับการทำงานแบบทีม', 'เชื่อมต่อ HR / LMS', 'ที่ปรึกษาเฉพาะองค์กร', 'เชื่อมต่อ API', 'ฝ่าย Support ส่วนตัว'],
    cta: 'ติดต่อทีมขาย',
  },
];

// ตารางเปรียบเทียบ: แต่ละแถวระบุแผนแรกที่ได้สิทธิ์ (สิทธิ์สะสมขึ้นไปตามลำดับแผน) — สร้างจาก features ของแต่ละแผนด้านบน
// แถวที่มีค่าที่ 3 = แสดงข้อความตามแผนแทนเครื่องหมายถูก (เช่น โควตา AI)
const ORDER = PLANS.map((p) => p.key);
const aiQuotaText = Object.fromEntries(Object.entries(AI_QUOTA).map(([k, n]) => [k, `${n} ข้อความ/เดือน`]));
export const COMPARE = [
  { group: 'กฎหมายและมาตรฐาน', rows: [
    ['อัปเดตกฎหมาย', 'free'],
    ['อัปเดตมาตรฐานสากล', 'free'],
    ['รายการกฎหมายที่ติดตาม', 'free'],
    ['แจ้งเตือนกฎหมายทางเว็บและอีเมล', 'basic'],
    ['AI ผู้ช่วยกฎหมาย', 'basic', aiQuotaText],
  ]},
  { group: 'เอกสาร', rows: [
    ['คลังดาวน์โหลดเอกสาร', 'basic'],
  ]},
  { group: 'ระบบงานความปลอดภัย', rows: [
    ['ระบบ Report record', 'business'],
    ['ระบบ Action plan', 'business'],
    ['การตั้งค่าขั้นสูง', 'business'],
    ['แอปมือถือ SafeAct Club (iPhone)', 'business'],
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

// ราคาเริ่มต้นต่อปีที่ใช้โฆษณา: แผนแบบชำระเงินที่ถูกที่สุด — คำนวณจากราคาจริง ไม่เขียนตัวเลขตายตัว
export const fromPrice = (keys = ['basic', 'business']) =>
  Math.min(...PLANS.filter((p) => keys.includes(p.key) && p.yearly > 0).map((p) => p.yearly));

// แผนแรกที่ได้สิทธิ์ฟีเจอร์ (อ่านจาก COMPARE) — หน้าฟีเจอร์ใช้ค่านี้แทนข้อความที่เขียนตายตัว จะได้ตรงกับตารางเปรียบเทียบเสมอ
export const planFrom = (label) => {
  const row = COMPARE.flatMap((g) => g.rows).find(([l]) => l === label);
  const plan = row && PLANS.find((p) => p.key === row[1]);
  if (!plan) throw new Error(`planFrom: ไม่พบฟีเจอร์ "${label}" ในตารางเปรียบเทียบ`);
  return `${plan.name} ขึ้นไป`;
};

// แอปมือถือ — แผนแรกที่ได้ใช้แอป (อ่านจาก COMPARE) · ป้าย App Store, คำถามที่พบบ่อย, หน้าราคา และ llms.txt ใช้ค่านี้ จะได้ตรงกับตารางเสมอ
export const APP_PLAN = planFrom('แอปมือถือ SafeAct Club (iPhone)');   // "Business ขึ้นไป"
const appFrom = COMPARE.flatMap((g) => g.rows).find(([l]) => l === 'แอปมือถือ SafeAct Club (iPhone)')[1];
// แผนที่ยังไม่ได้ใช้แอป (ใช้งานผ่านเว็บอย่างเดียว) เช่น "Free และ Basic"
export const WEB_ONLY_PLANS = PLANS.filter((p) => !hasFeature(p.key, appFrom)).map((p) => p.name).join(' และ ');
