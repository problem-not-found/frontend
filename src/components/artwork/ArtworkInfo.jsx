import { useState } from 'react';
import styles from './artworkInfo.module.css';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';
import shareIcon from '../../assets/exhibition/share.svg';

const ArtworkInfo = ({ 
  title = "파도",
  medium = "캔버스에 유화, 144x116",
  description = "이 작품은 파도를 나타냈다."
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
      {/* Artwork Title */}
      <div className={styles.titleSection}>
        <div className={styles.titleContainer}>
          <h2 className={styles.artworkTitle}>{title}</h2>
          
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
      </div>
    </>
  );
};

export default ArtworkInfo;
