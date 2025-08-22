import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cardMedium.module.css";
import defaultImg from "../../assets/feed/예시2.png";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";

export default function CardMedium({ item = {}, showBookmark = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const {
    id = 1,
    img = defaultImg,
    title = "홍익대 디자인 졸전 2024",
    date = "24.11.26 - 24.11.30",
  } = item;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    navigate(`/exhibition/${id}`);
  };

  return (
    <div 
      className={styles.card} 
      style={{ minWidth: "320px", width: "320px", cursor: "pointer" }}
      onClick={handleCardClick}
    >
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
            <img 
              src={isLiked ? likeIcon : unlikeIcon} 
              alt={isLiked ? "좋아요 취소" : "좋아요"} 
              className={styles.heartIcon}
            />
          </button>
        )}
      </div>
    </div>
  );
}
