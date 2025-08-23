import { useNavigate } from 'react-router-dom';
import styles from './creatorSearchItem.module.css';

const CreatorSearchItem = ({ creator }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/creator/${creator.id}`);
  };

  return (
    <div className={styles.itemContainer} onClick={handleClick}>
      <div className={styles.itemContent}>
        <div className={styles.profileImage}>
          <img 
            src={creator.profileImage || '/creator-profile.png'} 
            alt={creator.name}
            className={styles.avatar}
          />
        </div>
        <div className={styles.textContent}>
          <div className={styles.creatorInfo}>
            <span className={styles.creatorName}>
              {creator.name} <span className={styles.username}>@{creator.username}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorSearchItem;
