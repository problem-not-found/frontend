import { useNavigate } from 'react-router-dom';
import styles from './writeReviewButton.module.css';

const WriteReviewButton = ({ exhibitionId = "1" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/write-review/${exhibitionId}`);
  };

  return (
    <div className={styles.writeReviewContainer}>
      <button className={styles.writeReviewButton} onClick={handleClick}>
        감상평 작성하기
      </button>
    </div>
  );
};

export default WriteReviewButton;
