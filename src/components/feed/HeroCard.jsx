import { useEffect, useRef, useState } from "react";
import styles from "./heroCard.module.css";
import heroImg from "../../assets/feed/메인 이미지.png";
import sample1 from "../../assets/feed/예시1.png";
import sample2 from "../../assets/feed/예시2.png";

export default function HeroCard({ images }) {
  const slides =
    Array.isArray(images) && images.length > 0
      ? images
      : [heroImg, sample1, sample2];

  const [index, setIndex] = useState(0);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const onTouchStart = (e) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!isDraggingRef.current) return;
    const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
    const delta = endX - startXRef.current;
    const threshold = 50; // 스와이프 임계값
    let next = index;
    if (delta > threshold) next = index - 1; // 오른쪽으로 스와이프 → 이전
    if (delta < -threshold) next = index + 1; // 왼쪽으로 스와이프 → 다음
    setIndex(clamp(next, 0, slides.length - 1));
    isDraggingRef.current = false;
  };

  // 3초마다 자동 다음 슬라이드
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className={styles.hero}>
      <div
        className={styles.slider}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className={styles.slides}
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div className={styles.slide} key={i}>
              <img
                src={src}
                alt={`slide-${i + 1}`}
                className={styles.slideImage}
              />
            </div>
          ))}
        </div>

        <div className={styles.pagerWrap} aria-hidden>
          <div className={styles.pagerTrack}>
            {slides.map((_, i) => (
              <span
                key={i}
                className={`${styles.pagerSeg} ${
                  i === index ? styles.active : ""
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
