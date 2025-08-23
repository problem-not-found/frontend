import { useNavigate } from 'react-router-dom';
import styles from './artworkHeader.module.css';

const BackIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M28.5 18H7.5" stroke="black" strokeWidth="1"/>
    <path d="M18 7.5L7.5 18L18 28.5" stroke="black" strokeWidth="1"/>
  </svg>
);

const ArtworkHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <button className={styles.backButton} onClick={handleBack}>
          <BackIcon />
        </button>
        <h1 className={styles.headerTitle}>작품 정보</h1>
      </div>
    </div>
  );
};

export default ArtworkHeader;
