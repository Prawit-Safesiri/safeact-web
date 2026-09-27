// ไอคอนเส้น 1.5px สไตล์ SF Symbols (วาดใหม่เป็น SVG — ใช้ SF Symbols จริงบนเว็บไม่ได้ตามสัญญาอนุญาต)
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
const I = ({ children, ...r }) => (
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...r}>{children}</svg>
);
export const IconScale = (p) => <I {...p}><g {...P}><path d="M24 7v34M14 41h20M9 13h30"/><path d="M9 13l-6 13a6 6 0 0 0 12 0zM39 13l-6 13a6 6 0 0 0 12 0z"/></g></I>;
export const IconBell = (p) => <I {...p}><g {...P}><path d="M14 33V21a10 10 0 0 1 20 0v12l3 4H11z"/><path d="M20 40a4 4 0 0 0 8 0"/></g></I>;
export const IconDoc = (p) => <I {...p}><g {...P}><path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9M18 24h14M18 30h14M18 36h8"/></g></I>;
export const IconShield = (p) => <I {...p}><g {...P}><path d="M24 5l15 6v11c0 10-6.5 17-15 21-8.5-4-15-11-15-21V11z"/><path d="M17 24l5 5 9-10"/></g></I>;
export const IconChart = (p) => <I {...p}><g {...P}><path d="M6 42h36M12 36V24M20 36V14M28 36V20M36 36V8"/></g></I>;
export const IconCap = (p) => <I {...p}><g {...P}><path d="M4 18l20-9 20 9-20 9z"/><path d="M12 22v10c4 4 20 4 24 0V22M44 18v12"/></g></I>;
export const IconEar = (p) => <I {...p}><g {...P}><path d="M16 20a10 10 0 0 1 20 0c0 7-7 8-7 15a6 6 0 0 1-11 2"/><path d="M22 20a4 4 0 0 1 8 0c0 3-3 4-3 6"/></g></I>;
export const IconCheck = (p) => <I {...p}><g {...P}><rect x="8" y="6" width="32" height="38" rx="4"/><path d="M18 6v4h12V6M16 22l3 3 6-6M16 34l3 3 6-6M30 23h4M30 35h4"/></g></I>;
// ประกายเคลื่อนไหว (ไทล์ AI) — แยกดาวเป็นชิ้นให้ CSS ขยับทีละดวง (.spark-anim ใน components.css)
export const IconSparkAnim = ({ className = '', ...p }) => (
  <I className={`spark-anim ${className}`} {...p}>
    <g {...P}>
      <path className="spark-anim__big" d="M24 6l3.5 10.5L38 20l-10.5 3.5L24 34l-3.5-10.5L10 20l10.5-3.5z" />
      <path className="spark-anim__small" d="M38 32l1.5 4.5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-1.5z" />
      <path className="spark-anim__tiny" d="M10 35l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
    </g>
  </I>
);
export const IconSpark = (p) => <I {...p}><g {...P}><path d="M24 6l3.5 10.5L38 20l-10.5 3.5L24 34l-3.5-10.5L10 20l10.5-3.5zM38 32l1.5 4.5L44 38l-4.5 1.5L38 44l-1.5-4.5L32 38l4.5-1.5z"/></g></I>;
export const IconUsers = (p) => <I {...p}><g {...P}><circle cx="18" cy="16" r="6"/><path d="M6 40c0-7 5-12 12-12s12 5 12 12"/><circle cx="34" cy="18" r="5"/><path d="M32 28c6 0 10 4 10 10"/></g></I>;
export const IconPhone = (p) => <I {...p}><g {...P}><rect x="13" y="4" width="22" height="40" rx="5"/><path d="M21 8h6"/></g></I>;
export const IconLock = (p) => <I {...p}><g {...P}><rect x="10" y="21" width="28" height="21" rx="4"/><path d="M16 21v-6a8 8 0 0 1 16 0v6M24 29v5"/></g></I>;
export const IconReceipt = (p) => <I {...p}><g {...P}><path d="M11 5h26v38l-4.3-3-4.4 3-4.3-3-4.3 3-4.4-3-4.3 3z"/><path d="M17 15h14M17 22h14M17 29h8"/></g></I>;
export const IconBuilding = (p) => <I {...p}><g {...P}><path d="M8 42V10l16-5v37M24 16l16 5v21M4 42h40M14 16h4M14 24h4M14 32h4M30 26h4M30 33h4"/></g></I>;
export const IconMail = (p) => <I {...p}><g {...P}><rect x="5" y="10" width="38" height="28" rx="4"/><path d="M6 12l18 14 18-14"/></g></I>;
export const IconCall = (p) => <I {...p}><g {...P}><path d="M14 6l6 9-4 4c2 5 6 9 11 11l4-4 9 6-3 7c-17 0-30-13-30-30z"/></g></I>;
export const IconImage = (p) => <I {...p}><g {...P}><rect x="5" y="9" width="38" height="30" rx="4"/><circle cx="16" cy="19" r="3.5"/><path d="M5 33l11-10 9 8 6-5 12 10"/></g></I>;
export const IconVideo = (p) => <I {...p}><g {...P}><rect x="4" y="12" width="28" height="24" rx="4"/><path d="M32 21l12-7v20l-12-7z"/></g></I>;
export const Tick = () => <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M4 9.5l3.2 3.2L14 5.8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
export const Dash = () => <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M5 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>;
