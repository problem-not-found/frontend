import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkList from '@museum/components/artwork/ArtworkList';
import { useInfinitePieces } from '@apis/museum/artwork';
import styles from './myArtworkPage.module.css'; // 같은 스타일 사용

export default function DraftArtworkPage() {
  const navigate = useNavigate();
  
  // API를 사용한 임시저장 작품 목록 관리 (applicated: false)
  const { 
    pieces: draftArtworks, 
    loading, 
    hasMore, 
    loadMorePieces: loadMoreDrafts, 
    resetPieces 
  } = useInfinitePieces({ applicated: false, pageSize: 3 });

  const handleBack = () => {
    navigate('/artwork/my'); // 내 작품 페이지로 돌아가기
  };

  const handleAddArtwork = () => {
    navigate('/artwork/upload'); // 작품 등록 페이지로 이동
  };

  const handleDraftClick = () => {
    // 이미 임시저장 페이지에 있으므로 아무것도 하지 않음
  };

  const handleArtworkClick = (artwork) => {
    // 임시저장 작품을 클릭했을 때 작품 수정 페이지로 이동
    // 임시저장 작품은 pieceId를 가지고 있으므로 이를 사용
    if (artwork.pieceId) {
      navigate(`/artwork/edit/${artwork.pieceId}`, {
        state: { 
          artworkId: artwork.pieceId,
          isDraft: true, // 임시저장 작품임을 표시
          fromDraft: true // 임시저장 페이지에서 왔음을 표시
        }
      });
    } else {
      console.error('임시저장 작품에 pieceId가 없습니다:', artwork);
    }
  };

  // 작품 삭제 완료 시 작품 목록 새로고침
  const handleArtworkDeleted = (deletedIds) => {
    console.log('삭제된 임시저장 작품 ID들:', deletedIds);
    // 작품 목록을 새로고침
    resetPieces();
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
        showDraftButton={false} // 임시저장 페이지에서는 버튼 숨김
        onDraftClick={handleDraftClick}
        artworks={draftArtworks}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={loadMoreDrafts}
        onArtworkDeleted={handleArtworkDeleted}
        title="임시저장 작품" // 커스텀 제목
      />
    </div>
  );
}