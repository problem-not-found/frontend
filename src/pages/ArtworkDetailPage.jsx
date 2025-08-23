import ArtworkHeader from '../components/artwork/ArtworkHeader';
import ArtworkImage from '../components/artwork/ArtworkImage';
import ArtworkInfo from '../components/artwork/ArtworkInfo';
import ArtworkCreator from '../components/artwork/ArtworkCreator';
import ArtworkDescription from '../components/artwork/ArtworkDescription';
import ArtworkContact from '../components/artwork/ArtworkContact';
import ArtworkExhibition from '../components/artwork/ArtworkExhibition';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './artworkDetailPage.module.css';

const ArtworkDetailPage = () => {
  return (
    <div className={styles.container}>
      <ArtworkHeader />
      
      <ArtworkImage 
        images={["/artwork1.png", "/artwork2.png", "/artwork3.png"]} 
        alt="작품 이미지"
        overlayText="디테일 컷을 미리보기로 확인해보세요"
      />
      
      <ArtworkInfo 
        title="파도"
        medium="캔버스에 유화, 144x116"
        description="이 작품은 파도를 나타냈다. 어떤 예술적 사조에 영향을 받았고, 어떤 것들을 통해 그런 감정을 전달하고자 했다. 이 전시를 감상할 때 ~한 점들을 생각하며 보면 더 재미있게 즐길 수 있을 것이다."
      />
      
      <ArtworkDescription 
        medium="캔버스에 유화, 144x116"
        description="이 작품은 파도를 나타냈다. 어떤 예술적 사조에 영향을 받았고, 어떤 것들을 통해 그런 감정을 전달하고자 했다. 이 전시를 감상할 때 ~한 점들을 생각하며 보면 더 재미있게 즐길 수 있을 것이다."
      />
      
      <ArtworkCreator 
        creatorName="김땡땡 크리에이터"
        creatorImage="/creator-profile.png"
      />

      <ArtworkContact 
        email="asd123@naver.com"
        instagram="@simonisnextdoor"
      />
      
      <ArtworkExhibition 
        exhibitionTitle="김땡땡 개인전 : 두 번째 여름"
        exhibitionImage="/example1.png"
        statusText="지금 전시 중"
      />
      
      <BackToTopButton />
    </div>
  );
};

export default ArtworkDetailPage;
