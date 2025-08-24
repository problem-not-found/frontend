import { useState } from "react";
import styles from "./searchHeader.module.css";

const SearchIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M17 17L21 21" stroke="black" strokeWidth="1" />
    <circle cx="11" cy="11" r="8" stroke="black" strokeWidth="1" fill="none" />
  </svg>
);

const SearchHeader = ({
  onSearchChange,
  onSearchClick,
  searchQuery,
  hasSearchQuery = false,
}) => {
  const handleSearch = () => {
    if (onSearchClick) {
      onSearchClick(searchQuery);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    if (onSearchChange) {
      onSearchChange(newQuery);
    }
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.searchBar}>
        <div className={styles.searchContent}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className={styles.searchInput}
            placeholder={
              hasSearchQuery
                ? "키워드로 검색하기"
                : "전시, 작품, 크리에이터 등을 검색해보세요"
            }
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
