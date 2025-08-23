import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './exhibitionPreferences.module.css';

const ExhibitionPreferences = ({ onSelectionChange }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  const preferences = [
    '역사, 문화',
    '자연',
    '환경',
    '인물',
    '사회',
    '추상',
    '개념 미술',
    '여행'
  ];

  const handlePreferenceToggle = (preference) => {
    let newSelection;
    if (selectedPreferences.includes(preference)) {
      newSelection = selectedPreferences.filter(item => item !== preference);
    } else {
      if (selectedPreferences.length < 5) {
        newSelection = [...selectedPreferences, preference];
      } else {
        return; // 5개 초과 선택 방지
      }
    }
    
    setSelectedPreferences(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>어떤 주제의 전시를 좋아하시나요?</h2>
      <p className={styles.subtitle}>3개 이상 5개까지 선택해주세요.</p>
      
      <div className={styles.preferencesGrid}>
        {preferences.map((preference) => (
          <button
            key={preference}
            className={`${styles.preferenceButton} ${
              selectedPreferences.includes(preference) ? styles.selected : ''
            }`}
            onClick={() => handlePreferenceToggle(preference)}
          >
            {preference}
          </button>
        ))}
      </div>
    </div>
  );
};

ExhibitionPreferences.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default ExhibitionPreferences;
