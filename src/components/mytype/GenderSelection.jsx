import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './genderSelection.module.css';

const GenderSelection = ({ onGenderChange }) => {
  const [selectedGender, setSelectedGender] = useState('');

  const genders = [
    { id: 'male', label: '남성' },
    { id: 'female', label: '여성' },
    { id: 'prefer-not-to-say', label: '선택 안 함' }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>성별을 선택해주세요</h2>
      <div className={styles.buttonGroup}>
        {genders.map((gender) => (
          <button
            key={gender.id}
            className={`${styles.genderButton} ${
              selectedGender === gender.id ? styles.selected : ''
            }`}
            onClick={() => {
              setSelectedGender(gender.id);
              onGenderChange(gender.id);
            }}
          >
            {gender.label}
          </button>
        ))}
      </div>
    </div>
  );
};

GenderSelection.propTypes = {
  onGenderChange: PropTypes.func.isRequired,
};

export default GenderSelection;
