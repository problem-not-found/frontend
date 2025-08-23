import CreatorHeader from '../components/creator/CreatorHeader';
import CreatorProfile from '../components/creator/CreatorProfile';
import CreatorDescription from '../components/creator/CreatorDescription';
import CreatorContact from '../components/creator/CreatorContact';
import CreatorExhibitions from '../components/creator/CreatorExhibitions';
import CreatorArtworks from '../components/creator/CreatorArtworks';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './creatorDetailPage.module.css';

const CreatorDetailPage = () => {
  return (
    <div className={styles.container}>
      <CreatorHeader />
      
      <CreatorProfile 
        creatorName="김땡땡 크리에이터"
        creatorImage="/creator-profile.png"
      />
      
      <CreatorDescription 
        description="안녕하세요. 아름다운 바다 그림을 통해 많은 사람들에게 행복을 주고 싶은 크리에이터 김땡땡입니다."
      />
      
      <CreatorContact 
        email="asd123@naver.com"
        instagram="@simonisnextdoor"
      />
      
      <CreatorArtworks 
        artworkCount={17}
        artworks={[
          { id: 1, image: "/artwork1.png" },
          { id: 2, image: "/artwork2.png" },
          { id: 3, image: "/artwork3.png" },
          { id: 4, image: "/creator-hero-image.png" },
          { id: 5, image: "/example1.png" }
        ]}
        exhibitionCount={2}
        exhibitions={[
          {
            id: 1,
            title: "김땡땡 개인전 : 두 번째 여름",
            date: "24.12.5 - 25.2.19",
            image: "/creator-hero-image.png"
          },
          {
            id: 2,
            title: "김땡땡 개인전",
            date: "24.12.5 - 25.2.19",
            image: "/example1.png"
          }
        ]}
      />
      
      <BackToTopButton />
    </div>
  );
};

export default CreatorDetailPage;
