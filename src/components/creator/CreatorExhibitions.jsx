import { useState } from 'react';
import styles from './creatorExhibitions.module.css';

const CreatorExhibitions = ({ 
  exhibitionCount = 2,
  exhibitions = []
}) => {
  const [showMore, setShowMore] = useState(false);
  
  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className={styles.exhibitionsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>참여한 전시</h3>
        <span className={styles.countText}>_ {exhibitionCount}개</span>
      </div>
      
      <div className={styles.exhibitionList}>
        {exhibitions.map((exhibition) => (
          <div key={exhibition.id} className={styles.exhibitionItem}>
            <p className={styles.exhibitionTitle}>{exhibition.title}</p>
            <p className={styles.exhibitionDate}>{exhibition.date}</p>
          </div>
        ))}
      </div>
      
      {exhibitions.length > 2 && (
        <div className={styles.showMoreContainer}>
          <button className={styles.showMoreButton} onClick={handleShowMore}>
            <span className={styles.showMoreText}>자세히 보기</span>
            <div className={styles.showMoreLines}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatorExhibitions;
