import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/user/userEdit.module.css";

export default function UserEditPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useUserStore();
  const [userId, setUserId] = useState(user.nickname || "simonisnextdoor");
  const [userIdStatus, setUserIdStatus] = useState("available");
  const [userIdMessage, setUserIdMessage] = useState("");
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: user.name || "김땡땡",
    nickname: user.nickname || "simonisnextdoor", 
    bio: ""
  });

  const handleCompleteClick = () => {
    // userStore 업데이트
    updateUser({
      name: formData.name,
      nickname: formData.nickname,
      bio: formData.bio
    });

    // 편집 완료 후 프로필 상세 페이지로 이동
    navigate('/user/profile');
  };

  const handleBackClick = () => {
    navigate('/user/profile');
  };

  // 아이디 중복 체크 함수 (실제로는 API 호출)
  const checkUserIdAvailability = useCallback(async (id) => {
    if (id.length < 3) {
      setUserIdStatus("idle");
      setUserIdMessage("");
      return;
    }

    setUserIdStatus("checking");
    setUserIdMessage("확인 중...");

    // 실제 구현에서는 API 호출
    setTimeout(() => {
      // 임시 로직: 특정 아이디들을 이미 사용 중으로 설정
      const unavailableIds = ["admin", "test", "user", "guest"];
      
      if (unavailableIds.includes(id.toLowerCase())) {
        setUserIdStatus("unavailable");
        setUserIdMessage("이미 사용 중인 아이디입니다");
      } else {
        setUserIdStatus("available");
        setUserIdMessage("사용 가능한 아이디입니다");
      }
    }, 1000);
  }, []);

  const handleUserIdChange = (e) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    setFormData(prev => ({ ...prev, nickname: newUserId }));
    
    // 디바운싱을 위한 타이머
    clearTimeout(window.userIdCheckTimer);
    window.userIdCheckTimer = setTimeout(() => {
      checkUserIdAvailability(newUserId);
    }, 500);
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    // 초기 아이디 체크
    checkUserIdAvailability(userId);
  }, [checkUserIdAvailability, userId]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 상단 헤더 영역 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBackClick}>
              <img src="/src/assets/user/chevron-left.png" alt="back" className={styles.backIcon} />
            </button>
            <span className={styles.headerTitle}>프로필 수정하기</span>
          </div>
          <button className={styles.completeButton} onClick={handleCompleteClick}>
            완료
          </button>
        </div>

        {/* 프로필 사진 영역 */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileDetailImage}>
            <img src="/src/assets/user/camera.png" alt="camera" className={styles.cameraIcon} />
          </div>
        </div>

        {/* 닉네임 영역 */}
        <div className={styles.editFieldContainer}>
          <label className={styles.editLabel}>닉네임</label>
          <div className={styles.editInputContainer}>
            <input 
              type="text" 
              className={styles.editInput} 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
        </div>

        {/* 아이디 영역 */}
        <div className={styles.editFieldContainer}>
          <label className={styles.editLabel}>아이디</label>
          <div className={styles.editInputContainer}>
            <input 
              type="text" 
              className={`${styles.editInput} ${
                userIdStatus === 'available' ? styles.inputAvailable : 
                userIdStatus === 'unavailable' ? styles.inputUnavailable : ''
              }`}
              value={userId}
              onChange={handleUserIdChange}
            />
          </div>
        </div>

        {/* 아이디 상태 메시지 */}
        {userIdMessage && (
          <div className={`${styles.userIdMessage} ${
            userIdStatus === 'available' ? styles.messageAvailable : 
            userIdStatus === 'unavailable' ? styles.messageUnavailable :
            userIdStatus === 'checking' ? styles.messageChecking : ''
          }`}>
            {userIdMessage}
          </div>
        )}

        {/* 자기소개 영역 */}
        <div className={styles.editBioSection}>
          <textarea 
            className={styles.editBioInput}
            placeholder="자기소개를 등록하세요(최대 50자)"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
          />
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
