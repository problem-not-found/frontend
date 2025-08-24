import { APIService } from "../axios";

// 전시 검색 API
export const searchExhibitions = async (keyword, sortBy = "HOTTEST") => {
  try {
    const response = await APIService.public.get("/api/exhibitions/search", {
      params: {
        keyword,
        sortBy,
      },
    });
    return response;
  } catch (error) {
    console.error("전시 검색 중 오류:", error);
    throw error;
  }
};
