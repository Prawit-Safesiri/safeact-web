// แผนบริการจากระบบสมาชิก — มี 2 ชุด ผ่าน derivePlans() เดียวกัน
//   • ชุดที่ build ติดไปกับหน้าเว็บ = src/data/plans.json (npm run sync:plans · scripts/sync-plans.mjs)
//     Google/AI อ่านชุดนี้ · ใช้ใน HTML ที่ prerender · JSON-LD · llms.txt · คำอธิบายหน้า (meta)
//   • ชุดล่าสุด = /api/plans.json ที่ server.cjs ดึงจากระบบสมาชิกทุก 5 นาที (useLivePlans ใน plans-live.js)
//     การ์ดแผน ตารางเปรียบเทียบ คำถามที่พบบ่อย และข้อความ "มีในแผน …" เปลี่ยนตามระบบสมาชิกเองโดยไม่ต้อง build ใหม่
// 26 พ.ย. 2569 เจ้าของ: "เช็ครายการฟีเจอร์ให้ตรงกับข้อมูลจริง หากการตั้งค่าเปลี่ยน ให้เปลี่ยนอัตโนมัติด้วย"
//   ระบบสมาชิกสร้างรายการฟีเจอร์เองจากการตั้งค่าจริง (สิทธิ์เมนูรายแผน /admin/access · โควตา AI /admin/ai-limits · บรรทัดเพิ่มเติม /admin/plans)
//   ⚠ ห้ามพิมพ์ฟีเจอร์ ราคา หรือชื่อแผนในหน้าเว็บเอง — แก้ที่ระบบสมาชิก แล้วรัน npm run sync:plans ให้ชุดที่ build ไว้ตรงด้วย
//   ("ระบบ Report record" และ "การตั้งค่าขั้นสูง" เอาออกแล้ว — ไม่มีอยู่จริงในระบบ)
// ขายแบบรายปีอย่างเดียว (เจ้าของสั่งปิดแผนรายเดือน 22 พ.ย. 2569) · ราคาเป็นเงินบาท ยังไม่รวม VAT 7%
// แอปมือถือใช้ได้เฉพาะแผนที่มีสิทธิ์ mobile_app (26 พ.ย. 2569: Business ขึ้นไป) — APP_PLAN / WEB_ONLY_PLANS คำนวณจากข้อมูล ห้ามพิมพ์ตายตัว
import DATA from './plans.json';
import { checkPlans } from './plan-rules.js';

export const VAT_RATE = 0.07;

// จำนวนเต็มไม่แสดงทศนิยม · มีเศษสตางค์แสดง 2 ตำแหน่งเสมอ (฿267.50 ไม่ใช่ ฿267.5)
const fmt = new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 });
const fmt2 = new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const baht = (n) => `฿${(Number.isInteger(n) ? fmt : fmt2).format(n)}`;
export const withVat = (n) => Math.round(n * (1 + VAT_RATE) * 100) / 100;

