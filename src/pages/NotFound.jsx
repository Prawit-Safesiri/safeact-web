import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main id="main">
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h1 className="t-h1">ไม่พบหน้าที่คุณค้นหา</h1>
          <p className="t-lead muted" style={{ marginTop: 16 }}>หน้านี้อาจถูกย้ายหรือไม่มีอยู่แล้ว</p>
          <div className="cta-row" style={{ marginTop: 32 }}>
            <Link className="btn" to="/">กลับหน้าแรก</Link>{' '}
            <Link className="more" to="/features/">ดูฟีเจอร์ SafeAct</Link>{' '}
            <Link className="more" to="/pricing/">ดูแผนและราคา</Link>{' '}
            <Link className="more" to="/contact/">ติดต่อ SafeAct</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
