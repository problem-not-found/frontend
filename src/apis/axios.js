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
 * 쿠키에서 특정 이름의 값을 가져오는 함수
 */
const getCookie = (name) => {
  const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return matches ? decodeURIComponent(matches[1]) : null;
};

/**
 * 쿠키에 값을 저장하는 함수
 * expires: 만료 시간 (일 단위)
 */
const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + days);
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; expires=${expires.toUTCString()}; Secure; HttpOnly`;
};

/**
 * 쿠키에서 특정 이름의 값을 삭제하는 함수
 */
const deleteCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; HttpOnly`;
};

/**
 * 토큰이 필요없는 일반 요청 (public API)
 */
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
  withCredentials: true, //쿠키 자동 포함
});

/**
 * 토큰이 필요한 인증 요청 (private API)
 */
const privateApi = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  timeout: 30000,
  withCredentials: true, //쿠키 자동 포함
});;

/**
 * 요청 인터셉터 - 쿠키에서 토큰을 가져와 요청 헤더에 추가
 */
privateApi.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("ACCESS_TOKEN");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터 - 401 발생 시 자동으로 토큰 갱신
 */
privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie("REFRESH_TOKEN");
        const response = await publicApi.post("/api/auths/refresh", {
          refreshToken,
        });

        const newToken = response.data.token;
        setCookie("ACCESS_TOKEN", newToken, 7); // 새 토큰을 쿠키에 저장 (7일 유지)

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return privateApi(originalRequest);
      } catch (refreshError) {
        deleteCookie("ACCESS_TOKEN");
        deleteCookie("REFRESH_TOKEN");
         window.location.href = "/login";
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