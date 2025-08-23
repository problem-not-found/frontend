import { useState } from 'react';
import styles from './tasteCategories.module.css';

const TasteCategories = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState('전시');
  
  const categories = ['내 관심사', '전시', '작품', '크리에이터'];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category === '내 관심사' ? '관심사' : category);
    }
  };

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryTab} ${activeCategory === category ? styles.activeTab : styles.inactiveTab}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export default TasteCategories;
