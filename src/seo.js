// SEO — ข้อมูล head ของทุกหน้าอยู่ที่นี่ที่เดียว
// ใช้ร่วมกัน 2 ทาง: prerender (เขียนลง HTML ตอน build ให้บอตอ่านได้ทันที)
// และฝั่งเบราว์เซอร์ (อัปเดต head ตอนเปลี่ยนหน้าแบบ SPA) — ทั้งสองทางใช้ headModel() ตัวเดียวกัน จึงไม่มีทางขัดกัน
//
// JSON-LD บอก Google 2 เรื่อง:
//   เราคือใคร  → Organization (OnlineBusiness) + WebSite
//   ให้บริการอะไร → Service (+ OfferCatalog ราคาแต่ละแผน) และ WebApplication (รายการฟีเจอร์)
// หมายเหตุ: ไม่ใส่ FAQPage แล้ว (Google เลิกแสดงผล FAQ ตั้งแต่ พ.ค. 2026) · ไม่ใส่คะแนนรีวิวจนกว่าจะมีรีวิวจริงบนหน้าเว็บ
import { SITE_URL, APP_URL, COMPANY, LEGAL_DATES } from './data/company.js';
import { PLANS, baht, fromPrice } from './data/plans.js';
import { SERVICE, FEATURES, LAW_CATEGORIES } from './data/service.js';

const OG_IMAGE = {
  url: `${SITE_URL}/assets/og-image.png`,
  width: 1200,
  height: 630,
  alt: 'SafeAct แพลตฟอร์มติดตามกฎหมายความปลอดภัย พร้อมระบบบริหารงานความปลอดภัยสำหรับ จป.',
};

const ID = {
  org: `${SITE_URL}/#organization`,
  site: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
  service: `${SITE_URL}/#service`,
  webapp: `${SITE_URL}/#webapp`,
  iosapp: `${SITE_URL}/#iosapp`,
};
const ref = (id) => ({ '@id': id });
// ตัดค่าว่างทิ้ง — ข้อมูลที่เจ้าของยังไม่ได้ให้ (sameAs, vatId, appStoreUrl) จะไม่ถูกส่งออก
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) =>
  v != null && v !== '' && !(Array.isArray(v) && !v.length)));

const hoursAvailable = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: COMPANY.hoursSpec.days,
  opens: COMPANY.hoursSpec.opens,
  closes: COMPANY.hoursSpec.closes,
};

// ── เราคือใคร ──
const org = clean({
  '@type': 'OnlineBusiness',
  '@id': ID.org,
  name: COMPANY.brand,                 // ตรงกับชื่อเว็บ (WebSite.name, og:site_name) ตามแนวทาง Google
  legalName: COMPANY.nameTh,
  alternateName: [COMPANY.brandTh, COMPANY.nameEn],
  description: `${COMPANY.aboutEntity} ${COMPANY.aboutService}`,
  url: `${SITE_URL}/`,
  logo: {
    '@type': 'ImageObject',
    '@id': ID.logo,
    url: `${SITE_URL}${COMPANY.logo.path}`,
    width: COMPANY.logo.width,
    height: COMPANY.logo.height,
    caption: COMPANY.brand,
  },
  image: ref(ID.logo),
  email: COMPANY.email,
  telephone: COMPANY.phoneE164,
  taxID: COMPANY.taxId,
  vatID: COMPANY.vatId,
  foundingDate: COMPANY.registeredOn,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${COMPANY.address.line} ${COMPANY.address.subdistrict}`,
    addressLocality: COMPANY.address.district,
    addressRegion: COMPANY.address.province,
    postalCode: COMPANY.address.postcode,
    addressCountry: 'TH',
  },
  areaServed: { '@type': 'Country', name: 'TH' },
  knowsAbout: [
    'กฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน',
    ...LAW_CATEGORIES.map((c) => (c.startsWith('กฎหมาย') ? c : `กฎหมาย${c}`)),
  ],
  sameAs: COMPANY.sameAs,
  contactPoint: ['sales', 'customer support'].map((contactType) => ({
    '@type': 'ContactPoint',
    contactType,
    telephone: COMPANY.phoneE164,
    email: COMPANY.email,
    areaServed: 'TH',
    availableLanguage: COMPANY.supportLanguages,
    hoursAvailable,
  })),
});

const website = (full) => clean({
  '@type': 'WebSite',
  '@id': ID.site,
  url: `${SITE_URL}/`,
  name: COMPANY.brand,
  alternateName: full ? [COMPANY.brandTh, 'SAFEACT'] : undefined,   // ชื่อสำรองของเว็บ (ต้องอยู่ที่หน้าแรก)
  description: full ? ROUTES['/'].description : undefined,
  inLanguage: 'th-TH',
  publisher: ref(ID.org),
});

// ── ให้บริการอะไร ──
const CYCLES = [['yearly', 'รายปี', 'P1Y', 'ANN'], ['monthly', 'รายเดือน', 'P1M', 'MON']];
// เฉพาะแผนที่มีราคา (ไม่รวม Free = 0 และ Enterprise = ติดต่อฝ่ายขาย) · ราคายังไม่รวม VAT ตามที่แสดงบนหน้า
const planOffers = () => PLANS.filter((p) => p.yearly > 0).flatMap((p) => CYCLES.map(([c, label, dur, unit]) => ({
  '@type': 'Offer',
  '@id': `${SITE_URL}/pricing/#offer-${p.key}-${c}`,
  name: `${p.name} ${label}`,
  description: p.subtitle,
  category: 'subscription',
  price: p[c].toFixed(2),
  priceCurrency: 'THB',
  availability: 'https://schema.org/InStock',
  url: `${SITE_URL}/pricing/`,
  offeredBy: ref(ID.org),
  itemOffered: ref(ID.service),
  priceSpecification: {
    '@type': 'UnitPriceSpecification',
    price: p[c].toFixed(2),
    priceCurrency: 'THB',
    valueAddedTaxIncluded: false,
    billingDuration: dur,
    unitCode: unit,
    referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode: unit },
  },
})));

