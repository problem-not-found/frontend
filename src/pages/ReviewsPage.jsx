import { useParams } from 'react-router-dom';
import { useInfiniteReviews } from '../apis/review/reviews';
import { ClipLoader } from 'react-spinners';
import ReviewsHeader from '../components/reviews/ReviewsHeader';
import ReviewsList from '../components/reviews/ReviewsList';
import WriteReviewButton from '../components/reviews/WriteReviewButton';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './reviewsPage.module.css';

const ReviewsPage = () => {
  const { exhibitionId } = useParams();
  
  // 무한스크롤 리뷰 데이터 가져오기
  const { 
    reviews, 
    loading, 
    hasMore, 
    error, 
    loadMoreReviews,
    totalElements
  } = useInfiniteReviews(exhibitionId, 10);

  // 스크롤 이벤트 핸들러
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = scrollBottom < 200;
    
    if (isNearBottom && hasMore && !loading) {
      loadMoreReviews();
    }
  };

  // 에러 상태 처리
  if (error) {
    return (
      <div className={styles.container}>
        <ReviewsHeader />
        <div className={styles.errorMessage}>
          <p>리뷰를 불러오는 중 오류가 발생했습니다.</p>
          <p>{error.message}</p>
        </div>
        <WriteReviewButton exhibitionId={exhibitionId} />
        <BackToTopButton />
      </div>
    );
  }

  return (
    <div className={styles.container} onScroll={handleScroll}>
      <ReviewsHeader />
      <ReviewsList reviews={reviews} />
      
      {/* 로딩 상태 표시 */}
      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader 
            color="var(--color-main)" 
            size={35}
            loading={loading}
          />
          <p>리뷰를 불러오는 중...</p>
        </div>
      )}
      
      {/* 더 이상 불러올 리뷰가 없을 때 */}
      {!hasMore && reviews.length > 0 && (
        <div className={styles.endMessage}>
          <p>모든 리뷰를 불러왔습니다.</p>
        </div>
      )}
      
      {/* 리뷰가 없을 때 */}
      {!loading && reviews.length === 0 && (
        <div className={styles.emptyMessage}>
          <p>아직 작성된 리뷰가 없습니다.</p>
          <p>첫 번째 리뷰를 작성해보세요!</p>
        </div>
      )}
      
      <WriteReviewButton exhibitionId={exhibitionId} />
      <BackToTopButton />
    </div>
  );
};

export default ReviewsPage;
