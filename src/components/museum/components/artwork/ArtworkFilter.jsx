import { useState, useEffect } from 'react';
import layoutButton from '@/assets/museum/layoutbutton.svg';
import styles from './artworkFilter.module.css';

export default function ArtworkFilter({ 
  layoutMode, 
  onLayoutChange, 
  searchKeyword, 
  onSearchChange,
  applicated,
  onApplicatedChange
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [localSearchKeyword, setLocalSearchKeyword] = useState(searchKeyword || '');

  // debounce 효과를 위한 useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchKeyword);
    }, 1000); // 1초 대기

    return () => clearTimeout(timer);
  }, [localSearchKeyword, onSearchChange]);

  // 외부에서 searchKeyword가 변경될 때 local state 동기화
  useEffect(() => {
    setLocalSearchKeyword(searchKeyword || '');
  }, [searchKeyword]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 엔터 키 누르면 즉시 검색
    onSearchChange(localSearchKeyword);
  };

  const handleInputChange = (e) => {
    setLocalSearchKeyword(e.target.value);
  };

  const handleApplicatedToggle = () => {
    if (onApplicatedChange) {
      onApplicatedChange();
    }
  };

  return (
    <div className={styles.filterContainer}>
      {/* 등록 상태 토글 */}
      {onApplicatedChange && (
        <div className={styles.applicatedToggle}>
          <button
            className={`${styles.toggleButton} ${applicated ? styles.toggleButtonActive : ''}`}
            onClick={handleApplicatedToggle}
          >
            {applicated ? '등록 신청한 작품' : '임시 저장된 작품'}
          </button>
        </div>
      )}

      {/* 검색바 */}
      <div className={styles.searchContainer}>
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="키워드로 검색하기"
            value={localSearchKeyword}
            onChange={handleInputChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`${styles.searchInput} ${isSearchFocused ? styles.searchInputFocused : ''}`}
          />
          <button type="submit" className={styles.searchButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#f37021" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>
      </div>

      {/* 정렬 및 레이아웃 컨트롤 */}
      <div className={styles.controlsContainer}>
        <div className={styles.sortInfo}>
          작품은 최신순으로 보여집니다.
        </div>
        
        <div className={styles.layoutControls}>
          {/* 레이아웃 토글 버튼 */}
          <div className={styles.layoutToggle}>
            <button
              className={`${styles.layoutButton} ${layoutMode === 'vertical' ? styles.layoutButtonActive : ''}`}
              onClick={() => onLayoutChange('vertical')}
            >
              <img 
                src={layoutButton} 
                alt="vertical layout" 
                className={styles.layoutIcon}
              />
            </button>
            <button
              className={`${styles.layoutButton} ${layoutMode === 'grid' ? styles.layoutButtonActive : ''}`}
              onClick={() => onLayoutChange('grid')}
            >
              <img 
                src={layoutButton} 
                alt="grid layout" 
                className={`${styles.layoutIcon} ${styles.rotated}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
