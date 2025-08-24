import { APIService } from '../axios.js';
import { useState, useEffect, useCallback } from 'react';

/**
 * 전시 리뷰 목록 조회 API (페이지네이션 지원)
 * @param {string} exhibitionId - 전시 ID
 * @param {number} pageNum - 페이지 번호 (1부터 시작)
 * @param {number} pageSize - 페이지 크기 (기본값: 10)
 * @returns {Promise} 리뷰 목록과 페이지 정보
 */
export const getReviews = async (exhibitionId, pageNum = 1, pageSize = 10) => {
  try {
    const response = await APIService.private.get(`/api/exhibitions/${exhibitionId}/reviews`, {
      params: {
        pageNum,
        pageSize
      }
    });
    return response;
  } catch (error) {
    console.error('리뷰 조회 실패:', error);
    throw error;
  }
};

/**
 * 디버깅용 - 직접 리뷰 조회 테스트
 * 브라우저 콘솔에서 testGetReviews(1) 형태로 호출 가능
 */
export const testGetReviews = async (exhibitionId = 1, pageNum = 1, pageSize = 10) => {
  try {
    const result = await getReviews(exhibitionId, pageNum, pageSize);
    return result;
  } catch (error) {
    console.error('테스트 실패:', error);
    return null;
  }
};

// 개발 환경에서 전역 테스트 함수 등록
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.testGetReviews = testGetReviews;
}

/**
 * 리뷰 작성 API
 * @param {string} exhibitionId - 전시 ID
 * @param {string} content - 리뷰 내용
 */
export const createReview = async (exhibitionId, content) => {
  try {
    const response = await APIService.private.post(`/api/exhibitions/${exhibitionId}/reviews`, {
      content
    });
    return response;
  } catch (error) {
    console.error('리뷰 작성 실패:', error);
    throw error;
  }
};

/**
 * 무한스크롤을 위한 리뷰 목록 관리 훅
 * @param {string} exhibitionId - 전시 ID
 * @param {number} pageSize - 페이지 크기 (기본값: 10)
 * @returns {object} 리뷰 데이터와 상태 관리 함수들
 */
export const useInfiniteReviews = (exhibitionId, pageSize = 10) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작
  const [totalElements, setTotalElements] = useState(0);

  // 리뷰 목록 초기화
  const resetReviews = useCallback(() => {
    setReviews([]);
    setCurrentPage(1); // 1부터 시작
    setHasMore(true);
    setError(null);
    setTotalElements(0);
  }, []);

  // 다음 페이지 리뷰 로드
  const loadMoreReviews = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getReviews(exhibitionId, currentPage, pageSize);
      
      const apiResponse = response.data || response;
      const newReviews = apiResponse.content || [];
      const isLastPage = apiResponse.last;
      const totalElements = apiResponse.totalElements || 0;
      
      setReviews(prev => [...prev, ...newReviews]);
      setCurrentPage(prev => prev + 1);
      setHasMore(!isLastPage);
      setTotalElements(totalElements);
    } catch (err) {
      setError(err);
      console.error('리뷰 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [exhibitionId, currentPage, pageSize, loading, hasMore, reviews.length]);

  // 첫 페이지 로드
  useEffect(() => {
    if (exhibitionId) {
      resetReviews();
    }
  }, [exhibitionId, resetReviews]);

  // 첫 페이지 자동 로드
  useEffect(() => {
    if (exhibitionId && reviews.length === 0 && !loading) {
      loadMoreReviews();
    }
  }, [exhibitionId, reviews.length, loading, loadMoreReviews]);

  return {
    reviews,
    loading,
    hasMore,
    error,
    loadMoreReviews,
    resetReviews,
    totalElements
  };
};
