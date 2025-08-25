import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, updateUserProfile, updateUserProfileImage, checkUserCode } from "@/apis/user/user.js";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/user/userEdit.module.css";
import backIcon from "@/assets/user/chevron-left.png";
import cameraIcon from "@/assets/user/camera.png";

export default function UserEditPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState({
    id: null,
    name: '',
    nickname: '',
    introduction: '',
    profileImageUrl: null,
    code: null
  });
  const [userId, setUserId] = useState('');
  const [userIdStatus, setUserIdStatus] = useState("available");
  const [userIdMessage, setUserIdMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    name: '',
    nickname: '', 
    introduction: ''
  });

  // 이미지 선택 핸들러
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 핸들러
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택할 수 있습니다.');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB 제한
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      setSelectedImage(file);
      
      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteClick = async () => {
    // 아이디 유효성 검사
    if (userIdStatus !== "available") {
      alert('사용할 수 없는 아이디입니다. 다른 아이디를 입력해주세요.');
      return;
    }

    try {
      // 프로필 이미지 업데이트 (이미지가 선택된 경우)
      if (selectedImage) {
        try {
          const imageResponse = await updateUserProfileImage(selectedImage);
        } catch (error) {
          console.error('프로필 이미지 업데이트 실패:', error);
          console.error('에러 상세 정보:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          alert(`프로필 이미지 업데이트에 실패했습니다.\n에러: ${error.message}`);
        }
      }

      // API로 사용자 정보 업데이트
      const response = await updateUserProfile({
        nickname: formData.name,        // 닉네임
        code: formData.nickname,        // 아이디 (code)
        introduction: formData.introduction  // 자기소개
      });

      // 편집 완료 후 프로필 상세 페이지로 이동
      navigate('/user/profile');
    } catch (error) {
      console.error('사용자 정보 업데이트 실패:', error);
      alert('프로필 수정에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBackClick = () => {
    navigate('/user/profile');
  };

  // 아이디 중복 체크 함수 (API 호출)
  const checkUserIdAvailability = useCallback(async (id) => {
    if (id.length < 3) {
      setUserIdStatus("idle");
      setUserIdMessage("");
      return;
    }

    if (id.length > 15) {
      setUserIdStatus("unavailable");
      setUserIdMessage("3~15자 이내로 입력해주세요");
      return;
    }

    // 특수문자 체크 (영문, 숫자, 언더스코어, 점, 하이픈 허용)
    const codeRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!codeRegex.test(id)) {
      setUserIdStatus("unavailable");
      setUserIdMessage("사용할 수 없는 특수문자가 포함되어 있습니다");
      return;
    }

    // 현재 사용자의 code와 동일한 경우 중복 체크 건너뛰기
    if (id === user.code) {
      setUserIdStatus("available");
      setUserIdMessage("현재 사용 중인 아이디입니다");
      return;
    }

    setUserIdStatus("checking");
    setUserIdMessage("확인 중...");

    try {
      const response = await checkUserCode(id);
      if (response && response.data !== undefined) {
        // API 응답: data가 true면 중복, false면 사용 가능
        if (response.data === false) {
          setUserIdStatus("available");
          setUserIdMessage("사용 가능한 아이디입니다");
        } else {
          setUserIdStatus("unavailable");
          setUserIdMessage("이미 사용 중인 아이디입니다");
        }
      }
    } catch (error) {
      console.error('아이디 중복 확인 실패:', error);
      setUserIdStatus("error");
      setUserIdMessage("확인 중 오류가 발생했습니다");
    }
  }, [user.code]);

  const handleUserIdChange = (e) => {
    const newUserId = e.target.value;
    setUserId(newUserId);
    setFormData(prev => ({ ...prev, nickname: newUserId }));
    
    // 디바운싱을 위한 타이머 (1.3초 후 요청)
    clearTimeout(window.userIdCheckTimer);
    window.userIdCheckTimer = setTimeout(() => {
      checkUserIdAvailability(newUserId); 
    }, 1300);
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // 컴포넌트 마운트 시 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await getCurrentUser();
        console.log('사용자 정보 API 응답:', userResponse);
        
        if (userResponse && userResponse.data && userResponse.data.data) {
          const userData = userResponse.data.data;
          console.log('UserEditPage 파싱된 사용자 데이터:', userData);
          setUser({
            nickname: userData.nickname || "",
            code: userData.code || "",
            introduction: userData.introduction || "",
            profileImageUrl: userData.profileImageUrl || null,
          });
          setOriginalUser({
            nickname: userData.nickname || "",
            code: userData.code || "",
            introduction: userData.introduction || "",
            profileImageUrl: userData.profileImageUrl || null,
          });
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      }
    };
    
    fetchUserData();
  }, []);

  useEffect(() => {
    // 초기 아이디 체크
    if (userId) {
      checkUserIdAvailability(userId);
    }
  }, [checkUserIdAvailability, userId]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* 상단 헤더 영역 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBackClick}>
              <img src={backIcon} alt="back" className={styles.backIcon} />
            </button>
            <span className={styles.headerTitle}>프로필 편집</span>
          </div>
          <button className={styles.completeButton} onClick={handleCompleteClick}>
            완료
          </button>
        </div>

        {/* 프로필 사진 영역 */}
        <div className={styles.profileImageSection}>
          <div className={styles.profileImageContainer}>
            <div 
              className={styles.profileImage}
              style={{
                backgroundImage: user.profileImageUrl ? `url(${user.profileImageUrl})` : 'none'
              }}
              onClick={handleImageClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleImageClick();
                }
              }}
            />
            {/* 프로필 이미지가 있을 때는 카메라 아이콘을 숨김 */}
            {!user.profileImageUrl && (
              <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
            )}

            {/* 숨겨진 파일 입력 */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
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
            userIdStatus === 'checking' ? styles.messageChecking :
            userIdStatus === 'error' ? styles.messageError :
            userIdStatus === 'idle' ? styles.messageIdle : ''
          }`}>
            {userIdMessage}
          </div>
        )}

        {/* 자기소개 영역 */}
        <div className={styles.editBioSection}>
          <textarea 
            className={styles.editBioInput}
            placeholder="자기소개를 등록하세요(최대 50자)"
            value={formData.introduction}
            onChange={(e) => handleInputChange('introduction', e.target.value)}
          />
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}