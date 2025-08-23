import { useNavigate } from 'react-router-dom';
import styles from './searchItem.module.css';

const ArrowIcon = () => (
  <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
    <line x1="21" y1="0" x2="21" y2="17" stroke="white" strokeWidth="2"/>
    <line x1="4" y1="17" x2="21" y2="17" stroke="white" strokeWidth="2"/>
    <line x1="6.02" y1="3" x2="19.02" y2="16" stroke="white" strokeWidth="2"/>
  </svg>
);

const SearchItem = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.type === 'exhibition') {
      navigate(`/exhibition/${item.id}`);
    } else if (item.type === 'artwork') {
      navigate(`/artwork/${item.id}`);
    } else if (item.type === 'creator') {
      navigate(`/creator/${item.id}`);
    }
  };

  return (
    <div className={styles.itemContainer} onClick={handleClick}>
      <div className={styles.itemContent}>
        <div className={styles.textContent}>
          <h3 className={styles.itemTitle}>{item.title}</h3>
        </div>
      </div>
      <div className={styles.arrowContainer}>
        <div className={styles.arrowFrame}>
          <ArrowIcon />
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
