import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './nicknameInputSection.module.css';

const NicknameInputSection = ({ onNicknameChange }) => {
  const [nickname, setNickname] = useState('');

  return (
    <div className={styles.container}>
      <h2 className={styles.title}><span className={styles.underline}>닉네임</span>을 설정해주세요</h2>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            onNicknameChange(e.target.value);
          }}
          placeholder=""
          className={styles.input}
        />
      </div>
      <div className={styles.helperTextContainer}>
        <p className={styles.helperText}>닉네임은 추후 변경 가능합니다.</p>
        <p className={styles.helperText}>
          닉네임은 2~10자 이내의 한글, 영문, 숫자를 사용해주세요
        </p>
        <p className={styles.helperText}>
          특수문자, 욕설, 타인의 개인정보는 사용할 수 없습니다
        </p>
        <p className={styles.helperText}>닉네임은 중복 가능합니다</p>
      </div>
    </div>
  );
};

NicknameInputSection.propTypes = {
  onNicknameChange: PropTypes.func.isRequired,
};

export default NicknameInputSection;
