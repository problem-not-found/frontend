import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set) => ({
      // 사용자 선호도
      preferences: {
        exhibitions: [],
        artworkMoods: [],
        gender: '',
        age: '',
        nickname: '',
        userId: '',
      },

      // 전시 선호도 업데이트
      updateExhibitionPreferences: (exhibitions) => {
        set(state => ({
          preferences: { ...state.preferences, exhibitions }
        }))
      },

      // 작품 분위기 선호도 업데이트
      updateArtworkMoodPreferences: (artworkMoods) => {
        set(state => ({
          preferences: { ...state.preferences, artworkMoods }
        }))
      }
    }),
    {
      name: 'artium-user-storage',
      partialize: (state) => ({
        preferences: state.preferences
      })
    }
  )
)

export default useUserStore