// "Free และ Basic" · "Free, Basic และ Business"
export const joinTh = (names) => (names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} และ ${names.at(-1)}`);

// ฟีเจอร์ที่ข้อความบนเว็บพูดถึง (ข้อความ "มีในแผน …" หน้าฟีเจอร์ คำถามที่พบบ่อย ป้าย App Store)
// ชุดที่ build ไว้ต้องมีครบ (build ล้มถ้าไม่มี) · ข้อมูลล่าสุดที่ไม่มีข้อใดเลย → หน้าเว็บใช้ชุดที่ build ต่อ เพราะเนื้อหาที่บรรยายฟีเจอร์นั้นต้องแก้โดยคน
export const REQUIRED_ITEMS = ['laws', 'standards', 'notifications', 'documents', 'presentations', 'action_plan', 'hearing', 'ai', 'mobile_app'];

// ตารางเปรียบเทียบ: กลุ่มแถวตาม item_key ของระบบสมาชิก (เรียงในกลุ่มตาม ord ของระบบ)
// เมนูใหม่ที่ยังไม่อยู่ในรายการนี้ → กลุ่มที่มี other · บรรทัดเพิ่มเติมที่พิมพ์เอง (extra_features เช่น บริการของ Enterprise) → กลุ่มที่มี extras
const GROUPS = [
  { group: 'กฎหมายและมาตรฐาน', keys: ['laws', 'standards', 'laws_followed', 'notifications', 'ai'] },
  { group: 'เอกสาร', keys: ['documents', 'presentations'] },
  { group: 'ระบบงานความปลอดภัย', keys: ['dashboard', 'action_plan', 'hearing', 'mobile_app'], other: true },
  { group: 'องค์กร', extras: true },
];
// ชื่อแถวเมื่อแต่ละแผนได้ข้อความต่างกันและไม่มีคำขึ้นต้นร่วมกัน (เช่น Basic "คลังสไลด์… (ดูรายการ)" · Business "ดาวน์โหลดสไลด์…")
const ROW_TITLE = { presentations: 'สไลด์พรีเซนเทชั่น' };

// คำขึ้นต้นร่วมกันทั้งคำ: "AI ผู้ช่วยกฎหมาย 30 ข้อความ/เดือน" + "AI ผู้ช่วยกฎหมาย 200 ข้อความ/เดือน" → "AI ผู้ช่วยกฎหมาย"
const commonHead = (list) => {
  let s = list[0];
  for (const t of list) while (s && !t.startsWith(s)) s = s.slice(0, -1);
  if (!list.every((t) => t.length === s.length || t[s.length] === ' ')) s = s.slice(0, s.lastIndexOf(' ') + 1);
  return s.trim();
};
// ข้อความในช่องของแผน: ตัดชื่อแถวออก ("30 ข้อความ/เดือน") · วงเล็บท้าย ("ดูรายการ") · หรือข้อความเต็มของระบบ
const cellText = (label, title) => {
  if (label === title) return true;
  if (label.startsWith(title)) return label.slice(title.length).trim();
  const paren = /\(([^()]+)\)\s*$/.exec(label);
  if (paren) return paren[1].trim();
  const rest = label.includes(title) ? label.replace(title, '').trim() : '';
  return rest || label;
};

function compareTable(plans, matrix) {
  const order = plans.map((p) => p.key);
  const items = new Map();
  for (const r of matrix) {
    const it = items.get(r.item_key) ?? { key: r.item_key, ord: r.ord, labels: new Map() };
    it.ord = Math.min(it.ord, r.ord);
    it.labels.set(r.plan, r.label);
    items.set(r.item_key, it);
  }
  const row = (it) => {
    const holders = order.filter((k) => it.labels.has(k));
    const uniq = [...new Set(holders.map((k) => it.labels.get(k)))];
    // ทุกแผนที่มีได้ข้อความเดียวกัน → เครื่องหมายถูก · ข้อความต่างกัน (เช่น โควตา AI) → แสดงข้อความของแผนนั้นในช่อง
    const label = uniq.length === 1 ? uniq[0] : commonHead(uniq) || ROW_TITLE[it.key] || uniq[0];
    const cells = Object.fromEntries(order.map((k) => [k, !it.labels.has(k) ? false : uniq.length === 1 ? true : cellText(it.labels.get(k), label)]));
    return { key: it.key, label, cells, ord: it.ord };
  };
  const known = new Set(GROUPS.flatMap((g) => g.keys ?? []));
  const extras = [...new Set(plans.flatMap((p) => p.extra_features))].map((line) => ({
    key: `extra:${line}`, label: line, cells: Object.fromEntries(plans.map((p) => [p.key, p.extra_features.includes(line)])),
  }));
  return GROUPS.map((g) => ({
    group: g.group,
    rows: g.extras
      ? extras
      : [...items.values()].filter((it) => g.keys.includes(it.key) || (g.other && !known.has(it.key))).map(row)
        .sort((a, b) => a.ord - b.ord).map(({ ord, ...r }) => r),
  })).filter((g) => g.rows.length);
}

// strict = ชุดที่ build ไว้ (ฟีเจอร์ที่ขอไม่มีในแผนใดเลย → build ล้ม) · ข้อมูลล่าสุดไม่ strict (คืนข้อความว่าง)
export function derivePlans(d, { strict = false } = {}) {
  const bad = checkPlans(d);
  if (bad) throw new Error(`ข้อมูลแผนไม่ถูกต้อง (${bad})`);
  // ข้อความปุ่มของการ์ด — เว็บนี้กำหนดเอง (ไม่อยู่ในระบบสมาชิก)
  const PLANS = d.plans.map((p) => ({
    ...p,
    cta: p.key === 'free' ? 'เริ่มทดลองฟรี' : p.yearly === null ? 'ติดต่อทีมขาย' : 'เลือกแผนนี้',
  }));
  const has = new Set(d.matrix.map((r) => `${r.plan}|${r.item_key}`));
  const hasItem = (planKey, itemKey) => has.has(`${planKey}|${itemKey}`);
  const labelOf = (planKey, itemKey) => d.matrix.find((r) => r.plan === planKey && r.item_key === itemKey)?.label ?? '';

  // ชื่อแผนที่ได้สิทธิ์ในรูปแบบที่ใช้บนเว็บ: "Basic ขึ้นไป" (ทุกแผนถัดขึ้นไปมีด้วย) · "Enterprise" (เฉพาะแผนสูงสุด) · "Basic และ Enterprise" (ไม่ต่อเนื่อง)
  const plansText = (list, what) => {
    if (!list.length) {
      if (strict) throw new Error(`plans.json: ไม่มีแผนใดมี "${what}" — ตรวจระบบสมาชิก แล้วรัน npm run sync:plans หรือแก้ข้อความบนเว็บ`);
      return '';
    }
    const first = PLANS.findIndex((p) => p.key === list[0].key);
    if (list.length !== PLANS.length - first) return joinTh(list.map((p) => p.name));
    return first === PLANS.length - 1 ? list[0].name : `${list[0].name} ขึ้นไป`;
  };
  // แผนที่มีฟีเจอร์ (item_key ของระบบสมาชิก) · match = เฉพาะแผนที่ข้อความของฟีเจอร์ตรงเงื่อนไข เช่น /ดาวน์โหลด/
  const planWhere = (itemKey, match) =>
    plansText(PLANS.filter((p) => hasItem(p.key, itemKey) && (!match || match.test(labelOf(p.key, itemKey)))), `${itemKey}${match ? ` ${match}` : ''}`);
  const planFrom = (itemKey) => planWhere(itemKey);

  // โควตา AI ผู้ช่วยกฎหมาย (ข้อความ/เดือน) อ่านจากข้อความของระบบ "AI ผู้ช่วยกฎหมาย 30 ข้อความ/เดือน" (ตาราง ai_plan_limits)
  const AI_QUOTA = Object.fromEntries(PLANS.flatMap((p) => {
    const m = /([\d,]+)\s*ข้อความ/.exec(labelOf(p.key, 'ai'));
    return m ? [[p.key, Number(m[1].replace(/,/g, ''))]] : [];
  }));
  // "Basic 30 · Business 200 · Enterprise 500"
  const AI_QUOTA_TEXT = PLANS.filter((p) => AI_QUOTA[p.key]).map((p) => `${p.name} ${AI_QUOTA[p.key].toLocaleString('en-US')}`).join(' · ');

  const COMPARE = compareTable(PLANS, d.matrix);
  // สิทธิ์สะสมขึ้นไป = ทุกแถว เมื่อแผนหนึ่งมีแล้ว แผนถัดขึ้นไปมีด้วย
  const CUMULATIVE = COMPARE.every((g) => g.rows.every((r) => {
    const v = PLANS.map((p) => Boolean(r.cells[p.key]));
    return v.every((x, i) => !v[i - 1] || x);
  }));

  return {
    syncedIso: d.syncedIso,
    PLANS,
    COMPARE,
    CUMULATIVE,
    AI_QUOTA,
    AI_QUOTA_TEXT,
    hasItem,
    planFrom,
    planWhere,
    // แอปมือถือ — ป้าย App Store คำถามที่พบบ่อย หน้าราคา และ llms.txt ใช้ค่านี้ จะได้ตรงกับระบบสมาชิกเสมอ
    APP_PLAN: planFrom('mobile_app'),                                                          // "Business ขึ้นไป"
    WEB_ONLY_PLANS: joinTh(PLANS.filter((p) => !hasItem(p.key, 'mobile_app')).map((p) => p.name)),   // "Free และ Basic" (ใช้งานผ่านเว็บอย่างเดียว)
    // ราคาเริ่มต้นต่อปีที่ใช้โฆษณา: แผนแบบชำระเงินที่ถูกที่สุด — คำนวณจากราคาจริง ไม่เขียนตัวเลขตายตัว
    fromPrice: (keys) => Math.min(...PLANS.filter((p) => (!keys || keys.includes(p.key)) && p.yearly > 0).map((p) => p.yearly)),
    // ชื่อแผนทั้งหมด "Free, Basic, Business และ Enterprise"
    PLAN_NAMES: joinTh(PLANS.map((p) => p.name)),
  };
}

// ชุดที่ build ไว้
export const SNAPSHOT = derivePlans(DATA, { strict: true });
for (const k of REQUIRED_ITEMS) SNAPSHOT.planFrom(k);
export const { PLANS, COMPARE, CUMULATIVE, AI_QUOTA, AI_QUOTA_TEXT, hasItem, planFrom, planWhere, APP_PLAN, WEB_ONLY_PLANS, fromPrice, PLAN_NAMES } = SNAPSHOT;
