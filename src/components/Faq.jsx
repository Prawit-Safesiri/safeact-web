// details/summary: เปิดปิดได้แม้ JavaScript ยังไม่โหลด และโปรแกรมอ่านหน้าจอเข้าใจโดยกำเนิด
export default function Faq({ items }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <div><p>{f.a}</p></div>
        </details>
      ))}
    </div>
  );
}
