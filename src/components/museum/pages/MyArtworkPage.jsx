import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkList from '@museum/components/artwork/ArtworkList';
import { useInfinitePieces, getPieceDraftCount } from '@apis/museum/artwork';
import styles from './myArtworkPage.module.css';

export default function MyArtworkPage() {
  const navigate = useNavigate();
  
  // 임시저장 작품 개수 상태
  const [draftCount, setDraftCount] = useState(0);
  
  // API를 사용한 작품 목록 관리
  const { 
    pieces: artworks, 
    loading, 
    hasMore, 
    loadMorePieces, 
    resetPieces 
  } = useInfinitePieces({ applicated: true, pageSize: 3 });
  
  // 스크롤 상태 관리 (기존 뮤지엄 페이지와 동일)
  const [isScrolled, setIsScrolled] = useState(false);

  // 임시저장 작품 개수 조회
  const fetchDraftCount = async () => {
    try {
      const response = await getPieceDraftCount();
      console.log('getPieceDraftCount 응답:', response);
      if (response?.success === true && response?.data) {
        const count = response.data.count || response.data;
        console.log('설정할 draftCount:', count);
        setDraftCount(count);
      } else {
        console.log('응답이 성공이 아니거나 data가 없음');
        setDraftCount(0);
      }
    } catch (error) {
      console.error('임시저장 작품 개수 조회 실패:', error);
      setDraftCount(0);
    }
  };

  // 컴포넌트 마운트 시 작품 목록 초기화 및 draft 개수 확인
  useEffect(() => {
    resetPieces();
    fetchDraftCount();
  }, [resetPieces]);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10); // 10px 이상 스크롤 시 그림자 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate('/museum'); // 뮤지엄 페이지로 돌아가기
  };

  const handleAddArtwork = () => {
    navigate('/artwork/upload'); // 작품 등록 페이지로 이동
  };

  const handleDraftClick = () => {
    navigate('/artwork/drafts'); // 임시저장 페이지로 이동
  };

  const handleArtworkClick = (artwork) => {
    // 작품 수정 페이지로 이동
    navigate(`/artwork/edit/${artwork.pieceId}`, {
      state: { artworkId: artwork.pieceId }
    });
  };

  // 작품 삭제 완료 시 작품 목록 새로고침
  const handleArtworkDeleted = (deletedIds) => {
    console.log('삭제된 작품 ID들:', deletedIds);
    // 작품 목록을 새로고침
    resetPieces();
    // 임시저장 작품 개수도 새로고침
    fetchDraftCount();
  };

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>
      
      <ArtworkList
        showBackButton={true}
        onBack={handleBack}
        showAddButton={true}
        onAddArtwork={handleAddArtwork}
        onArtworkClick={handleArtworkClick}
        showDraftButton={draftCount > 0}
        onDraftClick={handleDraftClick}
        artworks={artworks}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMorePieces}
        onArtworkDeleted={handleArtworkDeleted}
      />
    </div>
  );
}