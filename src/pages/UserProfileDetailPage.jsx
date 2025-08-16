import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import AppFooter from "../components/footer/AppFooter";
import styles from "../components/user/userProfileDetail.module.css";

export default function UserProfileDetailPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleEditClick = () => {
    navigate('/user/edit');
  };

  const handleBackClick = () => {
    navigate('/user');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 뒤로가기 버튼 */}
        <button className={styles.backButton} onClick={handleBackClick}>
          ← 뒤로
        </button>

        {/* 프로필 사진과 편집하기 버튼 영역 */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileDetailImage}>
            <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
          </div>
          <button className={styles.editButton} onClick={handleEditClick}>
            편집하기
          </button>
        </div>

        {/* 닉네임과 태그 영역 */}
        <div className={styles.profileNameSection}>
          <span className={styles.profileName}>김땡땡</span>
          <span className={styles.profileTag}>@simonisnextdoor</span>
        </div>

        <div className={styles.bioSection}>
          <p className={styles.bioText}>
            안녕하세요. 아름다운 바다 그림을 통해 많은 사람들에게 행복을 주고 싶은 크리에이터 김땡땡입니다.
          </p>
        </div>

        <div className={styles.contactSection}>
          <div className={styles.contactItem}>
            <img src="/src/assets/user/mail2.png" alt="mail" className={styles.contactIcon} />
            <span className={styles.contactText}>
              이메일 <span className={styles.contactValue}>asd123@naver.com</span>
            </span>
          </div>
          <div className={styles.contactItem}>
            <img src="/src/assets/user/instagram.png" alt="instagram" className={styles.contactIcon} />
            <span className={styles.contactText}>
              인스타그램 <span className={styles.contactValue}>@simonisnextdoor</span>
            </span>
          </div>
        </div>

        <div className={styles.actionButtons}>
          <button className={styles.actionButton}>거래 정보 등록하기</button>
          <button className={styles.actionButton}>멤버십 관리</button>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
