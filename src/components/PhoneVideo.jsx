import { useEffect, useRef, useState } from 'react';

// ภาพมือถือ iPhone + วิดีโอหน้าจอแอปซ้อนในจอ
// ปุ่ม/การเล่นถอดจาก inline media ของ apple.com/th/business (plugin AnimPlay + PlayPauseButton)
//   • เข้าจอ (ขอบบนถึงขอบล่างจอ จนขอบล่างพ้นขอบบน) → โหลดแล้วเล่นอัตโนมัติ
//   • วนซ้ำไปเรื่อย ๆ (คลิปจบด้วยการเฟดเป็นขาว ต่อกับเฟรมแรกที่เป็นจอสว่างได้เนียน)
//   • ออกจอ → หยุดพัก · กลับมา → เล่นต่อจากเดิม
//   • ผู้ใช้กดหยุด → ค้างไว้ ไม่เล่นเองอีกจนกว่าจะกดเล่น
//   • Reduced Motion → ไม่เล่นอัตโนมัติ ผู้ใช้กดปุ่มเล่นเอง
// ตำแหน่งจอวัดจาก app-iphone-hand.webp (1000×1288): แผ่นแอปอยู่ที่ x 116–577, y 95–1035
// วิดีโอ 720×1280 (ช่องแสดงผลกว้างราว 200–300px) เข้ารหัสแบบเริ่มเล่นได้ทันที · ไฟล์ต้นฉบับ 1080p อยู่ที่ app-screen.mp4
const LABEL = 'วิดีโอแอป SafeAct Club';
const ARIA = { playing: `หยุดพัก${LABEL}`, paused: `เล่น${LABEL}` };

export default function PhoneVideo() {
  const box = useRef(null);
  const vid = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const userPaused = useRef(false);

  const load = (v) => { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } };

  useEffect(() => {
    const v = vid.current;
    v.muted = true; // React ไม่ใส่ attribute muted ตอน SSR → ตั้งเองก่อน play()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onReady = () => setReady(true);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('loadeddata', onReady);

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        load(v);
        if (!reduce && !userPaused.current) v.play().catch(() => {});
      } else if (!v.paused) {
        v.pause();
      }
    }, { threshold: 0 });
    io.observe(box.current);

    return () => {
      io.disconnect();
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('loadeddata', onReady);
    };
  }, []);

  const onButton = () => {
    const v = vid.current;
    if (playing) { userPaused.current = true; v.pause(); }
    else { userPaused.current = false; load(v); v.play().catch(() => {}); }
  };
  const state = playing ? 'playing' : 'paused';

  return (
    <div className="phone">
      <img className="phone__img" src="/assets/app-iphone-hand.webp" srcSet="/assets/app-iphone-hand-640.webp 640w, /assets/app-iphone-hand.webp 1000w"
        sizes="(min-width: 1376px) 640px, (min-width: 1069px) calc(50vw - 48px), (min-width: 735px) calc(50vw - 36px), (min-width: 503px) 440px, 88vw" width="1000" height="1288" loading="lazy" decoding="async"
        alt="มือถือ iPhone เปิดแอป SafeAct Club ขณะเลือกกิจกรรมเสี่ยงของกิจการ แล้ว AI คัดกฎหมายที่เกี่ยวข้องให้" />
      <div ref={box} className="phone__screen">
        <video ref={vid} src="/assets/app-screen-720.mp4" poster="/assets/app-screen-720-poster.webp"
          muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
        <button type="button" className={`im__btn im__btn--${state}${ready ? ' is-ready' : ''}`}
          aria-label={ARIA[state]} onClick={onButton} />
      </div>
    </div>
  );
}
