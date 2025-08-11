import { useState, useRef, useEffect } from "react";
import styles from "./horizontalList.module.css";

export default function HorizontalList({
  items,
  renderItem,
  children,
  showIndex = false,
  showVerticalLine = false,
  verticalLineHeight = 220,
  totalCount = 4,
}) {
  const [currentIndex, setCurrentIndex] = useState(1);
  const scrollerRef = useRef(null);

  const content =
    Array.isArray(items) && renderItem
      ? items.map((item, idx) => renderItem(item, idx))
      : children;

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || !showIndex) return;

    const handleScroll = () => {
      const scrollLeft = scroller.scrollLeft;
      const cardWidth = 240 + 16; // 카드 너비 + gap
      const centerPosition = scrollLeft + scroller.clientWidth / 2;
      const cardIndex = Math.round(centerPosition / cardWidth);
      const newIndex = Math.max(1, Math.min(cardIndex, totalCount));
      setCurrentIndex(newIndex);
    };

    scroller.addEventListener("scroll", handleScroll);
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [showIndex, totalCount]);

  return (
    <div className={styles.wrapper}>
      {showIndex && (
        <div className={styles.indexInfo}>
          <div className={styles.indexText}>AI cruration</div>
          <div className={styles.indexNumber}>
            {currentIndex}/{totalCount}
          </div>
        </div>
      )}
      {showVerticalLine && (
        <div
          className={styles.verticalLine}
          style={{ height: `${verticalLineHeight}px` }}
        />
      )}
      <div className={styles.scroller} ref={scrollerRef}>
        {content}
      </div>
    </div>
  );
}
