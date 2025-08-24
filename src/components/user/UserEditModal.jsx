import useUserStore from "../../stores/userStore";
import styles from './userEditModal.module.css';

export default function UserEditModal({ isOpen, onClose }) {
  const { user } = useUserStore();

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editHeader}>
          <div className={styles.editProfileImage}>
            <div 
              className={styles.editProfileImageContainer}
              style={{
                backgroundImage: user.profileImage ? `url(/src/assets/user/camera.png)` : `url(/src/assets/user/camera.png)`
              }}
            />
            <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
          </div>
          
          <div className={styles.editFields}>
            <div className={styles.editField}>  
              <label className={styles.editLabel}>닉네임</label>
              <input 
                type="text" 
                className={styles.editInput} 
                defaultValue={user.name}
              />
            </div>
            <div className={styles.editField}>
              <label className={styles.editLabel}>아이디</label>
              <input 
                type="text" 
                className={styles.editInput} 
                defaultValue={user.nickname}
              />
            </div>
          </div>
          
          <button className={styles.completeButton} onClick={onClose}>완료</button>
        </div>

        <div className={styles.editBioSection}>
          <textarea 
            className={styles.editBioInput}
            placeholder="자기소개를 등록하세요"
          />
        </div>

        <div className={styles.editContactSection}>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/mail2.png" alt="mail" className={styles.contactIcon} />
            <span className={styles.editContactLabel}>이메일</span>
            <input 
              type="email" 
              className={styles.editContactInput}
              defaultValue=""
            />
          </div>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/instagram.png" alt="instagram" className={styles.contactIcon} />
            <span className={styles.editContactLabel}>인스타그램</span>
            <input 
              type="text" 
              className={styles.editContactInput}
              defaultValue=""
            />
          </div>
        </div>
      </div>
    </div>
  );
}
