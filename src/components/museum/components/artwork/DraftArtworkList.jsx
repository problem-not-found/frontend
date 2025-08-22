import { useState, useEffect, useCallback, useRef } from 'react';
import ArtworkCard from './ArtworkCard';
import ArtworkFilter from './ArtworkFilter';
import useArtworkDraftStore from '@museum/services/artworkDraftStore';
import BackToTopButton from '@/components/common/BackToTopButton';
import chevronLeft from '@/assets/museum/chevron-left.png';
import arrowDown from '@/assets/museum/arrow-down.svg';
import xImage from '@/assets/museum/x.png';
import styles from './artworkList.module.css';

export default function DraftArtworkList({ 
  showAddButton = true,
  onAddArtwork,
  showBackButton = false,
  onBack,
  onArtworkClick
}) {
  // Zustand 스토어에서 임시저장 데이터 가져오기
  const {
    drafts,
    deleteDraft
  } = useArtworkDraftStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showScrollHeader, setShowScrollHeader] = useState(false);
  const [selectedDrafts, setSelectedDrafts] = useState(new Set());
  const [layoutMode, setLayoutMode] = useState('vertical');
  const [searchKeyword, setSearchKeyword] = useState('');
  const observerRef = useRef();
  const loadingRef = useRef();
  const headerRef = useRef();

  // 임시저장 데이터를 ArtworkCard에서 사용할 수 있는 형태로 변환
  const convertedDrafts = drafts.map(draft => ({
    id: draft.id,
    title: draft.title || '제목 없음',
    description: draft.description || '설명 없음',
    image: draft.image,
    status: "임시저장",
    createdAt: draft.createdAt,
    isExhibiting: false
  }));

  // 필터된 작품 목록
  const getFilteredDrafts = () => {
    if (!searchKeyword) return convertedDrafts;
    
    return convertedDrafts.filter(draft =>
      draft.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      draft.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  };

  const filteredDrafts = getFilteredDrafts();

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
      setSelectedDrafts(new Set());
    }
  };

  const handleAddClick = () => {
    if (onAddArtwork) {
      onAddArtwork();
    }
  };

  const handleLayoutChange = (mode) => {
    setLayoutMode(mode);
  };

  const handleSearchChange = (keyword) => {
    setSearchKeyword(keyword);
  };

  const handleDraftSelection = (draft) => {
    const newSelected = new Set(selectedDrafts);
    if (newSelected.has(draft.id)) {
      newSelected.delete(draft.id);
    } else {
      newSelected.add(draft.id);
    }
    setSelectedDrafts(newSelected);
  };

  const handleDeleteSelected = () => {
    if (selectedDrafts.size === 0) return;
    
    const count = selectedDrafts.size;
    if (confirm(`선택한 ${count}개 임시저장을 정말 삭제하시겠습니까?`)) {
      // 선택된 임시저장들을 실제로 삭제
      Array.from(selectedDrafts).forEach(draftId => {
        deleteDraft(draftId);
      });
      
      console.log('선택된 임시저장들 삭제 완료:', Array.from(selectedDrafts));
      setSelectedDrafts(new Set());
    }
  };

  const handleDeleteDraft = (draft) => {
    if (confirm(`"${draft.title}" 임시저장을 정말 삭제하시겠습니까?`)) {
      deleteDraft(draft.id);
    }
  };

  // 빈 상태 체크
  const isEmpty = !filteredDrafts || filteredDrafts.length === 0;
  const hasSearchKeyword = searchKeyword && searchKeyword.trim() !== '';
  const isSearchResultEmpty = hasSearchKeyword && isEmpty;
  const isCompletelyEmpty = !hasSearchKeyword && isEmpty;

  if (isCompletelyEmpty) {
    return (
      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {showBackButton && (
              <button className={styles.backButton} onClick={onBack}>
                <img src={chevronLeft} alt="back" className={styles.backIcon} />  
              </button>
            )}
            <h1 className={styles.title}>임시저장한 작품</h1>
          </div>
        </div>

        {/* 빈 상태 */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <img src={xImage} alt="empty" className={styles.emptyIconImage} />
          </div>
          <div className={styles.emptyText}>
            임시저장된 작품이 아직 없어요<br />
            작품을 등록해보세요
          </div>
        </div>

        {/* 등록/삭제 버튼 */}
        {showAddButton && !isEditMode && (
          <div className={styles.addButtonContainer}>
            <button className={styles.addButton} onClick={handleAddClick}>
              작품 등록하기
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
          <h1 className={styles.title}>임시저장한 작품</h1>
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
            <h1 className={styles.scrollTitle}>임시저장한 작품</h1>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <ArtworkFilter
        layoutMode={layoutMode}
        onLayoutChange={handleLayoutChange}
        searchKeyword={searchKeyword}
        onSearchChange={handleSearchChange}
      />

      {/* 작품 목록 */}
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
        // 정상적인 작품 목록
        <div className={`${styles.artworkGrid} ${layoutMode === 'grid' ? styles.artworkGridLayout : styles.artworkVerticalLayout}`}>
          {filteredDrafts.map((draft, index) => {
            return (
              <div key={draft.id}>
                {/* 날짜를 이미지 밖 왼쪽 상단에 표시 */}
                <div className={styles.dateLabel}>
                  {draft.createdAt}
                </div>
                <ArtworkCard
                  artwork={draft}
                  layoutMode={layoutMode}
                  onClick={onArtworkClick}
                  showDate={false}
                  showStatus={false}
                  showDescription={true}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteDraft}
                  isSelected={selectedDrafts.has(draft.id)}
                  onSelect={handleDraftSelection}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 등록/삭제 버튼 */}
      {showAddButton && (
        <div className={styles.addButtonContainer}>
          {isEditMode ? (
            <button 
              className={`${styles.addButton} ${selectedDrafts.size === 0 ? styles.disabledButton : ''}`}
              onClick={handleDeleteSelected}
              disabled={selectedDrafts.size === 0}
            >
              {selectedDrafts.size > 0 ? `${selectedDrafts.size}개 삭제하기` : '삭제하기'}
            </button>
          ) : (
            <button className={styles.addButton} onClick={handleAddClick}>
              작품 등록하기
            </button>
          )}
        </div>
      )}

      {/* 맨 위로 버튼 */}
      <BackToTopButton />
    </div>
  );
}