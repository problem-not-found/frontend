import { useState, useEffect } from "react";
import styles from "./creatorProfile.module.css";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import shareIcon from "../../assets/exhibition/share.svg";
import { likeCreator, unlikeCreator } from "../../apis/exhibition/exhibition";

const CreatorProfile = ({
  creatorName = "김땡땡 크리에이터",
  creatorImage = "/creator-profile.png",
  loading = false,
  creator = null,
}) => {
  const [isLiked, setIsLiked] = useState(creator?.isLike || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // creator.isLike 값이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(creator?.isLike || false);
  }, [creator?.isLike]);

  const handleLike = async () => {
    const creatorId = creator?.userId || creator?.id;
    if (!creatorId || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeCreator(creatorId);
        setIsLiked(false);
        console.log("크리에이터 좋아요 취소 성공");
      } else {
        await likeCreator(creatorId);
        setIsLiked(true);
        console.log("크리에이터 좋아요 성공");
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
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <img
          src={creatorImage}
          alt="크리에이터 프로필"
          className={styles.profileAvatar}
        />
        <div className={styles.profileDetails}>
          <div className={styles.creatorNameContainer}>
            {loading ? (
              <span className={styles.creatorName}>로딩 중...</span>
            ) : (
              <>
                <span className={styles.creatorName}>
                  {creatorName.replace(" 크리에이터", "")}
                </span>
                <span className={styles.creatorLabel}> 크리에이터</span>
              </>
            )}
          </div>
        </div>
      </div>

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
  );
};

export default CreatorProfile;
