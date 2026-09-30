// llms.txt และ llms-full.txt (มาตรฐาน https://llmstxt.org) — สรุปข้อเท็จจริงของ SafeAct ให้ระบบ AI อ่านและอ้างอิง
// สร้างตอน build (scripts/prerender.mjs) จากไฟล์ข้อมูลชุดเดียวกับหน้าเว็บ → ตัวเลข ราคา และลิงก์ตรงกับเว็บเสมอ
// ⚠ ห้ามพิมพ์ตัวเลขหรือข้อความตายตัวที่นี่ ให้แก้ที่ไฟล์ข้อมูลใน src/data/
import { SITE_URL, APP_URL, COMPANY, AI_DISCLAIMER, fullAddress } from './data/company.js';
import { PLANS, baht, withVat } from './data/plans.js';
import { SERVICE, FEATURES, LAW_LIBRARY } from './data/service.js';
import { FAQ_GENERAL, FAQ_BILLING, FAQ_LAWS } from './data/faq.js';
import { LAWS, MONTHS12, SUM12, CATEGORY_GROUPS, CATEGORIES } from './data/laws.js';
import { STANDARD_GROUPS } from './data/standards.js';
import { AI_ROWS, AI_POINTS } from './data/ai.js';
import { ROUTES } from './seo.js';

const lawCount = LAW_LIBRARY.count.toLocaleString('en-US');
const link = (label, path, note) => `- [${label}](${SITE_URL}${path})${note ? `: ${note}` : ''}`;
const title = (path) => ROUTES[path].title.replace(/\s*\|\s*SafeAct$/, '');

const facts = () => [
  `- ผู้ให้บริการ: ${COMPANY.nameTh} (${COMPANY.nameEn}) เลขทะเบียนนิติบุคคล/เลขประจำตัวผู้เสียภาษี ${COMPANY.taxId} จดทะเบียนเมื่อ ${COMPANY.registeredOnTh}`,
  `- ที่อยู่: ${fullAddress()}`,
  `- ติดต่อ: โทร ${COMPANY.phone.replace(/ /g, ' ')} · อีเมล ${COMPANY.email} · LINE ${COMPANY.line.url} · เวลาทำการ ${COMPANY.hours}`,
  `- กลุ่มผู้ใช้หลัก: ${SERVICE.audience} ทุกระดับ ผู้รับผิดชอบงานอาชีวอนามัยและสิ่งแวดล้อม ฝ่ายบุคคล SME โรงงาน องค์กรหลายสาขา และนักศึกษาสาขาความปลอดภัย`,
  `- คลังกฎหมาย: ${lawCount} ฉบับ (ข้อมูล ณ ${LAW_LIBRARY.asOfTh}) จัดเป็น ${CATEGORIES.length} หมวด พร้อมแหล่งอ้างอิงและวันมีผลใช้บังคับ แจ้งกฎหมายใหม่ประจำเดือน`,
  `- ใช้งานได้บน: เว็บ (${APP_URL}) และแอป ${COMPANY.appName} บน iPhone และ Android ด้วยบัญชีเดียวกัน`,
  `- ทดลองใช้ฟรี 30 วัน · ขอคืนเงินเต็มจำนวนได้ภายใน 7 วันนับจากวันชำระเงินครั้งแรก · ราคาเป็นเงินบาท ยังไม่รวม VAT 7%`,
  `- ภาษาที่ให้บริการ: ไทย · พื้นที่ให้บริการ: ประเทศไทย`,
];

const prices = () => PLANS.map((p) => {
  if (p.monthly == null) return `- ${p.name} (${p.subtitle}): ติดต่อทีมขาย`;
  if (p.monthly === 0) return `- ${p.name} (${p.subtitle}): ฟรี 30 วัน`;
  return `- ${p.name} (${p.subtitle}): ${baht(p.monthly)}/เดือน หรือ ${baht(p.yearly)}/ปี (รวม VAT ${baht(withVat(p.yearly))}/ปี)`;
});

const pages = () => [
  link(title('/'), '/', ROUTES['/'].description),
  link(title('/features/'), '/features/', ROUTES['/features/'].description),
  link(title('/ai/'), '/ai/', ROUTES['/ai/'].description),
  link(title('/law-updates/'), '/law-updates/', ROUTES['/law-updates/'].description),
  link(title('/pricing/'), '/pricing/', ROUTES['/pricing/'].description),
  link(title('/about/'), '/about/', ROUTES['/about/'].description),
  link(title('/contact/'), '/contact/', ROUTES['/contact/'].description.replace(/ /g, ' ')),
];

