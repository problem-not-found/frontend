import { create } from 'zustand';

// 기존 뮤지엄 페이지 이미지 import
import artwork1 from '@/assets/museum/큰사진3.png';
import artwork2 from '@/assets/museum/큰사진4.png';
import artwork3 from '@/assets/museum/큰사진5.png';

// 더미 데이터 (기존 뮤지엄 페이지 데이터 활용)
const DUMMY_ARTWORKS = [
  {
    id: 1,
    title: "정원에서의 오후",
    description: "어떤 생각을 가지고 만든 작품.\n어떤 생각을 가지면서 봐주셨으면 좋겠고 어떤 스타일로 어떻게 한 거임\n그래서 이걸 보면 눈물이 남...",
    image: artwork1,
    status: "전시 중",
    createdAt: "25.01.19",
    isExhibiting: true
  },
  {
    id: 2,
    title: "에트르타 절벽",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork2,
    status: "전시 중",
    createdAt: "24.11.19",
    isExhibiting: true
  },
  {
    id: 3,
    title: "바다 풍경",
    description: "어떤 생각을 가지고 만든 작품.\n어떤 생각을 가지고 만든 작품.어떤 생각을 가지고 만든 작품.\n어떤 생각을 가지고 만든 작품.어떤 생각을 가지고 만든 작품.\n어떤 생각을 가지고 만든 작품.어떤 생각을 가지고 만든 작품.",
    image: artwork3,
    status: "전시 중",
    createdAt: "24.11.18",
    isExhibiting: true
  },
  {
    id: 4,
    title: "보르디게라의 정원",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork1,
    status: "미승인",
    createdAt: "24.11.15",
    isExhibiting: false
  },
  {
    id: 5,
    title: "강가의 휴식",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork2,
    status: "전시 중",
    createdAt: "24.11.10",
    isExhibiting: true
  },
  {
    id: 6,
    title: "모네의 정원 시리즈 1",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork3,
    status: "전시 중",
    createdAt: "24.11.05",
    isExhibiting: true
  },
  {
    id: 7,
    title: "바위와 바다",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork1,
    status: "승인 대기",
    createdAt: "24.11.01",
    isExhibiting: false
  },
  {
    id: 8,
    title: "푸른 바다",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork2,
    status: "전시 중",
    createdAt: "24.10.28",
    isExhibiting: true
  },
  {
    id: 9,
    title: "나무와 빛",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork3,
    status: "전시 중",
    createdAt: "24.10.25",
    isExhibiting: true
  },
  {
    id: 10,
    title: "물가의 평온",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork1,
    status: "전시 중",
    createdAt: "24.10.22",
    isExhibiting: true
  },
  {
    id: 11,
    title: "인상파 풍경 1",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork2,
    status: "전시 중",
    createdAt: "24.10.19",
    isExhibiting: true
  },
  {
    id: 12,
    title: "인상파 풍경 2",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork3,
    status: "전시 중",
    createdAt: "24.10.16",
    isExhibiting: true
  },
  {
    id: 13,
    title: "인상파 풍경 3",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork1,
    status: "미승인",
    createdAt: "24.10.13",
    isExhibiting: false
  },
  {
    id: 14,
    title: "인상파 풍경 4",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork2,
    status: "전시 중",
    createdAt: "24.10.10",
    isExhibiting: true
  },
  {
    id: 15,
    title: "인상파 풍경 5",
    description: "어떤 생각을 가지고 만든 작품.",
    image: artwork3,
    status: "전시 중",
    createdAt: "24.10.07",
    isExhibiting: true
  }
];

