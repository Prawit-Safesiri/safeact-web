// ภาพจางเข้าเมื่อโหลดเสร็จ — ตัวหลักอยู่ใน index.html (ดักเหตุการณ์ load ที่ document ตั้งแต่ก่อนภาพแรก)
// ตัวสำรอง: ภาพที่ React สร้างแล้วโหลดเสร็จก่อนถูกต่อเข้าหน้า (เช่น ภาพในแคชตอนเปลี่ยนหน้า) จะไม่มีเหตุการณ์ load ให้ดัก
// → หลังเปลี่ยนหน้า ตรวจภาพที่โหลดเสร็จแล้ว (complete) แล้วใส่ data-loaded ให้ ไม่ทิ้งภาพไว้ในสถานะซ่อน
// ภาพ lazy ที่ยังไม่เริ่มโหลดมี complete = false → รอเหตุการณ์ load ตามปกติ
export function markLoadedImages() {
  const mark = () => {
    document.querySelectorAll('main img:not([data-loaded])').forEach((img) => {
      if (img.complete) img.setAttribute('data-loaded', '');
    });
  };
  mark();
  const raf = requestAnimationFrame(mark);
  const timer = setTimeout(mark, 400);
  return () => { cancelAnimationFrame(raf); clearTimeout(timer); };
}
