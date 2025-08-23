import ReviewItem from './ReviewItem';
import styles from './reviewsList.module.css';

const ReviewsList = ({ reviews = [] }) => {
  return (
    <div className={styles.reviewsList}>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          reviewer={review.reviewer}
          reviewText={review.reviewText}
          avatarSrc={review.avatarSrc}
          isOwnReview={review.isOwnReview}
        />
      ))}
    </div>
  );
};

export default ReviewsList;
