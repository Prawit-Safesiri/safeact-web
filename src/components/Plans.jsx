import { Link } from 'react-router-dom';
import { baht, withVat } from '../data/plans.js';
import { useLivePlans } from '../data/plans-live.js';
import { checkoutLink, COMPANY } from '../data/company.js';
import { Tick, Dash } from './Icons.jsx';

// ขายแบบรายปีอย่างเดียว (เจ้าของสั่งปิดแผนรายเดือน 22 พ.ย. 2569)
// 26 พ.ย. 2569 เจ้าของ: แอปมือถือใช้ได้เฉพาะแผน Business ขึ้นไป → บอกเหนือการ์ดแผน (หน้าแรกและหน้าราคา) ตรงที่ลูกค้าตัดสินใจ
// 26 พ.ย. 2569 เจ้าของ: การ์ดแผนและตารางเปรียบเทียบใช้ข้อมูลจริงจากระบบสมาชิก (useLivePlans) — การตั้งค่าเปลี่ยน หน้าเว็บเปลี่ยนตามเอง
export function PlanTerms() {
  const { APP_PLAN, WEB_ONLY_PLANS } = useLivePlans();
  return (
    <div className="billing">
      <p>ราคารายปี ยังไม่รวม VAT 7% · ไม่ต่ออายุอัตโนมัติ · คืนเงินได้ภายใน 7 วัน · จำหน่ายให้นิติบุคคลและหน่วยงานเท่านั้น</p>
      <p>แอป {COMPANY.appName} บน iPhone รวมอยู่ในแผน {APP_PLAN}{WEB_ONLY_PLANS && <> · แผน {WEB_ONLY_PLANS} ใช้งานผ่านเว็บ</>}</p>
    </div>
  );
}

function PlanCard({ plan, headingLevel: H = 'h3' }) {
  const isFree = plan.key === 'free';
  const isEnt = plan.yearly === null;
  const price = plan.yearly;
  const unit = isFree ? '/30 วัน' : '/ปี';

  return (
    <li className={`plan${plan.featured ? ' plan--featured' : ''}`}>
      {plan.badge && <span className={`plan__badge${plan.featured ? '' : ' plan__badge--quiet'}`}>{plan.badge}</span>}
      <H>{plan.name}</H>
      <p className="plan__sub">{plan.subtitle}</p>
      <p className="plan__price">
        {isEnt ? <strong style={{ fontSize: 28 }}>ติดต่อฝ่ายขาย</strong> : (<><strong>{isFree ? 'ฟรี' : baht(price)}</strong><span>{unit}</span></>)}
      </p>
      <p className="plan__vat">
        {isEnt && 'ราคาออกแบบตามจำนวนสาขาและผู้ใช้งาน'}
        {isFree && 'ไม่มีค่าใช้จ่ายระหว่างทดลองใช้'}
        {!isEnt && !isFree && (
          <>
            รวม VAT {baht(withVat(price))}{unit}
          </>
        )}
      </p>
      {isEnt ? (
        <Link className="btn btn--secondary btn--block" to="/contact/">{plan.cta}</Link>
      ) : (
        <a className={`btn btn--block${plan.featured ? '' : ' btn--secondary'}`} href={checkoutLink(plan.key, 'yearly')}
           aria-label={`${plan.cta} ${plan.name}${isFree ? '' : ' รายปี'}`}>
          {plan.cta}
        </a>
      )}
      <ul className="checks">
        {plan.features.map((f) => <li key={f}>{f}</li>)}
      </ul>
    </li>
  );
}

export function PlanGrid({ headingLevel }) {
  const { PLANS } = useLivePlans();
  return (
    <ul className="plans">
      {PLANS.map((p) => <PlanCard key={p.key} plan={p} headingLevel={headingLevel} />)}
    </ul>
  );
}

export function PlansYearly({ headingLevel }) {
  return (
    <>
      <PlanTerms />
      <PlanGrid headingLevel={headingLevel} />
    </>
  );
}

// แถว = ฟีเจอร์ที่แต่ละแผนมีจริงในระบบสมาชิก (plan_feature_matrix) · ช่องที่เป็นข้อความ = แผนนั้นได้ต่างกัน เช่น โควตา AI
export function CompareTable() {
  const { PLANS, COMPARE } = useLivePlans();
  return (
    <div className="compare-wrap" tabIndex={0} role="region" aria-label="ตารางเปรียบเทียบแผน (เลื่อนแนวนอนได้)">
      <table className="compare">
        <caption className="visually-hidden">เปรียบเทียบสิทธิ์การใช้งานของแต่ละแผน</caption>
        <thead>
          <tr>
            <td style={{ width: '32%' }}></td>
            {PLANS.map((p) => <th key={p.key} scope="col" className={p.featured ? 'col-featured' : ''}>{p.name}</th>)}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">ราคารายปี (ยังไม่รวม VAT)</th>
            {PLANS.map((p) => (
              <td key={p.key} className={p.featured ? 'col-featured' : ''}>
                {p.yearly === null ? 'ติดต่อ' : p.yearly === 0 ? 'ฟรี 30 วัน' : baht(p.yearly)}
              </td>
            ))}
          </tr>
          {COMPARE.map((g) => [
            <tr className="grp" key={g.group}><th colSpan={PLANS.length + 1} scope="colgroup">{g.group}</th></tr>,
            ...g.rows.map(({ key, label, cells }) => (
              <tr key={key}>
                <th scope="row">{label}</th>
                {PLANS.map((p) => {
                  const v = cells[p.key];
                  return (
                    <td key={p.key} className={`${v ? 'yes' : 'no'}${p.featured ? ' col-featured' : ''}`}>
                      {typeof v === 'string' ? <span className="compare__val">{v}</span> : v ? <Tick /> : <Dash />}
                      {typeof v !== 'string' && <span className="visually-hidden">{v ? 'มี' : 'ไม่มี'}</span>}
                    </td>
                  );
                })}
              </tr>
            )),
          ])}
        </tbody>
      </table>
    </div>
  );
}
