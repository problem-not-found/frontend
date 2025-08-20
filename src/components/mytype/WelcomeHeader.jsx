import PropTypes from 'prop-types';
import styles from './welcomeHeader.module.css';

const WelcomeHeader = ({ currentStep = 1 }) => {
  return (
    <div className={styles.container}>
      {currentStep <= 2 && (
        <>
          <h1 className={styles.title}>반갑습니다!</h1>
          <p className={styles.subtitle}>
            개인 맞춤 전시를 위해
            <br />
            기본 정보를 입력해주세요.
          </p>
        </>
      )}
    </div>
  );
};

WelcomeHeader.propTypes = {
  currentStep: PropTypes.number,
};

export default WelcomeHeader;