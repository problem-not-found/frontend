import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DraftArtworkList from '@museum/components/artwork/DraftArtworkList';
import styles from './draftArtworkPage.module.css';

export default function DraftArtworkPage() {
  const navigate = useNavigate();
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate('/artwork'); // 내 작품 페이지로 돌아가기
  };

  const handleAddArtwork = () => {
    navigate('/artwork/upload'); // 작품 등록 페이지로 이동
  };

  const handleArtworkClick = (draft) => {
    // 임시저장 작품 편집 페이지로 이동 (추후 구현)
    console.log('임시저장 작품 클릭:', draft);
  };

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>
      
      <DraftArtworkList
        showBackButton={true}
        onBack={handleBack}
        showAddButton={true}
        onAddArtwork={handleAddArtwork}
        onArtworkClick={handleArtworkClick}
      />
    </div>
  );
}
