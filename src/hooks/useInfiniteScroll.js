import { useState, useEffect, useCallback, useRef } from "react";

/**
 * 무한스크롤을 위한 커스텀 훅
 * @param {Function} fetchFunction - 데이터를 가져오는 함수 (pageNum, pageSize) => Promise
 * @param {number} pageSize - 한 번에 가져올 데이터 개수 (기본값: 10)
 * @returns {Object} 무한스크롤 관련 상태와 함수들
 */
export const useInfiniteScroll = (fetchFunction, pageSize = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerRef = useRef();

  // 데이터 초기화 함수
  const reset = useCallback(() => {
    setData([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, []);

  // 데이터 로드 함수
  const loadData = useCallback(
    async (pageNum) => {
      console.log(
        `loadData 호출: pageNum=${pageNum}, fetchFunction=${!!fetchFunction}, loading=${loading}`
      );
      if (loading || !fetchFunction) {
        console.log(
          `loadData 중단: loading=${loading}, fetchFunction=${!!fetchFunction}`
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(`API 호출 시작: pageNum=${pageNum}, pageSize=${pageSize}`);
        const response = await fetchFunction(pageNum, pageSize);
        console.log(`API 응답 받음:`, response);

        const responseData = response.data?.data || response.data;
        const newData = responseData?.content || [];
        const isLast = responseData?.last || false;
        const totalElements = responseData?.totalElements || 0;

        console.log(`페이지 ${pageNum} 로드:`, {
          newData: newData.length,
          totalElements,
          isLast,
          hasMore: !isLast,
        });

        if (pageNum === 1) {
          setData(newData);
        } else {
          setData((prev) => [...prev, ...newData]);
        }

        setHasMore(!isLast);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, pageSize, loading]
  );

  // 다음 페이지 로드
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  }, [loading, hasMore, page, loadData]);

  // Intersection Observer 콜백
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      // hasMore가 false이면 Observer를 등록하지 않음
      if (!hasMore) {
        console.log("마지막 페이지 도달, Observer 등록 안함");
        return;
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log("마지막 요소 감지됨", { hasMore, loading, page });
          if (hasMore && !loading) {
            console.log("다음 페이지 로드 시작");
            loadMore();
          } else {
            console.log("추가 로드 안함:", { hasMore, loading });
          }
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, page]
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (fetchFunction) {
      loadData(1);
    }
  }, [fetchFunction]);

  // fetchFunction이 변경될 때 리셋
  useEffect(() => {
    if (fetchFunction) {
      reset();
    }
  }, [fetchFunction, reset]);

  return {
    data,
    loading,
    error,
    hasMore,
    lastElementRef,
    reset,
    loadMore,
  };
};
