import { useState, useEffect } from "react";
import PremiumBar from "@museum/components/museum/PremiumBar";
import MuseumProfile from "@museum/components/museum/MuseumProfile";
import ArtworkSection from "@museum/components/museum/ArtworkSection";
import ExhibitionSection from "@museum/components/museum/ExhibitionSection";
import InsightSection from "@museum/components/museum/InsightSection";
import InvitationSection from "@museum/components/museum/InvitationSection";
import BackToTopButton from "@/components/common/BackToTopButton";
import AppFooter from "@/components/footer/AppFooter";
import { getMyPieces } from "@apis/museum/artwork";
import { getMyExhibitions } from "@apis/museum/exhibition";
import { getCurrentUser } from "@/apis/user/user.js";
import styles from "@museum/components/museum/museum.module.css";
import commonStyles from "@museum/components/museum/common.module.css";


export default function MuseumPage() {
  // 작품 데이터 상태
  const [artworks, setArtworks] = useState([]);
  const [artworksTotal, setArtworksTotal] = useState(0);
  
  // 전시회 데이터 상태
  const [exhibitions, setExhibitions] = useState([]);
  const [exhibitionsTotal, setExhibitionsTotal] = useState(0);
  
  // 사용자 정보 상태
  const [user, setUser] = useState(null);
  
  // 초대 정보 상태
  const [invitation, setInvitation] = useState({
    hasInvitation: false,
    hasSharedLibraryRequest: false,
    invitationCount: 0
  });
  
  // 스크롤 상태 관리
  const [isScrolled, setIsScrolled] = useState(false);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 사용자 정보 로드
        const userResponse = await getCurrentUser();
        if (userResponse?.data) {
          setUser(userResponse.data);
          console.log('MuseumPage - 사용자 정보:', userResponse.data);
        }
        
        // 작품 데이터 로드
        const artworksResponse = await getMyPieces({ applicated: true, pageNum: 1, pageSize: 3 });
        if (artworksResponse?.data) {
          setArtworks(artworksResponse.data.content || []);
          setArtworksTotal(artworksResponse.data.totalElements || 0);
          console.log('설정된 작품 목록:', artworksResponse.data.content);
          console.log('작품 총 개수:', artworksResponse.data.totalElements);
        }
        
        // 전시회 데이터 로드
        const exhibitionsResponse = await getMyExhibitions({ pageNum: 1, pageSize: 3, fillAll: true });
        console.log('전시회 API 응답:', exhibitionsResponse);
        if (exhibitionsResponse?.data?.data) {
          const content = exhibitionsResponse.data.data.content || [];
          const totalElements = exhibitionsResponse.data.data.totalElements || 0;
          
          setExhibitions(content);
          setExhibitionsTotal(totalElements);
          
          console.log('전시회 데이터 설정:', { content, totalElements });
        }
        
      } catch (error) {
        console.error('데이터 로드 오류:', error);
      }
    };

    loadData();
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


  return (
    <div className={styles.page}>
      <div style={{height: '10px'}}></div>
      <div className={`${styles.topShadow} ${isScrolled ? styles.topShadowVisible : ''}`} />
      
      {user && <MuseumProfile user={user} />}
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
        <ArtworkSection artworks={artworks} totalElements={artworksTotal} />
        <ExhibitionSection exhibitions={exhibitions} totalElements={exhibitionsTotal} />
        <InsightSection />
      </main>
      


      <BackToTopButton />
      <AppFooter />
    </div>
  );
}