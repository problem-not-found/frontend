import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import likeIcon from '../../assets/feed/like.svg';
import unlikeIcon from '../../assets/feed/unlike.svg';
import styles from './tasteExhibitions.module.css';

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

const TasteExhibitions = () => {
  const navigate = useNavigate();
  const [likedExhibitions, setLikedExhibitions] = useState([1, 2]); // 기본적으로 좋아요 상태

  const exhibitions = [
    {
      id: 1,
      title: "홍익대학교 산업디자인전공 졸업 전시",
      date: "24.11.26 - 24.11.30",
      image: "/artwork1.png"
    },
    {
      id: 2,
      title: "정영진 유화전",
      date: "24.11.26 - 24.11.30", 
      image: "/artwork2.png"
    }
  ];

  const handleExhibitionClick = (exhibitionId) => {
    navigate(`/exhibition/${exhibitionId}`);
  };

  const handleLikeToggle = (exhibitionId, event) => {
    event.stopPropagation();
    setLikedExhibitions(prev => 
      prev.includes(exhibitionId) 
        ? prev.filter(id => id !== exhibitionId)
        : [...prev, exhibitionId]
    );
  };

  return (
    <div className={styles.exhibitionsContainer}>
      {exhibitions.map((exhibition) => (
        <div key={exhibition.id} className={styles.exhibitionItem}>
          <div 
            className={styles.exhibitionImage}
            onClick={() => handleExhibitionClick(exhibition.id)}
          >
            <img 
              src={exhibition.image} 
              alt={exhibition.title}
              className={styles.image}
            />
          </div>
          
          <div className={styles.exhibitionContent}>
            <div className={styles.exhibitionInfo}>
              <div className={styles.textContent}>
                <h3 className={styles.exhibitionTitle}>{exhibition.title}</h3>
                <p className={styles.exhibitionDate}>{exhibition.date}</p>
              </div>
            </div>
            
            <div className={styles.likeButton}>
              <HeartIcon 
                filled={likedExhibitions.includes(exhibition.id)}
                onClick={(e) => handleLikeToggle(exhibition.id, e)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasteExhibitions;
