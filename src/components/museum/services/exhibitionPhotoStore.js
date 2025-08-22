import { create } from 'zustand';

const useExhibitionPhotoStore = create((set, get) => ({
  // 전시 썸네일
  thumbnail: null,
  
  // 전시 작품들 (배열로 관리)
  artworks: [],
  
  // 썸네일 설정
  setThumbnail: (file) => {
    set({ thumbnail: file });
  },
  
  // 썸네일 제거
  removeThumbnail: () => {
    set({ thumbnail: null });
  },
  
  // 작품 추가 (새로운 인덱스에 추가)
  addArtwork: (file) => {
    set((state) => ({
      artworks: [...state.artworks, file]
    }));
  },
  
  // 특정 인덱스의 작품 수정
  updateArtwork: (index, file) => {
    set((state) => {
      const newArtworks = [...state.artworks];
      newArtworks[index] = file;
      return { artworks: newArtworks };
    });
  },
  
  // 특정 인덱스의 작품 제거
  removeArtwork: (index) => {
    set((state) => ({
      artworks: state.artworks.filter((_, i) => i !== index)
    }));
  },
  
  // 모든 작품 제거
  clearArtworks: () => {
    set({ artworks: [] });
  },
  
  // 전체 상태 초기화
  reset: () => {
    set({ thumbnail: null, artworks: [] });
  },
  
  // 전체 상태 가져오기
  getExhibitionData: () => {
    const state = get();
    return {
      thumbnail: state.thumbnail,
      artworks: state.artworks
    };
  }
}));

export default useExhibitionPhotoStore;
