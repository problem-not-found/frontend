import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getContactStatus } from "@/apis/user/user.js";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/user/userProfileDetail.module.css";

export default function UserProfileDetailPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: null,
    name: '',
    nickname: '',
    profileImageUrl: null,
    code: null,
    introduction: null
  });
  const [contactStatus, setContactStatus] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 사용자 정보와 연락 정보 상태 가져오기
    const fetchData = async () => {
      try {
        // 사용자 정보 조회
        const userResponse = await getCurrentUser();
        console.log('사용자 API 응답:', userResponse);
        
        if (userResponse && userResponse.data) {
          const userData = userResponse.data;
          setUser({
            id: userData.userId,
            name: userData.nickname,
            nickname: userData.nickname,
            profileImageUrl: userData.profileImageUrl,
            code: userData.code,
            introduction: userData.introduction
          });
        }

        // 연락 정보 상태 조회
        const contactResponse = await getContactStatus();
        console.log('연락 정보 API 응답:', contactResponse);
        if (contactResponse && contactResponse.data !== undefined) {
          setContactStatus(contactResponse.data);
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleEditClick = () => {
    navigate('/user/edit');
  };

  const handleBackClick = () => {
    navigate('/user');
  };

  const handleMembershipClick = () => {
    console.log('멤버십 관련 액션');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 상단 헤더 영역 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBackClick}>
              <img src="/src/assets/user/chevron-left.png" alt="back" className={styles.backIcon} />
            </button>
            <span className={styles.headerTitle}>프로필</span>
          </div>
          <button className={styles.editButton} onClick={handleEditClick}>
            편집하기
          </button>
        </div>

        {/* 프로필 사진 영역 */}
        <div className={styles.profileImageSection}>
          {console.log('현재 사용자 상태:', user)}
          <div 
            className={styles.profileDetailImage}
            style={{
              backgroundImage: user.profileImageUrl ? `url(${user.profileImageUrl})` : 'none'
            }}
          >
            {!user.profileImageUrl && (
              <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
            )}
          </div>
        </div>

        {/* 닉네임과 태그 영역 */}
        <div className={styles.profileNameSection}>
          <span className={styles.profileName}>{user.name}</span>
          {user.code && (
            <span className={styles.profileTag}>@{user.code}</span>
          )}
        </div>

        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            {user.introduction || "자기소개를 등록해주세요."}
          </p>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionButton} ${contactStatus ? styles.contactRegistered : ''}`}
            onClick={() => navigate('/user/contact')}
          >
            {contactStatus ? '연락 정보 등록됨' : '연락 정보 등록하기'}
          </button>
        </div>  
      </div>
      
      <AppFooter />
    </div>
  );
}