import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import profileImage from '@/assets/museum/프사.png'

const useUserStore = create(
  persist(
    (set) => ({
      // 사용자 정보
      user: {
        id: 1,
        name: '김땡땡',
        nickname: 'simonisnextdoor',
        email: 'asd123@naver.com',
        profileImage: profileImage,
        title: '크리에이터의 전시장',
        bio: '',
        instagram: 'simonisnextdoor'
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
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },

      // 연락 정보
      contactInfo: {
        isRegistered: true, // 연락 정보 등록 여부
        accountNumber: '1234567890',
        bankName: '국민은행',
      },

      // 구독 상태 업데이트 (테스트용)
      updateSubscription: (subscriptionData) => {
        set(state => ({
          subscription: { ...state.subscription, ...subscriptionData }
        }))
      },

      // 연락 정보 업데이트
      updateContactInfo: (contactData) => {
        set(state => ({
          contactInfo: { ...state.contactInfo, ...contactData }
        }))
      },

      // 사용자 정보 업데이트
      updateUser: (userData) => {
        set(state => ({
          user: { ...state.user, ...userData }

        }))
      }
    }),
    {
      name: 'artium-user-storage',
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        subscription: state.subscription,
        contactInfo: state.contactInfo

      })
    }
  )
)

export default useUserStore
