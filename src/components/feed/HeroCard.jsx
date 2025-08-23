import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./heroCard.module.css";
import heroImg from "../../assets/feed/메인 이미지.png";
import sample1 from "../../assets/feed/예시1.png";
import sample2 from "../../assets/feed/예시2.png";

export default function HeroCard({ images, exhibitions, pieces }) {
  const navigate = useNavigate();
  
  // exhibitions 또는 pieces 데이터가 있으면 그것을 사용, 없으면 기본 이미지 사용
  const slides = exhibitions && exhibitions.length > 0
    ? exhibitions.map(exhibition => exhibition.thumbnailImageUrl || heroImg)
    : pieces && pieces.length > 0
      ? pieces.map(piece => piece.imageUrl || heroImg)
      : Array.isArray(images) && images.length > 0
        ? images
        : [heroImg, sample1, sample2];
        
  const itemData = exhibitions || pieces || [];
  const isExhibition = !!exhibitions;

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

  const handleSlideClick = () => {
    // 현재 슬라이드의 전시 또는 작품으로 이동
    if (itemData.length > 0 && itemData[index]) {
      if (isExhibition) {
        navigate(`/exhibition/${itemData[index].exhibitionId}`);
      } else {
        // 작품인 경우 작품 상세 페이지로 이동
        navigate(`/artwork/${itemData[index].pieceId}`);
      }
    } else {
      // 기본 이미지인 경우 첫 번째 전시로 이동
      navigate('/exhibition/1');
    }
  };

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
            <div 
              className={styles.slide} 
              key={i}
              onClick={handleSlideClick}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={src}
                alt={`slide-${i + 1}`}
                className={styles.slideImage}
              />
              {/* 전시/작품 정보 오버레이 */}
              {itemData[i] && (
                <div className={styles.slideOverlay}>
                  <div className={styles.exhibitionInfo}>
                    <p className={styles.subtitle}>
                      {isExhibition ? "지금 뜨는 전시" : "지금 뜨는 작품"}
                    </p>
                    <h3 className={styles.title}>{itemData[i].title}</h3>
                  </div>
                </div>
              )}
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
