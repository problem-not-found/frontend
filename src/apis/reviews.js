import { APIService } from './axios.js';

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

