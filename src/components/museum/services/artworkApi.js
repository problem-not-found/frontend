const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

// 상태 매핑 함수들
const mapProgressStatus = (progressStatus) => {
  switch (progressStatus) {
    case 'REGISTERED':
      return '등록 완료';
    case 'ON_DISPLAY':
      return '전시 중';
    case 'WAITING':
      return '등록 대기 중';
    case 'UNREGISTERED':
      return '등록 거절';
    default:
      return '알 수 없음';
  }
};

const mapProgressStatusToUIStatus = (progressStatus) => {
  switch (progressStatus) {
    case 'REGISTERED':
      return '전시 중'; // UI에서는 등록 완료도 전시 중으로 표시
    case 'ON_DISPLAY':
      return '전시 중';
    case 'WAITING':
      return '승인 대기';
    case 'UNREGISTERED':
      return '미승인';
    default:
      return '알 수 없음';
  }
};

// 토큰 가져오기 (userStore에서 가져와야 함)
const getAuthToken = () => {
  // 추후 userStore에서 토큰을 가져오도록 수정
  return localStorage.getItem('accessToken') || '';
};

// API 호출 헬퍼
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'API 호출 실패');
    }
    
    return data;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};

// 내 작품 목록 가져오기
export const fetchMyArtworks = async (applicated = true, pageNum = 0, pageSize = 3) => {
  const response = await apiCall(
    `/api/pieces/my-page?applicated=${applicated}&pageNum=${pageNum}&pageSize=${pageSize}`
  );
  
  // API 응답 데이터를 프론트엔드 형식으로 변환
  const transformedContent = response.data.content.map(piece => ({
    id: piece.pieceId,
    title: piece.title,
    description: piece.description,
    image: piece.imageUrl,
    status: mapProgressStatusToUIStatus(piece.progressStatus),
    progressStatus: piece.progressStatus,
    saveStatus: piece.saveStatus,
    isPurchasable: piece.isPurchasable,
    userId: piece.userId,
    createdAt: new Date().toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit', 
      day: '2-digit'
    }).replace(/\. /g, '.').replace('.', ''), // 임시로 현재 날짜 사용
    isExhibiting: piece.progressStatus === 'ON_DISPLAY' || piece.progressStatus === 'REGISTERED'
  }));
  
  return {
    content: transformedContent,
    pagination: {
      totalElements: response.data.totalElements,
      totalPages: response.data.totalPages,
      pageNum: response.data.pageNum,
      pageSize: response.data.pageSize,
      first: response.data.first,
      last: response.data.last
    }
  };
};

// 작품 등록 (임시 저장)
export const saveDraftArtwork = async (artworkData) => {
  // 임시 저장 API (추후 구현)
  throw new Error('임시 저장 API가 아직 구현되지 않았습니다.');
};

// 작품 등록 신청
export const submitArtworkApplication = async (artworkData) => {
  // 등록 신청 API (추후 구현)
  throw new Error('등록 신청 API가 아직 구현되지 않았습니다.');
};

// 작품 수정
export const updateArtwork = async (pieceId, artworkData) => {
  // 작품 수정 API (추후 구현)
  throw new Error('작품 수정 API가 아직 구현되지 않았습니다.');
};

// 작품 삭제
export const deleteArtwork = async (pieceId) => {
  // 작품 삭제 API (추후 구현)
  throw new Error('작품 삭제 API가 아직 구현되지 않았습니다.');
};
