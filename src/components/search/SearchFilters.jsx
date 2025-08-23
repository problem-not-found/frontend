import { useState } from 'react';
import styles from './searchFilters.module.css';

const SearchFilters = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('전시');
  const [sortBy, setSortBy] = useState('인기순');

  const tabs = ['전시', '작품', '크리에이터'];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  const handleSortToggle = () => {
    setSortBy(prev => prev === '인기순' ? '최신순' : '인기순');
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        {/* Category Tabs */}
        <div className={styles.categoryTabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.categoryTab} ${activeTab === tab ? styles.activeTab : styles.inactiveTab}`}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sort Filter */}
        <div className={styles.sortContainer}>
          <button
            onClick={handleSortToggle}
            className={styles.sortButton}
          >
            {sortBy}
          </button>
        </div>
      </div>

      {/* Creator Search Notice */}
      {activeTab === '크리에이터' && (
        <div className={styles.creatorNotice}>
          <p className={styles.noticeText}>
            닉네임이 아닌 아이디로 검색하려면 @를 입력하세요
          </p>
        </div>
      )}
    </>
  );
};

export default SearchFilters;
