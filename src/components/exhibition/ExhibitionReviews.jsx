
import styles from './exhibitionReviews.module.css';

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
  reviews = [
    {
      id: 1,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여"
    },
    {
      id: 2,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여"
    }
  ]
}) => {
  return (
    <>
      {/* Clean Reviews Header */}
      <div className={styles.reviewsHeader}>
        <h3 className={styles.sectionTitle}>클린 감상평</h3>
        {reviews.length > 1 && (
          <div className={styles.moreReviews}>
            <span className={styles.moreReviewsText}>리뷰 더 보기</span>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div className={styles.reviewsSection}>
        {reviews.map((review, index) => (
          <ReviewItem
            key={review.id || index}
            reviewer={review.reviewer}
            reviewText={review.reviewText}
            avatarSrc={review.avatarSrc}
          />
        ))}
      </div>
    </>
  );
};

export default ExhibitionReviews;
