import { useState } from 'react';
import TasteHeader from '../components/taste/TasteHeader';
import TasteCategories from '../components/taste/TasteCategories';
import TasteProfile from '../components/taste/TasteProfile';
import TasteTags from '../components/taste/TasteTags';
import TasteExhibitions from '../components/taste/TasteExhibitions';
import TasteArtworks from '../components/taste/TasteArtworks';
import TasteCreators from '../components/taste/TasteCreators';
import TasteActions from '../components/taste/TasteActions';
import AppFooter from '../components/footer/AppFooter';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './tastePage.module.css';

const TastePage = () => {
  const [activeCategory, setActiveCategory] = useState('전시');
  
  const userProfile = {
    age: "20대",
    gender: "남성"
  };

  const interestTags = [
    "아크릴화", "스케치", "목조각", "대형 설치미술", "디지털 사진", "다큐멘터리 영상",
    "춤", "홀로그램", "도자기", "섬유·패브릭 아트", "도시 설치물", "실험적 사운드 아트",
    "주얼리", "금속 조형물", "콜라주", "혼합매체(Mixed Media)", "디지털 페인팅", "게임 아트",
    "먹화", "한국화", "금속 공예"
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const renderContent = () => {
    switch (activeCategory) {
      case '전시':
        return <TasteExhibitions />;
      case '작품':
        return <TasteArtworks />;
      case '크리에이터':
        return <TasteCreators />;
      case '관심사':
      default:
        return (
          <>
            <TasteProfile profile={userProfile} />
            <TasteTags tags={interestTags} />
            <TasteActions />
          </>
        );
    }
  };

  return (
    <div className={styles.container}>
      <TasteHeader />
      <TasteCategories onCategoryChange={handleCategoryChange} />
      {renderContent()}
      <AppFooter />
      <BackToTopButton />
    </div>
  );
};

export default TastePage;
