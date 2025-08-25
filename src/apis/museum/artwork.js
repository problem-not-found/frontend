import { APIService } from '../axios.js';
import { useState, useEffect, useCallback } from 'react';

/**
 * 내 작품 리스트 조회 API
 * @param {Object} params - 쿼리 파라미터
 * @param {boolean} params.applicated - 등록 신청 여부
 * @param {number} params.pageNum - 페이지 번호 (기본값: 1)
 * @param {number} params.pageSize - 페이지 크기 (기본값: 10)
 * @returns {Promise} API 응답 데이터
 */
export const getMyPieces = async (params = {}) => {
  try {
    const { applicated = true, pageNum = 1, pageSize = 3 } = params;
    
    const response = await APIService.private.get('/api/pieces/my-page', {
      params: {
        applicated,
        pageNum,
        pageSize
      }
    });
    
    return response;
  } catch (error) {
    console.error('내 작품 조회 실패:', error);
    throw error;
  }
};

/**
 * 내 작품 상세 정보 조회 API
 * @param {string} pieceId - 작품 ID
 * @returns {Promise} API 응답 데이터
 */
export const getMyPieceDetail = async (pieceId) => {
  try {
    const response = await APIService.private.get(`/api/pieces/${pieceId}`);
    return response;
  } catch (error) {
    console.error('내 작품 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 작품 등록 API
 * @param {Object} formData - 작품 등록 데이터
 * @param {string} formData.title - 작품명
 * @param {string} formData.description - 작품 소개
 * @param {File} formData.mainImage - 메인 이미지 파일
 * @param {File[]} formData.detailImages - 디테일 이미지 파일들
 * @param {string} saveStatus - 저장 상태 (DRAFT 또는 APPLICATION)
 * @returns {Promise} API 응답 데이터
 */
export const createPiece = async (formData, saveStatus = 'APPLICATION') => {
  try {
    const data = new FormData();
    
    // 작품 정보를 JSON으로 변환하여 data 필드에 추가
    const pieceData = {
      title: formData.title,
      description: formData.description,
      isPurchasable: true // 사용자 요구사항: 항상 true로 설정
    };
    
    data.append('data', JSON.stringify(pieceData));
    
    // 메인 이미지 추가
    if (formData.mainImage) {
      data.append('mainImage', formData.mainImage);
    }
    
    // 디테일 이미지들 추가
    if (formData.detailImages && formData.detailImages.length > 0) {
      formData.detailImages.forEach((image, index) => {
        if (image) {
          data.append('detailImages', image);
        } 
      });
    }
    
    const response = await APIService.private.post('/api/pieces', data, {
      params: { saveStatus },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response;
  } catch (error) {
    console.error('작품 등록 실패:', error);
    throw error;
  }
};

/**
 * 작품 임시저장 API
 * @param {Object} formData - 작품 임시저장 데이터
 * @returns {Promise} API 응답 데이터
 */
export const saveDraftPiece = async (formData) => {
  try {
    const response = await createPiece(formData, 'DRAFT');
    return response;
  } catch (error) {
    console.error('작품 임시저장 실패:', error);
    throw error;
  }
};

/**
 * 여러 작품 삭제 API
 * @param {number[]} pieceIds - 삭제할 작품 ID 배열
 * @returns {Promise} API 응답 데이터
 */
export const deletePieces = async (pieceIds) => {
  try {
    const response = await APIService.private.delete('/api/pieces', {
      params: {
        pieceIds: pieceIds.join(',')
      }
    });
    return response;
  } catch (error) {
    console.error('작품들 삭제 실패:', error);
    throw error;
  }
};

/**
 * 임시저장된 작품 개수 조회 API
 * @returns {Promise} API 응답 데이터
 */
export const getPieceDraftCount = async () => {
  try {
    const response = await APIService.private.get('/api/pieces/draft-count');
    return response;
  } catch (error) {
    console.error('임시저장 작품 개수 조회 실패:', error);
    throw error;
  }
};

/**
 * 작품 수정 API
 * @param {string} pieceId - 작품 ID
 * @param {Object} formData - 작품 수정 데이터
 * @param {string} saveStatus - 저장 상태 (기본값: APPLICATION)
 * @returns {Promise} API 응답 데이터
 */
export const updatePiece = async (pieceId, formData, saveStatus = 'APPLICATION', remainPieceDetailIds = []) => {
  try {
    // FormData 객체 생성하여 multipart/form-data 형식으로 전송
    const formDataToSend = new FormData();
    
    // data 객체를 JSON으로 추가 (Swagger 명세에 따름)
    const dataObject = {
      title: formData.title,
      description: formData.description,
      isPurchasable: formData.isPurchasable || true,
      status: 'UNREGISTERED',
      remainPieceDetailIds: remainPieceDetailIds
    };
    
    formDataToSend.append('data', JSON.stringify(dataObject));
    
    // 메인 이미지가 새로 선택된 경우에만 추가
    if (formData.mainImage) {
      formDataToSend.append('mainImage', formData.mainImage);
    }
    
    // 디테일 이미지들 추가 (null이 아닌 것만)
    formData.detailImages.forEach((image, index) => {
      if (image) {
        formDataToSend.append(`detailImages`, image);
      }
    });
    
    const response = await APIService.private.put(`/api/pieces/${pieceId}?saveStatus=${saveStatus}`, formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('작품 수정 실패:', error);
    throw error;
  }
};

/**
 * 작품 상세 정보 조회 API (전시용)
 * @param {string} pieceId - 작품 ID
 * @returns {Promise} API 응답 데이터
 */
export const getPieceDetail = async (pieceId) => {
  console.log('📡 API 호출: getPieceDetail', { pieceId });
  
  try {
    const response = await APIService.public.get(`/api/pieces/${pieceId}`);
    console.log('✅ getPieceDetail 성공:', { pieceId, response });
    return response;
  } catch (error) {
    console.error('❌ getPieceDetail 실패:', { pieceId, error });
    throw error;
  }
};

/**
 * 여러 작품의 상세 정보를 일괄 조회하는 API
 * @param {string[]} pieceIds - 작품 ID 배열
 * @returns {Promise} API 응답 데이터
 */
export const getMultiplePieceDetails = async (pieceIds) => {
  console.log('📡 API 호출: getMultiplePieceDetails', { pieceIds });
  
  try {
    // 여러 작품을 한 번에 조회하는 API가 있다면 사용, 없다면 개별 조회
    const promises = pieceIds.map(id => getPieceDetail(id));
    console.log('🔄 개별 작품 조회 시작, 총 개수:', pieceIds.length);
    
    const responses = await Promise.all(promises);
    console.log('✅ getMultiplePieceDetails 성공:', { pieceIds, responses });
    
    // API 응답 구조를 정확히 파악하여 데이터 추출
    const result = responses.map((response, index) => {
      console.log(`🔍 응답 ${index + 1} 구조:`, response);
      
      // 다양한 응답 구조 시도
      let pieceData = null;
      
      if (response?.data?.data) {
        pieceData = response.data.data;
      } else if (response?.data) {
        pieceData = response.data;
      } else if (response) {
        pieceData = response;
      }
      
      console.log(`🎨 작품 ${index + 1} 추출된 데이터:`, pieceData);
      return pieceData;
    });
    
    console.log('🎨 최종 가공된 작품 데이터:', result);
    
    return result;
  } catch (error) {
    console.error('❌ getMultiplePieceDetails 실패:', { pieceIds, error });
    throw error;
  }
};

/**
 * 무한스크롤을 위한 작품 목록 관리 훅
 * @param {Object} params - 쿼리 파라미터
 * @param {boolean} params.applicated - 등록 신청 여부 (기본값: true)
 * @param {number} params.pageSize - 페이지 크기 (기본값: 3)
 * @returns {object} 작품 데이터와 상태 관리 함수들
 */
export const useInfinitePieces = (params = {}) => {
  const { applicated = true, pageSize = 3 } = params;
  
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 1부터 시작
  const [totalElements, setTotalElements] = useState(0);

  // 작품 목록 초기화
  const resetPieces = useCallback(() => {
    setPieces([]);
    setCurrentPage(1); // 1부터 시작
    setHasMore(true);
    setError(null);
    setTotalElements(0);
  }, []);

  // applicated 변경 시 초기화
  useEffect(() => {
    resetPieces();
  }, [applicated, resetPieces]);

  // 첫 페이지 자동 로드
  useEffect(() => {
    // applicated가 변경되거나 pieces가 비어있을 때만 실행
    if (pieces.length === 0 && !loading) {
      const loadFirstPage = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        setError(null);

        try {
          // 첫 페이지(1)로 API 호출
          const response = await getMyPieces({
            applicated,
            pageNum: 1,
            pageSize
          });

          // API 응답 구조: { content: [], last: boolean, totalElements: number }
          const apiResponse = response.data || response;
          const newPieces = apiResponse.content || [];
          const isLastPage = apiResponse.last; // last가 true면 마지막 페이지
          const totalElements = apiResponse.totalElements || 0;

          setPieces(newPieces);
          setHasMore(!isLastPage); // last가 true면 더 이상 로드하지 않음
          setTotalElements(totalElements);
          setCurrentPage(2); // 다음 페이지는 2
        } catch (err) {
          setError(err);
          console.error('작품 로드 실패:', err);
        } finally {
          setLoading(false);
        }
      };

      loadFirstPage();
    }
  }, [applicated, pieces.length, loading, hasMore, pageSize]);

  // 다음 페이지 작품 로드
  const loadMorePieces = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      // 현재 페이지 번호로 API 호출
      const response = await getMyPieces({
        applicated,
        pageNum: currentPage,
        pageSize
      });

      // API 응답 구조: { content: [], last: boolean, totalElements: number }
      const apiResponse = response.data || response;
      const newPieces = apiResponse.content || [];
      const isLastPage = apiResponse.last; // last가 true면 마지막 페이지
      const totalElements = apiResponse.totalElements || 0;

      setPieces(prev => [...prev, ...newPieces]);
      setHasMore(!isLastPage); // last가 true면 더 이상 로드하지 않음
      setTotalElements(totalElements);
      
      // 다음 페이지 번호로 업데이트 (현재 페이지 로드 완료 후)
      setCurrentPage(prev => prev + 1);
    } catch (err) {
      setError(err);
      console.error('작품 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [applicated, pageSize, currentPage, loading, hasMore]);

  return {
    pieces,
    loading,
    hasMore,
    error,
    loadMorePieces,
    resetPieces,
    totalElements,
    currentPage
  };
};

/**
 * 작품 이미지 URL을 여러 가능한 필드에서 찾는 유틸리티 함수
 * @param {Object} artwork - 작품 객체
 * @returns {string|null} 이미지 URL 또는 null
 */
export const getImageUrl = (artwork) => {
  if (!artwork) return null;
  
  // API에서 받아오는 imageUrl 필드를 우선적으로 확인
  const imageUrl = artwork.imageUrl || 
                  artwork.mainImageUrl || 
                  artwork.thumbnailUrl || 
                  artwork.image || 
                  artwork.mainImage;
  
  return imageUrl;
};

/**
 * 작품 상태에 따른 스타일 클래스명을 반환하는 유틸리티 함수
 * @param {string} status - 작품 상태
 * @returns {string} CSS 클래스명
 */
export const getStatusStyle = (status) => {
  switch (status) {
    case '전시 중':
      return 'statusExhibiting';
    case '미승인':
      return 'statusRejected';
    case '승인 대기':
      return 'statusPending';
    default:
      return 'statusDefault';
  }
};

/**
 * 작품 제목을 안전하게 표시하는 유틸리티 함수
 * @param {string} title - 작품 제목
 * @param {string} fallback - 기본값
 * @returns {string} 표시할 제목
 */
export const getArtworkTitle = (title, fallback = '제목 없음') => {
  return title && title.trim() ? title.trim() : fallback;
};

/**
 * 작품 설명을 안전하게 표시하는 유틸리티 함수
 * @param {string} description - 작품 설명
 * @param {string} fallback - 기본값
 * @returns {string} 표시할 설명
 */
export const getArtworkDescription = (description, fallback = '설명 없음') => {
  return description && description.trim() ? description.trim() : fallback;
};