import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArtworkCard from '@museum/components/artwork/ArtworkCard';
import useArtworkStore from '@museum/services/artworkStore';
import chevronLeft from '@/assets/museum/chevron-left.png';
import styles from './artworkLibraryPage.module.css';

export default function ArtworkLibraryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 전시 등록 페이지에서 전달받은 정보
  const { fromExhibition, artworkIndex, isThumbnail, isChangeMode } = location.state || {};
  
  // Zustand 스토어에서 상태 가져오기
  const {
    artworks,
    getFilteredArtworks,
    loadArtworks,
    loadMoreArtworks,
    hasMore
  } = useArtworkStore();

  // 선택된 작품들 관리
  const [selectedArtworks, setSelectedArtworks] = useState(new Set());
  const [isEditMode, setIsEditMode] = useState(true); // 항상 편집 모드로 시작

  // 무한 스크롤을 위한 ref들
  const observerRef = useRef();
  const loadingRef = useRef();

  // 필터된 작품 목록 (검색어 없이 모든 작품)
  const filteredArtworks = getFilteredArtworks();

  // 컴포넌트 마운트 시 작품 데이터 로드 (라이브러리 페이지에서는 6개)
  useEffect(() => {
    loadArtworks(true, 6);
  }, [loadArtworks]);

  // 무한 스크롤 구현 (IntersectionObserver 사용)
  const lastArtworkElementRef = useCallback((node) => {
    if (artworks.isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore()) {
        loadMoreArtworks();
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [artworks.isLoadingMore, hasMore, loadMoreArtworks]);

  const handleBack = () => {
    if (fromExhibition) {
      // 전시 등록 페이지로 돌아가기
      navigate('/exhibition/upload', { 
        state: { 
          returnFromLibrary: true,
          selectedArtwork: null 
        } 
      });
    } else {
      // 기본적으로 뮤지엄 페이지로 돌아가기
      navigate('/museum');
    }
  };

  const handleArtworkSelection = (artwork) => {
    if (isChangeMode) {
      // 변경 모드: 한 장만 선택 가능
      setSelectedArtworks(new Set([artwork.id]));
    } else {
      // 새로 추가 모드: 여러 장 선택 가능
      const newSelected = new Set(selectedArtworks);
      if (newSelected.has(artwork.id)) {
        newSelected.delete(artwork.id);
      } else {
        newSelected.add(artwork.id);
      }
      setSelectedArtworks(newSelected);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedArtworks.size === 0) return;
    
    // 선택된 작품들 가져오기
    const selectedArtworkList = filteredArtworks.filter(artwork => 
      selectedArtworks.has(artwork.id)
    );
    
    if (fromExhibition && selectedArtworkList.length > 0) {
      // 전시 등록 페이지로 돌아가면서 선택된 작품 정보 전달
      navigate('/exhibition/upload', { 
        state: { 
          returnFromLibrary: true,
          selectedArtworks: selectedArtworkList, // 선택된 모든 작품 배열
          artworkIndex: artworkIndex,
          isThumbnail: isThumbnail
        } 
      });
    }
  };



  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>
      
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="back" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>
            {isThumbnail ? "이미지 라이브러리" : "작품 라이브러리"}
          </h1>
        </div>
      </div>

      {/* 작품 그리드 */}
      <div className={styles.artworkGrid}>
        {filteredArtworks.map((artwork, index) => {
          // 마지막 요소에 ref 추가 (무한 스크롤용)
          const isLast = index === filteredArtworks.length - 1;
          return (
            <div key={artwork.id} ref={isLast ? lastArtworkElementRef : null}>
              <ArtworkCard
                artwork={artwork}
                layoutMode="grid"
                onClick={() => handleArtworkSelection(artwork)}
                showDate={true}
                showStatus={false}
                showDescription={true}
                isEditMode={true}
                isSelected={selectedArtworks.has(artwork.id)}
                onSelect={handleArtworkSelection}
                isLibraryMode={true}
                checkboxSize="large"
              />
            </div>
          );
        })}
        
        {/* 더 로딩 중 표시 */}
        {artworks.isLoadingMore && (
          <div className={styles.loadingMore}>
            <div className={styles.spinner}></div>
            <p>더 많은 작품을 불러오는 중...</p>
          </div>
        )}
      </div>

      {/* 하단 고정 버튼 */}
      <div className={styles.bottomButtonContainer}>
        {selectedArtworks.size === 0 ? (
          <button className={styles.selectButton}>
            {isChangeMode ? '변경할 작품 선택하기' : '선택하기'}
          </button>
        ) : (
          <button 
            className={styles.confirmButton}
            onClick={handleConfirmSelection}
          >
            {isChangeMode ? '작품 변경하기' : `${selectedArtworks.size}개 선택 완료`}
          </button>
        )}
      </div>
    </div>
  );
}
