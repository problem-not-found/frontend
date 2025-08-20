import styles from './privacyNotice.module.css';

const PrivacyNotice = () => {
  return (
    <div className={styles.container}>
      <p className={styles.notice}>
        입력하신 정보는 추천 기능에만 사용됩니다
      </p>
    </div>
  );
};

export default PrivacyNotice;
