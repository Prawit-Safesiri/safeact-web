import { Link } from 'react-router-dom';

// details/summary: เปิดปิดได้แม้ JavaScript ยังไม่โหลด และโปรแกรมอ่านหน้าจอเข้าใจโดยกำเนิด
// f.link = ลิงก์ต่อท้ายคำตอบ (ภายในเว็บใช้ to · ภายนอกใช้ href เปิดแท็บใหม่)
export default function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <div>
            <p>{f.a}</p>
            {f.link && (f.link.to
              ? <p><Link className="more" to={f.link.to}>{f.link.label}</Link></p>
              : <p><a className="more" href={f.link.href} target="_blank" rel="noopener">{f.link.label}</a></p>)}
          </div>
        </details>
      ))}
    </div>
  );
}
