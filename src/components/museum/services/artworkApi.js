import { fetchMyArtworks as fetchMyArtworksApi, deleteArtwork as deleteArtworkApi, updateArtworkStatus as updateArtworkStatusApi } from '@/apis/artwork';

// 상태 텍스트 변환
const getStatusText = (progressStatus) => ({
  REGISTERED: '등록 완료',
  ON_DISPLAY: '전시 중',
  WAITING: '등록 대기 중',
  UNREGISTERED: '등록 거절',
}[progressStatus] || '알 수 없음');

// 날짜 포맷
const formatDate = (date) =>
  date.toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' })
    .replace(/\. /g, '.').replace('.', '');

// API → 프론트 포맷 변환
const transformArtworkData = (a) => ({
  id: a.pieceId,
  title: a.title,
  description: a.description,
  image: a.imageUrl,
  status: getStatusText(a.progressStatus),
  createdAt: formatDate(new Date()),
  isExhibiting: a.progressStatus === 'ON_DISPLAY',
  saveStatus: a.saveStatus,
  progressStatus: a.progressStatus,
  isPurchasable: a.isPurchasable,
  userId: a.userId,
});

// 내 작품 목록 조회
export async function fetchMyArtworks(applicated = true, pageNum = 0, pageSize = 3) {
  try {
    const data = await fetchMyArtworksApi(applicated, pageNum, pageSize);
    
    // API 응답 구조에 따라 데이터 처리
    const d = data.data || data;
    return {
      content: (d.content || []).map(transformArtworkData),
      totalElements: d.totalElements,
      totalPages: d.totalPages,
      pageNum: d.pageNum,
      pageSize: d.pageSize,
      first: d.first,
      last: d.last,
    };
  } catch (error) {
    console.error('내 작품 조회 오류:', error);
    throw error;
  }
}

// 작품 삭제
export async function deleteArtwork(pieceId) {
  try {
    const data = await deleteArtworkApi(pieceId);
    return data;
  } catch (error) {
    console.error('작품 삭제 오류:', error);
    throw error;
  }
}

// 작품 상태 업데이트
export async function updateArtworkStatus(pieceId, status) {
  try {
    const data = await updateArtworkStatusApi(pieceId, status);
    return data;
  } catch (error) {
    console.error('작품 상태 업데이트 오류:', error);
    throw error;
  }
}
