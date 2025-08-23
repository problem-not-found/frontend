import { useState } from 'react';
import styles from './searchEmpty.module.css';

const SearchEmpty = ({ onKeywordSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendedKeywords = [
    '공예 판매전',
    '유화',
    '흑백 사진전',
    '풍경 드로잉',
    '성북구 작가 전시',
    '서경대학교 디자인전공 졸업전시',
    '국립현대미술관 한국 현대미술 작가전'
  ];

  const handleKeywordClick = (keyword) => {
    setSearchQuery(keyword);
    if (onKeywordSelect) {
      onKeywordSelect(keyword);
    }
  };

  return (
    <div className={styles.emptyContainer}>
      {/* Section Title */}
      <div className={styles.sectionTitle}>
        <h2 className={styles.titleText}>추천 분류</h2>
      </div>

      {/* Recommended Keywords */}
      <div className={styles.keywordsGrid}>
        {recommendedKeywords.map((keyword, index) => (
          <button
            key={index}
            className={styles.keywordButton}
            onClick={() => handleKeywordClick(keyword)}
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchEmpty;
