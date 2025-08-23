import { useParams } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ExhibitionHeader from '../components/exhibition/ExhibitionHeader';
import ExhibitionImage from '../components/exhibition/ExhibitionImage';
import ExhibitionInfo from '../components/exhibition/ExhibitionInfo';
import ExhibitionCreator from '../components/exhibition/ExhibitionCreator';
import ExhibitionDescription from '../components/exhibition/ExhibitionDescription';
import ExhibitionActions from '../components/exhibition/ExhibitionActions';
import ExhibitionVenue from '../components/exhibition/ExhibitionVenue';
import ExhibitionReviews from '../components/exhibition/ExhibitionReviews';
import ExhibitionParticipants from '../components/exhibition/ExhibitionParticipants';
import BackToTopButton from '../components/common/BackToTopButton';
import { useExhibitionDetail, usePieceImages, useParticipantCreators, useExhibitionReviewsPreview } from '../apis/exhibition/exhibition';
import styles from './exhibitionDetailPage.module.css';

const ExhibitionDetailPage = () => {
  const { id } = useParams(); // URL에서 전시 ID 가져오기
  const exhibitionId = id ? parseInt(id, 10) : null;
  

  
  // 전시 상세 정보 가져오기
  const { exhibition, loading: exhibitionLoading, error: exhibitionError } = useExhibitionDetail(exhibitionId);
  
  // 작품 이미지들 가져오기
  const { pieceImages, loading: pieceImagesLoading, error: pieceImagesError } = usePieceImages(exhibition?.pieceIdList);
  
  // 참여 크리에이터들 가져오기
  const { participants, loading: participantsLoading, error: participantsError } = useParticipantCreators(exhibition?.participantIdList);
  
  // 감상평 미리보기 가져오기
  const { reviews, totalElements, loading: reviewsLoading, error: reviewsError } = useExhibitionReviewsPreview(exhibitionId);
  
  // 로딩 상태
  if (exhibitionLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <ClipLoader color="var(--color-main)" size={40} />
      </div>
    );
  }
  
  // 에러 상태
  if (exhibitionError || !exhibition) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>전시 정보를 불러올 수 없습니다.</h2>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }
  
  // 이미지 슬라이드 구성: 썸네일 + 작품 이미지들
  const slideImages = [
    exhibition.thumbnailImageUrl,
    ...(pieceImages?.map(piece => piece.imageUrl) || [])
  ].filter(Boolean); // null/undefined 제거
  
  // 공동전시 여부 판단
  const isGroupExhibition = exhibition.participantIdList && exhibition.participantIdList.length > 0;

  return (
    <div className={styles.container}>
      <ExhibitionHeader />
      
      <ExhibitionImage 
        images={slideImages}
        alt={exhibition.title}
        loading={pieceImagesLoading}
      />
      
      <ExhibitionInfo 
        date={`${exhibition.startDate} - ${exhibition.endDate}`}
        title={exhibition.title}
        showDescription={false}
      />
      
      <ExhibitionCreator 
        creatorName="전시 주최자" // API에서 크리에이터 정보 추가 시 수정 예정
        creatorImage="/creator-profile.png" // API에서 크리에이터 정보 추가 시 수정 예정
      />
      
      <ExhibitionDescription 
        description={exhibition.description}
      />
      
      {/* 공동전시일 때만 참여 크리에이터 섹션 표시 */}
      {isGroupExhibition && (
        <ExhibitionParticipants 
          participants={participants}
          loading={participantsLoading}
          error={participantsError}
        />
      )}

      <ExhibitionReviews 
        exhibitionId={exhibitionId.toString()}
        reviews={reviews}
        totalElements={totalElements}
        loading={reviewsLoading}
        error={reviewsError}
      />
      
      <ExhibitionVenue 
        venueName={exhibition.addressName}
        venueAddress={exhibition.address}
        venueDates={`${exhibition.startDate} - ${exhibition.endDate}`}
        venueNote={exhibition.offlineDescription}
        mapImage="/wood-floor.jpg" // 지도 이미지는 추후 구현
      />

      <ExhibitionActions />
      <BackToTopButton />
    </div>
  );
};

export default ExhibitionDetailPage;