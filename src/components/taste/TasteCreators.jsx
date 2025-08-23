import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';
import styles from './tasteCreators.module.css';

const HeartIcon = ({ filled = false, onClick }) => (
  <img 
    src={filled ? likeIcon : unlikeIcon} 
    alt={filled ? "좋아요" : "좋아요 안함"}
    width="24" 
    height="24" 
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  />
);

const ArrowIcon = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#434343" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TasteCreators = () => {
  const navigate = useNavigate();
  const [likedCreators, setLikedCreators] = useState([1, 2, 3, 4, 5]); // 기본적으로 모두 좋아요 상태

  const creators = [
    {
      id: 1,
      name: "김땡땡 크리에이터",
      profileImage: "/creator-profile.png"
    },
    {
      id: 2,
      name: "김땡땡 크리에이터",
      profileImage: "/creator-hero-image.png",
      hasArrow: true
    },
    {
      id: 3,
      name: "김땡땡 크리에이터",
      profileImage: "/example1.png"
    },
    {
      id: 4,
      name: "김땡땡 크리에이터",
      profileImage: "/artwork1.png"
    },
    {
      id: 5,
      name: "김땡땡 크리에이터",
      profileImage: "/artwork2.png"
    }
  ];



  const handleCreatorClick = (creatorId) => {
    navigate(`/creator/${creatorId}`);
  };

  const handleLikeToggle = (creatorId, event) => {
    event.stopPropagation();
    setLikedCreators(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    );
  };

  return (
    <div className={styles.creatorsContainer}>
      <div className={styles.creatorsList}>
        {creators.map((creator) => (
          <div 
            key={creator.id} 
            className={styles.creatorCard}
            onClick={() => handleCreatorClick(creator.id)}
          >
            <div className={styles.creatorInfo}>
              <img 
                src={creator.profileImage} 
                alt={creator.name}
                className={styles.profileImage}
              />
              <div className={styles.creatorDetails}>
                <h3 className={styles.creatorName}>
                  <span>김땡땡</span>
                  <span className={styles.creatorLabel}> 크리에이터</span>
                </h3>
              </div>
            </div>
            
            
              <div className={styles.likeButton}>
                <HeartIcon 
                  filled={likedCreators.includes(creator.id)}
                  onClick={(e) => handleLikeToggle(creator.id, e)}
                />
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default TasteCreators;
