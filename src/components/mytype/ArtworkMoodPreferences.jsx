import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './exhibitionPreferences.module.css'; // 3단계와 동일한 CSS 사용

const ArtworkMoodPreferences = ({ onSelectionChange }) => {
  const [selectedMoods, setSelectedMoods] = useState([]);

  const moods = [
    '휴양지 감성',
    '몽환적',
    '미니멀리즘',
    '네온 감성',
    '팝아트',
    '흑백',
    '레트로',
    '파스텔톤',
    '아방가르드',
    '키치',
    '사실주의',
    '원색 대비',
    '세피아톤',
    '그라데이션',
    '위트 있는',
    '서정적',
    '퓨처리즘',
    '그로테스크',
    '초현실주의',
    '따뜻한'
  ];

  const handleMoodToggle = (mood) => {
    let newSelection;
    if (selectedMoods.includes(mood)) {
      newSelection = selectedMoods.filter(item => item !== mood);
    } else {
      if (selectedMoods.length < 5) {
        newSelection = [...selectedMoods, mood];
      } else {
        return; // 5개 초과 선택 방지
      }
    }
    
    setSelectedMoods(newSelection);
    onSelectionChange(newSelection);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>작품의 어떤 분위기를 좋아하시나요?</h2>
      <p className={styles.subtitle}>3개 이상 5개까지 선택해주세요.</p>
      
      <div className={styles.preferencesGrid}>
        {moods.map((mood) => (
          <button
            key={mood}
            className={`${styles.preferenceButton} ${
              selectedMoods.includes(mood) ? styles.selected : ''
            }`}
            onClick={() => handleMoodToggle(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};

ArtworkMoodPreferences.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default ArtworkMoodPreferences;

