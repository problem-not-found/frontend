import { useState, useEffect } from "react";
import styles from "./exhibitionInfo.module.css";
import shareIcon from "../../assets/exhibition/share.svg";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import {
  likeExhibition,
  unlikeExhibition,
} from "../../apis/exhibition/exhibition";

const ExhibitionInfo = ({
  date = "24.12.5 - 25.2.19",
  title = "김땡땡 개인전 : 두 번째 여름",
  description,
  showDescription = true,
  exhibition = null,
}) => {
  const [isLiked, setIsLiked] = useState(exhibition?.isLike || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // exhibition.isLike 값이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(exhibition?.isLike || false);
  }, [exhibition?.isLike]);

  const handleLike = async () => {
    const exhibitionId = exhibition?.exhibitionId;
    if (!exhibitionId || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeExhibition(exhibitionId);
        setIsLiked(false);
        console.log("전시 좋아요 취소 성공");
      } else {
        await likeExhibition(exhibitionId);
        setIsLiked(true);
        console.log("전시 좋아요 성공");
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShare = () => {
    console.log("공유하기");
  };
  return (
    <>
      {/* Exhibition Title */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h2 className={styles.exhibitionTitle}>{title}</h2>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button
              className={styles.heartButton}
              onClick={handleLike}
              disabled={isLikeLoading}
              style={{ opacity: isLikeLoading ? 0.6 : 1 }}
            >
              <img
                src={isLiked ? likeIcon : unlikeIcon}
                alt={isLiked ? "좋아요 취소" : "좋아요"}
                className={styles.heartIconImg}
              />
            </button>
            <button className={styles.shareButton} onClick={handleShare}>
              <img src={shareIcon} alt="공유" className={styles.shareIconImg} />
            </button>
          </div>
        </div>
        {/* Exhibition Date */}
        <div className={styles.exhibitionDate}>{date}</div>
      </div>

      {/* Exhibition Description */}
      {showDescription && description && (
        <div className={styles.descriptionSection}>
          <p className={styles.description}>{description}</p>
        </div>
      )}
    </>
  );
};

export default ExhibitionInfo;
