import { useNavigate } from "react-router-dom";
import useUserStore from "../stores/userStore";
import AppFooter from "../components/footer/AppFooter";
import styles from "../components/user/userEdit.module.css";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleCompleteClick = () => {
    // 편집 완료 후 프로필 상세 페이지로 이동
    navigate('/user/profile');
  };

  const handleBackClick = () => {
    navigate('/user/profile');
  };

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 프로필 사진과 완료 버튼 영역 */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileDetailImage}>
            <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
          </div>
          <button className={styles.completeButton} onClick={handleCompleteClick}>
            완료
          </button>
        </div>

        {/* 닉네임 영역 */}
        <div className={styles.editFieldContainer}>
          <label className={styles.editLabel}>닉네임</label>
          <div className={styles.editInputContainer}>
            <input 
              type="text" 
              className={styles.editInput} 
              defaultValue="김땡땡  "
            />
          </div>
        </div>

        {/* 아이디 영역 */}
        <div className={styles.editFieldContainer}>
          <label className={styles.editLabel}>아이디</label>
          <div className={styles.editInputContainer}>
            <input 
              type="text" 
              className={styles.editInput} 
              defaultValue="simonisnextdoor"
            />
          </div>
        </div>

        {/* 자기소개 영역 */}
        <div className={styles.editBioSection}>
          <textarea 
            className={styles.editBioInput}
            placeholder="자기소개를 등록하세요(최대 50자)"
            defaultValue=""
          />
        </div>

        <div className={styles.editContactSection}>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/mail2.png" alt="mail" className={styles.contactIcon} />
            <span className={styles.editContactLabel}>이메일</span>
            <input 
              type="email" 
              className={styles.editContactInput}
              defaultValue={user.email}
            />
          </div>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/instagram.png" alt="instagram" className={styles.contactIcon} />
            <span className={styles.editContactLabel}>인스타그램</span>
            <input 
              type="text" 
              className={styles.editContactInput}
              defaultValue={user.nickname}
            />
          </div>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
