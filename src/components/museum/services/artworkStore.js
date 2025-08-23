import { create } from 'zustand';
import { fetchMyArtworks, deleteArtwork as deleteArtworkApi } from './artworkApi';

const useArtworkStore = create((set, get) => ({
  artworks: [],
  layoutMode: 'vertical',
  isLoading: false,
  isLoadingMore: false,
  searchKeyword: '',
  applicated: true,

  pagination: {
    pageNum: 0,
    pageSize: 3,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
  },

  error: null,

  setLayoutMode: (mode) => set({ layoutMode: mode }),
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  setApplicated: (applicated) => set({ applicated }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  loadArtworks: async (reset = true, initialCount = 3) => {
    set({ isLoading: reset, isLoadingMore: !reset, error: null });
    try {
      const { applicated } = get();
      const pageNum = reset ? 0 : get().pagination.pageNum + 1;
      const data = await fetchMyArtworks(applicated, pageNum, initialCount);

      const nextState = {
        artworks: reset ? data.content : [...get().artworks, ...data.content],
        pagination: {
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          first: data.first,
          last: data.last,
        },
        isLoading: false,
        isLoadingMore: false,
      };
      set(nextState);
    } catch (error) {
      const msg = String(error?.message || '');
      set({
        error: msg.includes('401') ? '인증이 만료되었습니다. 다시 로그인해주세요.' : (msg || '작품을 불러오는데 실패했습니다.'),
        isLoading: false,
        isLoadingMore: false,
      });
    }
  },

  loadMoreArtworks: async () => {
    const { isLoadingMore, isLoading, pagination, applicated } = get();
    if (isLoading || isLoadingMore || pagination.last) return;

    set({ isLoadingMore: true });
    try {
      const nextPage = pagination.pageNum + 1;
      const data = await fetchMyArtworks(applicated, nextPage, pagination.pageSize);
      set((state) => ({
        artworks: [...state.artworks, ...data.content],
        pagination: {
          pageNum: data.pageNum,
          pageSize: data.pageSize,
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          first: data.first,
          last: data.last,
        },
        isLoadingMore: false,
      }));
    } catch (error) {
      const msg = String(error?.message || '');
      set({
        error: msg.includes('401') ? '인증이 만료되었습니다. 다시 로그인해주세요.' : (msg || '추가 작품을 불러오는데 실패했습니다.'),
        isLoadingMore: false,
      });
    }
  },

  refreshArtworks: async () => get().loadArtworks(true, 3),

  toggleApplicated: async () => {
    set({ applicated: !get().applicated });
    await get().loadArtworks(true, 3);
  },

  getFilteredArtworks: () => {
    const { artworks, searchKeyword } = get();
    if (!searchKeyword) return artworks;
    const q = searchKeyword.toLowerCase();
    return artworks.filter((a) =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q)
    );
  },

  getArtworkCount: () => get().pagination.totalElements,
  getExhibitingArtworks: () => get().artworks.filter((a) => a.isExhibiting),
  hasMore: () => !get().pagination.last,

  deleteArtwork: async (artworkId) => {
    try {
      await deleteArtworkApi(artworkId);
      set((state) => {
        const filtered = state.artworks.filter((a) => a.id !== artworkId);
        return {
          artworks: filtered,
          pagination: {
            ...state.pagination,
            totalElements: state.pagination.totalElements - 1,
            totalPages: Math.ceil((state.pagination.totalElements - 1) / state.pagination.pageSize),
          },
        };
      });
      return true;
    } catch (error) {
      set({ error: error.message || '작품 삭제에 실패했습니다.' });
      return false;
    }
  },

  updateArtworkStatus: (artworkId, newStatus) => {
    set((state) => ({
      artworks: state.artworks.map((a) =>
        a.id === artworkId
          ? { ...a, status: newStatus, isExhibiting: newStatus === '전시 중' }
          : a
      ),
    }));
  },
}));

export default useArtworkStore;
