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
