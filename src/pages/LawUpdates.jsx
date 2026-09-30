import { Link } from 'react-router-dom';
import Media from '../components/Media.jsx';
import Faq from '../components/Faq.jsx';
import StoreBadges from '../components/StoreBadges.jsx';
import MonthSample from '../components/MonthSample.jsx';
import LawUpdateMotion from '../components/LawUpdateMotion.jsx';
import { IconHelmet, IconLeaf, IconFood } from '../components/Icons.jsx';
import { COMPANY, checkoutLink } from '../data/company.js';
import { planFrom } from '../data/plans.js';
import { coverSrc } from '../data/laws.js';
import { useLiveLaws } from '../data/laws-live.js';
import { STANDARD_GROUPS, STANDARD_COUNT } from '../data/standards.js';
import { FAQ_LAWS } from '../data/faq.js';

// หน้าอัปเดตกฎหมาย — ข้อมูลชุดเดียวกับหน้า "อัปเดตกฎหมาย" ในระบบสมาชิก
// ตัวเลขเริ่มจากชุดที่ build ไว้ (src/data/laws.json) แล้วเปลี่ยนเป็นชุดล่าสุดจากเซิร์ฟเวอร์ (useLiveLaws)
// → การ์ด "ล่าสุด" กราฟ 12 เดือน และจำนวนต่อหมวด เลื่อนเป็นเดือนล่าสุดเองทุกเดือน · FAQ ใช้ชุดที่ build (ตรงกับ JSON-LD)
// ดีไซน์เป็นของเว็บนี้เอง ไม่ลอกการ์ด/สไลด์ของแอป · บนสุดเป็นภาพเคลื่อนไหวจำลอง Hub กฎหมาย + การแจ้งเตือน (LawUpdateMotion)
// ภาพหน้าปกหมวดเป็นภาพเดียวกับในแอป (law_categories.cover) · หมวดที่ยังไม่มีภาพในแอปแสดงกรอบภาพเปล่า (Media)
// การ์ดหมวดกฎหมายคลิกไม่ได้ (เจ้าของกำหนด) — มีปุ่มทดลองใช้ฟรีท้ายส่วน
// แจ้งเตือนในแอปเกิดจาก "หมวดที่ติดตาม" เท่านั้น (ติดตามรายฉบับไม่แจ้งเตือน) — ข้อความในหน้านี้ต้องไม่อ้างว่าติดตามรายฉบับแล้วได้แจ้งเตือน
const n = (x) => x.toLocaleString('en-US');
const STD_ICONS = { safety: IconHelmet, environment: IconLeaf, food: IconFood };
const SERIES = [['new', 'ใหม่'], ['amended', 'แก้ไข'], ['repealed', 'ยกเลิก']];

// ไม่ตัดกลางคำประสม (ตัวตัดคำภาษาไทยของเบราว์เซอร์แยก "ความ|ปลอดภัย" "อาชีว|อนามัย" "เจ้า|หน้าที่" "การ|ทำงาน" ได้)
const KEEP = /(ความปลอดภัย|อาชีวอนามัย|สภาพแวดล้อม|สิ่งแวดล้อม|จดทะเบียน|ผู้ชำนาญการ|เจ้าหน้าที่|การทำงาน|เกี่ยวกับ|พระราชบัญญัติ)/;
const keep = (t) => t.split(KEEP).map((p, i) => (i % 2 ? <span key={i} className="nw">{p}</span> : p));
// "กฎกระทรวงฯ ความปลอดภัยเกี่ยวกับไฟฟ้า" → ป้ายเล็ก "กฎกระทรวงฯ" + ชื่อ (ข้อความรวมยังตรงกับชื่อหมวดใน JSON-LD)
const KIND = 'กฎกระทรวงฯ ';
const CatTitle = ({ title }) => (title.startsWith(KIND)
  ? <><span className="lcat__kind">{KIND.trim()}</span>{' '}{keep(title.slice(KIND.length))}</>
  : keep(title));

// "ใหม่ 42 · แก้ไข 3" — ไม่แสดงประเภทที่เป็น 0 (เหมือนแอป)
const parts = (r) => SERIES.filter(([k]) => r[k] > 0).map(([k, label]) => `${label} ${n(r[k])}`).join(' · ');
// การ์ดเดือนล่าสุด: เดือนที่ยังนับไม่ครบต่อท้าย "นับถึงวันที่ 29" · เดือนที่ครบแล้ว (ต้นเดือนใหม่ที่ยังไม่มีฉบับแรก) ไม่ต่อท้าย
const sofar = (r, laws, long) => [r.total ? parts(r) : 'ยังไม่มีฉบับใหม่',
  r.partial && (long ? `นับถึง ${laws.syncedTh}` : `นับถึงวันที่ ${laws.syncedDay}`)].filter(Boolean).join(' · ');

