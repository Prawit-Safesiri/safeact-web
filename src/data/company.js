// ข้อมูลนิติบุคคล — แหล่งเดียวที่ทุกหน้า (ฟุตเตอร์ นโยบาย JSON-LD) ดึงไปใช้
// อ้างอิง: หนังสือรับรอง / DBD DataWarehouse+ และข้อมูลติดต่อที่ผู้ประกอบการยืนยัน
export const SITE_URL = 'https://www.safeact.com';
export const APP_URL = 'https://member.safeact.com';

export const COMPANY = {
  nameTh: 'บริษัท เซฟแอ็กต์ จำกัด',
  nameEn: 'SAFEACT Co., Ltd.',
  brand: 'SafeAct',
  taxId: '0105568153603',
  registeredOn: '2025-08-06', // 6 สิงหาคม 2568
  address: {
    line: '252 อาคารเอสพีอี ชั้นที่ 10 ห้องเลขที่ 1032-01 ถนนพหลโยธิน',
    subdistrict: 'แขวงสามเสนใน',
    district: 'เขตพญาไท',
    province: 'กรุงเทพมหานคร',
    postcode: '10400',
  },
  phone: '065-961-4745',
  phoneE164: '+66659614745',
  email: 'sale@safeact.com',
  hours: 'จันทร์–ศุกร์ 09:00–18:00 น. (เว้นวันหยุดนักขัตฤกษ์)',
};

export const fullAddress = () => {
  const a = COMPANY.address;
  return `${a.line} ${a.subdistrict} ${a.district} ${a.province} ${a.postcode}`;
};

export const appLink = (path = '/auth') => `${APP_URL}${path}`;
export const checkoutLink = (plan, cycle = 'yearly') =>
  plan === 'free'
    ? `${APP_URL}/auth/signup-free`
    : `${APP_URL}/auth/checkout?plan=${plan}&cycle=${cycle}`;
