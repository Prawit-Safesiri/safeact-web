// โครงหน้าเอกสาร (นโยบาย/ข้อกำหนด): หัวเรื่อง + สารบัญติดข้าง + เนื้อหา
export default function DocPage({ id, title, lead, updated, toc, children }) {
  return (
    <main id="main">
      <header className="container doc-hero">
        <h1 id={id} className="t-h1">{title}</h1>
        {/* lead ส่งเป็น <span> หลายชิ้นได้: แต่ละชิ้นขึ้นบรรทัดใหม่บนจอกว้าง (t-lines) */}
        {lead && <p className="t-lead t-lines">{lead}</p>}
        {updated && <p className="doc-meta">มีผลบังคับใช้และปรับปรุงล่าสุด: <time dateTime={updated.iso}>{updated.th}</time></p>}
      </header>
      <div className="container doc">
        <nav className="doc__toc" aria-label="สารบัญ">
          <p>ในหน้านี้</p>
          <ol>{toc.map(([h, t]) => <li key={h}><a href={`#${h}`}>{t}</a></li>)}</ol>
        </nav>
        <article className="doc__body" aria-labelledby={id}>{children}</article>
      </div>
    </main>
  );
}