// ภาพหน้าปกหมวด (ภาพเดียวกับในแอป) — เป็นภาพประกอบ ชื่อหมวดอยู่ในหัวข้อการ์ดแล้วจึงใช้ alt ว่าง
// มือถือเป็นภาพเล็ก 64 px (ไฟล์ 320) · แท็บเล็ต 3 คอลัมน์ · จอคอม 4 คอลัมน์ ~300 px (ไฟล์ 640 สำหรับจอความละเอียดสูง)
const CatCover = ({ name }) => (
  <img className="lcat__img" src={coverSrc(name, 640)} srcSet={`${coverSrc(name, 320)} 320w, ${coverSrc(name, 640)} 640w`}
    sizes="(max-width: 734px) 64px, (max-width: 1068px) 33vw, 300px" width="640" height="360" alt="" loading="lazy" decoding="async" />
);

// กราฟแท่ง 12 เดือน (HTML/CSS ล้วน เรนเดอร์บนเซิร์ฟเวอร์) · ตัวเลขทุกเดือนแสดงบนแท่ง
// โปรแกรมอ่านหน้าจออ่านประโยคเต็มของแต่ละเดือน (ซ่อนจากตา) แทนป้ายย่อ · ตารางตัวเลขใต้กราฟเจ้าของสั่งลบ (29 ก.ย. 2569)
function MonthlyChart({ laws: { LAWS, MONTHS12, SUM12, PEAK } }) {
  const cur = MONTHS12.at(-1);   // เดือนที่ดึงข้อมูล (ยังนับไม่ครบ · แท่งมี *)
  return (
    <figure className="lchart" aria-labelledby="lchart-title">
      <div className="lchart__head">
        <div>
          <h3 id="lchart-title" className="lchart__title">จำนวนฉบับตามเดือนที่ประกาศ</h3>
          <p className="lchart__range">{SUM12.from} – {SUM12.to} · ข้อมูล ณ {LAWS.syncedTh}</p>
        </div>
        <ul className="lchart__legend">
          {SERIES.map(([k, label]) => (
            <li key={k}><i className={`lchart__sw lchart__sw--${k}`} aria-hidden="true" />{label} <b>{n(SUM12[k])}</b></li>
          ))}
        </ul>
      </div>

      <div className="lchart__plot">
        <ol className="lbars" style={{ '--max': Math.max(1, PEAK.total) }} aria-label={`จำนวนฉบับรายเดือน ${SUM12.from} ถึง ${SUM12.to}`}>
          {MONTHS12.map((r) => (
            <li key={r.ym} className={`lbar${r.partial ? ' lbar--partial' : ''}`} style={{ '--v': r.total }}
              title={`${r.long}: ${r.total} ฉบับ${r.total ? ` (${parts(r)})` : ''}`}>
              <span className="visually-hidden">{r.long}{r.partial ? ` (นับถึง ${LAWS.syncedTh})` : ''} {n(r.total)} ฉบับ{r.total ? ` ${parts(r)}` : ''}</span>
              <span className="lbar__track" aria-hidden="true">
                <span className="lbar__val">{n(r.total)}{r.partial ? '*' : ''}</span>
                <span className="lbar__col">
                  {SERIES.filter(([k]) => r[k] > 0).map(([k]) => (
                    <i key={k} className={`lbar__seg lbar__seg--${k}`} style={{ flexGrow: r[k] }} />
                  ))}
                </span>
              </span>
              <span className="lbar__mon" aria-hidden="true">{r.short} <span>{r.yy}</span></span>
            </li>
          ))}
        </ol>
      </div>

      <p className="lchart__sum">
        รวม {n(SUM12.total)} ฉบับใน 12 เดือน · มากที่สุด {PEAK.long} ({n(PEAK.total)} ฉบับ)
      </p>
      <p className="lchart__note">
        * {cur.long} นับถึงวันที่ {LAWS.syncedTh} · ฉบับที่ไม่มีวันประกาศนับตามเดือนที่เพิ่มเข้าคลัง
      </p>
    </figure>
  );
}

