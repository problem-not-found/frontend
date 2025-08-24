import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../apis/user/user.js";
import styles from './userProfileHeader.module.css';

export default function UserProfileHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    code: '',
    profileImageUrl: null
  });
  
  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        console.log('UserProfileHeader - 사용자 API 응답:', response);
        
        if (response && response.data) {
          const userData = response.data;
          setUser({
            name: userData.nickname || '',
            code: userData.code || '',
            profileImageUrl: userData.profileImageUrl || null
          });
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleProfileClick = () => {
    navigate('/user/profile');
  };

  return (
    <div className={styles.profileHeader} onClick={handleProfileClick}>
      <div className={styles.profileInfo}>
        <div 
          className={styles.profileImage}
          style={{
            backgroundImage: user.profileImageUrl ? `url(${user.profileImageUrl})` : 'none'
          }}
        />
        <div className={styles.profileText}>
          <span className={styles.profileName}>{user.name}</span>
          {user.code && <span className={styles.profileId}>@{user.code}</span>}
        </div>
      </div>
    </div>
  );
}