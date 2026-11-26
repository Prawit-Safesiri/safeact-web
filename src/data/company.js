// ข้อมูลนิติบุคคล — แหล่งเดียวที่ทุกหน้า (ฟุตเตอร์ นโยบาย JSON-LD) ดึงไปใช้
// อ้างอิง: หนังสือรับรอง / DBD DataWarehouse+ และข้อมูลติดต่อที่ผู้ประกอบการยืนยัน
import { APP_PLAN } from './plans.js';

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
  email: 'sale@safesiri.com',   // เจ้าของสั่ง 21 พ.ย. 2569 (ตรงกับระบบสมาชิกและแอป iOS) — ข้อยกเว้นของกฎ "ไม่กล่าวถึงเซฟสิริบนเว็บ" เฉพาะอีเมลนี้
  hours: 'จันทร์–ศุกร์ 09:00–18:00 น. (เว้นวันหยุดนักขัตฤกษ์)',
  hoursSpec: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
  supportLanguages: ['th'],

  // ── ตัวตน: ข้อความชุดนี้แสดงบนหน้าเว็บ และใช้เป็นคำอธิบายใน JSON-LD (ต้องเป็นข้อความเดียวกัน) ──
  // ประโยคนิยามสั้น (hero หน้าแรก)
  definitionShort: 'SafeAct (เซฟแอ็กต์) คือแพลตฟอร์มออนไลน์ที่ติดตาม สรุป และแจ้งเตือนกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบบริหารงานความปลอดภัยสำหรับเจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.)',
  // หน้าเกี่ยวกับเรา ย่อหน้า 1 และ 2
  aboutEntity: 'บริษัท เซฟแอ็กต์ จำกัด จดทะเบียนจัดตั้งเมื่อวันที่ 6 สิงหาคม 2568 เป็นผู้พัฒนาและให้บริการ SafeAct (เซฟแอ็กต์) แพลตฟอร์มออนไลน์แบบสมาชิกสำหรับงานความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน',
  // 26 พ.ย. 2569 เจ้าของ: แอปมือถือใช้ได้เฉพาะแผน Business ขึ้นไป
  aboutService: `SafeAct รวบรวม สรุป และแจ้งเตือนกฎหมายพร้อมแหล่งอ้างอิงและวันมีผลใช้บังคับ และมีระบบบริหารงานความปลอดภัยที่ช่วยให้เจ้าหน้าที่ความปลอดภัยในการทำงาน (จป.) วางแผน บันทึก และติดตามงานตามกฎหมายได้ในที่เดียว ใช้งานได้บนเว็บ และมีแอปบน iPhone สำหรับลูกค้าแผน ${APP_PLAN}`,
  // บรรทัดในฟุตเตอร์ทุกหน้า
  // 2 บรรทัดบนจอกว้าง (ตัดบรรทัดตามที่เจ้าของกำหนด) · จอแคบตัดบรรทัดตามปกติ
  footerLines: ['ผู้ให้บริการ SafeAct แพลตฟอร์มออนไลน์ติดตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน', 'พร้อมระบบบริหารงานความปลอดภัยสำหรับ จป.'],

  // โลโก้ตัวแทนองค์กรใน JSON-LD = ไอคอนแอป (เจ้าของกำหนด 28 ก.ย. 2569) · ตัวอักษร SAFEACT ในส่วนหัวใช้ safeact-logo.png ตามเดิม
  logo: { path: '/assets/icon-512.png', width: 512, height: 512 },

  // LINE Official Account — ปุ่ม "เพิ่มเพื่อน" ทางการของ LINE (ภาพจากเซิร์ฟเวอร์ LINE ตามโค้ดที่ LINE ให้มา)
  line: { url: 'https://lin.ee/qyDzfoi', button: 'https://scdn.line-apps.com/n/line_add_friends/btn/th.png' },

  // ── ข้อมูลที่เจ้าของต้องให้ (เว้นว่าง = ไม่แสดงบนเว็บและไม่ส่งออกใน JSON-LD) ──
  sameAs: ['https://line.me/R/ti/p/@528oihrm'],   // LINE Official Account ของบริษัท (ปลายทางจริงของ lin.ee) · เพิ่มลิงก์ทางการอื่นได้ เช่น Facebook Page · เช่น LINE Official, Facebook Page (ใส่เฉพาะที่เป็นของบริษัทนี้)
  vatId: null,         // เลขประจำตัวผู้เสียภาษีมูลค่าเพิ่ม ถ้าจดทะเบียน VAT
  appName: 'SafeAct Club',
  // ลิงก์แอปบน App Store (เปิดให้ดาวน์โหลดใน App Store ไทย 26 พ.ย. 2569) · แอปใช้ได้เฉพาะลูกค้าองค์กรแผน Business ขึ้นไป (APP_PLAN ใน plans.js)
  appStoreUrl: 'https://apps.apple.com/th/app/safeact-club/id6793849424',
  playStoreUrl: null,  // ยังไม่มีแอป Android (มีบน iPhone อย่างเดียว · 21 พ.ย. 2569) — ใส่ลิงก์เมื่อมีแอปบน Google Play แล้วเพิ่มป้ายใน StoreBadges.jsx
};

// วันที่ปรับปรุงล่าสุดของเอกสารนโยบายแต่ละฉบับ — ใช้ทั้งบนหน้าเอกสาร, JSON-LD และ lastmod ใน sitemap
// ⚠ แก้วันที่ของฉบับที่แก้เนื้อหาทุกครั้ง (ทั้ง iso และ th)
export const LEGAL_DATES = {
  terms: { iso: '2026-11-24', th: '24 พฤศจิกายน 2569' },     // จำหน่ายให้นิติบุคคลและหน่วยงานเท่านั้น (ข้อ 2) · ก่อนหน้า: เปลี่ยนอีเมลติดต่อ · ขายแบบรายปีอย่างเดียว
  privacy: { iso: '2026-11-21', th: '21 พฤศจิกายน 2569' },   // เปลี่ยนอีเมลติดต่อ
  refund: { iso: '2026-11-24', th: '24 พฤศจิกายน 2569' },    // ผู้ใช้บริการ = นิติบุคคลหรือหน่วยงาน · ก่อนหน้า: ตัดแผน Student และช่องทางชำระเงินที่ไม่มีจริงออก · เปลี่ยนอีเมลติดต่อ · ขายแบบรายปีอย่างเดียว
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
