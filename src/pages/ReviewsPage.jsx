import { useParams } from 'react-router-dom';
import ReviewsHeader from '../components/reviews/ReviewsHeader';
import ReviewsList from '../components/reviews/ReviewsList';
import WriteReviewButton from '../components/reviews/WriteReviewButton';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './reviewsPage.module.css';

const ReviewsPage = () => {
  const { exhibitionId } = useParams();

  const reviews = [
    {
      id: 1,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여",
      // isOwnReview: true
    },
    {
      id: 2,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여"
    },
    {
      id: 3,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여"
    },
    {
      id: 4,
      reviewer: "정영진",
      reviewText: "좋네요. 어떤 의도로 만들어진 작품인지 너무 잘 와닿았고 여운이 한참동안 가시질 않았어요. 좋은 작품 잘 봤습니다!! 특히 ~~작품이 좋았어여"
    }
  ];

  return (
    <div className={styles.container}>
      <ReviewsHeader />
      <ReviewsList reviews={reviews} />
      <WriteReviewButton exhibitionId={exhibitionId} />
      <BackToTopButton />
    </div>
  );
};

export default ReviewsPage;
