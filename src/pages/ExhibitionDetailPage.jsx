
import ExhibitionHeader from '../components/exhibition/ExhibitionHeader';
import ExhibitionImage from '../components/exhibition/ExhibitionImage';
import ExhibitionInfo from '../components/exhibition/ExhibitionInfo';
import ExhibitionCreator from '../components/exhibition/ExhibitionCreator';
import ExhibitionDescription from '../components/exhibition/ExhibitionDescription';
import ExhibitionActions from '../components/exhibition/ExhibitionActions';
import ExhibitionVenue from '../components/exhibition/ExhibitionVenue';
import ExhibitionReviews from '../components/exhibition/ExhibitionReviews';
import styles from './exhibitionDetailPage.module.css';

const ExhibitionDetailPage = () => {
  return (
    <div className={styles.container}>
      <ExhibitionHeader />
      
      <ExhibitionImage 
        images={["/artwork1.png", "/artwork2.png", "/artwork3.png", "/creator-hero-image.png", "/example1.png"]} 
        alt="전시 이미지" 
      />
      
      <ExhibitionInfo 
        date="24.12.5 - 25.2.19"
        title="김땡땡 개인전 : 두 번째 여름"
        showDescription={false}
      />
      
      <ExhibitionCreator 
        creatorName="김땡땡 크리에이터"
        creatorImage="/creator-profile.png"
      />
      
      <ExhibitionDescription 
        description="이번 전시는 ---하다. 어떤 예술적 사조에 영향을 받았고, 어떤 것들을 통해 그런 감정을 전달하고자 했다. 이 전시를 감상할 때 ~한 점들을 생각하며 보면 더 재미있게 즐길 수 있을 것이다."
      />
      
      <ExhibitionReviews />
      
      <ExhibitionVenue 
        venueName="석파정 서울 미술관 2관"
        venueAddress="서울특별시 종로구 창의문로11길 4-1"
        venueDates="24.11.26 - 24.11.30"
        venueNote="아르티움 회원은 무료. 광화문역에서 하차 후 1164번 버스 탑승후 10분 소요."
        mapImage="/wood-floor.jpg"
      />
      

      <ExhibitionActions />
    </div>
  );
};

export default ExhibitionDetailPage;