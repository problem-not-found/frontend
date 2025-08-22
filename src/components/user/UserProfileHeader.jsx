import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/userStore";
import styles from './userProfileHeader.module.css';

export default function UserProfileHeader() {
  const navigate = useNavigate();
  const { user } = useUserStore();
  
  const handleProfileClick = () => {
    navigate('/user/profile');
  };

  return (
    <div className={styles.profileHeader} onClick={handleProfileClick}>
      <div className={styles.profileInfo}>
        <div 
          className={styles.profileImage}
          style={{
            backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none'
          }}
        />
        <div className={styles.profileText}>
          <span className={styles.profileName}>{user.name} </span>
          <span className={styles.profileId}>@{user.nickname}</span>  
        </div>
      </div>
    </div>
  );
}
