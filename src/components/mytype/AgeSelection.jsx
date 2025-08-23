import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './ageSelection.module.css';

const AgeSelection = ({ onAgeChange }) => {
  const [selectedAge, setSelectedAge] = useState('');

  const ageGroups = [
    { id: '10s', label: '10대' },
    { id: '20s', label: '20대' },
    { id: '30s', label: '30대' },
    { id: '40s', label: '40대' },
    { id: '50plus', label: '50대+' }
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}><span className={styles.underline}>연령대</span>를 선택해주세요</h2>
      <div className={styles.buttonGroup}>
        {ageGroups.map((age) => (
          <button
            key={age.id}
            className={`${styles.ageButton} ${
              selectedAge === age.id ? styles.selected : ''
            }`}
            onClick={() => {
              setSelectedAge(age.id);
              onAgeChange(age.id);
            }}
          >
            {age.label}
          </button>
        ))}
      </div>
    </div>
  );
};

AgeSelection.propTypes = {
  onAgeChange: PropTypes.func.isRequired,
};

export default AgeSelection;
