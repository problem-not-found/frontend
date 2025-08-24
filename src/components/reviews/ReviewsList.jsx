import ReviewItem from "./ReviewItem";
import styles from "./reviewsList.module.css";

const ReviewsList = ({ reviews = [] }) => {
  return (
    <div className={styles.reviewsList}>
      {reviews.map((review, index) => (
        <ReviewItem
          key={
            review.reviewId
              ? `review-${review.reviewId}`
              : `review-index-${index}`
          }
          reviewer={review.nickname || "익명"}
          reviewText={review.content}
          avatarSrc={review.profileImageUrl}
          isOwnReview={review.isAuthor}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
