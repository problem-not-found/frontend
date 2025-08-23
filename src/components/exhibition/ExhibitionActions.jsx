import { useNavigate } from 'react-router-dom';
import BackToTopButton from '../common/BackToTopButton';
import styles from './exhibitionActions.module.css';

const ExhibitionActions = () => {
  const navigate = useNavigate();

  const handleViewExhibition = () => {
    navigate('/gallery');
  };

  return (
    <>
      <BackToTopButton />
      
      {/* View Exhibition Button */}
      <div className={styles.actionsContainer}>
        <button className={styles.viewExhibitionButton} onClick={handleViewExhibition}>
          전시 보러가기
        </button>
      </div>
    </>
  );
};

export default ExhibitionActions;
