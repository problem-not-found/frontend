import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useUserStore from "@/stores/userStore";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/user/userEdit.module.css";

export default function ContactEditPage() {
  const navigate = useNavigate();
  const { user, updateUser, updateContactInfo } = useUserStore();
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    emailUsername: "",
    emailDomain: "naver.com",
    customDomain: "",
    instagram: ""
  });

  // 컴포넌트 마운트 시 사용자 정보로 초기화
  useEffect(() => {
    if (user.email) {
      const [username, domain] = user.email.split('@');
      setFormData(prev => ({
        ...prev,
        emailUsername: username || "",
        emailDomain: domain || "naver.com"
      }));
    }
    if (user.instagram) {
      setFormData(prev => ({
        ...prev,
        instagram: user.instagram
      }));
    }
  }, [user]);

  const handleCompleteClick = () => {
    // 이메일 주소 조합
    const finalEmail = showCustomDomain 
      ? `${formData.emailUsername}@${formData.customDomain}`
      : `${formData.emailUsername}@${formData.emailDomain}`;

    console.log('저장할 연락정보:', {
      email: finalEmail,
      instagram: formData.instagram
    });

    // userStore 업데이트
    updateUser({
      email: finalEmail,
      instagram: formData.instagram
    });

    // 연락정보 등록 상태 업데이트
    updateContactInfo({
      isRegistered: true
    });

    console.log('연락정보가 userStore에 저장되었습니다.');

    // 편집 완료 후 프로필 상세 페이지로 이동
    navigate('/user/profile');
  };

  const handleBackClick = () => {
    navigate('/user/profile');
  };

  // 입력 필드 변경 핸들러
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailUsernameChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, emailUsername: value }));
  };

  const handleEmailDomainChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomDomain(true);
    } else {
      setShowCustomDomain(false);
      setFormData(prev => ({ ...prev, emailDomain: value }));
    }
  };

  const handleCustomDomainChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, customDomain: value }));
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
            <span className={styles.headerTitle}>연락 정보 수정하기</span>
          </div>
          <button className={styles.completeButton} onClick={handleCompleteClick}>
            완료
          </button>
        </div>

        <div className={styles.editContactSection}>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/mail2.png" alt="mail" className={styles.contactIcon} />
            <span className={`${styles.editContactLabel} ${styles.email}`}>이메일</span>
            <div className={styles.emailInputContainer}>
              <input 
                type="text" 
                className={styles.emailUsernameInput}
                placeholder="아이디"
                value={formData.emailUsername}
                onChange={handleEmailUsernameChange}
              />
              <span className={styles.emailAt}>@</span>
              {showCustomDomain ? (
                <input 
                  type="text" 
                  className={styles.emailDomainInput}
                  placeholder="도메인 입력"
                  value={formData.customDomain}
                  onChange={handleCustomDomainChange}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setShowCustomDomain(false);
                    }
                  }}
                />
              ) : (
                <select 
                  className={styles.emailDomainSelect} 
                  value={formData.emailDomain}
                  onChange={handleEmailDomainChange}
                >
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="kakao.com">kakao.com</option>
                  <option value="hanmail.net">hanmail.net</option>
                  <option value="custom">직접입력</option>
                </select>
              )}
            </div>
          </div>
          <div className={styles.editContactItem}>
            <img src="/src/assets/user/instagram.png" alt="instagram" className={styles.contactIcon} />
            <span className={`${styles.editContactLabel} ${styles.instagram}`}>인스타그램</span>
            <input 
              type="text" 
              className={styles.editContactInput}
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <AppFooter />
    </div>
  );
}