const policies = () => [
  link(title('/refund-policy/'), '/refund-policy/'),
  link(title('/terms/'), '/terms/'),
  link(title('/privacy/'), '/privacy/'),
];

// อัปเดตกฎหมายรายเดือน — ตัวนับเดียวกับแอป (นับตามเดือนที่ประกาศ · เดือนล่าสุดยังนับไม่ครบเดือน)
const monthly = () => [
  `## อัปเดตกฎหมายรายเดือน (ข้อมูล ณ ${LAWS.syncedTh})`,
  `จำนวนกฎหมาย ประกาศ และมาตรฐานในคลัง SafeAct นับตามเดือนที่ประกาศ · รายละเอียด: ${SITE_URL}/law-updates/`,
  ...[...MONTHS12].reverse().map((r) => `- ${r.long}${r.partial ? ` (นับถึง ${LAWS.syncedTh})` : ''}: ${r.total} ฉบับ (ใหม่ ${r.new} · แก้ไข ${r.amended} · ยกเลิก ${r.repealed})`),
  `- รวม ${SUM12.from} – ${SUM12.to}: ${SUM12.total.toLocaleString('en-US')} ฉบับ`,
];
const categories = () => [
  `## หมวดกฎหมาย ${CATEGORIES.length} หมวด (จำนวนฉบับ ณ ${LAWS.syncedTh} · ฉบับหนึ่งอาจอยู่ได้หลายหมวด)`,
  ...CATEGORY_GROUPS.flatMap((g) => [`### ${g.title}`, ...g.items.map((c) => `- ${c.title}: ${c.count.toLocaleString('en-US')} ฉบับ${c.desc ? ` (${c.desc})` : ''}`)]),
];
const standards = () => [
  '## มาตรฐานระบบการจัดการใน Hub กฎหมาย',
  ...STANDARD_GROUPS.flatMap((g) => g.items.map((x) => `- ${x.code} — ${x.title}: ${x.detail}${x.notIso ? ' (ไม่ใช่มาตรฐาน ISO)' : ''}`)),
];

const head = () => [
  `# ${SERVICE.name}`,
  '',
  `> ${COMPANY.definitionShort}`,
  '',
  COMPANY.aboutService,
  '',
  '## ข้อเท็จจริงหลัก',
  ...facts(),
  '',
  '## แผนและราคา',
  ...prices(),
  '',
  '## ฟีเจอร์',
  ...FEATURES.map((f) => link(f.name, `/features/#${f.id}`)),
  '',
  '## หน้าหลัก',
  ...pages(),
  '',
  '## นโยบาย',
  ...policies(),
];

export function llmsTxt() {
  const short = [
    ...head(),
    '',
    ...monthly(),
    '',
    '## คำถามที่พบบ่อย',
    ...[...FAQ_GENERAL, ...FAQ_BILLING, ...FAQ_LAWS].map((f) => `- ${f.q}: ${f.a}`),
    '',
    '## Optional',
    `- [ข้อมูลฉบับเต็มสำหรับ AI](${SITE_URL}/llms-full.txt): หมวดกฎหมายพร้อมจำนวนฉบับ มาตรฐาน เนื้อหาเปรียบเทียบ AI และรายละเอียดเพิ่มเติม`,
    '',
  ].join('\n');

  const full = [
    ...head(),
    '',
    '## AI SafeAct ต่างกับ AI ทั่วไปอย่างไร',
    ...AI_POINTS.map(([h, p]) => `### ${h}\n${p}\n`),
    '| หัวข้อ | AI ทั่วไป | AI SafeAct |',
    '|---|---|---|',
    ...AI_ROWS.map(([k, a, b]) => `| ${k} | ${a} | ${b} |`),
    '',
    AI_DISCLAIMER,
    '',
    ...monthly(),
    '',
    ...categories(),
    '',
    ...standards(),
    '',
    '## คำถามที่พบบ่อย',
    ...[...FAQ_GENERAL, ...FAQ_BILLING, ...FAQ_LAWS].map((f) => `### ${f.q}\n${f.a}${f.link ? `\n${f.link.label}: ${f.link.to ? SITE_URL + f.link.to : f.link.href}` : ''}\n`),
  ].join('\n');

  return { short, full };
}
