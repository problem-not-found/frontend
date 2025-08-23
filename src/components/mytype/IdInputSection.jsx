import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './idInputSection.module.css';

const IdInputSection = ({ onIdChange }) => {
  const [id, setId] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    if (id.length === 0) {
      setShowValidation(false);
      return;
    }

    const timer = setTimeout(() => {
      // 입력이 멈춘 후 500ms 후에 검증 결과 표시
      setShowValidation(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      setShowValidation(false);
    };
  }, [id]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}><span className={styles.underline}>아이디</span>를 설정해주세요</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            onIdChange(e.target.value);
          }}
          placeholder=""
          className={styles.input}
        />
      </div>
      <p className={styles.helperText}>
        {showValidation && (
          <>
            <span className={styles.available}>사용 가능한 아이디입니다</span>
            <br />
          </>
        )}
        아이디는 3~15자 이내의 <span className={styles.highlight}>영문, 숫자, 특수문자</span>를 사용해주세요
      </p>
    </div>
  );
};

IdInputSection.propTypes = {
  onIdChange: PropTypes.func.isRequired,
};

export default IdInputSection;
