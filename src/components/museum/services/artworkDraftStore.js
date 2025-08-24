import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useArtworkDraftStore = create(
  persist(
    (set, get) => ({
      // 여러 임시저장 데이터 배열
      drafts: [],
      
      // 임시저장 여부 확인
      hasDraft: () => {
        const { drafts } = get();
        return drafts.length > 0;
      },
      
      // 새 임시저장 추가
      saveDraft: (formData) => {
        const { drafts } = get();
        
        // 이미지 파일을 URL로 변환
        let imageUrl = null;
        if (formData.mainImage) {
          imageUrl = URL.createObjectURL(formData.mainImage);
        }
        
        const newDraft = {
          id: `draft_${Date.now()}`,
          title: formData.title || '',
          description: formData.description || '',
          image: imageUrl,
          mainImage: formData.mainImage, // 원본 파일도 저장
          detailImages: formData.detailImages || [],
          createdAt: (() => {
            const now = new Date();
            const year = String(now.getFullYear()).slice(-2);
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            return `${year}.${month}.${day}`;
          })()
        };
        
        const updatedDrafts = [...drafts, newDraft];
        set({ drafts: updatedDrafts });
        
        console.log('임시저장 완료:', newDraft);
        console.log('총 임시저장 개수:', updatedDrafts.length);
        
        return newDraft;
      },
      
      // 특정 임시저장 불러오기
      loadDraft: (draftId) => {
        const { drafts } = get();
        return drafts.find(draft => draft.id === draftId);
      },
      
      // 모든 임시저장 가져오기
      getAllDrafts: () => {
        const { drafts } = get();
        return drafts;
      },
      
      // 특정 임시저장 삭제
      deleteDraft: (draftId) => {
        const { drafts } = get();
        const draftToDelete = drafts.find(draft => draft.id === draftId);
        
        // 이미지 URL이 있다면 메모리에서 해제
        if (draftToDelete && draftToDelete.image && draftToDelete.image.startsWith('blob:')) {
          URL.revokeObjectURL(draftToDelete.image);
        }
        
        const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
        set({ drafts: updatedDrafts });
        
        console.log('임시저장 삭제됨:', draftId);
      },
      
      // 모든 임시저장 삭제
      clearAllDrafts: () => {
        const { drafts } = get();
        
        // 모든 blob URL 메모리 해제
        drafts.forEach(draft => {
          if (draft.image && draft.image.startsWith('blob:')) {
            URL.revokeObjectURL(draft.image);
          }
        });
        
        set({ drafts: [] });
        console.log('모든 임시저장 삭제됨');
      }
    }),
    {
      name: 'artwork-drafts-storage', // localStorage key
      // 파일 객체는 직렬화할 수 없으므로 제외
      partialize: (state) => ({
        drafts: state.drafts.map(draft => ({
          id: draft.id,
          title: draft.title,
          description: draft.description,
          image: draft.image,
          createdAt: draft.createdAt
        }))
      })
    }
  )
);

export default useArtworkDraftStore;
