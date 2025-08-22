import { useNavigate } from 'react-router-dom';
import styles from './completionScreen.module.css';
import SubmitButton from './SubmitButton';

const CompletionScreen = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // 피드 페이지로 이동
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.checkIcon}>
        <svg width="37" height="38" viewBox="0 0 37 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M7 19L15 27L30 11" 
            stroke="#F37021" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      
      <div className={styles.message}>
        <span>취향 파악이 완료되었어요</span>
        <span>내 취향에 맞게 추천해드려요</span>
      </div>
      
      <SubmitButton onNext={handleConfirm} buttonText="확인" />
    </div>
  );
};

export default CompletionScreen;
