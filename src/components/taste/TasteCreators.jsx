import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import styles from "./tasteCreators.module.css";
import {
  getLikedCreators,
  unlikeCreator,
} from "../../apis/exhibition/exhibition";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const HeartIcon = ({ filled = false, onClick }) => (
  <img
    src={filled ? likeIcon : unlikeIcon}
    alt={filled ? "좋아요" : "좋아요 안함"}
    width="24"
    height="24"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  />
);

const ArrowIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path
      d="M9 18L15 12L9 6"
      stroke="#434343"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TasteCreators = () => {
  const navigate = useNavigate();

  const {
    data: creators,
    loading,
    error,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll(getLikedCreators, 10);

  const handleCreatorClick = (creatorId) => {
    navigate(`/creator/${creatorId}`);
  };

  const handleLikeToggle = async (creatorId, event) => {
    event.stopPropagation();

    try {
      await unlikeCreator(creatorId);
      console.log("크리에이터 좋아요 취소 성공");
      // 페이지 새로고침하여 최신 목록 표시
      window.location.reload();
    } catch (error) {
      console.error("크리에이터 좋아요 취소 실패:", error);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>좋아요한 크리에이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.creatorsContainer}>
      <div className={styles.creatorsList}>
        {creators.map((creator, index) => (
          <div
            key={creator.userId || creator.id}
            className={styles.creatorCard}
            onClick={() => handleCreatorClick(creator.userId || creator.id)}
            ref={index === creators.length - 1 ? lastElementRef : null}
          >
            <div className={styles.creatorInfo}>
              <img
                src={
                  creator.profileImageUrl ||
                  creator.profileImage ||
                  "/creator-profile.png"
                }
                alt={creator.nickname || creator.name}
                className={styles.profileImage}
              />
              <div className={styles.creatorDetails}>
                <h3 className={styles.creatorName}>
                  <span>
                    {(creator.nickname || creator.name || "크리에이터").replace(
                      " 크리에이터",
                      ""
                    )}
                  </span>
                  <span className={styles.creatorLabel}> 크리에이터</span>
                </h3>
              </div>
            </div>

            <div className={styles.likeButton}>
              <HeartIcon
                filled={true} // 좋아요한 크리에이터 목록이므로 항상 채워진 하트
                onClick={(e) =>
                  handleLikeToggle(creator.userId || creator.id, e)
                }
              />
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader color="var(--color-main)" size={30} />
        </div>
      )}

      {!hasMore && creators.length > 0 && (
        <div className={styles.endMessage}>
          <p>모든 크리에이터를 확인했습니다.</p>
        </div>
      )}

      {creators.length === 0 && !loading && (
        <div className={styles.emptyContainer}>
          <p>좋아요한 크리에이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TasteCreators;