const service = (withOffers = false) => clean({
  '@type': 'Service',
  '@id': ID.service,
  name: SERVICE.name,
  serviceType: SERVICE.type,
  description: COMPANY.definitionShort,
  url: `${SITE_URL}/`,
  provider: ref(ID.org),
  areaServed: { '@type': 'Country', name: 'TH' },
  audience: { '@type': 'Audience', audienceType: SERVICE.audience },
  availableChannel: { '@type': 'ServiceChannel', serviceUrl: APP_URL },
  termsOfService: `${SITE_URL}/terms/`,
  hasOfferCatalog: withOffers
    ? { '@type': 'OfferCatalog', name: 'แผนและราคา SafeAct', itemListElement: planOffers() }
    : undefined,
});

const webapp = (full = false) => clean({
  '@type': 'WebApplication',
  '@id': ID.webapp,
  name: SERVICE.name,
  url: APP_URL,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  inLanguage: 'th-TH',
  provider: ref(ID.org),
  featureList: full ? FEATURES.map((f) => f.name) : undefined,
  screenshot: full
    ? FEATURES.filter((f) => f.shot).map((f) => ({
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/features/${f.shot}.webp`,
      width: 2320,
      height: 1740,
    }))
    : undefined,
});

// แอป iPhone — ส่งออกเมื่อมีลิงก์ App Store ใน company.js เท่านั้น
const iosApp = () => (COMPANY.appStoreUrl ? [clean({
  '@type': 'MobileApplication',
  '@id': ID.iosapp,
  name: COMPANY.appName,
  operatingSystem: 'iOS',
  applicationCategory: 'BusinessApplication',
  url: COMPANY.appStoreUrl,
  installUrl: COMPANY.appStoreUrl,
  inLanguage: 'th-TH',
  provider: ref(ID.org),
})] : []);

// ── ระดับหน้า ──
const pageNode = (path, m) => {
  const url = `${SITE_URL}${path}`;
  const p = m.page || {};
  return clean({
    '@type': p.type || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: m.title,
    description: m.description,
    inLanguage: 'th-TH',
    isPartOf: ref(ID.site),
    about: p.about && ref(p.about),
    mainEntity: p.mainEntity && ref(p.mainEntity),
    breadcrumb: m.crumb ? ref(`${url}#breadcrumb`) : undefined,
    // ใส่เฉพาะภาพที่แสดงอยู่ในเนื้อหาของหน้านั้นจริง
    primaryImageOfPage: p.image && { '@type': 'ImageObject', url: `${SITE_URL}${p.image[0]}`, width: p.image[1], height: p.image[2] },
    dateModified: p.dateModified,
  });
};

const crumbs = (path, name) => ({
  '@type': 'BreadcrumbList',
  '@id': `${SITE_URL}${path}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name, item: `${SITE_URL}${path}` },
  ],
});

// title ≤ 60 ตัวอักษร · description 70–160 ตัวอักษร · ทุกหน้าไม่ซ้ำกัน
// lastmod: เปลี่ยนเฉพาะเมื่อเนื้อหา ลิงก์ หรือ structured data ของหน้านั้นเปลี่ยนจริง (Google ใช้ค่านี้ต่อเมื่อเชื่อถือได้)
// crumb: ชื่อในเส้นทางหน้า (ฟุตเตอร์ + BreadcrumbList)
export const ROUTES = {
  '/': {
    title: 'SafeAct — อัปเดตกฎหมายความปลอดภัย ระบบงาน จป. ครบในที่เดียว',
    description: 'SafeAct แพลตฟอร์มสำหรับ จป. ติดตาม สรุป และแจ้งเตือนกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบบริหารงานความปลอดภัย ทดลองใช้ฟรี 30 วัน',
    lastmod: '2026-09-28',
    page: { about: ID.org, mainEntity: ID.service, image: ['/assets/laws-macbook.webp', 1422, 1024] },
    nodes: () => [service(), webapp(), ...iosApp()],
  },
  '/features/': {
    title: 'ฟีเจอร์ SafeAct — ระบบบริหารงานความปลอดภัยสำหรับ จป.',
    description: 'ติดตามกฎหมายทุกหมวดหมู่ Action Plan รายปี Training Matrix บันทึกงานตรวจรับรอง โปรแกรมอนุรักษ์การได้ยิน คลังเอกสาร และ AI ผู้ช่วยกฎหมาย ใช้ได้ทั้งบนเว็บและ iPhone',
    lastmod: '2026-09-27',
    crumb: 'ฟีเจอร์',
    page: { mainEntity: ID.webapp, image: ['/assets/features/hero.webp', 2880, 1234] },
    nodes: () => [webapp(true), ...iosApp()],
  },
  '/pricing/': {
    title: `แผนและราคา — เริ่ม ${baht(fromPrice())}/เดือน ทดลองฟรี 30 วัน | SafeAct`,
    description: 'เปรียบเทียบแผน SafeAct: Free ทดลอง 30 วัน, Student, Basic, Business และ Enterprise ชำระรายเดือนหรือรายปี ราคายังไม่รวม VAT 7% คืนเงินได้ภายใน 7 วัน',
    lastmod: '2026-09-27',
    crumb: 'แผนและราคา',
    page: { mainEntity: ID.service },
    nodes: () => [service(true)],
  },
  '/refund-policy/': {
    title: 'นโยบายการยกเลิกและการคืนเงิน | SafeAct',
    description: 'เงื่อนไขการยกเลิกบริการสมาชิก SafeAct รับประกันคืนเงินภายใน 7 วัน กรณีที่คืนเงินได้และไม่ได้ ขั้นตอนและระยะเวลาการคืนเงิน และการจัดการข้อพิพาท',
    lastmod: LEGAL_DATES.refund.iso,
    crumb: 'นโยบายการยกเลิกและการคืนเงิน',
    page: { dateModified: LEGAL_DATES.refund.iso },
  },
  '/terms/': {
    title: 'ข้อกำหนดและเงื่อนไขการใช้บริการ | SafeAct',
    description: 'ข้อกำหนดการใช้งานบริการ SafeAct ของบริษัท เซฟแอ็กต์ จำกัด ครอบคลุมบัญชีผู้ใช้ แผนบริการ การชำระเงิน ทรัพย์สินทางปัญญา และกฎหมายที่ใช้บังคับ',
    lastmod: LEGAL_DATES.terms.iso,
    crumb: 'ข้อกำหนดการใช้บริการ',
    page: { dateModified: LEGAL_DATES.terms.iso },
  },
  '/privacy/': {
    title: 'นโยบายความเป็นส่วนตัว (PDPA) | SafeAct',
    description: 'วิธีที่บริษัท เซฟแอ็กต์ จำกัด เก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และสิทธิของเจ้าของข้อมูล',
    lastmod: LEGAL_DATES.privacy.iso,
    crumb: 'นโยบายความเป็นส่วนตัว',
    page: { dateModified: LEGAL_DATES.privacy.iso },
  },
  '/about/': {
    title: 'เกี่ยวกับเรา — บริษัท เซฟแอ็กต์ จำกัด | SafeAct',
    description: 'บริษัท เซฟแอ็กต์ จำกัด ผู้พัฒนาและให้บริการ SafeAct แพลตฟอร์มออนไลน์ติดตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน พร้อมระบบงานสำหรับ จป.',
    lastmod: '2026-09-28',
    crumb: 'เกี่ยวกับเรา',
    page: { type: 'AboutPage', mainEntity: ID.org, image: ['/assets/about-team.webp', 2000, 883] },
  },
  '/contact/': {
    title: 'ติดต่อ SafeAct — ขอใบเสนอราคาและนัดสาธิตระบบ',
    description: `ติดต่อ SafeAct โทร ${COMPANY.phone} อีเมล ${COMPANY.email} ขอใบเสนอราคาแผน Enterprise สาธิตระบบ หรือสอบถามการชำระเงินแบบใบแจ้งหนี้`,
    lastmod: '2026-09-27',
    crumb: 'ติดต่อเรา',
    page: { type: 'ContactPage', mainEntity: ID.org },
  },
};

export const NOT_FOUND = {
  title: 'ไม่พบหน้าที่คุณค้นหา | SafeAct',
  description: 'ไม่พบหน้าที่คุณค้นหา กลับไปหน้าแรกของ SafeAct',
  noindex: true,
};

// /pricing และ /pricing/index.html → /pricing/ (รูปแบบเดียวกับ canonical)
export const normPath = (p) => {
  const s = p.replace(/\/index\.html$/, '/');
  return s.endsWith('/') ? s : `${s}/`;
};
export const metaFor = (path) => ROUTES[normPath(path)] || NOT_FOUND;

export function graphFor(path) {
  const k = normPath(path);
  const m = ROUTES[k];
  if (!m) return [];
  return [
    org,
    website(k === '/'),
    pageNode(k, m),
    ...(m.crumb ? [crumbs(k, m.crumb)] : []),
    ...(m.nodes ? m.nodes() : []),
  ];
}

// สตริง JSON-LD ของหน้า ('' = ไม่มี เช่นหน้า 404)
export function jsonLdFor(path) {
  const graph = graphFor(path);
  return graph.length
    ? JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')
    : '';
}

// ข้อมูล head ของหน้า — ใช้ทั้งตอน prerender และตอนเปลี่ยนหน้าในเบราว์เซอร์
export function headModel(path) {
  const k = normPath(path);
  const m = ROUTES[k] || NOT_FOUND;
  return {
    title: m.title,
    // ชื่อสำหรับแชร์: ตัด " | SafeAct" ท้ายชื่อออก เพราะ og:site_name บอกชื่อเว็บอยู่แล้ว
    ogTitle: m.title.replace(/\s*\|\s*SafeAct$/, ''),
    description: m.description,
    robots: m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    canonical: ROUTES[k] ? `${SITE_URL}${k}` : null,
    image: OG_IMAGE,
    crumb: m.crumb || null,
    jsonLd: jsonLdFor(k),
  };
}

// รายการแท็กใน head ที่ระบบนี้ดูแล: [ชนิดแท็ก, ชื่อแอตทริบิวต์ที่ใช้ระบุ, ค่าระบุ, เนื้อหา]
// หน้าที่ไม่มี canonical (404) จะไม่มีแท็ก canonical / Open Graph / Twitter
export function headEntries(h) {
  const e = [
    ['meta', 'name', 'description', h.description],
    ['meta', 'name', 'robots', h.robots],
  ];
  if (h.canonical) {
    e.push(
      ['link', 'rel', 'canonical', h.canonical],
      ['meta', 'property', 'og:type', 'website'],
      ['meta', 'property', 'og:site_name', COMPANY.brand],
      ['meta', 'property', 'og:locale', 'th_TH'],
      ['meta', 'property', 'og:title', h.ogTitle],
      ['meta', 'property', 'og:description', h.description],
      ['meta', 'property', 'og:url', h.canonical],
      ['meta', 'property', 'og:image', h.image.url],
      ['meta', 'property', 'og:image:width', String(h.image.width)],
      ['meta', 'property', 'og:image:height', String(h.image.height)],
      ['meta', 'property', 'og:image:alt', h.image.alt],
      ['meta', 'name', 'twitter:card', 'summary_large_image'],
      ['meta', 'name', 'twitter:title', h.ogTitle],
      ['meta', 'name', 'twitter:description', h.description],
      ['meta', 'name', 'twitter:image', h.image.url],
      ['meta', 'name', 'twitter:image:alt', h.image.alt],
    );
  }
  return e;
}
// แท็กทั้งหมดที่อาจมี — ฝั่งเบราว์เซอร์ใช้ลบแท็กที่หน้าปัจจุบันไม่ควรมี
export const HEAD_KEYS = headEntries({ canonical: 'x', image: OG_IMAGE }).map(([tag, attr, key]) => [tag, attr, key]);
export const LD_ID = 'ld-graph';

// สร้างแท็ก head เป็นสตริง — ใช้ตอน prerender
export function headTags(path) {
  const h = headModel(path);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return [
    `<title>${esc(h.title)}</title>`,
    ...headEntries(h).map(([tag, attr, key, val]) => (tag === 'link'
      ? `<link ${attr}="${key}" href="${esc(val)}">`
      : `<meta ${attr}="${key}" content="${esc(val)}">`)),
    h.jsonLd ? `<script type="application/ld+json" id="${LD_ID}">${h.jsonLd}</script>` : '',
  ].filter(Boolean).join('\n    ');
}
