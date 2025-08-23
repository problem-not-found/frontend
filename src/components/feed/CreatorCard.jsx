import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './creatorCard.module.css';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';

const CreatorCard = ({ creator, showHeartButton = true }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.profileSection}>
        <img 
          src={creator.profileImage} 
          alt={`${creator.name} 프로필`}
          className={styles.profileImage}
        />
        <div className={styles.nameSection}>
          <h3 className={styles.name}>
            {creator.name.replace(' 크리에이터', '')} 
            <span className={styles.creatorLabel}> 크리에이터</span>
          </h3>
          <p className={styles.username}>{creator.username}</p>
        </div>
      </div>
      
      <div className={styles.artworkGrid}>
        {creator.artworks.map((artwork, index) => (
          <div key={artwork.id} className={styles.artworkFrame}>
            {artwork.image ? (
              <img 
                src={artwork.image} 
                alt={`작품 ${index + 1}`}
                className={styles.artworkImage}
              />
            ) : (
              <div className={styles.emptyArtwork}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M4 4H28V28H4V4Z" stroke="#757575" strokeWidth="1"/>
                  <circle cx="9.33" cy="9.33" r="2" fill="#757575"/>
                  <path d="M6.67 13.33L28 28V13.33H6.67Z" stroke="#757575" strokeWidth="1"/>
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>

      {showHeartButton && (
        <button 
          className={styles.heartButton}
          onClick={() => setIsLiked(!isLiked)}
        >
          <img 
            src={isLiked ? likeIcon : unlikeIcon} 
            alt={isLiked ? "좋아요 취소" : "좋아요"} 
            className={styles.heartIcon}
          />
        </button>
      )}
    </div>
  );
};

CreatorCard.propTypes = {
  creator: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileImage: PropTypes.string.isRequired,
    artworks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string,
    })).isRequired,
  }).isRequired,
  showHeartButton: PropTypes.bool,
};

export default CreatorCard;
