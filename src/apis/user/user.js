import { APIService } from "../axios.js";

/**
 * 사용자 기본 정보 등록 API
 * @param {string} nickname - 닉네임
 * @param {string} code - 사용자 코드
 * @returns {Promise} 등록 결과
 */
export const updateUserInfo = async (nickname, code) => {
  try {
    const response = await APIService.private.put("/api/users/user-info", {
      nickname,
      code,
    });
    console.log("사용자 기본 정보 등록 성공:", response.data);
    return response;
  } catch (error) {
    console.error("사용자 기본 정보 등록 실패:", error);
    throw error;
  }
};

/**
 * 사용자 선호도 정보 업데이트 API
 * @param {Object} preferences - 선호도 정보
 * @returns {Promise} 업데이트 결과
 */
export const updateUserPreferences = async (preferences) => {
  try {
    // URLSearchParams를 사용하여 배열을 올바르게 처리
    const params = new URLSearchParams();

    // 일반 속성 추가
    if (preferences.gender) params.append("gender", preferences.gender);
    if (preferences.age) params.append("age", preferences.age);

    // 배열 속성 추가
    if (preferences.themePreferences) {
      preferences.themePreferences.forEach((theme) => {
        params.append("themePreferences", theme);
      });
    }

    if (preferences.moodPreferences) {
      preferences.moodPreferences.forEach((mood) => {
        params.append("moodPreferences", mood);
      });
    }

    if (preferences.formatPreferences) {
      preferences.formatPreferences.forEach((format) => {
        params.append("formatPreferences", format);
      });
    }

    const finalUrl = `/api/users/preferences?${params.toString()}`;
    console.log("전송할 파라미터:", params.toString());
    console.log("최종 요청 URL:", finalUrl);

    const response = await APIService.private.put(finalUrl, null);
    console.log("사용자 선호도 업데이트 성공:", response.data);
    return response;
  } catch (error) {
    console.error("사용자 선호도 업데이트 실패:", error);
    throw error;
  }
};

/**
 * 사용자 관심사 정보 조회 API
 * @returns {Promise} 사용자의 나이, 성별, 선호도 정보
 */
export const getUserPreferences = async () => {
  try {
    const response = await APIService.private.get("/api/users/preferences");
    console.log("사용자 관심사 조회 성공:", response.data);
    return response;
  } catch (error) {
    console.error("사용자 관심사 조회 실패:", error);
    throw error;
  }
};

/**
 * 현재 로그인한 사용자 정보 조회 API
 * @returns {Promise} API 응답 데이터
 */
export const getCurrentUser = async () => {
  try {
    const response = await APIService.private.get('/api/users');
    return response;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 특정 사용자 정보 조회 API
 * @param {string} userId - 사용자 ID
 * @returns {Promise} API 응답 데이터
 */
export const getUserById = async (userId) => {
  try {
    const response = await APIService.private.get(`/api/users/${userId}/creator`);
    return response;
  } catch (error) {
    console.error('사용자 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 프로필 수정 API
 * @param {Object} userData - 수정할 사용자 데이터
 * @param {string} userData.nickname - 닉네임
 * @param {string} userData.introduction - 자기소개
 * @param {string} userData.code - 코드
 * @returns {Promise} API 응답 데이터
 */
export const updateUserProfile = async (userData) => {
  try {
    // FormData 객체 생성
    const formData = new FormData();
    
    // request라는 이름으로 JSON 데이터를 추가
    const requestData = {
      nickname: userData.nickname,
      code: userData.code,
      introduction: userData.introduction
    };
    
    formData.append('request', new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    }));
    
    const response = await APIService.private.put('/api/users', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('사용자 프로필 수정 실패:', error);
    throw error;
  }
};

/**
 * 사용자 프로필 이미지 수정 API
 * @param {File} profileImage - 프로필 이미지 파일
 * @returns {Promise} API 응답 데이터
 */
export const updateUserProfileImage = async (profileImage) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', profileImage);  // profileImageUrl -> profileImage로 변경
    
    const response = await APIService.private.put('/api/users/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('프로필 이미지 수정 실패:', error);
    throw error;
  }
};

/**
 * 사용자 계정 삭제 API
 * @returns {Promise} API 응답 데이터
 */
export const deleteUserAccount = async () => {
  try {
    const response = await APIService.private.delete('/api/users');
    return response;
  } catch (error) {
    console.error('사용자 계정 삭제 실패:', error);
    throw error;
  }
};

/**
 * 사용자 코드로 프로필 조회 API
 * @param {string} userCode - 사용자 코드 (예: @username)
 * @returns {Promise} API 응답 데이터
 */
export const getUserProfilesByCode = async (userCode) => {
  try {
    const response = await APIService.private.get(`/api/users/profile?code=${userCode}`);
    return response;
  } catch (error) {
    console.error('사용자 프로필 조회 실패:', error);
    throw error;
  }
};

/**
 * 연락 정보 등록 상태 조회 API
 * @returns {Promise} API 응답 데이터
 */
export const getContactStatus = async () => {
  try {
    const response = await APIService.private.get('/api/users/contact/status');
    return response;
  } catch (error) {
    console.error('연락 정보 상태 조회 실패:', error);
    throw error;
  }
};

/**
 * 연락 정보 수정 API
 * @param {Object} contactData - 수정할 연락 정보 데이터
 * @param {string} contactData.email
 * @param {string} contactData.instagram
 * @returns {Promise} API 응답 데이터
 */
export const updateContact = async (contactData) => {
  try {
    const response = await APIService.private.put('/api/users/contact', contactData);
    return response;
  } catch (error) {
    console.error('연락 정보 수정 실패:', error);
    throw error;
  }
};

/**
 * 사용자 연락 정보 조회 API
 * @param {string} userId - 사용자 ID
 * @returns {Promise} API 응답 데이터
 */
export const getUserContact = async (userId) => {
  try {
    const response = await APIService.private.get(`/api/users/${userId}/contact`);
    return response;
  } catch (error) {
    console.error('사용자 연락 정보 조회 실패:', error);
    throw error;
  }
};

/**
 * 사용자 코드 중복 확인 API
 * @param {string} code - 확인할 사용자 코드
 * @returns {Promise} API 응답 데이터
 */
export const checkUserCode = async (code) => {
  try {
    const response = await APIService.private.get(`/api/users/check-code?code=${code}`);
    return response;
  } catch (error) {
    console.error('사용자 코드 중복 확인 실패:', error);
    throw error;
  }
};