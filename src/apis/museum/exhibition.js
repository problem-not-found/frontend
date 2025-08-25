import { useState, useEffect, useCallback } from 'react';
import APIService from '../axios';

/**
 * 전시 등록 API (multipart/form-data)
 * @param {Object} exhibitionData - DTO 그대로 JSON으로 보낼 데이터 (Swagger의 request object와 동일)
 * @param {File=} imageFile - 썸네일 파일(선택). 없으면 생략 가능
 * @returns {Promise}
 */
export const createExhibition = async (exhibitionData, imageFile) => {
  try {
    const formData = new FormData();

    // ✅ 서버가 기대하는 "request" 파트에 JSON 통째로 담기
    formData.append(
      "request",
      new Blob([JSON.stringify(exhibitionData)], { type: "application/json" })
    );

    // ✅ 이미지 파일 파트명은 Swagger의 "image"와 동일해야 함
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // axios는 boundary 자동 설정
    const res = await APIService.private.post("/api/exhibitions", formData);
    return res;
  } catch (err) {
    console.error("전시 등록 실패:", err);
    throw err;
  }
};

/**
 * 전시 수정 API (multipart/form-data)
 * @param {number} exhibitionId - 전시 ID
 * @param {Object} exhibitionData - DTO 그대로 JSON으로 보낼 데이터 (Swagger의 request object와 동일)
 * @param {File=} imageFile - 썸네일 파일(선택). 없으면 생략 가능
 * @returns {Promise}
 */
export const updateExhibition = async (exhibitionId, exhibitionData, imageFile) => {
  try {
    const formData = new FormData();

    // ✅ 서버가 기대하는 "request" 파트에 JSON 통째로 담기
    formData.append(
      "request",
      new Blob([JSON.stringify(exhibitionData)], { type: "application/json" })
    );

    // ✅ 이미지 파일 파트명은 Swagger의 "image"와 동일해야 함
    if (imageFile) {
      formData.append("image", imageFile);
    }

    // axios는 boundary 자동 설정
    const res = await APIService.private.put(`/api/exhibitions/${exhibitionId}`, formData);
    return res;
  } catch (err) {
    console.error("전시 수정 실패:", err);
    throw err;
  }
};

/**
 * 전시 상세 정보 조회 API
 * @param {number} exhibitionId - 전시 ID
 * @returns {Promise} 전시 상세 정보
 */
