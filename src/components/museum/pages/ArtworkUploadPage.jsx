import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPiece } from '@apis/museum/artwork';
import { getCurrentUser } from '@apis/user/user';
import ArtworkModal from '@museum/components/artwork/ArtworkModal';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png'; 
import styles from './artworkUploadPage.module.css';

export default function ArtworkUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 전시 등록에서 넘어온 경우 draft 데이터 받기
  const draft = location.state?.draft;
  const fromExhibition = location.state?.fromExhibition;
  const isThumbnail = location.state?.isThumbnail;
  const isChangeMode = location.state?.isChangeMode;
  const returnTo = location.state?.returnTo;
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImage: null,
    detailImages: []
  });

  const [modal, setModal] = useState({
    isOpen: false,
    type: null
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationTimeout, setValidationTimeout] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState('');
  const [detailImageUrls, setDetailImageUrls] = useState([]);

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data);
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
        // 에러가 발생해도 페이지는 계속 사용할 수 있도록 함
      }
    };

    fetchUser();
  }, []);

  // 메인 이미지 URL 생성 및 정리
  useEffect(() => {
    if (formData.mainImage) {
      const url = URL.createObjectURL(formData.mainImage);
      setMainImageUrl(url);
      
      // 컴포넌트 언마운트 시 URL 정리
      return () => URL.revokeObjectURL(url);
    } else {
      setMainImageUrl('');
    }
  }, [formData.mainImage]);

  // 디테일 이미지 URL 생성 및 정리
  useEffect(() => {
    const urls = [];
    formData.detailImages.forEach((image, index) => {
      if (image) {
        const url = URL.createObjectURL(image);
        urls[index] = url;
      }
    });
    
    setDetailImageUrls(urls);
    
    // 컴포넌트 언마운트 시 모든 URL 정리
    return () => {
      urls.forEach(url => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [formData.detailImages]);

  // 입력 완료 후 1초 뒤에 에러 메시지만 숨기기
  useEffect(() => {
    if (validationTimeout) {
      clearTimeout(validationTimeout);
    }

    const timeout = setTimeout(() => {
      // 입력이 완료되면 에러 메시지 숨기기
      if (showErrors) {
        setShowErrors(false);
        setErrorMessage('');
      }
    }, 1000);

    setValidationTimeout(timeout);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [formData.title, formData.description, showErrors]);

  // 폼 검증 함수
  const validateForm = () => {
    let hasError = false;
    let errorMsg = '';
    
    // 1순위: 메인 이미지 없음
    if (!formData.mainImage) {
      errorMsg = '메인 이미지를 등록해주세요';
      hasError = true;
    }
    // 2순위: 작품 소개 500자 이상
    else if (formData.description && formData.description.length > 500) {
      errorMsg = '작품 소개는 최대 500자까지만 가능해요';
      hasError = true;
    }
    // 3순위: 작품명 없음
    else if (!formData.title || !formData.title.trim()) {
      errorMsg = '작품명을 작성해주세요';
      hasError = true;
    }
    // 4순위: 작품 소개 없음
    else if (!formData.description || !formData.description.trim()) {
      errorMsg = '작품 소개를 작성해주세요';
      hasError = true;
    }
    
    // 에러가 있을 때만 상태 업데이트
    if (hasError) {
      setErrorMessage(errorMsg);
      setShowErrors(true);
      
      // 에러 메시지를 3초 후에 자동으로 숨기기
      setTimeout(() => {
        setShowErrors(false);
        setErrorMessage('');
      }, 3000);
    }
    
    return hasError; // 에러 여부 반환
  };

  // 로컬 draft 저장소 (localStorage 사용)
  const saveDraft = (data) => {
    try {
      localStorage.setItem('artworkDraft', JSON.stringify(data));
      console.log('임시저장 완료:', data);
    } catch (error) {
      console.error('임시저장 실패:', error);
    }
  };

  const handleBack = () => {
    // 작성 중인 내용이 있으면 취소 모달 표시
    if (formData.title || formData.description || formData.mainImage || formData.detailImages.length > 0) {
      setModal({ isOpen: true, type: 'cancel' });
    } else {
      // 전시 등록에서 넘어온 경우 draft 데이터와 함께 돌아가기
      if (fromExhibition && returnTo === 'exhibition-upload') {
        navigate('/exhibition/upload', {
          state: { draft: draft }
        });
      } else {
        navigate('/artwork/my');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        mainImage: file
      }));
    }
  };

  const handleDetailImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => {
        const newDetailImages = [...prev.detailImages];
        newDetailImages[index] = file;
        return {
          ...prev,
          detailImages: newDetailImages
        };
      });
    }
  };

  const removeDetailImage = (index) => {
    setFormData(prev => {
      const newDetailImages = [...prev.detailImages];
      newDetailImages[index] = null;
      return {
        ...prev,
        detailImages: newDetailImages.filter(img => img !== null)
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 즉시 검증 실행하고 에러 여부 확인
    const hasError = validateForm();
    
    // 에러가 있으면 제출 중단
    if (hasError) {
      return;
    }
    
    // 등록 확인 모달 표시
    setModal({ isOpen: true, type: 'register' });
  };

  const handleRegisterConfirm = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // API를 사용하여 작품 등록
      const response = await createPiece(formData, 'APPLICATION');
      
      if (response?.success === true && (response?.code === 200 || response?.code === 201)) {
        console.log('작품 등록 완료:', response.data);
        
        // 등록 완료 모달 표시
        setModal({ isOpen: true, type: 'complete' });
      } else {
        throw new Error('작품 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('작품 등록 실패:', error);
      setErrorMessage('작품 등록에 실패했습니다. 다시 시도해주세요.');
      setShowErrors(true);
      
      // 에러 메시지를 3초 후에 자동으로 숨기기
      setTimeout(() => {
        setShowErrors(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteConfirm = () => {
    // 등록 완료시 모달 닫고 페이지 이동
    setModal({ isOpen: false, type: null });
    
    // 전시 등록에서 넘어온 경우 draft 데이터와 함께 돌아가기
    if (fromExhibition && returnTo === 'exhibition-upload') {
      navigate('/exhibition/upload', {
        state: { draft: draft }
      });
    } else {
      // 내 작품 페이지로 바로 이동
      navigate('/artwork/my');
    }
  };

  const handleCancelConfirm = () => {
    // 임시 저장 후 페이지 나가기
    saveDraft(formData);
    navigate('/artwork/my');
  };

  const handleCancelModal = () => {
    // 작성 취소 (임시저장 없이 나가기)
    navigate('/artwork/my');
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: null });
  };

  const handleSave = async () => {
    // 임시저장 중이면 중단
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // API를 사용하여 임시저장 (DRAFT)
      const response = await createPiece(formData, 'DRAFT');
      
      if (response?.success === true && (response?.code === 200 || response?.code === 201)) {
        console.log('임시저장 완료:', response.data);
        
        // 로컬 draft도 업데이트
        saveDraft(formData);
        
        // 임시저장 완료 메시지 표시
        setErrorMessage('임시 저장이 완료되었어요');
        setShowErrors(true);
        
        // 메시지를 3초 후에 자동으로 숨기기
        setTimeout(() => {
          setShowErrors(false);
          setErrorMessage('');
        }, 3000);
      } else {
        throw new Error('임시저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('임시저장 실패:', error);
      setErrorMessage('임시저장에 실패했습니다. 다시 시도해주세요.');
      setShowErrors(true);
      
      // 에러 메시지를 3초 후에 자동으로 숨기기
      setTimeout(() => {
        setShowErrors(false);
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>

      <div className={styles.container}>
        {/* 헤더 */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={chevronLeft} alt="back" className={styles.backIcon} />
            </button>
            <h1 className={styles.title}>작품 등록하기</h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.saveButton} onClick={handleSave}>
              저장
            </button>
          </div>
        </div>

        {/* 등록 폼 */}
        <form id="artworkForm" onSubmit={handleSubmit} className={styles.form}>
          {/* 이미지 업로드 섹션 */}
          <div className={styles.imageSection}>
            <div className={styles.imageSlideContainer}>
              {/* 메인 이미지 슬라이드 */}
              <div className={styles.imageSlide}>
                <div className={styles.imageUploadBox}>
                  <div className={styles.imageTag}>메인 이미지</div>
                                     <label htmlFor="mainImage" className={styles.imageLabel}>
                     {mainImageUrl ? (
                       <img 
                         src={mainImageUrl} 
                         alt="메인 이미지" 
                         className={styles.previewImage}
                       />
                     ) : (
                       <div className={styles.imagePlaceholder}>
                         <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
                         <p className={styles.placeholderText}>
                           작품 사진을 등록해주세요<br />
                           (필수)
                         </p>
                       </div>
                     )}
                   </label>
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    className={styles.imageInput}
                  />
                </div>
              </div>

              {/* 디테일 이미지 슬라이드 (최대 5개) */}
              {[...Array(5)].map((_, index) => (
                <div key={index} className={styles.imageSlide}>
                  <div className={styles.imageUploadBox}>
                    <div className={styles.detailTag}>디테일 컷{index + 1}</div>
                    
                                         <label htmlFor={`detailImage${index}`} className={styles.imageLabel}>
                       {detailImageUrls[index] ? (
                         <div className={styles.detailImagePreview}>
                           <img 
                             src={detailImageUrls[index]} 
                             alt={`디테일 이미지 ${index + 1}`} 
                             className={styles.previewImage}
                           />
                           <button 
                             type="button"
                             onClick={(e) => {
                               e.preventDefault();
                               removeDetailImage(index);
                             }}
                             className={styles.removeImageButton}
                           >
                             ×
                           </button>
                         </div>
                       ) : (
                         <div className={styles.imagePlaceholder}>
                           <img src={plusCircleIcon} alt="plus" className={styles.plusCircleIcon} />
                           <p className={styles.placeholderText}>
                             디테일 컷을 추가해보세요<br />
                             (최대 5장)
                           </p>
                         </div>
                       )}
                     </label>
                    
                    <input
                      type="file"
                      id={`detailImage${index}`}
                      accept="image/*"
                      onChange={(e) => handleDetailImageChange(e, index)}
                      className={styles.imageInput}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 작품명 입력 */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="작품명을 작성하세요"
              className={styles.titleInput}
            />
          </div>

          {/* 작품 소개 입력 */}
          <div className={styles.inputGroup}>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="작품 소개를 작성하세요. (최대 500자)"
              className={styles.descriptionInput}
              rows={15}
              maxLength={500}
            />
          </div>

          {/* 추가 기능 버튼들 */}
          <div className={styles.additionalFeatures}>
            <button 
              type="button" 
              className={`${styles.featureButton} ${
                user?.email || user?.nickname ? styles.contactRegistered : ''
              }`}
            >
              연락 정보 등록하기
            </button>
          </div>

        </form>
        
        {/* 등록하기 버튼 (고정 위치) */}
        <div className={styles.submitButtonContainer}>
          <button type="submit" form="artworkForm" className={styles.submitButton}>
            작품 등록하기
          </button>
        </div>

        {/* 에러 메시지 컨테이너 (고정 위치) */}
        {showErrors && (
          <div className={styles.errorContainer}>
            <div className={styles.errorMessageBox}>
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <ArtworkModal
        type={modal.type}
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={
          modal.type === 'register' ? handleRegisterConfirm :
          modal.type === 'complete' ? handleCompleteConfirm :
          modal.type === 'cancel' ? handleCancelConfirm :
          closeModal
        }
        onCancel={
          modal.type === 'register' ? closeModal :
          modal.type === 'cancel' ? handleCancelModal :
          undefined
        }
      />
    </div>
  );
}
