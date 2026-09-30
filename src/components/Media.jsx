import { IconImage } from './Icons.jsx';

// กล่องภาพเปล่า (mock) สำหรับภาพ/วิดีโอที่ยังไม่มีไฟล์จริง — วางไฟล์จริงทีหลังโดยแทนที่คอมโพเนนต์นี้ด้วย <img>/<video>
// ป้ายชื่อและขนาดไฟล์ที่ต้องเตรียม (label/spec) แสดงเฉพาะตอน npm run dev ให้ทีมออกแบบเห็น · เว็บจริงเป็นกล่องเปล่า ไม่มีข้อความ
// เป็นของตกแต่ง: ซ่อนจากโปรแกรมอ่านหน้าจอ และไม่ให้ Google นำไปแสดงในผลค้นหา (data-nosnippet)
// bare = แสดงเฉพาะไอคอน (กล่องเล็ก เช่น การ์ดหมวดกฎหมาย)
export default function Media({ kind = 'image', label, spec, ratio = '16/9', dark = false, bare = false, className = '' }) {
  const isVideo = kind === 'video';
  const showLabel = import.meta.env.DEV && !bare && label;
  return (
    <div
      className={['ph', dark && 'ph--dark', bare && 'ph--bare', className].filter(Boolean).join(' ')}
      style={{ '--ar': ratio }}
      aria-hidden="true"
      data-nosnippet=""
    >
      {isVideo ? (
        <span className="ph__play">
          <svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="currentColor" /></svg>
        </span>
      ) : (
        <IconImage />
      )}
      {showLabel && <span className="ph__label">{isVideo ? 'VIDEO' : 'IMAGE'} · {label}</span>}
      {showLabel && spec && <span className="ph__spec">{spec}</span>}
    </div>
  );
}
