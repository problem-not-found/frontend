import useUserStore from "../../stores/userStore";
import styles from './userProfileModal.module.css';

export default function UserProfileModal({ isOpen, onClose, onEditClick }) {
  const { user, contactInfo, subscription } = useUserStore();

  if (!isOpen) return null;

  const handleContactInfoClick = () => {
    // 연락 정보 수정 페이지로 이동
    window.location.href = '/user/contact';
  };

  const handleMembershipClick = () => {
    console.log('멤버십 관련 액션');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.profileDetailHeader}>
          <div className={styles.profileDetailInfo}>
            <div 
              className={styles.profileDetailImage}
              style={{
                backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none'
              }}
            />
            <div className={styles.profileDetailText}>
              <span className={styles.profileDetailName}>{user.name} @{user.nickname}</span>
            </div>
          </div>
          <button className={styles.editButton} onClick={onEditClick}>
            편집하기
          </button>
        </div>

        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            {user.bio || "안녕하세요. 아름다운 바다 그림을 통해 많은 사람들에게 행복을 주고 싶은 크리에이터입니다."}
          </p>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📧</div>
            <span className={styles.contactText}>이메일 {user.email}</span>
          </div>
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📷</div>
            <span className={styles.contactText}>인스타그램 @{user.instagram || user.nickname}</span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button 
            className={`${styles.actionButton} ${contactInfo.isRegistered ? styles.contactRegistered : ''}`}
            onClick={handleContactInfoClick}
          >
            {contactInfo.isRegistered ? '연락 정보 등록됨' : '연락 정보 등록하기'}
          </button>
          <button 
            className={`${styles.actionButton} ${subscription.isPremium ? styles.premiumSubscribed : ''}`}
            onClick={handleMembershipClick}
          >
            {subscription.isPremium ? '멤버십 구독 중' : '멤버십 관리'}
          </button>
        </div>
      </div>
    </div>
  );
}
