import { useState, useEffect, useCallback } from 'react';
import { getExhibitionById } from '../apis/museum/exhibition';
import { getMultiplePieceDetails } from '../apis/museum/artwork';

/**
 * 전시 정보와 작품들을 관리하는 커스텀 훅
 * @param {string} exhibitionId - 전시 ID
 * @returns {Object} 전시 데이터와 상태 관리 함수들
 */
export const useExhibitionArtworks = (exhibitionId) => {
  const [exhibition, setExhibition] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 전시 정보와 작품 상세 정보 로드
  const loadExhibition = useCallback(async () => {
    if (!exhibitionId) {
      console.log('🔍 useExhibitionArtworks: exhibitionId가 없습니다.');
      return;
    }

    console.log('🚀 useExhibitionArtworks: 전시 정보 로드 시작', { exhibitionId });
    setLoading(true);
    setError(null);

    try {
      // 1. 전시 정보 조회
      console.log('📡 API 호출: 전시 정보 조회 시작');
      const exhibitionResponse = await getExhibitionById(exhibitionId);
      console.log('✅ 전시 정보 조회 성공:', exhibitionResponse);
      
      const exhibitionData = exhibitionResponse.data?.data;
      console.log('📋 전시 데이터:', exhibitionData);
      
      if (exhibitionData) {
        setExhibition(exhibitionData);
        console.log('🎯 전시 정보 설정 완료:', exhibitionData);
        
        // 2. pieceIdList가 있으면 각 작품의 상세 정보 조회
        if (exhibitionData.pieceIdList && exhibitionData.pieceIdList.length > 0) {
          console.log('🖼️ 작품 ID 목록 발견:', exhibitionData.pieceIdList);
          
          try {
            console.log('📡 API 호출: 작품 상세 정보 조회 시작');
            const pieceDetails = await getMultiplePieceDetails(exhibitionData.pieceIdList);
            console.log('✅ 작품 상세 정보 조회 성공:', pieceDetails);
            
            // 작품 정보를 전시용으로 가공
            const processedArtworks = pieceDetails.map((piece, index) => {
              console.log(`🔍 원본 작품 데이터 ${index + 1}:`, piece);
              
              // 빈 객체나 null 체크
              if (!piece || Object.keys(piece).length === 0) {
                console.warn(`⚠️ 작품 ${index + 1}이 빈 데이터입니다:`, piece);
                return null;
              }
              
              const processed = {
                id: piece.id || piece.pieceId || exhibitionData.pieceIdList[index],
                title: piece.title || `작품 ${index + 1}`,
                artist: piece.artist || piece.artistName || "작가명 없음",
                year: piece.year || piece.createdYear || "연도 없음",
                description: piece.description || "작품 설명이 없습니다.",
                image: piece.imageUrl,
                price: piece.price || "가격 정보 없음",
                // 기존 위치 정보는 index 기반으로 할당
                position: index < 9 ? [
                  [-8, 2.5, -7.8],   // 뒷벽 왼쪽
                  [0, 2.5, -7.8],    // 뒷벽 중앙
                  [8, 2.5, -7.8],    // 뒷벽 오른쪽
                  [-17.3, 2.5, -4],  // 왼쪽 벽 뒤쪽
                  [17.3, 2.5, -4],   // 오른쪽 벽 뒤쪽
                  [-17.3, 2.5, 4],   // 왼쪽 벽 앞쪽
                  [17.3, 2.5, 4],    // 오른쪽 벽 앞쪽
                  [-6, 2.5, 7.8],    // 앞쪽 벽 왼쪽
                  [6, 2.5, 7.8],     // 앞쪽 벽 오른쪽
                ][index] : [0, 2.5, 0] // 기본 위치
              };
              
              console.log(`🎨 작품 ${index + 1} 처리 완료:`, processed);
              return processed;
            }).filter(Boolean); // null 값 제거
            
            console.log('🎭 최종 가공된 작품 목록 (null 제거 후):', processedArtworks);
            console.log('📊 실제 작품 개수:', processedArtworks.length);
            setArtworks(processedArtworks);
            
          } catch (pieceError) {
            console.error('❌ 작품 상세 정보 조회 실패:', pieceError);
            console.log('🔧 작품 정보 조회 실패 시 더미 데이터 사용');
            
            // 에러 발생 시에도 더미 데이터 사용
            const dummyArtworks = [
              {
                id: 'dummy1',
                title: '도시의 일몰',
                artist: '김민수',
                year: '2023',
                description: '현대 도시 풍경을 따뜻한 색조로 표현한 작품',
                image: '/artwork1.png',
                price: '150만원',
                position: [-8, 2.5, -7.8]
              },
              {
                id: 'dummy2',
                title: '자연의 조화',
                artist: '이영희',
                year: '2023',
                description: '자연 속에서 찾은 평온함을 담은 추상화',
                image: '/artwork2.png',
                price: '200만원',
                position: [0, 2.5, -7.8]
              }
            ];
            
            console.log('🎭 에러 시 더미 작품 데이터 설정:', dummyArtworks);
            setArtworks(dummyArtworks);
          }
        } else {
          console.log('⚠️ pieceIdList가 비어있거나 없습니다. 더미 데이터 사용');
          
          // pieceIdList가 없는 경우에도 더미 데이터 사용
          const dummyArtworks = [
            {
              id: 'dummy1',
              title: '도시의 일몰',
              artist: '김민수',
              year: '2023',
              description: '현대 도시 풍경을 따뜻한 색조로 표현한 작품',
              image: '/artwork1.png',
              price: '150만원',
              position: [-8, 2.5, -7.8]
            }
          ];
          
          console.log('🎭 기본 더미 작품 데이터 설정:', dummyArtworks);
          setArtworks(dummyArtworks);
        }
      } else {
        console.log('⚠️ 전시 데이터가 없습니다.');
      }
    } catch (err) {
      console.error('❌ 전시 정보 로드 실패:', err);
      setError(err);
    } finally {
      setLoading(false);
      console.log('🏁 전시 정보 로드 완료');
    }
  }, [exhibitionId]);

  // 전시 정보 초기 로드
  useEffect(() => {
    console.log('🔄 useExhibitionArtworks useEffect 실행:', { exhibitionId });
    loadExhibition();
  }, [loadExhibition]);

  // 데이터 새로고침
  const refresh = useCallback(() => {
    console.log('🔄 전시 데이터 새로고침 시작');
    loadExhibition();
  }, [loadExhibition]);

  // 상태 변화 로깅
  useEffect(() => {
    console.log('📊 useExhibitionArtworks 상태 변화:', {
      exhibition: exhibition ? '있음' : '없음',
      artworksCount: artworks.length,
      loading,
      error: error ? '있음' : '없음'
    });
  }, [exhibition, artworks, loading, error]);

  return {
    exhibition,
    artworks,
    loading,
    error,
    refresh
  };
};
