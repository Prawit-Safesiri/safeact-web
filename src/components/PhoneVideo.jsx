import { useEffect, useRef, useState } from 'react';

// ภาพมือถือ iPhone + วิดีโอหน้าจอแอปซ้อนในจอ
// ปุ่ม/การเล่นถอดจาก inline media ของ apple.com/th/business (plugin AnimPlay + PlayPauseButton)
//   • ใกล้ถึง (ห่างจอ 1 ช่วงจอ) → เริ่มโหลดล่วงหน้า · เห็นอย่างน้อย 30% → เล่นอัตโนมัติ (ภาพ poster แสดงจนโหลดพอเล่น)
//     (เดิมเริ่มโหลดตอนเข้าจอแล้ว ผู้ชมเห็นจอเปล่ารอโหลด และเน็ตช้าจะสะดุด)
//   • รอบแรกเริ่มจากฉาก "เลือกกิจกรรมครบ 23 รายการ" (START = เฟรมเดียวกับภาพ poster) แล้วต่อด้วยฉาก AI
//     จากนั้นวนตามปกติ (คลิปจบด้วยการเฟดเป็นขาว ต่อกับเฟรมแรกที่เป็นจอสว่างได้เนียน)
//     — เฟรมแรกของคลิปเป็นจอเกือบเปล่า (รายการยังไม่ขึ้น) ถ้าใช้เป็นภาพ poster จะดูเหมือนโหลดช้า
//   • พ้นจอทั้งหมด หรือสลับไปแท็บอื่น → หยุดพัก · กลับมา → เล่นต่อจากเดิม (มีระยะเผื่อ 0–30% กันเล่น/หยุดสลับไปมาที่ขอบจอ)
//   • ผู้ใช้กดหยุด → ค้างไว้ ไม่เล่นเองอีกจนกว่าจะกดเล่น
//   • Reduced Motion → ไม่เล่นอัตโนมัติ (เห็นภาพ poster ที่เป็นจอแอปเต็ม) ผู้ใช้กดปุ่มเล่นเอง
// ตำแหน่งจอวัดจาก app-iphone-hand.webp (1000×1288): แผ่นแอปอยู่ที่ x 116–577, y 95–1035
// วิดีโอ 720×1280 · 30fps · 15 วินาที (ช่องแสดงผลกว้างราว 200–300px) เข้ารหัสแบบเริ่มเล่นได้ทันที (moov อยู่หน้าไฟล์)
// ไฟล์ต้นฉบับ 1080p อยู่ที่ app-screen.mp4 · ภาพ poster = เฟรมที่ START ของ app-screen-720.mp4 (เปลี่ยนวิดีโอต้องทำภาพนี้ใหม่)
const LABEL = 'วิดีโอแอป SafeAct Club';
const ARIA = { playing: `หยุดพัก${LABEL}`, paused: `เล่น${LABEL}` };
const START = 5.2;   // วินาที

export default function PhoneVideo() {
  const box = useRef(null);
  const vid = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const userPaused = useRef(false);
  const started = useRef(false);

  const load = (v) => { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } };
  // รอบแรกเริ่มที่ START ให้ภาพต่อจาก poster พอดี (ยังไม่รู้ความยาวคลิป → ตั้งเวลาเมื่อ loadedmetadata)
  const play = (v) => {
    if (!started.current) {
      started.current = true;
      const seek = () => { if (v.currentTime < START) v.currentTime = START; };
      if (v.readyState >= 1) seek(); else v.addEventListener('loadedmetadata', seek, { once: true });
    }
    v.play().catch(() => {});
  };

  useEffect(() => {
    const v = vid.current;
    v.muted = true; // React ไม่ใส่ attribute muted ตอน SSR → ตั้งเองก่อน play()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let inView = false;
    // เรียก play() ทันทีที่อยู่ในจอ — เบราว์เซอร์แสดงภาพ poster จนกว่าจะโหลดพอเล่น
    // (iPhone Safari ไม่โหลดล่วงหน้าตาม preload จนกว่าจะสั่ง play() จึงห้ามรอ canplaythrough)
    const tryPlay = () => {
      if (reduce || userPaused.current || !inView || document.hidden || !v.paused) return;
      play(v);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onReady = () => setReady(true);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('loadeddata', onReady);

    const pre = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { load(v); pre.disconnect(); }
    }, { rootMargin: '100% 0px' });
    pre.observe(box.current);

    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.3) { inView = true; load(v); tryPlay(); }
      else if (!e.isIntersecting) { inView = false; if (!v.paused) v.pause(); }
    }, { threshold: [0, 0.3] });
    io.observe(box.current);

    const onVisibility = () => { if (document.hidden) { if (!v.paused) v.pause(); } else tryPlay(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      pre.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('loadeddata', onReady);
    };
  }, []);

  const onButton = () => {
    const v = vid.current;
    if (playing) { userPaused.current = true; v.pause(); }
    else { userPaused.current = false; load(v); play(v); }
  };
  const state = playing ? 'playing' : 'paused';

  return (
    <div className="phone">
      <img className="phone__img" src="/assets/app-iphone-hand.webp" srcSet="/assets/app-iphone-hand-640.webp 640w, /assets/app-iphone-hand.webp 1000w"
        sizes="(min-width: 1376px) 640px, (min-width: 1069px) calc(50vw - 48px), (min-width: 735px) calc(50vw - 36px), (min-width: 442px) 600px, 136vw" width="1000" height="1288" loading="lazy" decoding="async"
        alt="มือถือ iPhone เปิดแอป SafeAct Club ขณะเลือกกิจกรรมเสี่ยงของกิจการ แล้ว AI คัดกฎหมายที่เกี่ยวข้องให้" />
      <div ref={box} className="phone__screen">
        <video ref={vid} src="/assets/app-screen-720.mp4" poster="/assets/app-screen-720-start.webp"
          muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />
        <button type="button" className={`im__btn im__btn--${state}${ready ? ' is-ready' : ''}`}
          aria-label={ARIA[state]} onClick={onButton} />
      </div>
    </div>
  );
}
