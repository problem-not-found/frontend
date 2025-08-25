import { useState, useEffect, useCallback, useRef } from 'react';
import ArtworkCard from './ArtworkCard';
import ArtworkFilter from './ArtworkFilter';
import { deletePieces, getArtworkTitle, getArtworkDescription } from '@apis/museum/artwork';
import useUserStore from '@/stores/userStore';
import BackToTopButton from '@/components/common/BackToTopButton';
import chevronLeft from '@/assets/museum/chevron-left.png';
import arrowDown from '@/assets/museum/arrow-down.svg';
import xImage from '@/assets/museum/x.png';
import styles from './artworkList.module.css';

export default function ArtworkList({ 
  showAddButton = true,
  onAddArtwork,
  showBackButton = false,
  onBack,
  onArtworkClick,
  showDraftButton = false,
  onDraftClick,
  isLibraryMode = false,
  libraryTitle = "작품 목록",
  title, // 커스텀 제목 prop 추가
  artworks = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  onArtworkDeleted // 새로운 prop 추가
}) {
  // 로컬 상태로 관리
  const [layoutMode, setLayoutMode] = useState('grid');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showScrollHeader, setShowScrollHeader] = useState(false);
  const [selectedArtworks, setSelectedArtworks] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  
  const observerRef = useRef();
  const loadingRef = useRef();
  const headerRef = useRef();

  // 검색어로 필터링된 작품 목록
  const filteredArtworks = artworks.filter(artwork => 
    !searchKeyword || 
    artwork.title?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
    artwork.description?.toLowerCase().includes(searchKeyword.toLowerCase())
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

  // 무한 스크롤 구현
  const lastArtworkElementRef = useCallback((node) => {
    if (loading || !hasMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const handleEditModeToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // 편집 모드 종료 시 선택 초기화
      setSelectedArtworks(new Set());
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

  const handleArtworkSelection = (artwork) => {
    console.log('작품 선택 시도:', artwork.pieceId, artwork.title);
    console.log('현재 선택된 작품들:', Array.from(selectedArtworks));
    
    const newSelected = new Set(selectedArtworks);
    if (newSelected.has(artwork.pieceId)) {
      newSelected.delete(artwork.pieceId);
      console.log('작품 선택 해제:', artwork.pieceId);
    } else {
      newSelected.add(artwork.pieceId);
      console.log('작품 선택 추가:', artwork.pieceId);
    }
    
    console.log('새로운 선택된 작품들:', Array.from(newSelected));
    setSelectedArtworks(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedArtworks.size === 0 || isDeleting) return;
    
    const count = selectedArtworks.size;
    if (confirm(`선택한 ${count}개 작품을 정말 삭제하시겠습니까?`)) {
      setIsDeleting(true);
      
      try {
        // 선택된 작품들을 한 번에 삭제
        const pieceIds = Array.from(selectedArtworks);
        const response = await deletePieces(pieceIds);
        
        if (response?.status === 200) {
          console.log('선택된 작품들 삭제 완료:', pieceIds);
          // 부모 컴포넌트에 삭제 완료 알림
          if (onArtworkDeleted) {
            onArtworkDeleted(pieceIds);
          }
        } else {
          console.warn('작품들 삭제에 실패했습니다.');
        }
        
        setSelectedArtworks(new Set());
      } catch (error) {
        console.error('작품 삭제 중 오류 발생:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDeleteArtwork = async (artwork) => {
    const safeTitle = getArtworkTitle(artwork.title, '이 작품');
    if (confirm(`"${safeTitle}" 작품을 정말 삭제하시겠습니까?`)) {
      try {
        const response = await deletePieces([artwork.pieceId]);
        if (response?.status === 200 || response?.status === 204) {
          console.log('작품 삭제 완료:', artwork);
          // 부모 컴포넌트에 삭제 완료 알림
          if (onArtworkDeleted) {
            onArtworkDeleted([artwork.pieceId]);
          }
        } else {
          console.error('작품 삭제 실패:', artwork);
        }
      } catch (error) {
        console.error('작품 삭제 중 오류 발생:', error);
      }
    }
  };

  // 빈 상태 체크
  const isEmpty = !filteredArtworks || filteredArtworks.length === 0;
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
            <h1 className={styles.title}>내 작품</h1>
          </div>
        </div>

        {/* 빈 상태 */}
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <img src={xImage} alt="empty" className={styles.emptyIconImage} />
          </div>
          <div className={styles.emptyText}>
            등록된 작품이 아직 없어요<br />
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
          <h1 className={styles.title}>{title || (isLibraryMode ? libraryTitle : '내 작품')}</h1>
        </div>
        <div className={styles.headerRight}>
          {showDraftButton && (
            <button 
              className={styles.draftButton}
              onClick={onDraftClick}
            >
              임시저장
            </button>
          )}
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
            <h1 className={styles.scrollTitle}>{title || (isLibraryMode ? libraryTitle : '내 작품')}</h1>
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
          {filteredArtworks.map((artwork, index) => {
            // 마지막 요소에 ref 추가 (무한 스크롤용)
            const isLast = index === filteredArtworks.length - 1;
            return (
              <div
                key={artwork.pieceId}
                ref={isLast ? lastArtworkElementRef : null}
              >
                <ArtworkCard
                  artwork={artwork}
                  layoutMode={layoutMode}
                  onClick={onArtworkClick}
                  showDate={true}
                  showStatus={true}
                  showDescription={true}
                  isEditMode={isEditMode}
                  onDelete={handleDeleteArtwork}
                  isSelected={selectedArtworks.has(artwork.pieceId)}
                  onSelect={handleArtworkSelection}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* 더 로딩 중 표시 */}
      {loading && (
        <div className={styles.loadingMore}>
          <div className={styles.spinner}></div>
          <p>더 많은 작품을 불러오는 중...</p>
        </div>
      )}

      {/* 등록/삭제 버튼 */}
      {showAddButton && (
        <div className={styles.addButtonContainer}>
          {isEditMode ? (
            <button 
              className={`${styles.addButton} ${selectedArtworks.size === 0 ? styles.disabledButton : ''}`}
              onClick={handleDeleteSelected}
              disabled={selectedArtworks.size === 0 || isDeleting}
            >
              {isDeleting ? '삭제 중...' : selectedArtworks.size > 0 ? `${selectedArtworks.size}개 삭제하기` : '삭제하기'}
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