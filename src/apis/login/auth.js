import { APIService } from '../axios.js';

/**
 * 테스트 로그인 API
 */
export const testLogin = async () => {
  try {
    const response = await APIService.public.post('/api/auths/test-login');
    return response;
  } catch (error) {
    console.error('테스트 로그인 실패:', error);
    throw error;
  }
};

/**
 * 카카오 OAuth 로그인 URL로 리다이렉트
 */
export const redirectToKakaoLogin = () => {
  window.location.href = 'https://api.artium.life/oauth2/authorization/kakao';
};