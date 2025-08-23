import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./cardSmall.module.css";
import defaultImg from "../../assets/feed/예시1.png";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";

export default function CardSmall({ item = {}, showBookmark = false }) {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  // API 응답 데이터 매핑
  const isExhibition = item.exhibitionId !== undefined;
  const isPiece = item.pieceId !== undefined;
  
  const {
    id = isExhibition ? item.exhibitionId : isPiece ? item.pieceId : 1,
    img = isExhibition ? item.thumbnailImageUrl : isPiece ? item.imageUrl : defaultImg,
    title = item.title || "김땡땡 개인전 : 두 번째 여름",
    date = isExhibition ? `${item.startDate} - ${item.endDate}` : "24.12.05 - 25.02.19",
  } = item;

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    if (isExhibition) {
      navigate(`/exhibition/${id}`);
    } else if (isPiece) {
      navigate(`/artwork/${id}`);
    } else {
      navigate(`/exhibition/${id}`); // fallback
    }
  };

  return (
    <div 
      className={styles.card} 
      style={{ minWidth: "240px", width: "240px", cursor: "pointer" }}
      onClick={handleCardClick}
    >
      <div className={styles.thumb}>
        <img 
          src={img} 
          alt={title} 
          className={styles.image}
          loading="lazy"
          onError={(e) => {
            e.target.src = defaultImg;
          }}
        />
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
          <img 
            src={isLiked ? likeIcon : unlikeIcon} 
            alt={isLiked ? "좋아요 취소" : "좋아요"} 
            className={styles.heartIcon}
          />
        </button>
      </div>
    </div>
  );
}
