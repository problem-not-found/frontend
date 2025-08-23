import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';
import styles from './tasteArtworks.module.css';

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

const TasteArtworks = () => {
  const navigate = useNavigate();
  const [likedArtworks, setLikedArtworks] = useState([1, 2, 3, 4, 5, 6]); // 기본적으로 모두 좋아요 상태

  const artworks = [
    {
      id: 1,
      title: "절벽 소녀",
      creator: "윤희준 크리에이터",
      image: "/artwork1.png"
    },
    {
      id: 2,
      title: "어둠 속",
      creator: "박성연 크리에이터",
      image: "/artwork2.png"
    },
    {
      id: 3,
      title: "절벽 소녀",
      creator: "윤희준 크리에이터",
      image: "/artwork3.png"
    },
    {
      id: 4,
      title: "어둠 속",
      creator: "박성연 크리에이터",
      image: "/creator-hero-image.png"
    },
    {
      id: 5,
      title: "절벽 소녀",
      creator: "윤희준 크리에이터",
      image: "/example1.png"
    },
    {
      id: 6,
      title: "어둠 속",
      creator: "박성연 크리에이터",
      image: "/creator-profile.png"
    }
  ];

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const handleLikeToggle = (artworkId, event) => {
    event.stopPropagation();
    setLikedArtworks(prev => 
      prev.includes(artworkId) 
        ? prev.filter(id => id !== artworkId)
        : [...prev, artworkId]
    );
  };

  return (
    <div className={styles.artworksContainer}>
      <div className={styles.artworksGrid}>
        {artworks.map((artwork) => (
          <div key={artwork.id} className={styles.artworkItem}>
            <div 
              className={styles.artworkImage}
              onClick={() => handleArtworkClick(artwork.id)}
            >
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className={styles.image}
              />
              
              <div className={styles.likeButton}>
                <HeartIcon 
                  filled={likedArtworks.includes(artwork.id)}
                  onClick={(e) => handleLikeToggle(artwork.id, e)}
                />
              </div>
            </div>
            
            <div className={styles.artworkInfo}>
              <h3 className={styles.artworkTitle}>{artwork.title}</h3>
              <p className={styles.artworkCreator}>{artwork.creator}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasteArtworks;
