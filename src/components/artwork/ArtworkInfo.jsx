import { useState, useEffect } from "react";
import styles from "./artworkInfo.module.css";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import shareIcon from "../../assets/exhibition/share.svg";
import { likePiece, unlikePiece } from "../../apis/exhibition/exhibition";

const ArtworkInfo = ({
  title = "파도",
  medium = "캔버스에 유화, 144x116",
  description = "이 작품은 파도를 나타냈다.",
  piece = null,
}) => {
  const [isLiked, setIsLiked] = useState(piece?.isLike || false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // piece.isLike 값이 변경될 때 상태 업데이트
  useEffect(() => {
    setIsLiked(piece?.isLike || false);
  }, [piece?.isLike]);

  const handleLike = async () => {
    const pieceId = piece?.pieceId;
    if (!pieceId || isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikePiece(pieceId);
        setIsLiked(false);
        console.log("작품 좋아요 취소 성공");
      } else {
        await likePiece(pieceId);
        setIsLiked(true);
        console.log("작품 좋아요 성공");
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
      {/* Artwork Title */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h2 className={styles.artworkTitle}>{title}</h2>

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
      </div>
    </>
  );
};

export default ArtworkInfo;
