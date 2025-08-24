import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./cardSmall.module.css";
import defaultImg from "../../assets/feed/예시1.png";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import {
  likeExhibition,
  unlikeExhibition,
  likePiece,
  unlikePiece,
} from "../../apis/exhibition/exhibition";

export default function CardSmall({ item = {}, showBookmark = false }) {
  const [isLiked, setIsLiked] = useState(item.isLike || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // item.isLike 값이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(item.isLike || false);
  }, [item.isLike]);

  // API 응답 데이터 매핑
  const isExhibition = item.exhibitionId !== undefined;
  const isPiece = item.pieceId !== undefined;

  const {
    id = isExhibition ? item.exhibitionId : isPiece ? item.pieceId : 1,
    img = isExhibition
      ? item.thumbnailImageUrl
      : isPiece
      ? item.imageUrl
      : defaultImg,
    title = item.title || "김땡땡 개인전 : 두 번째 여름",
    date = isExhibition
      ? `${item.startDate} - ${item.endDate}`
      : "24.12.05 - 25.02.19",
  } = item;

  const handleLikeClick = async (e) => {
    e.stopPropagation();

    // 전시와 작품 모두 좋아요 기능 지원
    if ((!isExhibition && !isPiece) || isLikeLoading) return;

    const itemId = isExhibition ? item.exhibitionId : item.pieceId;
    if (!itemId) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        if (isExhibition) {
          await unlikeExhibition(itemId);
          console.log("전시 좋아요 취소 성공");
        } else {
          await unlikePiece(itemId);
          console.log("작품 좋아요 취소 성공");
        }
        setIsLiked(false);
      } else {
        if (isExhibition) {
          await likeExhibition(itemId);
          console.log("전시 좋아요 성공");
        } else {
          await likePiece(itemId);
          console.log("작품 좋아요 성공");
        }
        setIsLiked(true);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleCardClick = () => {
    // 현재 탭 정보를 브라우저 히스토리에 저장
    const currentTab = searchParams.get("tab") || "전시";

    if (isExhibition) {
      navigate(`/exhibition/${id}`, {
        state: { previousTab: currentTab, fromFeed: true },
      });
    } else if (isPiece) {
      navigate(`/artwork/${id}`, {
        state: { previousTab: currentTab, fromFeed: true },
      });
    } else {
      navigate(`/exhibition/${id}`, {
        state: { previousTab: currentTab, fromFeed: true },
      }); // fallback
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
          {isExhibition && <div className={styles.meta}>{date}</div>}
        </div>
        <button
          className={`${styles.like} ${isLiked ? styles.liked : ""}`}
          aria-label="북마크"
          onClick={handleLikeClick}
          disabled={isLikeLoading}
          style={{ opacity: isLikeLoading ? 0.6 : 1 }}
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
