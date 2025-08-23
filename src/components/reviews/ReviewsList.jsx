import ReviewItem from './ReviewItem';
import styles from './reviewsList.module.css';

const ReviewsList = ({ reviews = [] }) => {
  return (
    <div className={styles.reviewsList}>
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewId}
          reviewer={review.reviewer || "익명"}
          reviewText={review.content}
          avatarSrc={review.avatarSrc}
          isOwnReview={review.isAuthor}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
