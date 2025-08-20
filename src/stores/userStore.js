import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import profileImage from '../assets/museum/프사.png'

const useUserStore = create(
  persist(
    (set) => ({
      // 사용자 정보
      user: {
        id: 1,
        name: '김땡땡',
        profileImage: profileImage,
        title: '크리에이터의 전시장',
      },
      
      // 사용자 선호도
      preferences: {
        exhibitions: [],
        artworkMoods: [],
        gender: '',
        age: '',
        nickname: '',
        userId: '',
      },
      
      // 로그인 상태
      isLoggedIn: true,
      
      // 구독 정보
      subscription: {
        isPremium: false, // 구독 상태별 조건부 렌더링 확인
        plan: 'premium', // 'free', 'premium', 'pro'
      },

      // 구독 상태 업데이트 (테스트용)
      updateSubscription: (subscriptionData) => {
        set(state => ({
          subscription: { ...state.subscription, ...subscriptionData }
        }))
      },

      // 사용자 선호도 업데이트
      updatePreferences: (preferenceData) => {
        set(state => ({
          preferences: { ...state.preferences, ...preferenceData }
        }))
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
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        subscription: state.subscription,
        preferences: state.preferences
      })
    }
  )
)

export default useUserStore
