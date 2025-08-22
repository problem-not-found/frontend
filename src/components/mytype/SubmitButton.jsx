
import PropTypes from 'prop-types';
import styles from './submitButton.module.css';

const SubmitButton = ({ onNext, showPrivacyNotice, disabled = false, buttonText = "다음" }) => {
  const handleSubmit = () => {
    if (disabled) return;
    
    if (onNext) {
      onNext();
    } else {
      // 최종 단계에서의 완료 로직
      console.log('회원가입 완료');
    }
  };

  return (
    <div className={styles.container}>
      {showPrivacyNotice && (
        <p className={styles.privacyNotice}>
          입력하신 정보는 추천 기능에만 사용됩니다
        </p>
      )}
      <button 
        className={`${styles.button} ${disabled ? styles.disabled : ''}`} 
        onClick={handleSubmit}
        disabled={disabled}
      >
        {buttonText}
      </button>
    </div>
  );
};

SubmitButton.propTypes = {
  onNext: PropTypes.func,
  showPrivacyNotice: PropTypes.bool,
  disabled: PropTypes.bool,
  buttonText: PropTypes.string,
};

export default SubmitButton;