export const getExhibitionDetail = async (exhibitionId) => {
  try {
    const response = await APIService.public.get(`/api/exhibitions/${exhibitionId}`);
    return response;
  } catch (error) {
    console.error('전시 상세 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 작품 단일 조회 API
 * @param {number} pieceId - 작품 ID
 * @returns {Promise} 작품 정보
 */
export const getPieceDetail = async (pieceId) => {
  try {
    const response = await APIService.public.get(`/api/pieces/${pieceId}`);
    return response;
  } catch (error) {
    console.error('작품 조회 실패:', error.response?.status, error.message);
    // 404 에러인 경우 기본값 반환
    if (error.response?.status === 404) {
      return {
        data: {
          data: {
            pieceId: pieceId,
            imageUrl: '/artwork1.png', // fallback 이미지
            title: `작품 ${pieceId}`
          }
        }
      };
    }
    throw error;
  }
};

/**
 * 크리에이터 단일 조회 API
 * @param {number} userId - 사용자 ID
 * @returns {Promise} 크리에이터 정보
 */
export const getUserDetail = async (userId) => {
  try {
    const response = await APIService.public.get(`/api/users/${userId}/creator`);
    return response;
  } catch (error) {
    console.error('크리에이터 조회 실패:', error.response?.status, error.message);
    // 404 에러인 경우 기본값 반환
    if (error.response?.status === 404) {
      return {
        data: {
          data: {
            userId: userId,
            nickname: `크리에이터 ${userId}`,
            profileImageUrl: '/creator-profile.png' // fallback 이미지
          }
        }
      };
    }
    throw error;
  }
};

/**
 * 전시 감상평 미리보기 조회 API
 * @param {number} exhibitionId - 전시 ID
 * @returns {Promise} 감상평 미리보기 3개
 */
export const getExhibitionReviewsPreview = async (exhibitionId) => {
  try {
    const response = await APIService.public.get(`/api/exhibitions/${exhibitionId}/reviews`, {
      params: {
        pageNum: 1,
        pageSize: 3
      }
    });
    return response;
  } catch (error) {
    console.error('전시 감상평 미리보기 조회 실패:', error);
    throw error;
  }
};

/**
 * 내 전시 목록 조회 API
 * @param {Object} params - 페이지네이션 파라미터
 * @param {number} params.pageNum - 페이지 번호
 * @param {number} params.pageSize - 페이지 크기
 * @param {boolean} params.fillAll - 모든 정보 채우기 여부
 * @returns {Promise} 내 전시 목록
 */
export const getMyExhibitions = async (params = { pageNum: 1, pageSize: 3, fillAll: true }) => {
  try {
    const response = await APIService.private.get('/api/exhibitions/my-page', { params });
    return response;
  } catch (error) {
    console.error('내 전시 목록 조회 실패:', error);
    throw error;
  }
};

/**
 * 전시 정보 조회 API
 * @param {string} exhibitionId - 전시 ID
 * @returns {Promise} API 응답 데이터
 */
export const getExhibitionById = async (exhibitionId) => {
  console.log('📡 API 호출: getExhibitionById', { exhibitionId });
  
  try {
    const response = await APIService.public.get(`/api/exhibitions/${exhibitionId}`);
    console.log('✅ getExhibitionById 성공:', response);
    return response;
  } catch (error) {
    console.error('❌ getExhibitionById 실패:', error);
    throw error;
  }
};

/**
 * 전시 작품 목록 조회 API
 * @param {Object} params - 쿼리 파라미터
 * @param {number} params.pageNum - 페이지 번호 (기본값: 1)
 * @param {number} params.pageSize - 페이지 크기 (기본값: 20)
 * @param {string} params.status - 작품 상태 필터
 * @returns {Promise} API 응답 데이터
 */
export const getExhibitionArtworks = async (params = {}) => {
  console.log('📡 API 호출: getExhibitionArtworks', { params });
  
  try {
    const { pageNum = 1, pageSize = 20, status } = params;
    
    const queryParams = {
      pageNum,
      pageSize
    };
    
    if (status) {
      queryParams.status = status;
    }
    
    const response = await APIService.public.get('/api/exhibitions/artworks', {
      params: queryParams
    });
    
    console.log('✅ getExhibitionArtworks 성공:', response);
    return response;
  } catch (error) {
    console.error('❌ getExhibitionArtworks 실패:', error);
    throw error;
  }
};

/**
 * 전시 상세 정보를 위한 커스텀 훅
 * @param {number} exhibitionId - 전시 ID
 * @returns {object} 전시 데이터와 상태 관리
 */
export const useExhibitionDetail = (exhibitionId) => {
  const [exhibition, setExhibition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExhibitionDetail = useCallback(async () => {
    if (!exhibitionId || isNaN(exhibitionId)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getExhibitionDetail(exhibitionId);
      // API 응답 구조: {data: {success: true, data: {실제데이터}}}
      const apiResponse = response.data?.data || response.data || response;
      
      setExhibition(apiResponse);
    } catch (err) {
      setError(err);
      console.error('전시 상세 정보 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [exhibitionId]);

  useEffect(() => {
    fetchExhibitionDetail();
  }, [fetchExhibitionDetail]);

  return {
    exhibition,
    loading,
    error,
    refetch: fetchExhibitionDetail
  };
};

/**
 * 작품들의 이미지를 가져오는 커스텀 훅
 * @param {number[]} pieceIdList - 작품 ID 목록
 * @returns {object} 작품 이미지들과 상태 관리
 */
export const usePieceImages = (pieceIdList) => {
  const [pieceImages, setPieceImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPieceImages = useCallback(async () => {
    if (!pieceIdList || pieceIdList.length === 0) {
      setPieceImages([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 모든 작품을 병렬로 조회
      const promises = pieceIdList.map(pieceId => getPieceDetail(pieceId));
      const responses = await Promise.all(promises);
      
      const images = responses.map(response => {
        // API 응답 구조: {data: {success: true, data: {실제데이터}}}
        const pieceData = response.data?.data || response.data || response;
        return {
          pieceId: pieceData.pieceId,
          imageUrl: pieceData.imageUrl,
          title: pieceData.title
        };
      });
      
      setPieceImages(images);
    } catch (err) {
      setError(err);
      console.error('작품 이미지 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [pieceIdList]);

  useEffect(() => {
    fetchPieceImages();
  }, [fetchPieceImages]);

  return {
    pieceImages,
    loading,
    error,
    refetch: fetchPieceImages
  };
};

/**
 * 참여 크리에이터들을 가져오는 커스텀 훅
 * @param {number[]} participantIdList - 참여자 ID 목록
 * @returns {object} 참여 크리에이터들과 상태 관리
 */
export const useParticipantCreators = (participantIdList) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchParticipants = useCallback(async () => {
    if (!participantIdList || participantIdList.length === 0) {
      setParticipants([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // 모든 참여자를 병렬로 조회
      const promises = participantIdList.map(userId => getUserDetail(userId));
      const responses = await Promise.all(promises);
      
      const creators = responses.map(response => {
        // API 응답 구조: {data: {success: true, data: {실제데이터}}}
        const userData = response.data?.data || response.data || response;
        return userData;
      });
      
      setParticipants(creators);
    } catch (err) {
      setError(err);
      console.error('참여 크리에이터 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [participantIdList]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return {
    participants,
    loading,
    error,
    refetch: fetchParticipants
  };
};

/**
 * 전시 감상평 미리보기를 위한 커스텀 훅
 * @param {number} exhibitionId - 전시 ID
 * @returns {object} 감상평 미리보기 데이터와 상태 관리
 */
export const useExhibitionReviewsPreview = (exhibitionId) => {
  const [reviews, setReviews] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviewsPreview = useCallback(async () => {
    if (!exhibitionId || isNaN(exhibitionId)) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getExhibitionReviewsPreview(exhibitionId);
      // API 응답 구조: {data: {success: true, data: {content: [...]}}}
      const apiResponse = response.data?.data || response.data || response;
      const reviewsList = apiResponse.content || [];
      const total = apiResponse.totalElements || 0;
      
      setReviews(reviewsList);
      setTotalElements(total);
    } catch (err) {
      setError(err);
      console.error('전시 감상평 미리보기 로드 실패:', err);
    } finally {
      setLoading(false);
    }
  }, [exhibitionId]);

  useEffect(() => {
    fetchReviewsPreview();
  }, [fetchReviewsPreview]);

  return {
    reviews,
    totalElements,
    loading,
    error,
    refetch: fetchReviewsPreview
  };
};