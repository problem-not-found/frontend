import { APIService } from "../axios.js";
import { useState, useEffect, useCallback } from "react";

/**
 * 핫한 전시 목록 조회 API (피드 상단 슬라이드용)
 * @returns {Promise} 인기 전시 5개 목록
 */
export const getHottestExhibitions = async () => {
  try {
    const response = await APIService.public.get("/api/exhibitions", {
      params: {
        sortBy: "HOTTEST",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("핫한 전시 조회 실패:", error);
    throw error;
  }
};

/**
 * 핫한 작품 목록 조회 API (피드 상단 슬라이드용)
 * @returns {Promise} 인기 작품 5개 목록
 */
export const getHottestPieces = async () => {
  try {
    const response = await APIService.public.get("/api/pieces", {
      params: {
        sortBy: "HOTTEST",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("핫한 작품 조회 실패:", error);
    throw error;
  }
};

/**
 * 최신 전시 목록 조회 API (새로 오픈 섹션용)
 * @returns {Promise} 최신 전시 5개 목록
 */
export const getLatestExhibitions = async () => {
  try {
    const response = await APIService.public.get("/api/exhibitions", {
      params: {
        sortBy: "LATEST",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("최신 전시 조회 실패:", error);
    throw error;
  }
};

/**
 * 최신 작품 목록 조회 API (새로 오픈 섹션용)
 * @returns {Promise} 최신 작품 5개 목록
 */
export const getLatestPieces = async () => {
  try {
    const response = await APIService.public.get("/api/pieces", {
      params: {
        sortBy: "LATEST",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("최신 작품 조회 실패:", error);
    throw error;
  }
};

/**
 * 최근 전시 오픈한 크리에이터 조회 API
 * @returns {Promise} 최근 전시 오픈한 크리에이터 5명 목록
 */
export const getLatestOpenCreators = async () => {
  try {
    const response = await APIService.public.get("/api/users/recommendations", {
      params: {
        sortBy: "LATEST_OPEN",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("최근 전시 오픈 크리에이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 비슷한 연령대 크리에이터 조회 API
 * @returns {Promise} 비슷한 연령대 크리에이터 5명 목록
 */
export const getPeerGroupCreators = async () => {
  try {
    const response = await APIService.public.get("/api/users/recommendations", {
      params: {
        sortBy: "PEER_GROUP",
        pageNum: 1,
        pageSize: 5,
      },
    });
    return response;
  } catch (error) {
    console.error("비슷한 연령대 크리에이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 지금 뜨는 크리에이터 조회 API
 * @returns {Promise} 인기 크리에이터 1명
 */
export const getHottestCreator = async () => {
  try {
    const response = await APIService.public.get("/api/users/recommendations", {
      params: {
        sortBy: "HOTTEST",
        pageNum: 1,
        pageSize: 1,
      },
    });
    return response;
  } catch (error) {
    console.error("지금 뜨는 크리에이터 조회 실패:", error);
    throw error;
  }
};

/**
 * 내 취향 저격 전시 조회 API
 * @returns {Promise} 내 취향에 맞는 전시 5개 목록
 */
export const getMyTasteExhibitions = async () => {
  try {
    const response = await APIService.public.get(
      "/api/exhibitions/recommendations",
      {
        params: {
          opposite: false,
          pageNum: 1,
          pageSize: 5,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("내 취향 저격 전시 조회 실패:", error);
    throw error;
  }
};

/**
 * 색다른 도전 전시 조회 API
 * @returns {Promise} 내 취향과 다른 전시 5개 목록
 */
export const getDifferentTasteExhibitions = async () => {
  try {
    const response = await APIService.public.get(
      "/api/exhibitions/recommendations",
      {
        params: {
          opposite: true,
          pageNum: 1,
          pageSize: 5,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("색다른 도전 전시 조회 실패:", error);
    throw error;
  }
};

/**
 * 내 취향 저격 작품 조회 API
 * @returns {Promise} 내 취향에 맞는 작품 5개 목록
 */
export const getMyTastePieces = async () => {
  try {
    const response = await APIService.public.get(
      "/api/pieces/recommendations",
      {
        params: {
          sortBy: "FAVORITE",
          pageNum: 1,
          pageSize: 5,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("내 취향 저격 작품 조회 실패:", error);
    throw error;
  }
};

/**
 * 색다른 도전 작품 조회 API
 * @returns {Promise} 새로운 스타일의 작품 5개 목록
 */
export const getDifferentTastePieces = async () => {
  try {
    const response = await APIService.public.get(
      "/api/pieces/recommendations",
      {
        params: {
          sortBy: "NEW_STYLE",
          pageNum: 1,
          pageSize: 5,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("색다른 도전 작품 조회 실패:", error);
    throw error;
  }
};

/**
 * 전시 목록 조회 API (일반용)
 * @param {string} sortBy - 정렬 기준 (HOTTEST, NEWEST, etc.)
 * @param {number} pageNum - 페이지 번호 (1부터 시작)
 * @param {number} pageSize - 페이지 크기
 * @returns {Promise} 전시 목록과 페이지 정보
 */
export const getExhibitions = async (
  sortBy = "HOTTEST",
  pageNum = 1,
  pageSize = 10
) => {
  try {
    const response = await APIService.public.get("/api/exhibitions", {
      params: {
        sortBy,
        pageNum,
        pageSize,
      },
    });
    return response;
  } catch (error) {
    console.error("전시 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 작품 목록 조회 API (일반용)
 * @param {string} sortBy - 정렬 기준 (HOTTEST, NEWEST, etc.)
 * @param {number} pageNum - 페이지 번호 (1부터 시작)
 * @param {number} pageSize - 페이지 크기
 * @returns {Promise} 작품 목록과 페이지 정보
 */
export const getPieces = async (
  sortBy = "HOTTEST",
  pageNum = 1,
  pageSize = 10
) => {
  try {
    const response = await APIService.public.get("/api/pieces", {
      params: {
        sortBy,
        pageNum,
        pageSize,
      },
    });
    return response;
  } catch (error) {
    console.error("작품 목록 조회 실패:", error);
    throw error;
  }
};

/**
 * 핫한 전시를 위한 커스텀 훅
 * @returns {object} 전시 데이터와 상태 관리
 */
export const useHottestExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHottestExhibitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHottestExhibitions();
      const apiResponse = response.data || response;
      const exhibitionList = apiResponse.content || [];

      setExhibitions(exhibitionList);
    } catch (err) {
      setError(err);
      console.error("핫한 전시 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHottestExhibitions();
  }, [fetchHottestExhibitions]);

  return {
    exhibitions,
    loading,
    error,
    refetch: fetchHottestExhibitions,
  };
};

/**
 * 핫한 작품을 위한 커스텀 훅
 * @returns {object} 작품 데이터와 상태 관리
 */
export const useHottestPieces = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHottestPieces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHottestPieces();
      const apiResponse = response.data || response;
      const piecesList = apiResponse.content || [];

      setPieces(piecesList);
    } catch (err) {
      setError(err);
      console.error("핫한 작품 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHottestPieces();
  }, [fetchHottestPieces]);

  return {
    pieces,
    loading,
    error,
    refetch: fetchHottestPieces,
  };
};

/**
 * 최신 전시를 위한 커스텀 훅
 * @returns {object} 전시 데이터와 상태 관리
 */
export const useLatestExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestExhibitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLatestExhibitions();
      const apiResponse = response.data || response;
      const exhibitionList = apiResponse.content || [];

      setExhibitions(exhibitionList);
    } catch (err) {
      setError(err);
      console.error("최신 전시 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestExhibitions();
  }, [fetchLatestExhibitions]);

  return {
    exhibitions,
    loading,
    error,
    refetch: fetchLatestExhibitions,
  };
};

/**
 * 최신 작품을 위한 커스텀 훅
 * @returns {object} 작품 데이터와 상태 관리
 */
export const useLatestPieces = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestPieces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLatestPieces();
      const apiResponse = response.data || response;
      const piecesList = apiResponse.content || [];

      setPieces(piecesList);
    } catch (err) {
      setError(err);
      console.error("최신 작품 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestPieces();
  }, [fetchLatestPieces]);

  return {
    pieces,
    loading,
    error,
    refetch: fetchLatestPieces,
  };
};

/**
 * 최근 전시 오픈한 크리에이터를 위한 커스텀 훅
 * @returns {object} 크리에이터 데이터와 상태 관리
 */
export const useLatestOpenCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestOpenCreators = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getLatestOpenCreators();
      const apiResponse = response.data || response;
      const creatorsList = apiResponse.content || [];

      setCreators(creatorsList);
    } catch (err) {
      setError(err);
      console.error("최근 전시 오픈 크리에이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLatestOpenCreators();
  }, [fetchLatestOpenCreators]);

  return {
    creators,
    loading,
    error,
    refetch: fetchLatestOpenCreators,
  };
};

/**
 * 비슷한 연령대 크리에이터를 위한 커스텀 훅
 * @returns {object} 크리에이터 데이터와 상태 관리
 */
export const usePeerGroupCreators = () => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPeerGroupCreators = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPeerGroupCreators();
      const apiResponse = response.data || response;
      const creatorsList = apiResponse.content || [];

      setCreators(creatorsList);
    } catch (err) {
      setError(err);
      console.error("비슷한 연령대 크리에이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeerGroupCreators();
  }, [fetchPeerGroupCreators]);

  return {
    creators,
    loading,
    error,
    refetch: fetchPeerGroupCreators,
  };
};

/**
 * 지금 뜨는 크리에이터를 위한 커스텀 훅
 * @returns {object} 크리에이터 데이터와 상태 관리
 */
export const useHottestCreator = () => {
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHottestCreator = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getHottestCreator();
      const apiResponse = response.data || response;
      const creatorsList = apiResponse.content || [];

      // 첫 번째 크리에이터만 가져오기
      setCreator(creatorsList.length > 0 ? creatorsList[0] : null);
    } catch (err) {
      setError(err);
      console.error("지금 뜨는 크리에이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHottestCreator();
  }, [fetchHottestCreator]);

  return {
    creator,
    loading,
    error,
    refetch: fetchHottestCreator,
  };
};

/**
 * 내 취향 저격 전시를 위한 커스텀 훅
 * @returns {object} 전시 데이터와 상태 관리
 */
export const useMyTasteExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyTasteExhibitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyTasteExhibitions();
      const apiResponse = response.data || response;
      const exhibitionsList = apiResponse.content || [];

      setExhibitions(exhibitionsList);
    } catch (err) {
      setError(err);
      console.error("내 취향 저격 전시 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTasteExhibitions();
  }, [fetchMyTasteExhibitions]);

  return {
    exhibitions,
    loading,
    error,
    refetch: fetchMyTasteExhibitions,
  };
};

/**
 * 색다른 도전 전시를 위한 커스텀 훅
 * @returns {object} 전시 데이터와 상태 관리
 */
export const useDifferentTasteExhibitions = () => {
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDifferentTasteExhibitions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDifferentTasteExhibitions();
      const apiResponse = response.data || response;
      const exhibitionsList = apiResponse.content || [];

      setExhibitions(exhibitionsList);
    } catch (err) {
      setError(err);
      console.error("색다른 도전 전시 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDifferentTasteExhibitions();
  }, [fetchDifferentTasteExhibitions]);

  return {
    exhibitions,
    loading,
    error,
    refetch: fetchDifferentTasteExhibitions,
  };
};

/**
 * 내 취향 저격 작품을 위한 커스텀 훅
 * @returns {object} 작품 데이터와 상태 관리
 */
export const useMyTastePieces = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyTastePieces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getMyTastePieces();
      const apiResponse = response.data || response;
      const piecesList = apiResponse.content || [];

      setPieces(piecesList);
    } catch (err) {
      setError(err);
      console.error("내 취향 저격 작품 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyTastePieces();
  }, [fetchMyTastePieces]);

  return {
    pieces,
    loading,
    error,
    refetch: fetchMyTastePieces,
  };
};

/**
 * 색다른 도전 작품을 위한 커스텀 훅
 * @returns {object} 작품 데이터와 상태 관리
 */
export const useDifferentTastePieces = () => {
  const [pieces, setPieces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDifferentTastePieces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getDifferentTastePieces();
      const apiResponse = response.data || response;
      const piecesList = apiResponse.content || [];

      setPieces(piecesList);
    } catch (err) {
      setError(err);
      console.error("색다른 도전 작품 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDifferentTastePieces();
  }, [fetchDifferentTastePieces]);

  return {
    pieces,
    loading,
    error,
    refetch: fetchDifferentTastePieces,
  };
};
