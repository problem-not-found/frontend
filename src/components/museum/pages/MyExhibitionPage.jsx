import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExhibitionList from '@museum/components/exhibition/ExhibitionList';
import styles from './myArtworkPage.module.css';

export default function MyExhibitionPage() {
  const navigate = useNavigate();
  
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

  const handleAddExhibition = () => {
    navigate('/exhibition/upload'); // 전시 등록 페이지로 이동
  };

  const handleExhibitionClick = (exhibition) => {
    // 전시 수정 페이지로 이동
    navigate(`/exhibition/edit/${exhibition.exhibitionId}`, {
      state: {
        isEditMode: true,
        exhibitionId: exhibition.exhibitionId
      }
    });
  };

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>
      
      <ExhibitionList
        showBackButton={true}
        onBack={handleBack}
        showAddButton={true}
        onAddExhibition={handleAddExhibition}
        onExhibitionClick={handleExhibitionClick}
      />
    </div>
  );
}