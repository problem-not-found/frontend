import { useState, useEffect, useCallback, useRef } from 'react';
import ExhibitionCard from './ExhibitionCard';
import ExhibitionFilter from './ExhibitionFilter';
import BackToTopButton from '@/components/common/BackToTopButton';
import chevronLeft from '@/assets/museum/chevron-left.png';
import arrowDown from '@/assets/museum/arrow-down.svg';
import xImage from '@/assets/museum/x.png';
import styles from './exhibitionList.module.css';
import { getMyExhibitions } from '@/apis/museum/exhibition';

export default function ExhibitionList({ 
  showAddButton = true,
  onAddExhibition,
  showBackButton = false,
  onBack,
  onExhibitionClick
}) {
  // 전시 데이터 상태
  const [exhibitions, setExhibitions] = useState([]);
  const [layoutMode, setLayoutMode] = useState('grid');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showScrollHeader, setShowScrollHeader] = useState(false);
  const [selectedExhibitions, setSelectedExhibitions] = useState(new Set());
  const headerRef = useRef();

  // 전시 데이터 로드
  useEffect(() => {
    const loadExhibitions = async () => {
      try {
        const response = await getMyExhibitions({ pageNum: 1, pageSize: 20, fillAll: true });
        if (response?.data?.data) {
          setExhibitions(response.data.data.content || []);
        }
      } catch (error) {
        console.error('전시 데이터 로드 실패:', error);
      }
    };

    loadExhibitions();
  }, []);

  // 필터된 전시 목록
  const filteredExhibitions = exhibitions.filter(exhibition => 
    exhibition.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    exhibition.description.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // 스크롤 감지 로직
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom;
        setShowScrollHeader(headerBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // 편집 모드 종료 시 선택 초기화
      setSelectedExhibitions(new Set());
    }
  };

  const handleAddClick = () => {
    if (onAddExhibition) {
      onAddExhibition();
    }
  };

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
  };

  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleExhibitionSelection = (exhibition) => {
    const newSelected = new Set(selectedExhibitions);
    if (newSelected.has(exhibition.id)) {
      newSelected.delete(exhibition.id);
    } else {
      newSelected.add(exhibition.id);
    }
    setSelectedExhibitions(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedExhibitions.size === 0) return;
    
    const count = selectedExhibitions.size;
    if (confirm(`선택한 ${count}개 전시를 정말 삭제하시겠습니까?`)) {
      // 선택된 전시들을 실제로 삭제
      setExhibitions(prev => prev.filter(exhibition => !selectedExhibitions.has(exhibition.id)));
      setSelectedExhibitions(new Set());
    }
  };

  const handleDeleteExhibition = (exhibition) => {
    if (confirm(`"${exhibition.title}" 전시를 정말 삭제하시겠습니까?`)) {
      setExhibitions(prev => prev.filter(e => e.id !== exhibition.id));
    }
  };

  // 빈 상태 체크
  const isEmpty = !filteredExhibitions || filteredExhibitions.length === 0;
  const hasSearchKeyword = searchKeyword && searchKeyword.trim() !== '';
  const isSearchResultEmpty = hasSearchKeyword && isEmpty;
  const isCompletelyEmpty = !hasSearchKeyword && isEmpty;

  if (isCompletelyEmpty) {
    return (
      <div className={`${styles.container} ${styles.emptyContainer}`}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {showBackButton && (
              <button className={styles.backButton} onClick={onBack}>
                <img src={chevronLeft} alt="back" className={styles.backIcon} />  
              </button>
            )}
            <h1 className={styles.title}>내 전시</h1>
          </div>
        </div>

        {/* 빈 상태 */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <img src={xImage} alt="empty" className={styles.emptyIconImage} />
          </div>
          <div className={styles.emptyText}>
            등록된 전시가 아직 없어요<br />
            전시를 등록해보세요
          </div>
        </div>

        {/* 등록 버튼 */}
        {showAddButton && !isEditMode && (
          <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={handleAddClick}>
              전시 등록하기
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div ref={headerRef} className={styles.header}>
        <div className={styles.headerLeft}>
          {showBackButton && (
            <button className={styles.backButton} onClick={onBack}>
              <img src={chevronLeft} alt="back" className={styles.backIcon} />
            </button>
          )}
          <h1 className={styles.title}>내 전시</h1>
        </div>
        <div className={styles.headerRight}>
          <button 
            className={`${styles.editButton} ${isEditMode ? styles.editButtonActive : ''}`}
            onClick={handleEditModeToggle}
          >
            {isEditMode ? '완료' : '편집'}
          </button>
        </div>
      </div>

      {/* 스크롤 헤더 */}
      {showScrollHeader && (
        <div className={styles.scrollHeader}>
          <div className={styles.scrollHeaderContent}>
            {showBackButton && (
              <button className={styles.scrollBackButton} onClick={onBack}>
                <img src={arrowDown} alt="back" className={styles.scrollBackIcon} />
              </button>
            )}
            <h1 className={styles.scrollTitle}>내 전시</h1>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <ExhibitionFilter
        layoutMode={layoutMode}
        onLayoutChange={handleLayoutChange}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
      />

      {/* 전시 목록 */}
      {isSearchResultEmpty ? (
        // 검색 결과가 없을 때
        <div className={styles.searchEmptyState}>
          <div className={styles.searchEmptyIcon}>
            <img src={xImage} alt="no results" className={styles.searchEmptyIconImage} />
          </div>
          <div className={styles.searchEmptyText}>
            검색된 결과가 없습니다<br />
            다른 키워드로 검색해보세요
          </div>
        </div>
      ) : (
        // 정상적인 전시 목록
        <div className={`${styles.exhibitionGrid} ${layoutMode === 'grid' ? styles.exhibitionGridLayout : styles.exhibitionVerticalLayout}`}>
                     {filteredExhibitions.map((exhibition, index) => (
             <div key={exhibition.exhibitionId || index}>
               <ExhibitionCard
                exhibition={exhibition}
                layoutMode={layoutMode}
                onClick={onExhibitionClick}
                showDate={true}
                showStatus={true}
                showDescription={true}
                isEditMode={isEditMode}
                onDelete={handleDeleteExhibition}
                isSelected={selectedExhibitions.has(exhibition.id)}
                onSelect={handleExhibitionSelection}
              />
            </div>
          ))}
        </div>
      )}

      {/* 등록/삭제 버튼 */}
      {showAddButton && (
        <div className={styles.addButtonContainer}>
          {isEditMode ? (
            <button 
              className={`${styles.addButton} ${selectedExhibitions.size === 0 ? styles.disabledButton : ''}`}
              onClick={handleDeleteSelected}
              disabled={selectedExhibitions.size === 0}
            >
              {selectedExhibitions.size > 0 ? `${selectedExhibitions.size}개 삭제하기` : '삭제하기'}
            </button>
          ) : (
            <button className={styles.addButton} onClick={handleAddClick}>
              전시 등록하기
            </button>
          )}
        </div>
      )}

      {/* 맨 위로 버튼 */}
      <BackToTopButton />
    </div>
  );
}