import { APIService } from "../axios";

// 크리에이터(사용자) 검색 API
export const searchUsers = async (keyword) => {
  try {
    const response = await APIService.public.get("/api/users/search", {
      params: {
        keyword,
      },
    });
    return response;
  } catch (error) {
    console.error("크리에이터 검색 중 오류:", error);
    throw error;
  }
};
