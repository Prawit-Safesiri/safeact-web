import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { checkoutLink } from '../data/company.js';
import { IconLock } from './Icons.jsx';

// หน้าต่าง "ตัวอย่างรายการกฎหมายประจำเดือน" (หน้า /law-updates/ · เปิดจากการ์ดเดือนล่าสุด)
// ตาราง = ฉบับจริง 6 ฉบับแรกของเดือนจากระบบสมาชิก (src/data/laws.js ← laws.json ← npm run sync:laws) เรียงแบบเดียวกับแอป (เพิ่มเข้าคลังล่าสุดก่อน)
// แถวล่างจางหายไป แล้วชวนทดลองใช้ฟรี — สรุปสาระสำคัญและเอกสารฉบับเต็มอยู่ในระบบสมาชิกเท่านั้น (ไม่ส่งเนื้อหาสรุปขึ้นเว็บ)
// ใช้โครงหน้าต่างเดียวกับหน้าต่าง AI (.aid · <dialog> ปิดด้วย ✕ / Esc / คลิกพื้นหลัง)
const KIND = { new: 'ใหม่', amended: 'แก้ไข', repealed: 'ยกเลิก' };
const n = (x) => x.toLocaleString('en-US');

export default function MonthSample({ month, syncedTh, summary }) {
  const ref = useRef(null);
  const close = () => ref.current?.close();
  const rest = month.total - month.sample.length;
  const id = `lmd-${month.ym}`;
  return (
    <>
      {/* ปุ่มนี้ขยายพื้นที่กดเต็มการ์ด (.lkpi__more::after) */}
      <button type="button" className="lkpi__more" aria-haspopup="dialog" onClick={() => ref.current?.showModal()}>
        ดูตัวอย่างรายการ
      </button>
      <dialog ref={ref} className="aid lmd" aria-labelledby={id} data-nosnippet=""
        onClick={(e) => { if (e.target === ref.current) close(); }}>
        <div className="aid__box">
          <button type="button" className="aid__close" aria-label="ปิด" onClick={close} />
          <div className="lmd__body">
            <header className="lmd__head">
              <p className="lmd__kicker">อัปเดตกฎหมายประจำเดือน</p>
              <h2 id={id} className="lmd__title">{month.long}</h2>
              <p className="lmd__meta"><strong>{n(month.total)}</strong> ฉบับ · {summary}</p>
            </header>

            <div className="lmd__fade">
              <table className="lmd__table">
                <caption className="visually-hidden">ตัวอย่าง {month.sample.length} จาก {n(month.total)} ฉบับ ของ{month.long}</caption>
                <thead>
                  <tr>
                    <th scope="col" className="lmd__no">#</th>
                    <th scope="col">ชื่อกฎหมาย</th>
                    <th scope="col">หน่วยงาน</th>
                    <th scope="col">ประกาศ</th>
                    <th scope="col">มีผล</th>
                    <th scope="col">สรุปและฉบับเต็ม</th>
                  </tr>
                </thead>
                <tbody>
                  {month.sample.map((r, i) => (
                    <tr key={r.title}>
                      <td className="lmd__no">{i + 1}</td>
                      <th scope="row" className="lmd__law">
                        <span className={`lmd__kind lmd__kind--${r.kind}`}>{KIND[r.kind]}</span>
                        <span className="lmd__name">{r.title}</span>
                      </th>
                      <td className="lmd__org">{r.ministry ?? '–'}</td>
                      <td data-h="ประกาศ">{r.announce ?? '–'}</td>
                      <td data-h="มีผล">{r.effective ?? '–'}</td>
                      <td className="lmd__lock">
                        <IconLock />
                        <span>{r.summary && r.pdf ? 'สรุป · ฉบับเต็ม' : r.summary ? 'สรุป' : 'ฉบับเต็ม'} สำหรับสมาชิก</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lmd__cta">
              {rest > 0 && <p className="lmd__rest">และอีก <b>{n(rest)} ฉบับ</b> ใน{month.long}</p>}
              <p className="lmd__pitch">ดูรายชื่อครบทุกฉบับ พร้อมสรุปสาระสำคัญ วันมีผลใช้บังคับ และลิงก์เอกสารฉบับเต็ม แล้วรับการแจ้งเตือนเมื่อมีฉบับใหม่ในหมวดที่คุณติดตาม</p>
              <p className="cta-row">
                <a className="btn" href={checkoutLink('free')}>ทดลองใช้ฟรี 30 วัน</a>{' '}
                <Link className="more" to="/pricing/" onClick={close}>ดูแผนและราคา</Link>
              </p>
              <p className="lmd__note">
                ตัวอย่าง {month.sample.length} จาก {n(month.total)} ฉบับ เรียงตามวันที่เพิ่มเข้าคลังล่าสุด · ข้อมูล ณ {syncedTh}
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
