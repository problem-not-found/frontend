import { useState, useRef, useEffect } from 'react';
import styles from './artworkImage.module.css';

const ArtworkImage = ({ 
  images = ["/artwork1.png"], 
  alt = "작품 이미지",
  overlayText = "디테일 컷을 미리보기로 확인해보세요"
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const startXRef = useRef(0);
  const isDraggingRef = useRef(false);

  const totalImages = images.length;
  const progressWidth = totalImages > 1 ? (100 / totalImages) : 100;
  const progressPosition = totalImages > 1 ? (currentIndex * progressWidth) : 0;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  const onTouchStart = (e) => {
    if (totalImages <= 1) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (!isDraggingRef.current || totalImages <= 1) return;
    const endX = (e.changedTouches && e.changedTouches[0]?.clientX) || 0;
    const delta = endX - startXRef.current;
    const threshold = 50;
    let next = currentIndex;
    if (delta > threshold) next = currentIndex - 1;
    if (delta < -threshold) next = currentIndex + 1;
    setCurrentIndex(clamp(next, 0, totalImages - 1));
    isDraggingRef.current = false;
  };

  // 자동 슬라이드 (3초마다)
  useEffect(() => {
    if (totalImages <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, 3000);
    return () => clearInterval(timer);
  }, [totalImages]);

  return (
    <div className={styles.artworkImageContainer}>
      <div 
        className={styles.imageSlider}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className={styles.imageTrack}
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt={`${alt} ${index + 1}`} 
              className={styles.artworkImage}
            />
          ))}
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className={styles.gradientOverlay}>
        <p className={styles.overlayText}>{overlayText}</p>
      </div>
      
      {totalImages > 1 && (
        <div className={styles.imageProgress}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{
                width: `${progressWidth}%`,
                left: `${progressPosition}%`
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtworkImage;
