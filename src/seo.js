// SEO — ข้อมูล head ของทุกหน้าอยู่ที่นี่ที่เดียว
// ใช้ร่วมกัน 2 ทาง: prerender (เขียนลง HTML ตอน build ให้บอตอ่านได้ทันที)
// และฝั่งเบราว์เซอร์ (อัปเดต head ตอนเปลี่ยนหน้าแบบ SPA)
import { SITE_URL, COMPANY, fullAddress } from './data/company.js';
import { PLANS } from './data/plans.js';
import { FAQ_GENERAL, FAQ_BILLING } from './data/faq.js';

const OG_IMAGE = `${SITE_URL}/assets/og-image.png`;

const org = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: COMPANY.nameTh,
  alternateName: [COMPANY.nameEn, COMPANY.brand],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/safeact-logo.png`,
  email: COMPANY.email,
  telephone: COMPANY.phoneE164,
  taxID: COMPANY.taxId,
  foundingDate: COMPANY.registeredOn,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${COMPANY.address.line} ${COMPANY.address.subdistrict}`,
    addressLocality: COMPANY.address.district,
    addressRegion: COMPANY.address.province,
    postalCode: COMPANY.address.postcode,
    addressCountry: 'TH',
  },
  contactPoint: [{
    '@type': 'ContactPoint',
    contactType: 'sales',
    telephone: COMPANY.phoneE164,
    email: COMPANY.email,
    areaServed: 'TH',
    availableLanguage: ['th', 'en'],
  }],
};

const website = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: 'SafeAct',
  inLanguage: 'th-TH',
  publisher: { '@id': `${SITE_URL}/#organization` },
};

const crumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [{ name: 'หน้าแรก', path: '/' }, ...items].map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`,
  })),
});

const faqPage = (list) => ({
  '@type': 'FAQPage',
  mainEntity: list.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const product = {
  '@type': 'Product',
  name: 'SafeAct — บริการสมาชิกอัปเดตกฎหมายความปลอดภัยออนไลน์',
  description: 'บริการสมาชิกรายเดือน/รายปี อัปเดตกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบงานสำหรับทีม จป.',
  brand: { '@type': 'Brand', name: 'SafeAct' },
  image: OG_IMAGE,
  offers: PLANS.filter((p) => p.yearly !== null).flatMap((p) => [
    ['yearly', 'P1Y', 'ANN'],
    ['monthly', 'P1M', 'MON'],
  ].filter(([c]) => p[c] > 0).map(([c, dur, unit]) => ({
    '@type': 'Offer',
    name: `${p.name} (${c === 'yearly' ? 'รายปี' : 'รายเดือน'})`,
    price: p[c].toFixed(2),
    priceCurrency: 'THB',
    availability: 'https://schema.org/InStock',
    url: `${SITE_URL}/pricing/`,
    seller: { '@id': `${SITE_URL}/#organization` },
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: p[c].toFixed(2),
      priceCurrency: 'THB',
      valueAddedTaxIncluded: false,
      billingDuration: dur,
      unitCode: unit,
    },
  }))),
};

