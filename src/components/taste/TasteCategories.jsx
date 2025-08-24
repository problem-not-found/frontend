import styles from "./tasteCategories.module.css";

const TasteCategories = ({ activeCategory, onCategoryChange }) => {
  const categories = ["내 관심사", "전시", "작품", "크리에이터"];

  const handleCategoryClick = (category) => {
    if (onCategoryChange) {
      onCategoryChange(category === "내 관심사" ? "관심사" : category);
    }
  };

  // 현재 활성 탭을 UI 표시용으로 변환 (관심사 -> 내 관심사)
  const displayActiveCategory =
    activeCategory === "관심사" ? "내 관심사" : activeCategory;

  return (
    <div className={styles.categoriesContainer}>
      <div className={styles.sectionHeader}>
        <div className={styles.categoryTabs}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryTab} ${
                displayActiveCategory === category
                  ? styles.activeTab
                  : styles.inactiveTab
              }`}
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
