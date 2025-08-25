import useUserStore from "../../stores/userStore";
import styles from './userEditModal.module.css';
import cameraIcon from '@assets/user/camera.png';
import mailIcon from '@assets/user/mail2.png';
import instagramIcon from '@assets/user/instagram.png';

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
                backgroundImage: user.profileImageUrl ? `url(${user.profileImageUrl})` : 'none'
              }}
            />
            {/* 프로필 이미지가 있을 때는 카메라 아이콘을 숨김 */}
            {!user.profileImageUrl && (
              <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
            )}
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
            <img src={mailIcon} alt="mail" className={styles.contactIcon} />
            <span className={styles.editContactLabel}>이메일</span>
            <input 
              type="email" 
              className={styles.editContactInput}
              defaultValue=""
            />
          </div>
          <div className={styles.editContactItem}>
            <img src={instagramIcon} alt="instagram" className={styles.contactIcon} />
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