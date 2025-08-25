import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { updateContact, getUserContact, getCurrentUser } from "@/apis/user/user.js";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/user/userEdit.module.css";

export default function ContactEditPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  
  // 전시 정보 상태 (전시 업로드 페이지에서 넘어온 경우)
  const [exhibitionData, setExhibitionData] = useState(null);
  const [draft, setDraft] = useState(null);
  
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    emailUsername: "",
    emailDomain: "naver.com",
    customDomain: "",
    instagram: ""
  });

  // 컴포넌트 마운트 시 사용자 ID 가져오기 및 연락 정보 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 전시 정보가 있는지 확인 (전시 업로드 페이지에서 넘어온 경우)
        if (location.state?.draft) {
          console.log('ContactEditPage에서 받은 draft 데이터:', location.state.draft);
          setDraft(location.state.draft);
          setExhibitionData(location.state.draft.exhibitionData);
        } else if (location.state?.exhibitionData) {
          console.log('ContactEditPage에서 받은 전시 데이터:', location.state);
          setExhibitionData(location.state.exhibitionData);
        }
        
        // 현재 사용자 정보 조회하여 ID 가져오기
        const userResponse = await getCurrentUser();
        if (userResponse && userResponse.data && userResponse.data.userId) {
          const userId = userResponse.data.userId;
          setCurrentUserId(userId);
          
          // 연락 정보 조회
          const contactResponse = await getUserContact(userId);
          
          if (contactResponse && contactResponse.data) {
            const contactData = contactResponse.data;
            
            // 이메일 정보 설정
            if (contactData.email) {
              const [username, domain] = contactData.email.split('@');
              setFormData(prev => ({
                ...prev,
                emailUsername: username || "",
                emailDomain: domain || "naver.com"
              }));
            }
            
            // 인스타그램 정보 설정
            if (contactData.instagram) {
              setFormData(prev => ({
                ...prev,
                instagram: contactData.instagram
              }));
            }
          }
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
        // 에러 발생 시 기본값 유지
      }
    };
    
    fetchData();
  }, [location.state]);

  const handleCompleteClick = async () => {
    try {
      // 이메일 주소 조합
      const finalEmail = showCustomDomain 
        ? `${formData.emailUsername}@${formData.customDomain}`
        : `${formData.emailUsername}@${formData.emailDomain}`;

      // API로 연락 정보 전송
      const response = await updateContact({
        email: finalEmail,
        instagram: formData.instagram
      });

      // 편집 완료 후 전시 정보가 있으면 전시 업로드 페이지로, 없으면 프로필 페이지로 이동
      if (draft) {
        navigate('/exhibition/upload', {
          state: { 
            draft: draft,
            contactUpdated: true 
          }
        });
      } else if (location.state?.exhibitionData) {
        navigate('/exhibition/upload', {
          state: { 
            exhibitionData: location.state.exhibitionData,
            thumbnail: location.state.thumbnail,
            artworks: location.state.artworks,
            contactUpdated: true 
          }
        });
      } else {
        navigate('/user/profile');
      }
    } catch (error) {
      console.error('연락 정보 등록 실패:', error);
      alert('연락 정보 등록에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleBackClick = () => {
    // 전시 등록 페이지에서 이동한 경우 전시 업로드 페이지로, 아니면 프로필 페이지로 이동
    if (draft) {
      navigate('/exhibition/upload', {
        state: { 
          draft: draft,
          contactUpdated: false // 뒤로가기이므로 contactUpdated는 false
        }
      });
    } else if (location.state?.exhibitionData) {
      navigate('/exhibition/upload', {
        state: { 
          exhibitionData: location.state.exhibitionData,
          contactUpdated: false // 뒤로가기이므로 contactUpdated는 false
        }
      });
    } else {
      navigate('/user/profile');
    }
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
            <span className={styles.headerTitle}>연락 정보 등록하기</span>
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