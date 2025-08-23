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
import { fetchMyArtworks } from "@/apis/artwork";
import styles from "@museum/components/museum/museum.module.css";
import commonStyles from "@museum/components/museum/common.module.css";

// 이미지 import
import exhibition1 from "@/assets/museum/큰사진1.png";
import exhibition2 from "@/assets/museum/큰사진2.png";

export default function MuseumPage() {
  // Zustand에서 사용자 정보 가져오기
  const { user, subscription, invitation } = useUserStore();
  
  // 작품 데이터 상태
  const [artworks, setArtworks] = useState([]);
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 작품 데이터 로드
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        console.log('작품 데이터 로드 시작...');
        const response = await fetchMyArtworks(true, 0, 10); // 등록 완료된 작품 10개
        console.log('API 응답:', response);
        console.log('응답 데이터:', response.data);
        console.log('작품 목록:', response.content);
        
        setArtworks(response.content || []);
        console.log('설정된 작품 목록:', response.content || []);
      } catch (error) {
        console.error('작품 로드 오류:', error);
      }
    };

    loadArtworks();
  }, []);

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10); // 10px 이상 스크롤 시 그림자 표시
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <div style={{height: '10px'}}></div>
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
