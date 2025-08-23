import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createReview } from '../apis/reviews';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './writeReviewPage.module.css';

const BackIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M28.5 18H7.5" stroke="black" strokeWidth="1"/>
    <path d="M18 7.5L7.5 18L18 28.5" stroke="black" strokeWidth="1"/>
  </svg>
);

const WriteReviewPage = () => {
  const navigate = useNavigate();
  const { exhibitionId } = useParams();
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    if (!reviewText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createReview(exhibitionId, reviewText.trim());
      // 리뷰 등록 성공 시 이전 페이지로 돌아가기
      navigate(-1);
    } catch (error) {
      console.error('리뷰 등록 오류:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= 500) {
      setReviewText(text);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button className={styles.backButton} onClick={handleBack}>
            <BackIcon />
          </button>
          <h1 className={styles.headerTitle}>감상평 작성하기</h1>
        </div>
      </div>

      {/* Notice */}
      <div className={styles.notice}>
        <p className={styles.noticeText}>
          건전한 리뷰 문화를 위해 비방, 욕설, 인신공격 등<br/>
          부적절한 표현이 포함된 리뷰는<br/>
          사전 고지 없이 삭제될 수 있습니다.
        </p>
      </div>

      {/* Text Area */}
      <div className={styles.textAreaContainer}>
        <textarea
          className={styles.textArea}
          placeholder="감상평을 작성해주세요 (최대 500자)"
          value={reviewText}
          onChange={handleTextChange}
          maxLength={500}
        />
        <div className={styles.charCount}>
          {reviewText.length}/500
        </div>
      </div>

      {/* Submit Button */}
      <div className={styles.submitContainer}>
        <button 
          className={styles.submitButton} 
          onClick={handleSubmit}
          disabled={!reviewText.trim() || isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '감상평 등록하기'}
        </button>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default WriteReviewPage;
