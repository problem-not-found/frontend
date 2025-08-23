import { useState, useEffect } from "react";
import PremiumBar from "@museum/components/museum/PremiumBar";
import MuseumProfile from "@museum/components/museum/MuseumProfile";
import ArtworkSection from "@museum/components/museum/ArtworkSection";
import ExhibitionSection from "@museum/components/museum/ExhibitionSection";
import InsightSection from "@museum/components/museum/InsightSection";
import InvitationSection from "@museum/components/museum/InvitationSection";
import BackToTopButton from "@/components/common/BackToTopButton";
import AppFooter from "@/components/footer/AppFooter";
import useUserStore from "@/stores/userStore";
import styles from "@museum/components/museum/museum.module.css";
import commonStyles from "@museum/components/museum/common.module.css";

// 이미지 import
import artwork1 from "@/assets/museum/큰사진3.png";
import artwork2 from "@/assets/museum/큰사진4.png";
import artwork3 from "@/assets/museum/큰사진5.png";
import exhibition1 from "@/assets/museum/큰사진1.png";
import exhibition2 from "@/assets/museum/큰사진2.png";


export default function MuseumPage() {
  // Zustand에서 사용자 정보 가져오기
  const { user, subscription, invitation } = useUserStore();
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10); // 10px 이상 스크롤 시 그림자 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const artworks = [
    { id: 1, image: artwork1, title: "정원에서의 오후" },
    { id: 2, image: artwork2, title: "에트르타 절벽" },
    { id: 3, image: artwork3, title: "바다 풍경" },
    { id: 4, image: artwork1, title: "보르디게라의 정원" },
    { id: 5, image: artwork2, title: "강가의 휴식" },
    { id: 6, image: artwork3, title: "모네의 정원 시리즈 1" },
    { id: 7, image: artwork1, title: "바위와 바다" },
    { id: 8, image: artwork2, title: "푸른 바다" },
    { id: 9, image: artwork3, title: "나무와 빛" },
    { id: 10, image: artwork1, title: "물가의 평온" },
    { id: 11, image: artwork2, title: "인상파 풍경 1" },
    { id: 12, image: artwork3, title: "인상파 풍경 2" },
    { id: 13, image: artwork1, title: "인상파 풍경 3" },
    { id: 14, image: artwork2, title: "인상파 풍경 4" },
    { id: 15, image: artwork3, title: "인상파 풍경 5" },
    { id: 16, image: artwork1, title: "자연의 순간 1" },
    { id: 17, image: artwork2, title: "자연의 순간 2" },
  ];

  const exhibitions = [
    {
      id: 1,
      title: "김땡땡 개인전 : 두 번째 여름",
      date: "24.12.5 - 25.2.19",
      image: exhibition1
    },
    {
      id: 2,
      title: "김땡땡 개인전",
      date: "24.12.5 - 25.2.19",
      image: exhibition2
    },
    {
      id: 3,
      title: "추상 미술의 세계",
      date: "24.11.1 - 25.1.15",
      image: exhibition1
    },
    {
      id: 4,
      title: "도시 풍경 전시",
      date: "24.10.20 - 24.12.30",
      image: exhibition2
    },
    {
      id: 5,
      title: "자연과 빛의 조화",
      date: "24.9.15 - 24.11.30",
      image: exhibition1
    },
    {
      id: 6,
      title: "현대 미술의 흐름",
      date: "24.8.1 - 24.10.15",
      image: exhibition2
    }
  ];

  return (
    <div className={styles.page}>
      <div style={{height: '40px'}}></div>
      <div className={`${styles.topShadow} ${isScrolled ? styles.topShadowVisible : ''}`} />
      
      <MuseumProfile user={user} />
      <PremiumBar />
      
      {/* 공동 전시 초대가 온 사용자에게만 보여주는 섹션 */}
      {(invitation.hasInvitation || invitation.hasSharedLibraryRequest) && (
        <InvitationSection 
          hasInvitation={invitation.hasInvitation}
          hasSharedLibraryRequest={invitation.hasSharedLibraryRequest}
          invitationCount={invitation.invitationCount}
        />
      )}
      
      <main className={commonStyles.main}>
        <ArtworkSection artworks={artworks} />
        <ExhibitionSection exhibitions={exhibitions} />
        <InsightSection />
      </main>

      <BackToTopButton />
      <AppFooter />
    </div>
  );
}
