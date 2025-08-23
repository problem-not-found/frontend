import styles from './reviewItem.module.css';

const ReviewItem = ({ reviewer, reviewText, avatarSrc, isOwnReview = false }) => (
  <div className={styles.review}>
    <div className={styles.reviewHeader}>
      <div 
        className={styles.reviewerAvatar}
        style={avatarSrc ? { backgroundImage: `url(${avatarSrc})` } : {}}
      ></div>
      <span className={styles.reviewerName}>{reviewer}</span>
      {isOwnReview ? (
        <div className={styles.reviewActions}>
          <button className={styles.actionButton}>수정하기</button>
          <button className={styles.actionButton}>삭제하기</button>
        </div>
      ) : (
        <div className={styles.reportAction}>
          <button className={styles.reportButton}>신고</button>
        </div>
      )}
    </div>
    <p className={styles.reviewText}>{reviewText}</p>
  </div>
);

export default ReviewItem;
