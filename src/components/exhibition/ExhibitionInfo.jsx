
import { useState } from 'react';
import styles from './exhibitionInfo.module.css';
import shareIcon from '../../assets/exhibition/share.svg';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';

const ExhibitionInfo = ({ 
  date = "24.12.5 - 25.2.19", 
  title = "김땡땡 개인전 : 두 번째 여름",
  description,
  showDescription = true
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    console.log('공유하기');
  };
  return (
    <>

      {/* Exhibition Title */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h2 className={styles.exhibitionTitle}>{title}</h2>
          
          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.heartButton} onClick={handleLike}>
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
         {/* Exhibition Date */}
      <div className={styles.exhibitionDate}>{date}</div>
      </div>

      {/* Exhibition Description */}
      {showDescription && description && (
        <div className={styles.descriptionSection}>
          <p className={styles.description}>{description}</p>
        </div>
      )}
    </>
  );
};

export default ExhibitionInfo;
