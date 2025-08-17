import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import AppFooter from "../components/footer/AppFooter";
import styles from "../components/user/userProfileDetail.module.css";

export default function UserProfileDetailPage() {
  const navigate = useNavigate();
  const { user, tradeInfo, subscription } = useUserStore();

  const handleEditClick = () => {
    navigate('/user/edit');
  };

  const handleBackClick = () => {
    navigate('/user');
  };

  const handleTradeInfoClick = () => {
    console.log('거래 정보 관련 액션');
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
          <div className={styles.profileDetailImage}>
            <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
          </div>
        </div>

        {/* 닉네임과 태그 영역 */}
        <div className={styles.profileNameSection}>
          <span className={styles.profileName}>{user.name}</span>
          <span className={styles.profileTag}>@{user.nickname}</span>
        </div>

        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            {user.bio || "안녕하세요. 아름다운 바다 그림을 통해 많은 사람들에게 행복을 주고 싶은 크리에이터입니다."}
          </p>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactItem}>
            <img src="/src/assets/user/mail2.png" alt="mail" className={styles.contactIcon} />
            <span className={styles.contactText}>
              이메일 <span className={styles.contactValue}>{user.email}</span>
            </span>
          </div>
          <div className={styles.contactItem}>
            <img src="/src/assets/user/instagram.png" alt="instagram" className={styles.contactIcon} />
            <span className={styles.contactText}>
              인스타그램 <span className={styles.contactValue}>@{user.instagram || user.nickname}</span>
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionButton} ${tradeInfo.isRegistered ? styles.tradeRegistered : ''}`}
            onClick={handleTradeInfoClick}
          >
            {tradeInfo.isRegistered ? '거래 정보 등록됨' : '거래 정보 등록하기'}
          </button>
          <button 
            className={`${styles.actionButton} ${subscription.isPremium ? styles.premiumSubscribed : ''}`}
            onClick={handleMembershipClick}
          >
            {subscription.isPremium ? '멤버십 구독 중' : '멤버십 관리'}
          </button>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
