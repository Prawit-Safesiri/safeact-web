import { AiContent } from '../components/AiDetail.jsx';

// หน้า /ai/ — เนื้อหาเดียวกับหน้าต่างรายละเอียดในหน้าแรก แต่มี URL ของตัวเองให้ Google เก็บลงดัชนี
export default function AiCompare() {
  return (
    <main id="main" className="aid-page">
      <article className="aid__box" aria-labelledby="ai-title">
        <AiContent as="h1" titleId="ai-title" photo />
      </article>
    </main>
  );
}
