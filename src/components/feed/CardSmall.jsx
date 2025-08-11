import { useState } from "react";
import styles from "./cardSmall.module.css";
import defaultImg from "../../assets/feed/예시1.png";

export default function CardSmall({ item = {}, showBookmark = false }) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    img = defaultImg,
    title = "김땡땡 개인전 : 두 번째 여름",
    date = "24.12.05 - 25.02.19",
  } = item;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className={styles.card} style={{ minWidth: "240px", width: "240px" }}>
      <div className={styles.thumb}>
        <img src={img} alt={title} className={styles.image} />
      </div>
      <div className={styles.bodyContainer}>
        <div className={styles.body}>
          <div className={styles.title}>{title}</div>
          <div className={styles.meta}>{date}</div>
        </div>
        <button
          className={`${styles.like} ${isLiked ? styles.liked : ""}`}
          aria-label="북마크"
          onClick={handleLikeClick}
        >
          {isLiked ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}