// title ≤ 60 ตัวอักษร · description 70–160 ตัวอักษร · ทุกหน้าไม่ซ้ำกัน
export const ROUTES = {
  '/': {
    title: 'SafeAct — อัปเดตกฎหมายความปลอดภัย ครบในที่เดียว',
    description: 'บริการสมาชิกออนไลน์ อัปเดตกฎหมายความปลอดภัย อาชีวอนามัย และสิ่งแวดล้อม พร้อมสรุปสาระสำคัญ แจ้งเตือน และระบบงาน จป. ทดลองใช้ฟรี 30 วัน',
    priority: '1.0',
    jsonLd: () => [org, website, faqPage(FAQ_GENERAL)],
  },
  '/features/': {
    title: 'ฟีเจอร์ — ระบบงานความปลอดภัยครบวงจร | SafeAct',
    description: 'ติดตามกฎหมาย 6 หมวด Action Plan รายปี บันทึกการอบรม งานตรวจรับรอง โปรแกรมอนุรักษ์การได้ยิน คลังเอกสาร WI/SDS และ AI ผู้ช่วยกฎหมาย บนเว็บและ iPhone',
    priority: '0.9',
    jsonLd: () => [org, crumbs([{ name: 'ฟีเจอร์', path: '/features/' }])],
  },
  '/pricing/': {
    title: 'แผนและราคา — เริ่มต้น ฿200 ต่อเดือน | SafeAct',
    description: 'เปรียบเทียบแผน SafeAct: Free ทดลอง 30 วัน, Student, Basic, Business และ Enterprise ชำระรายเดือนหรือรายปี ราคายังไม่รวม VAT 7% คืนเงินได้ภายใน 7 วัน',
    priority: '0.9',
    jsonLd: () => [org, product, faqPage(FAQ_BILLING), crumbs([{ name: 'แผนและราคา', path: '/pricing/' }])],
  },
  '/refund-policy/': {
    title: 'นโยบายการยกเลิกและการคืนเงิน | SafeAct',
    description: 'เงื่อนไขการยกเลิกบริการ ระยะเวลาแจ้งล่วงหน้า กรณีที่คืนเงินได้และไม่ได้ ขั้นตอนขอคืนเงิน และการประสานงานข้อพิพาทระหว่างผู้จัดการอบรมกับผู้ใช้บริการ',
    priority: '0.6',
    jsonLd: () => [org, crumbs([{ name: 'นโยบายการยกเลิกและการคืนเงิน', path: '/refund-policy/' }])],
  },
  '/terms/': {
    title: 'ข้อกำหนดและเงื่อนไขการใช้บริการ | SafeAct',
    description: 'ข้อกำหนดการใช้งานบริการ SafeAct ของบริษัท เซฟแอ็กต์ จำกัด ครอบคลุมบัญชีผู้ใช้ แผนบริการ การชำระเงิน ทรัพย์สินทางปัญญา และกฎหมายที่ใช้บังคับ',
    priority: '0.4',
    jsonLd: () => [org, crumbs([{ name: 'ข้อกำหนดการใช้บริการ', path: '/terms/' }])],
  },
  '/privacy/': {
    title: 'นโยบายความเป็นส่วนตัว (PDPA) | SafeAct',
    description: 'วิธีที่บริษัท เซฟแอ็กต์ จำกัด เก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และสิทธิของเจ้าของข้อมูล',
    priority: '0.4',
    jsonLd: () => [org, crumbs([{ name: 'นโยบายความเป็นส่วนตัว', path: '/privacy/' }])],
  },
  '/about/': {
    title: 'เกี่ยวกับเรา — บริษัท เซฟแอ็กต์ จำกัด | SafeAct',
    description: 'บริษัท เซฟแอ็กต์ จำกัด ให้บริการฝึกอบรม ให้คำปรึกษา และบริการข้อมูลกฎหมายด้านความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน',
    priority: '0.5',
    jsonLd: () => [org, crumbs([{ name: 'เกี่ยวกับเรา', path: '/about/' }])],
  },
  '/contact/': {
    title: 'ติดต่อทีมขาย — ขอใบเสนอราคาองค์กร | SafeAct',
    description: `ติดต่อ SafeAct โทร ${COMPANY.phone} อีเมล ${COMPANY.email} ขอใบเสนอราคาแผน Enterprise สาธิตระบบ หรือสอบถามการชำระเงินแบบใบแจ้งหนี้`,
    priority: '0.7',
    jsonLd: () => [{ ...org, '@type': ['Organization', 'LocalBusiness'], address: org.address, openingHours: 'Mo-Fr 09:00-18:00' }, crumbs([{ name: 'ติดต่อเรา', path: '/contact/' }])],
  },
};

export const NOT_FOUND = {
  title: 'ไม่พบหน้าที่คุณค้นหา | SafeAct',
  description: 'ไม่พบหน้าที่คุณค้นหา กลับไปหน้าแรกของ SafeAct',
  noindex: true,
  jsonLd: () => [],
};

export const metaFor = (path) => ROUTES[path.endsWith('/') ? path : `${path}/`] || NOT_FOUND;

// สร้างแท็ก head เป็นสตริง — ใช้ตอน prerender
export function headTags(path) {
  const m = metaFor(path);
  const url = `${SITE_URL}${path}`;
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const graph = m.jsonLd();
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    m.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">',
    m.noindex ? '' : `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" hreflang="th-TH" href="${url}">`,
    `<link rel="alternate" hreflang="x-default" href="${url}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="SafeAct">',
    '<meta property="og:locale" content="th_TH">',
    `<meta property="og:title" content="${esc(m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${OG_IMAGE}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(m.title)}">`,
    `<meta name="twitter:description" content="${esc(m.description)}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
    graph.length
      ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`
      : '',
  ].filter(Boolean).join('\n    ');
}