const useArtworkStore = create((set, get) => ({
  // 상태
  artworks: DUMMY_ARTWORKS.slice(0, 3), // 처음에는 3개만
  layoutMode: 'vertical', // 'vertical' | 'grid'
  isLoading: false,
  isLoadingMore: false,
  searchKeyword: '',
  applicated: true, // true: 등록 신청한 작품, false: 임시 저장된 작품
  
  // 페이지네이션 상태 (더미용)
  pagination: {
    pageNum: 0,
    pageSize: 3,
    totalElements: DUMMY_ARTWORKS.length,
    totalPages: Math.ceil(DUMMY_ARTWORKS.length / 3),
    first: true,
    last: false
  },
  
  // 오류 상태
  error: null,
  
  // 액션
  setLayoutMode: (mode) => set({ layoutMode: mode }),
  
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  
  setApplicated: (applicated) => set({ applicated }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // 작품 목록 초기 로드 (더미 데이터 사용)
  loadArtworks: async (reset = true, initialCount = 3) => {
    // 더미용: 로딩 상태만 시뮬레이션
    set({ 
      isLoading: reset,
      isLoadingMore: !reset,
      error: null 
    });
    
    // 로딩 시뮬레이션
    setTimeout(() => {
      if (reset) {
        // 초기 로드 시 지정된 개수만큼 작품 로드
        const initialArtworks = DUMMY_ARTWORKS.slice(0, initialCount);
        set({
          artworks: initialArtworks,
          isLoading: false,
          isLoadingMore: false
        });
      } else {
        set({
          isLoading: false,
          isLoadingMore: false
        });
      }
    }, 500);
  },
  
  // 더 많은 작품 로드 (무한 스크롤 시뮬레이션)
  loadMoreArtworks: async () => {
    const { artworks, isLoadingMore, isLoading } = get();
    
    if (isLoading || isLoadingMore || artworks.length >= DUMMY_ARTWORKS.length) {
      return;
    }
    
    set({ isLoadingMore: true });
    
    // 로딩 시뮬레이션
    setTimeout(() => {
      const currentLength = get().artworks.length;
      const nextBatch = DUMMY_ARTWORKS.slice(currentLength, currentLength + 3);
      
      set((state) => ({
        artworks: [...state.artworks, ...nextBatch],
        isLoadingMore: false
      }));
    }, 1000);
  },
  
  // 작품 목록 새로고침 (더미 데이터용)
  refreshArtworks: async () => {
    await get().loadArtworks(true);
  },
  
  // 등록 상태 변경 (더미 데이터용)
  toggleApplicated: async () => {
    const { applicated } = get();
    set({ applicated: !applicated });
    // 더미 데이터에서는 실제 다른 데이터 로드 안함
  },
  
  // 필터된 작품 가져오기
  getFilteredArtworks: () => {
    const { artworks, searchKeyword } = get();
    
    if (!searchKeyword) return artworks;
    
    return artworks.filter(artwork =>
      artwork.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      artwork.description.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  },
  
  // 작품 개수
  getArtworkCount: () => {
    const { pagination } = get();
    return pagination.totalElements;
  },
  
  // 전시 중인 작품만 가져오기
  getExhibitingArtworks: () => {
    const { artworks } = get();
    return artworks.filter(artwork => artwork.isExhibiting);
  },
  
  // 더 로드할 수 있는지 확인
  hasMore: () => {
    const { artworks } = get();
    return artworks.length < DUMMY_ARTWORKS.length;
  },

  // 작품 등록
  addArtwork: (artwork) => {
    const newArtwork = {
      ...artwork,
      id: Date.now(), // 고유 ID 생성
      status: "승인 대기", // 기본 상태
      createdAt: new Date().toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\. /g, '.').replace('.', ''),
      isExhibiting: false // 승인 대기 중이므로 전시 중 아님
    };

    set((state) => ({
      artworks: [newArtwork, ...state.artworks], // 최신 작품을 맨 앞에 추가
      pagination: {
        ...state.pagination,
        totalElements: state.pagination.totalElements + 1,
        totalPages: Math.ceil((state.pagination.totalElements + 1) / state.pagination.pageSize)
      }
    }));

    return newArtwork;
  },

  // 작품 삭제
  deleteArtwork: (artworkId) => {
    set((state) => {
      const filteredArtworks = state.artworks.filter(artwork => artwork.id !== artworkId);
      return {
        artworks: filteredArtworks,
        pagination: {
          ...state.pagination,
          totalElements: state.pagination.totalElements - 1,
          totalPages: Math.ceil((state.pagination.totalElements - 1) / state.pagination.pageSize)
        }
      };
    });
  },

  // 작품 상태 변경 (승인/거절 등)
  updateArtworkStatus: (artworkId, newStatus) => {
    set((state) => ({
      artworks: state.artworks.map(artwork => 
        artwork.id === artworkId 
          ? { 
              ...artwork, 
              status: newStatus,
              isExhibiting: newStatus === "전시 중"
            }
          : artwork
      )
    }));
  }
}));

export default useArtworkStore;
