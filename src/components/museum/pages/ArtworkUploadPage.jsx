import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useArtworkDraftStore from '@museum/services/artworkDraftStore';
import useArtworkStore from '@museum/services/artworkStore';
import useUserStore from '@/stores/userStore';
import ArtworkModal from '@museum/components/artwork/ArtworkModal';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png'; 
import styles from './artworkUploadPage.module.css';

export default function ArtworkUploadPage() {
  const navigate = useNavigate();
  const { saveDraft } = useArtworkDraftStore();
  const { addArtwork } = useArtworkStore();
  const { user } = useUserStore();
  
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

  const handleBack = () => {
    // 작성 중인 내용이 있으면 취소 모달 표시
    if (formData.title || formData.description || formData.mainImage || formData.detailImages.length > 0) {
      setModal({ isOpen: true, type: 'cancel' });
    } else {
      navigate('/artwork/my');
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
    
    let hasError = false;
    
    // 1순위: 메인 이미지 없음
    if (!formData.mainImage) {
      setErrorMessage('메인 이미지를 등록해주세요');
      hasError = true;
    }
    // 2순위: 작품 소개 500자 이상
    else if (formData.description && formData.description.length > 500) {
      setErrorMessage('작품 소개는 최대 500자까지만 가능해요');
      hasError = true;
    }
    // 3순위: 작품명 없음
    else if (!formData.title || !formData.title.trim()) {
      setErrorMessage('작품명을 작성해주세요');
      hasError = true;
    }
    // 4순위: 작품 소개 없음
    else if (!formData.description || !formData.description.trim()) {
      setErrorMessage('작품 소개를 작성해주세요');
      hasError = true;
    }
    
    setShowErrors(hasError);
    
    // 에러가 있으면 에러 메시지 표시
    if (hasError) {
      // 에러 메시지를 3초 후에 자동으로 숨기기
      setTimeout(() => {
        setShowErrors(false);
        setErrorMessage('');
      }, 3000);
      return;
    }
    
    // 등록 확인 모달 표시
    setModal({ isOpen: true, type: 'register' });
  };

  const handleRegisterConfirm = () => {
    // 실제 작품 등록 로직
    const newArtwork = {
      title: formData.title,
      description: formData.description,
      image: formData.mainImage ? URL.createObjectURL(formData.mainImage) : null,
      // 추가 정보들
      artistName: user.name,
      artistNickname: user.nickname,
      // 이미지 파일들 (실제 구현에서는 서버에 업로드 후 URL 사용)
      mainImage: formData.mainImage,
      detailImages: formData.detailImages.filter(img => img !== null)
    };
    
    // store에 작품 등록
    const registeredArtwork = addArtwork(newArtwork);
    console.log('작품 등록 완료:', registeredArtwork);
    
    // 등록 완료 모달 표시
    setModal({ isOpen: true, type: 'complete' });
  };

  const handleCompleteConfirm = () => {
    // 등록 완료시 모달 닫고 페이지 이동
    setModal({ isOpen: false, type: null });
    
    // 내 작품 페이지로 바로 이동
    navigate('/artwork/my');
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

  const handleSave = () => {
    // 수동 임시 저장
    saveDraft(formData);
    
    // 임시저장 완료 메시지 표시
    setErrorMessage('임시 저장이 완료되었어요');
    setShowErrors(true);
    
    // 메시지를 3초 후에 자동으로 숨기기
    setTimeout(() => {
      setShowErrors(false);
      setErrorMessage('');
    }, 3000);
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
                    {formData.mainImage ? (
                      <img 
                        src={URL.createObjectURL(formData.mainImage)} 
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
                      {formData.detailImages[index] ? (
                        <div className={styles.detailImagePreview}>
                          <img 
                            src={URL.createObjectURL(formData.detailImages[index])} 
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
            <button type="button" className={styles.featureButton}>
              VR 등록하기
            </button>
            <button 
              type="button" 
              className={`${styles.featureButton} ${
                user.email || user.nickname ? styles.contactRegistered : ''
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
