import { useState } from 'react';
import styles from './creatorProfile.module.css';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';
import shareIcon from '../../assets/exhibition/share.svg';

const CreatorProfile = ({ 
  creatorName = "김땡땡 크리에이터",
  creatorImage = "/creator-profile.png" 
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    console.log('공유하기');
  };

  return (
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <img 
          src={creatorImage} 
          alt="크리에이터 프로필" 
          className={styles.profileAvatar}
        />
        <div className={styles.profileDetails}>
          <div className={styles.creatorNameContainer}>
            <span className={styles.creatorName}>{creatorName.replace(' 크리에이터', '')}</span>
            <span className={styles.creatorLabel}> 크리에이터</span>
          </div>
        </div>
      </div>
      
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
  );
};

export default CreatorProfile;
