import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ArtworkList from '@museum/components/artwork/ArtworkList';
import useArtworkDraftStore from '@museum/services/artworkDraftStore';
import styles from './myArtworkPage.module.css';

export default function MyArtworkPage() {
  const navigate = useNavigate();
  const { hasDraft } = useArtworkDraftStore();
  
  // 스크롤 상태 관리 (기존 뮤지엄 페이지와 동일)
  const [isScrolled, setIsScrolled] = useState(false);

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
    // 작품 상세 페이지로 이동 (추후 구현)
    console.log('작품 클릭:', artwork);
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
        showDraftButton={hasDraft()}
        onDraftClick={handleDraftClick}
      />
    </div>
  );
}
