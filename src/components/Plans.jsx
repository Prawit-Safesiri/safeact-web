import { useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { PLANS, COMPARE, hasFeature, baht, withVat, yearlySaving } from '../data/plans.js';
import { checkoutLink } from '../data/company.js';
import { Tick, Dash } from './Icons.jsx';

export function BillingSwitch({ cycle, onChange }) {
  const id = useId();
  return (
    <div className="billing">
      <fieldset className="seg" style={{ border: 0, margin: 0 }}>
        <legend className="visually-hidden">รอบการชำระเงิน</legend>
        <input type="radio" id={`${id}-y`} name={`${id}-cycle`} checked={cycle === 'yearly'} onChange={() => onChange('yearly')} />
        <label htmlFor={`${id}-y`}>รายปี<small>ประหยัดกว่า ~17%</small></label>
        <input type="radio" id={`${id}-m`} name={`${id}-cycle`} checked={cycle === 'monthly'} onChange={() => onChange('monthly')} />
        <label htmlFor={`${id}-m`}>รายเดือน<small>&nbsp;</small></label>
      </fieldset>
      <p>ราคายังไม่รวม VAT 7% · ไม่ต่ออายุอัตโนมัติ · คืนเงินได้ภายใน 14 วัน</p>
    </div>
  );
}

function PlanCard({ plan, cycle, headingLevel: H = 'h3' }) {
  const isFree = plan.key === 'free';
  const isEnt = plan.yearly === null;
  const price = cycle === 'yearly' ? plan.yearly : plan.monthly;
  const unit = isFree ? '/30 วัน' : cycle === 'yearly' ? '/ปี' : '/เดือน';
  const save = yearlySaving(plan);

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
            {cycle === 'yearly' && save > 0 && <><br /><span className="plan__save">ประหยัด {baht(save)} เทียบรายเดือน</span></>}
            {cycle === 'monthly' && <><br />เฉลี่ยรายปี {baht(plan.monthly * 12)}</>}
          </>
        )}
      </p>
      {isEnt ? (
        <Link className="btn btn--secondary btn--block" to="/contact/">{plan.cta}</Link>
      ) : (
        <a className={`btn btn--block${plan.featured ? '' : ' btn--secondary'}`} href={checkoutLink(plan.key, cycle)}
           aria-label={`${plan.cta} ${plan.name}${isFree ? '' : cycle === 'yearly' ? ' รายปี' : ' รายเดือน'}`}>
          {plan.cta}
        </a>
      )}
      <ul className="checks">
        {plan.features.map((f) => <li key={f} className={f.startsWith('หลังครบ') ? 'is-warn' : ''}>{f}</li>)}
      </ul>
    </li>
  );
}

export function PlanGrid({ cycle, headingLevel }) {
  return (
    <ul className="plans">
      {PLANS.map((p) => <PlanCard key={p.key} plan={p} cycle={cycle} headingLevel={headingLevel} />)}
    </ul>
  );
}

export function PlansWithSwitch({ headingLevel }) {
  const [cycle, setCycle] = useState('yearly');
  return (
    <>
      <BillingSwitch cycle={cycle} onChange={setCycle} />
      <PlanGrid cycle={cycle} headingLevel={headingLevel} />
    </>
  );
}

export function CompareTable() {
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
          <tr>
            <th scope="row">ราคารายเดือน (ยังไม่รวม VAT)</th>
            {PLANS.map((p) => (
              <td key={p.key} className={p.featured ? 'col-featured' : ''}>
                {p.monthly === null ? 'ติดต่อ' : p.monthly === 0 ? '—' : baht(p.monthly)}
              </td>
            ))}
          </tr>
          {COMPARE.map((g) => [
            <tr className="grp" key={g.group}><th colSpan={PLANS.length + 1} scope="colgroup">{g.group}</th></tr>,
            ...g.rows.map(([label, from]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                {PLANS.map((p) => {
                  const ok = hasFeature(p.key, from);
                  return (
                    <td key={p.key} className={`${ok ? 'yes' : 'no'}${p.featured ? ' col-featured' : ''}`}>
                      {ok ? <Tick /> : <Dash />}
                      <span className="visually-hidden">{ok ? 'มี' : 'ไม่มี'}</span>
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
