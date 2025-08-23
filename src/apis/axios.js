/***
 * axios.js 사용 예시
 *
 * 1. 토큰이 필요없는 요청 (public)
 * EX: GET 전체 게시글
 * try {
 *   const response = await APIService.public.get('/api/posts');
 *   console.log();
 * } catch (error) {
 *   console.error(error);
 * }
 *
 * 2. 토큰이 필요한 요청 (private)
 * // POST
 * try {
 *   const response = await APIService.private.post('/posts', {
 *     title: '제목',
 *     content: '내용'
 *   });
 *   console.log();
 * } catch (error) {
 *   console.error(error);
 * }
 *
 * // PUT
 * try {
 *   const response = await APIService.private.put('/posts/1', {
 *     title: '수정된 제목',
 *     content: '수정된 내용'
 *   });
 *   console.log();
 * } catch (error) {
 *   console.error(error);
 * }
 *
 * // delete
 * try {
 *   const response = await APIService.private.delete('/posts/1');
 *   console.log(response);
 * } catch (error) {
 *   console.error(error);
 * }
 */

import axios from "axios";

/**
 * 쿠키에서 특정 이름의 값을 가져오는 함수 (개선된 버전)
 */
const getCookie = (name) => {
  // 여러 가지 방법으로 쿠키 읽기 시도
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  
  if (parts.length === 2) {
    const cookieValue = parts.pop().split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  
  // 대안 방법
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * 현재 모든 쿠키를 콘솔에 출력하는 디버깅 함수
 */
const debugCookies = () => {
  console.log('=== 쿠키 디버깅 ===');
  console.log('Raw document.cookie:', document.cookie);
  console.log('Cookie length:', document.cookie.length);
  
  // 모든 쿠키를 파싱해서 보여주기
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      acc[name] = value;
    }
    return acc;
  }, {});
  
  console.log('Parsed cookies:', cookies);
  console.log('ACCESS_TOKEN:', getCookie('ACCESS_TOKEN'));
  console.log('REFRESH_TOKEN:', getCookie('REFRESH_TOKEN'));
  
  // 현재 도메인과 경로 확인
  console.log('Current domain:', window.location.hostname);
  console.log('Current path:', window.location.pathname);
  console.log('Current protocol:', window.location.protocol);
};

/**
 * 토큰 상태를 확인하는 함수 (디버깅용)
 */
export const checkTokenStatus = () => {
  const accessToken = getCookie('ACCESS_TOKEN');
  const refreshToken = getCookie('REFRESH_TOKEN');
  
  console.log('=== 토큰 상태 확인 ===');
  console.log('ACCESS_TOKEN 존재:', !!accessToken);
  console.log('REFRESH_TOKEN 존재:', !!refreshToken);
  
  if (accessToken) {
    try {
      // JWT 토큰 디코딩 (간단한 방법)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log('ACCESS_TOKEN 만료 시간:', new Date(payload.exp * 1000));
      console.log('ACCESS_TOKEN 만료됨:', payload.exp < now);
    } catch (e) {
      console.log('ACCESS_TOKEN 디코딩 실패:', e);
    }
  }
  
  if (refreshToken) {
    try {
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      console.log('REFRESH_TOKEN 만료 시간:', new Date(payload.exp * 1000));
      console.log('REFRESH_TOKEN 만료됨:', payload.exp < now);
    } catch (e) {
      console.log('REFRESH_TOKEN 디코딩 실패:', e);
    }
  }
  
  return { accessToken: !!accessToken, refreshToken: !!refreshToken };
};

/**
 * 로그인 상태를 확인하고 필요시 로그인 페이지로 리다이렉트
 */
export const checkAuthStatus = () => {
  const tokenStatus = checkTokenStatus();
  
  if (!tokenStatus.accessToken && !tokenStatus.refreshToken) {
    console.warn('토큰이 없습니다. 로그인이 필요합니다.');
    return false;
  }
  
  return true;
};

/**
 * 강제로 로그아웃 처리 (쿠키 정리 + 로그인 페이지 이동)
 */
