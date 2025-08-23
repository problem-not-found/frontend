import useUserStore from '@/stores/userStore'; // 네가 보여준 store 경로에 맞게 수정

const API_BASE_URL = 'https://api.artium.life/api';

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

// 공통 fetch 헬퍼 (Bearer 붙이기)
async function authFetch(url, options = {}) {
  const token = useUserStore.getState().accessToken;
  if (!token) throw new Error('401: 로그인 정보가 없습니다.');

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`, // Bearer 붙이기
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* ignore */ }

  if (!res.ok) {
    const msg = json?.message || text || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json ?? {};
}

// 내 작품 목록 조회
export async function fetchMyArtworks(applicated = true, pageNum = 0, pageSize = 3) {
  const qs = new URLSearchParams({
    applicated: String(applicated),
    pageNum: String(pageNum),
    pageSize: String(pageSize),
  });
  const data = await authFetch(`${API_BASE_URL}/pieces/my-page?${qs.toString()}`, { method: 'GET' });

  if (data?.success === false) throw new Error(data.message || '작품 조회에 실패했습니다.');

  const d = data.data || {};
  return {
    content: (d.content || []).map(transformArtworkData),
    totalElements: d.totalElements,
    totalPages: d.totalPages,
    pageNum: d.pageNum,
    pageSize: d.pageSize,
    first: d.first,
    last: d.last,
  };
}

// 작품 삭제
export async function deleteArtwork(pieceId) {
  const data = await authFetch(`${API_BASE_URL}/pieces/${pieceId}`, { method: 'DELETE' });
  if (data?.success === false) throw new Error(data.message || '작품 삭제에 실패했습니다.');
  return data;
}
