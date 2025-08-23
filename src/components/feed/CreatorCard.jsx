import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './creatorCard.module.css';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';

const CreatorCard = ({ creator, showHeartButton = true }) => {
  const [isLiked, setIsLiked] = useState(creator.isLike || false);

  // API 응답 데이터 매핑
  const profileImage = creator.profileImageUrl || creator.profileImage;
  const name = creator.nickname || creator.name;
  const username = creator.username || '';
  const artworks = creator.pieceImageUrls ? 
    creator.pieceImageUrls.map((url, index) => ({ id: index, image: url })) :
    creator.artworks || [];

  return (
    <div className={styles.card}>
      <div className={styles.profileSection}>
        <img 
          src={profileImage} 
          alt={`${name} 프로필`}
          className={styles.profileImage}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/public/creator-profile.png'; // fallback image
          }}
        />
        <div className={styles.nameSection}>
          <h3 className={styles.name}>
            {name.replace(' 크리에이터', '')} 
            <span className={styles.creatorLabel}> 크리에이터</span>
          </h3>
          {username && <p className={styles.username}>{username}</p>}
        </div>
      </div>
      
      <div className={styles.artworkGrid}>
        {artworks.map((artwork, index) => (
          <div key={artwork.id || index} className={styles.artworkFrame}>
            {artwork.image ? (
              <img 
                src={artwork.image} 
                alt={`작품 ${index + 1}`}
                className={styles.artworkImage}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={styles.emptyArtwork} style={{ display: artwork.image ? 'none' : 'flex' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M4 4H28V28H4V4Z" stroke="#757575" strokeWidth="1"/>
                <circle cx="9.33" cy="9.33" r="2" fill="#757575"/>
                <path d="M6.67 13.33L28 28V13.33H6.67Z" stroke="#757575" strokeWidth="1"/>
              </svg>
            </div>
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
    // API 응답 필드
    userId: PropTypes.number,
    nickname: PropTypes.string,
    profileImageUrl: PropTypes.string,
    pieceImageUrls: PropTypes.arrayOf(PropTypes.string),
    isLike: PropTypes.bool,
    // 기존 필드 (호환성 유지)
    id: PropTypes.number,
    name: PropTypes.string,
    username: PropTypes.string,
    profileImage: PropTypes.string,
    artworks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      image: PropTypes.string,
    })),
  }).isRequired,
  showHeartButton: PropTypes.bool,
};

export default CreatorCard;
