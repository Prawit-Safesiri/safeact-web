import { IconImage } from './Icons.jsx';

// กล่อง Mock สำหรับภาพ/วิดีโอ — วางไฟล์จริงทีหลังโดยแทนที่คอมโพเนนต์นี้ด้วย <img>/<video>
// ระบุขนาดไฟล์ที่ต้องเตรียมไว้ใน spec เพื่อให้ทีมออกแบบส่งงานได้ตรง
export default function Media({ kind = 'image', label, spec, ratio = '16/9', dark = false, className = '' }) {
  const isVideo = kind === 'video';
  return (
    <div
      className={`ph${dark ? ' ph--dark' : ''} ${className}`}
      style={{ '--ar': ratio }}
      role="img"
      aria-label={`${isVideo ? 'วิดีโอ' : 'ภาพ'}: ${label}`}
    >
      {isVideo ? (
        <span className="ph__play" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="currentColor" /></svg>
        </span>
      ) : (
        <IconImage />
      )}
      <span className="ph__label">{isVideo ? 'VIDEO' : 'IMAGE'} · {label}</span>
      {spec && <span className="ph__spec">{spec}</span>}
    </div>
  );
}
