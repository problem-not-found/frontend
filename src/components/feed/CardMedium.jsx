import { useState } from "react";
import styles from "./cardMedium.module.css";
import defaultImg from "../../assets/feed/예시2.png";

export default function CardMedium({ item = {}, showBookmark = false }) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    img = defaultImg,
    title = "홍익대 디자인 졸전 2024",
    date = "24.11.26 - 24.11.30",
  } = item;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.card} style={{ minWidth: "320px", width: "320px" }}>
      <div className={styles.thumb}>
        <img src={img} alt={title} className={styles.image} />
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          <div className={styles.meta}>{date}</div>
        </div>
        {showBookmark && (
          <button
            className={`${styles.like} ${isLiked ? styles.liked : ""}`}
            aria-label="북마크"
            onClick={handleLikeClick}
          >
            {isLiked ? "♥" : "♡"}
          </button>
        )}
      </div>
    </div>
  );
}
