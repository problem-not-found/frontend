import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import styles from "./tasteExhibitions.module.css";
import {
  getLikedExhibitions,
  unlikeExhibition,
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

const TasteExhibitions = () => {
  const navigate = useNavigate();

  const {
    data: exhibitions,
    loading,
    error,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll(getLikedExhibitions, 10);

  const handleExhibitionClick = (exhibitionId) => {
    navigate(`/exhibition/${exhibitionId}`);
  };

  const handleLikeToggle = async (exhibitionId, event) => {
    event.stopPropagation();

    try {
      await unlikeExhibition(exhibitionId);
      console.log("전시 좋아요 취소 성공");
      // 페이지 새로고침하여 최신 목록 표시
      window.location.reload();
    } catch (error) {
      console.error("전시 좋아요 취소 실패:", error);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>좋아요한 전시를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.exhibitionsContainer}>
      {exhibitions.map((exhibition, index) => (
        <div
          key={exhibition.exhibitionId || exhibition.id}
          className={styles.exhibitionItem}
          ref={index === exhibitions.length - 1 ? lastElementRef : null}
        >
          <div
            className={styles.exhibitionImage}
            onClick={() =>
              handleExhibitionClick(exhibition.exhibitionId || exhibition.id)
            }
          >
            <img
              src={
                exhibition.thumbnailImageUrl ||
                exhibition.image ||
                "/artwork1.png"
              }
              alt={exhibition.title}
              className={styles.image}
            />
          </div>

          <div className={styles.exhibitionContent}>
            <div className={styles.exhibitionInfo}>
              <div className={styles.textContent}>
                <h3 className={styles.exhibitionTitle}>{exhibition.title}</h3>
                <p className={styles.exhibitionDate}>
                  {exhibition.startDate && exhibition.endDate
                    ? `${exhibition.startDate} - ${exhibition.endDate}`
                    : exhibition.date || "날짜 정보 없음"}
                </p>
              </div>
            </div>

            <div className={styles.likeButton}>
              <HeartIcon
                filled={true} // 좋아요한 전시 목록이므로 항상 채워진 하트
                onClick={(e) =>
                  handleLikeToggle(exhibition.exhibitionId || exhibition.id, e)
                }
              />
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader color="var(--color-main)" size={30} />
        </div>
      )}

      {!hasMore && exhibitions.length > 0 && (
        <div className={styles.endMessage}>
          <p>모든 전시를 확인했습니다.</p>
        </div>
      )}

      {exhibitions.length === 0 && !loading && (
        <div className={styles.emptyContainer}>
          <p>좋아요한 전시가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TasteExhibitions;
