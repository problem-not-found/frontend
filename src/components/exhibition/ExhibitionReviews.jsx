import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import styles from "./exhibitionReviews.module.css";

const ReviewItem = ({ reviewer, reviewText, avatarSrc }) => (
  <div className={styles.review}>
    <div className={styles.reviewHeader}>
      <div
        className={styles.reviewerAvatar}
        style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : {}}
      ></div>
      <span className={styles.reviewerName}>{reviewer}</span>
    </div>
    <p className={styles.reviewText}>{reviewText}</p>
  </div>
);

const ExhibitionReviews = ({
  exhibitionId = "1",
  reviews = [],
  totalElements = 0,
  loading = false,
  error = null,
}) => {
  const navigate = useNavigate();

  const handleMoreReviews = () => {
    navigate(`/reviews/${exhibitionId}`);
  };
  return (
    <>
      {/* Clean Reviews Header */}
      <div className={styles.reviewsHeader}>
        <h3 className={styles.sectionTitle}>클린 감상평 ({totalElements})</h3>
        <div className={styles.moreReviews} onClick={handleMoreReviews}>
          <span className={styles.moreReviewsText}>리뷰 더 보기</span>
        </div>
      </div>

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              margin: "20px 0",
            }}
          >
            <ClipLoader color="var(--color-main)" size={25} />
          </div>
        ) : error ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              margin: "20px 0",
              color: "#666",
            }}
          >
            감상평을 불러올 수 없습니다.
          </div>
        ) : reviews.length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100px",
              margin: "20px 0",
              color: "#666",
            }}
          >
            아직 감상평이 없습니다.
          </div>
        ) : (
          reviews.map((review, index) => (
            <ReviewItem
              key={review.reviewId || index}
              reviewer={review.nickname || "익명"}
              reviewText={review.content}
              avatarSrc={review.profileImageUrl}
            />
          ))
        )}
      </div>
    </>
  );
};

export default ExhibitionReviews;
