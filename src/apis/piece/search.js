import { APIService } from "../axios";

// 작품 검색 API
export const searchPieces = async (keyword, sortBy = "HOTTEST") => {
  try {
    const response = await APIService.public.get("/api/pieces/search", {
      params: {
        keyword,
        sortBy,
      },
    });
    return response;
  } catch (error) {
    console.error("작품 검색 중 오류:", error);
    throw error;
  }
};