export const forceLogout = (message = '로그인이 만료되었습니다. 다시 로그인해주세요.') => {
  // 모든 관련 쿠키 정리
  const cookiesToClear = ['ACCESS_TOKEN', 'REFRESH_TOKEN', 'JSESSIONID'];
  
  cookiesToClear.forEach(cookieName => {
    // 여러 도메인과 경로에서 쿠키 삭제 시도
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;`;
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.localhost;`;
  });
  
  console.log('쿠키 정리 완료');
  alert(message);
  window.location.href = "/login";
};



/**
 * 토큰이 필요없는 일반 요청 (public API)
 */
const publicApi = axios.create({
  baseURL: import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
});

/**
 * 토큰이 필요한 인증 요청 (private API)
 */
const privateApi = axios.create({
  baseURL: import.meta.env.DEV
    ? ""
    : import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
});

/**
 * 요청 인터셉터 - 쿠키와 Authorization 헤더 둘 다 지원
 */
privateApi.interceptors.request.use(
  (config) => {
    console.log('Private API request with credentials:', config.url);
    
    // 1. withCredentials: true로 쿠키 자동 전송 (기본)
    
    // 2. Authorization 헤더도 추가 (백엔드가 헤더 방식을 사용할 경우를 대비)
    const accessToken = getCookie('ACCESS_TOKEN');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('Authorization 헤더 추가됨:', `Bearer ${accessToken.substring(0, 20)}...`);
    } else {
      console.log('ACCESS_TOKEN이 없어서 Authorization 헤더 추가 안됨');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 토큰 갱신 중인지 확인하는 플래그
 */
let isRefreshing = false;
let failedQueue = [];

/**
 * 대기 중인 요청들을 처리하는 함수
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * 응답 인터셉터 - 401 발생 시 자동으로 토큰 갱신
 */
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 대기열에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return privateApi(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting token refresh...');
        debugCookies(); // 현재 쿠키 상태 확인
        
        // 토큰 상태 먼저 확인
        const tokenStatus = checkTokenStatus();
        if (!tokenStatus.refreshToken) {
          throw new Error('REFRESH_TOKEN이 없습니다.');
        }
        
        const refreshResponse = await publicApi.post("/api/auths/refresh");
        console.log('Refresh response:', refreshResponse);

        // 토큰 갱신 성공
        isRefreshing = false;
        processQueue(null, refreshResponse);
        
        console.log('Token refresh successful, retrying original request');
        return privateApi(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패
        isRefreshing = false;
        processQueue(refreshError, null);
        
        console.log('Refresh failed:', refreshError);
        console.log('Refresh error details:', {
          status: refreshError.response?.status,
          statusText: refreshError.response?.statusText,
          data: refreshError.response?.data,
          headers: refreshError.response?.headers
        });
        debugCookies(); // 실패 시에도 쿠키 상태 확인
        
        // 401이면 토큰이 완전히 만료된 것이므로 로그인 페이지로
        if (refreshError.response?.status === 401 || refreshError.message === 'REFRESH_TOKEN이 없습니다.') {
          forceLogout('세션이 만료되었습니다. 다시 로그인해주세요.');
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * API 서비스 객체
 */
export const APIService = {
  public: {
    get: async (url, config = {}) => {
      const response = await publicApi.get(url, config);
      return response.data;
    },
    post: async (url, data = {}, config = {}) => {
      const response = await publicApi.post(url, data, config);
      return response.data;
    },
    patch: async (url, data = {}, config = {}) => {
      const response = await publicApi.patch(url, data, config);
      return response.data;
    },
  },
  private: {
    get: async (url, config = {}) => {
      const response = await privateApi.get(url, config);
      return response.data;
    },
    post: async (url, data = {}, config = {}) => {
      const response = await privateApi.post(url, data, config);
      return response.data;
    },
    put: async (url, data = {}, config = {}) => {
      const response = await privateApi.put(url, data, config);
      return response.data;
    },
    delete: async (url, config = {}) => {
      const response = await privateApi.delete(url, config);
      return response.data;
    },
    patch: async (url, data = {}, config = {}) => {
      const response = await privateApi.patch(url, data, config);
      return response.data;
    },
  },
};

export default {
  public: publicApi,
  private: privateApi,
};