export default function LawUpdates() {
  const laws = useLiveLaws();
  const { LAWS, MONTHS12, SUM12, LATEST, PREV, CATEGORY_GROUPS, CATEGORIES } = laws;
  const cur = MONTHS12.at(-1);
  return (
    <main id="main">
      {/* ─── HERO ─── */}
      <section className="hero" aria-labelledby="lu-title">
        <div className="container">
          <p className="t-eyebrow">คลังกฎหมาย SafeAct</p>
          <h1 id="lu-title" className="t-hero lu-title" style={{ marginTop: 12 }}>
            <span>อัปเดตกฎหมาย</span><span>ความปลอดภัย</span>
          </h1>
          <p className="t-sub t-lines">
            <span>{keep('กฎหมายและมาตรฐานด้านความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน')}</span>{' '}
            <span>สรุปพร้อมลิงก์ต้นฉบับ และแจ้งเตือนเมื่อมีฉบับใหม่ในหมวดที่คุณติดตาม</span>
          </p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
          <p className="hero__note">มีในแผน {planFrom('อัปเดตกฎหมาย')} · ข้อมูล ณ {LAWS.syncedTh}</p>
        </div>
        <div className="container--wide hero__media">
          <LawUpdateMotion />
          <p className="pm-note">ภาพจำลองการใช้งาน {COMPANY.appName} ข้อมูลในภาพเป็นตัวอย่าง</p>
        </div>
      </section>

      {/* ─── ตัวเลขสรุป ─── */}
      <section className="section lu-stats" aria-labelledby="lu-stats-title">
        <div className="container">
          <h2 id="lu-stats-title" className="visually-hidden">ตัวเลขคลังกฎหมาย SafeAct ณ {LAWS.syncedTh}</h2>
          <ul className="stats">
            <li><strong>{n(LAWS.total)}</strong><span>ฉบับในคลังกฎหมาย</span></li>
            <li><strong>{CATEGORIES.length}</strong><span>หมวดกฎหมาย</span></li>
            <li><strong>{n(SUM12.total)}</strong><span>ฉบับ ประกาศ {MONTHS12[0].short} {MONTHS12[0].yy} – {cur.short} {cur.yy}</span></li>
            <li><strong>{STANDARD_COUNT}</strong><span>มาตรฐานระบบการจัดการ</span></li>
          </ul>
        </div>
      </section>

      {/* ─── กฎหมายใหม่รายเดือน ─── */}
      <section className="section section--alt" id="monthly" aria-labelledby="lu-monthly">
        <div className="container">
          <header className="section-head">
            <h2 id="lu-monthly" className="t-h1">กฎหมายใหม่ทุกเดือน</h2>
            <p className="t-lead t-lines"><span>กฎหมาย ประกาศ และมาตรฐานในคลัง นับตามเดือนที่ประกาศ</span>{' '}<span>แยกฉบับใหม่ ฉบับแก้ไข และฉบับยกเลิก</span></p>
          </header>
          {/* เดือนล่าสุด = เดือนใหม่สุดที่มีกฎหมายแล้ว (ต้นเดือนที่ยังไม่มีฉบับใหม่ยังแสดงเดือนก่อน) + เดือนก่อนหน้า · เลื่อนเองทุกเดือน */}
          <ul className="lkpis">
            <li className="lkpi">
              <p className="lkpi__label"><em className="lkpi__pill">ล่าสุด</em> {LATEST.long}</p>
              <p className="lkpi__num"><strong>{n(LATEST.total)}</strong> ฉบับ</p>
              <p className="lkpi__parts">{sofar(LATEST, LAWS)}</p>
              {LATEST.sample.length > 0 && (
                <MonthSample month={LATEST} syncedTh={LAWS.syncedTh} summary={sofar(LATEST, LAWS, true)} />
              )}
            </li>
            <li className="lkpi">
              <p className="lkpi__label">{PREV.long}</p>
              <p className="lkpi__num"><strong>{n(PREV.total)}</strong> ฉบับ</p>
              <p className="lkpi__parts">{PREV.total ? parts(PREV) : 'ไม่มีฉบับใหม่'}</p>
            </li>
          </ul>
          <MonthlyChart laws={laws} />
        </div>
      </section>

      {/* ─── หมวดกฎหมาย ─── */}
      <section className="section" id="categories" aria-labelledby="lu-cats">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="lu-cats" className="t-h1"><span className="lu-phrase">{CATEGORIES.length} หมวดกฎหมาย</span>{' '}<span className="lu-phrase">ครอบคลุมงาน จป.</span></h2>
            <p className="t-lead t-lines"><span>จัดหมวดตามลักษณะงานและหน่วยงานที่ออกกฎหมาย</span>{' '}<span>จำนวนฉบับ ณ {LAWS.syncedTh} · กฎหมายฉบับหนึ่งอาจอยู่ได้หลายหมวด</span></p>
          </header>
          {CATEGORY_GROUPS.map((g) => (
            <div className="lgroup" key={g.key}>
              <div className="lgroup__head">
                <h3 id={`lg-${g.key}`} className="t-h3">{g.phrases.map((p, i) => <span key={p} className="lu-phrase">{i > 0 && ' '}{p}</span>)}</h3>
                <p>{g.items.length} หมวด · {keep(g.lead)}</p>
              </div>
              <ul className="lcats" aria-labelledby={`lg-${g.key}`}>
                {g.items.map((c) => (
                  <li className="lcat" key={c.slug}>
                    {c.cover ? <CatCover name={c.cover} /> : <Media bare ratio="16/9" />}
                    <div className="lcat__body">
                      <h4 className="lcat__title"><CatTitle title={c.title} /></h4>
                      {c.desc && <p className="lcat__desc">{c.desc}</p>}
                      <p className="lcat__count"><b>{n(c.count)}</b> ฉบับ</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="lcats__cta">
            <p>ดูรายชื่อ สรุป และลิงก์ต้นฉบับของกฎหมายทุกหมวดในระบบสมาชิก</p>
            <div className="cta-row">
              <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── มาตรฐานระบบการจัดการ ─── */}
      <section className="section section--alt" id="standards" aria-labelledby="lu-std">
        <div className="container">
          <header className="section-head">
            <h2 id="lu-std" className="t-h1">มาตรฐานระบบการจัดการ</h2>
            <p className="t-lead t-lines"><span>มาตรฐาน ISO และมาตรฐานด้านความปลอดภัย สิ่งแวดล้อม และอาหาร</span>{' '}<span>รวมรายชื่อไว้ใน Hub กฎหมาย · มีในแผน {planFrom('อัปเดตมาตรฐานสากล')}</span></p>
          </header>
          <ul className="lstd">
            {STANDARD_GROUPS.map((g) => {
              const Icon = STD_ICONS[g.key];
              return (
                <li className="lstd__group" key={g.key}>
                  <Icon className="lstd__icon" />
                  <h3>{g.title}</h3>
                  <p className="lstd__en" lang="en">{g.en}</p>
                  <ul className="lstd__items">
                    {g.items.map((s) => (
                      <li key={s.code}>
                        <b lang="en">{s.code}</b>
                        <span>{s.title}</span>
                        <small>{s.detail}</small>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ─── กฎหมายใหม่ถึงคุณอย่างไร ─── */}
      <section className="section" aria-labelledby="lu-how">
        <div className="container--wide">
          <header className="section-head">
            <h2 id="lu-how" className="t-h1">กฎหมายใหม่ถึงคุณอย่างไร</h2>
          </header>
          <ol className="steps">
            <li><h3>เลือกหมวดที่ติดตาม</h3><p>ติดตามเฉพาะหมวดกฎหมายที่เกี่ยวกับงานของคุณ มีฉบับใหม่ในหมวดนั้นเมื่อไรก็ได้รับแจ้งเตือน</p></li>
            <li><h3>ทีมงานเพิ่มฉบับใหม่</h3><p>ติดตามประกาศจากแหล่งทางการ เพิ่มเข้าคลังพร้อมวันประกาศ วันมีผลใช้บังคับ และระดับผลกระทบ</p></li>
            <li><h3>สรุปพร้อมลิงก์ต้นฉบับ</h3><p>อ่านสาระสำคัญเป็นภาษาที่เข้าใจง่าย แล้วเปิดตัวบทต้นฉบับเพื่อตรวจสอบได้ทันที</p></li>
            <li><h3>แจ้งเตือนถึงคุณ</h3><p>ในระบบ ทางอีเมลสรุป (ทันที รายวัน รายสัปดาห์ หรือรายเดือน) และ Push Notification บนแอปมือถือ</p></li>
          </ol>
        </div>
      </section>

      {/* ─── คำถามที่พบบ่อย ─── */}
      <section className="section section--alt" aria-labelledby="lu-faq">
        <div className="container">
          <header className="section-head">
            <h2 id="lu-faq" className="t-h1">คำถามที่พบบ่อย</h2>
          </header>
          <Faq items={FAQ_LAWS} />
        </div>
      </section>

      {/* ─── ปิดท้าย ─── */}
      <section className="section" aria-labelledby="lu-cta">
        <div className="container cta-band">
          <h2 id="lu-cta" className="t-h1">เริ่มติดตามกฎหมาย<br />ที่เกี่ยวกับงานของคุณ</h2>
          <p className="t-lead">ทดลองใช้ฟรี 30 วัน ไม่มีค่าใช้จ่ายระหว่างทดลองใช้</p>
          <div className="cta-row">
            <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี</a>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>
          </div>
          <StoreBadges className="stores--center" />
        </div>
      </section>
    </main>
  );
}
