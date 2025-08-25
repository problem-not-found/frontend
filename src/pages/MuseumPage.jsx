import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import { getCurrentUser, getUserParticipationCount } from "@/apis/user/user.js";
import styles from "@museum/components/museum/museum.module.css";
import commonStyles from "@museum/components/museum/common.module.css";


export default function MuseumPage() {
  const location = useLocation();
  
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

  // 초대 데이터 로드
  const loadInvitationData = async () => {
    try {
      console.log('=== 초대 데이터 로드 시작 ===');
      
      // REQUESTED 상태의 전시 개수 조회 (아직 승인하지 않은 초대)
      const requestedResponse = await getUserParticipationCount({ status: 'REQUESTED' });
      console.log('초대 API 응답 전체:', requestedResponse);
      console.log('초대 API 응답 data:', requestedResponse?.data);
      console.log('초대 API 응답 data.data:', requestedResponse?.data?.data);
      
      // API 응답 구조에 따라 데이터 추출
      let count = 0;
      if (requestedResponse?.data?.data !== undefined) {
        // 기존 구조: response.data.data
        count = requestedResponse.data.data;
      } else if (requestedResponse?.data !== undefined && typeof requestedResponse.data === 'number') {
        // 새로운 구조: response.data가 직접 숫자
        count = requestedResponse.data;
      }
      
      console.log('파싱된 초대 개수:', count);
      console.log('count > 0 결과:', count > 0);
      
      if (count !== undefined) {
        setInvitation(prev => {
          console.log('이전 invitation 상태:', prev);
          
          const newState = {
            ...prev,
            hasInvitation: count > 0,
            invitationCount: count
          };
          
          console.log('새로운 invitation 상태:', newState);
          return newState;
        });
      } else {
        console.log('API 응답에서 초대 개수를 찾을 수 없음');
        console.log('응답 구조:', JSON.stringify(requestedResponse, null, 2));
      }
      
      console.log('=== 초대 데이터 로드 완료 ===');
    } catch (error) {
      console.error('초대 데이터 로드 오류:', error);
    }
  };

  // 초대 데이터만 새로고침하는 함수
  const refreshInvitationData = async () => {
    await loadInvitationData();
  };

  // 데이터 로드
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
      
      // 전시회 데이터 로드 (fillAll: false인 전시도 포함)
      const exhibitionsResponse = await getMyExhibitions({ pageNum: 1, pageSize: 3, fillAll: true });
      console.log('전시회 API 응답:', exhibitionsResponse);
      if (exhibitionsResponse?.data?.data) {
        const content = exhibitionsResponse.data.data.content || [];
        const totalElements = exhibitionsResponse.data.data.totalElements || 0;
        
        setExhibitions(content);
        setExhibitionsTotal(totalElements);
        
        console.log('전시회 데이터 설정:', { content, totalElements });
      }
      
      // 초대 데이터 로드
      await loadInvitationData();
      
    } catch (error) {
      console.error('데이터 로드 오류:', error);
    }
  };

  // 전시 목록만 새로고침하는 함수
  const refreshExhibitions = async () => {
    try {
      const exhibitionsResponse = await getMyExhibitions({ pageNum: 1, pageSize: 3, fillAll: true });
      console.log('전시회 새로고침 API 응답:', exhibitionsResponse);
      if (exhibitionsResponse?.data?.data) {
        const content = exhibitionsResponse.data.data.content || [];
        const totalElements = exhibitionsResponse.data.data.totalElements || 0;
        
        setExhibitions(content);
        setExhibitionsTotal(totalElements);
        
        console.log('전시회 데이터 새로고침 완료:', { content, totalElements });
      }
      
      // 전시 목록 새로고침 후 초대 데이터도 새로고침
      await loadInvitationData();
    } catch (error) {
      console.error('전시회 데이터 새로고침 오류:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    loadData();
  }, []);

  // invitation 상태 변경 추적
  useEffect(() => {
    console.log('invitation 상태 변경됨:', invitation);
  }, [invitation]);

  // refreshExhibitions 플래그 감지하여 전시 목록 새로고침
  useEffect(() => {
    if (location.state?.refreshExhibitions) {
      console.log('전시 등록 후 새로고침 감지됨');
      refreshExhibitions();
      // state 초기화 (중복 실행 방지)
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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