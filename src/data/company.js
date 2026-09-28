// ข้อมูลนิติบุคคล — แหล่งเดียวที่ทุกหน้า (ฟุตเตอร์ นโยบาย JSON-LD) ดึงไปใช้
// อ้างอิง: หนังสือรับรอง / DBD DataWarehouse+ และข้อมูลติดต่อที่ผู้ประกอบการยืนยัน

// โดเมนหลัก (canonical) — แบบไม่มี www ตรงกับที่ Google เก็บอยู่ · www ต้อง 301 มาที่นี่ (ตั้งที่ Cloudflare)
// ⚠ แก้ที่นี่ที่เดียว: canonical, og:url, JSON-LD, sitemap.xml และ robots.txt ดึงจากค่านี้ทั้งหมด
export const SITE_URL = 'https://safeact.com';
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
export const APP_URL = 'https://member.safeact.com';

export const COMPANY = {
  nameTh: 'บริษัท เซฟแอ็กต์ จำกัด',
  nameEn: 'SAFEACT Co., Ltd.',
  brand: 'SafeAct',
  brandTh: 'เซฟแอ็กต์',
  taxId: '0105568153603',
  registeredOn: '2025-08-06', // 6 สิงหาคม 2568
  registeredOnTh: '6 สิงหาคม 2568',
  address: {
    line: '252 อาคารเอสพีอี ชั้นที่ 10 ห้องเลขที่ 1032-01 ถนนพหลโยธิน',
    subdistrict: 'แขวงสามเสนใน',
    district: 'เขตพญาไท',
    province: 'กรุงเทพมหานคร',
    postcode: '10400',
  },
  phone: '(065)\u00a0961\u00a04745',   // แสดงเป็น (065) 961 4745 · เว้นวรรคแบบไม่ตัดบรรทัด เลขจึงไม่ถูกแยกคนละบรรทัด · ลิงก์โทรใช้ phoneE164
  phoneE164: '+66659614745',
  email: 'sale@safeact.com',
  hours: 'จันทร์–ศุกร์ 09:00–18:00 น. (เว้นวันหยุดนักขัตฤกษ์)',
  hoursSpec: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
  supportLanguages: ['th'],

  // ── ตัวตน: ข้อความชุดนี้แสดงบนหน้าเว็บ และใช้เป็นคำอธิบายใน JSON-LD (ต้องเป็นข้อความเดียวกัน) ──
  // ประโยคนิยามสั้น (hero หน้าแรก)
  definitionShort: 'SafeAct (เซฟแอ็กต์) คือแพลตฟอร์มออนไลน์ที่ติดตาม สรุป และแจ้งเตือนกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบบริหารงานความปลอดภัยสำหรับเจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.)',
  // หน้าเกี่ยวกับเรา ย่อหน้า 1 และ 2
  aboutEntity: 'บริษัท เซฟแอ็กต์ จำกัด จดทะเบียนจัดตั้งเมื่อวันที่ 6 สิงหาคม 2568 เป็นผู้พัฒนาและให้บริการ SafeAct (เซฟแอ็กต์) แพลตฟอร์มออนไลน์แบบสมาชิกสำหรับงานความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน',
  aboutService: 'SafeAct รวบรวม สรุป และแจ้งเตือนกฎหมายพร้อมแหล่งอ้างอิงและวันมีผลใช้บังคับ และมีระบบบริหารงานความปลอดภัยที่ช่วยให้เจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.) วางแผน บันทึก และติดตามงานตามกฎหมายได้ในที่เดียว ใช้งานได้ทั้งบนเว็บและแอป iPhone',
  // บรรทัดในฟุตเตอร์ทุกหน้า
  // 2 บรรทัดบนจอกว้าง (ตัดบรรทัดตามที่เจ้าของกำหนด) · จอแคบตัดบรรทัดตามปกติ
  footerLines: ['ผู้ให้บริการ SafeAct แพลตฟอร์มออนไลน์ติดตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน', 'พร้อมระบบบริหารงานความปลอดภัยสำหรับ จป.'],

  logo: { path: '/assets/safeact-logo.png', width: 1000, height: 161 },

  // LINE Official Account — ปุ่ม "เพิ่มเพื่อน" ทางการของ LINE (ภาพจากเซิร์ฟเวอร์ LINE ตามโค้ดที่ LINE ให้มา)
  line: { url: 'https://lin.ee/qyDzfoi', button: 'https://scdn.line-apps.com/n/line_add_friends/btn/th.png' },

  // ── ข้อมูลที่เจ้าของต้องให้ (เว้นว่าง = ไม่แสดงบนเว็บและไม่ส่งออกใน JSON-LD) ──
  sameAs: [],          // ลิงก์ช่องทางทางการ เช่น LINE Official, Facebook Page (ใส่เฉพาะที่เป็นของบริษัทนี้)
  vatId: null,         // เลขประจำตัวผู้เสียภาษีมูลค่าเพิ่ม ถ้าจดทะเบียน VAT
  appName: 'SafeAct Club',
  appStoreUrl: null,   // ลิงก์แอปบน App Store
};

// วันที่ปรับปรุงล่าสุดของเอกสารนโยบายแต่ละฉบับ — ใช้ทั้งบนหน้าเอกสาร, JSON-LD และ lastmod ใน sitemap
// ⚠ แก้วันที่ของฉบับที่แก้เนื้อหาทุกครั้ง (ทั้ง iso และ th)
export const LEGAL_DATES = {
  terms: { iso: '2026-09-28', th: '28 กันยายน 2569' },
  privacy: { iso: '2026-09-27', th: '27 กันยายน 2569' },
  refund: { iso: '2026-09-28', th: '28 กันยายน 2569' },
};

// ข้อสงวนสิทธิ์ของ AI — ใช้ข้อความเดียวกันทุกจุดที่พูดถึง AI ผู้ช่วยกฎหมาย
export const AI_DISCLAIMER = 'คำตอบของ AI เป็นข้อมูลประกอบการตัดสินใจ ไม่ใช่คำปรึกษาทางกฎหมาย';

export const fullAddress = () => {
  const a = COMPANY.address;
  return `${a.line} ${a.subdistrict} ${a.district} ${a.province} ${a.postcode}`;
};

export const appLink = (path = '/auth') => `${APP_URL}${path}`;
export const checkoutLink = (plan, cycle = 'yearly') =>
  plan === 'free'
    ? `${APP_URL}/auth/signup-free`
    : `${APP_URL}/auth/checkout?plan=${plan}&cycle=${cycle}`;
