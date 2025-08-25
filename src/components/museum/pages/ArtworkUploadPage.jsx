import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { createPiece, updatePiece } from '@apis/museum/artwork';
import { getCurrentUser, getUserContact } from '@apis/user/user';
import { getPieceDetail } from '@apis/exhibition/exhibition';
import ArtworkModal from '@museum/components/artwork/ArtworkModal';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png'; 
import styles from './artworkUploadPage.module.css';

export default function ArtworkUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // URL에서 작품 ID 가져오기\
  
  // 전시 등록에서 넘어온 경우 draft 데이터 받기
  const draft = location.state?.draft;
  const fromExhibition = location.state?.fromExhibition;
  const isThumbnail = location.state?.isThumbnail;
  const isChangeMode = location.state?.isChangeMode;
  const returnTo = location.state?.returnTo;
  const artworkId = id || location.state?.artworkId; // URL 파라미터 우선, 없으면 state에서 가져오기
  const isDraft = location.state?.isDraft; // 임시저장 작품인지 여부
  const fromDraft = location.state?.fromDraft; // 임시저장 페이지에서 왔는지 여부
  
  // 디버깅 로그 추가
  console.log('🔍 ArtworkUploadPage 변수들:', { 
    artworkId, 
    isEditMode: !!artworkId,
    id,
    locationState: location.state 
  });

  const [user, setUser] = useState(null);
  const [userContact, setUserContact] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mainImage: null,
    detailImages: [],
    isPurchasable: true
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
  const [isLoading, setIsLoading] = useState(false);
  const [originalDetailImageIds, setOriginalDetailImageIds] = useState([]); // 기존 디테일 이미지 ID들

  // 수정 모드인지 확인
  const isEditMode = !!artworkId;

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getCurrentUser();
        const userData = userResponse.data;
        setUser(userData);
        
        // userId가 있으면 연락 정보 조회
        if (userData?.userId) {
          try {
            const contactResponse = await getUserContact(userData.userId);
            if (contactResponse) {
              setUserContact(contactResponse.data);
            }
          } catch (contactError) {
            console.error('연락 정보 조회 실패:', contactError);
            // 연락 정보 조회 실패 시에도 기본 사용자 정보는 유지
          }
        }
      } catch (error) {
        console.error('유저 정보 조회 실패:', error);
        // 에러가 발생해도 페이지는 계속 사용할 수 있도록 함
      }
    };

    fetchUser();
  }, []);

  // 수정 모드일 때 기존 작품 데이터 불러오기
  useEffect(() => {
    if (isEditMode && artworkId) {
      const fetchArtwork = async () => {
        setIsLoading(true);
        try {
          const response = await getPieceDetail(artworkId);
          const artwork = response.data?.data || response.data;
          
          if (artwork) {
            setFormData({
              title: artwork.title || '',
              description: artwork.description || '',
              mainImage: null, // 기존 이미지는 URL로 표시
              detailImages: [],
              isPurchasable: artwork.isPurchasable || true // 기존 작품의 구매 가능 여부 설정
            });
            
            // 기존 이미지 URL 설정
            if (artwork.imageUrl) {
              setMainImageUrl(artwork.imageUrl);
            }
            
            // 디테일 이미지가 있다면 설정
            if (artwork.pieceDetails && artwork.pieceDetails.length > 0) {
              console.log('디테일 이미지 데이터:', artwork.pieceDetails);
              const urls = artwork.pieceDetails.map(img => img.imageUrl || img);
              console.log('디테일 이미지 URL들:', urls);
              setDetailImageUrls(urls);
              // pieceDetailId를 사용하여 기존 디테일 이미지 ID 저장
              const detailIds = artwork.pieceDetails.map(img => img.pieceDetailId || img.id);
              console.log('디테일 이미지 ID들:', detailIds);
              setOriginalDetailImageIds(detailIds.filter(id => id)); // null/undefined 제거
            } else {
              console.log('디테일 이미지가 없습니다');
            }
          }
        } catch (error) {
          console.error('작품 정보 조회 실패:', error);
          setErrorMessage('작품 정보를 불러올 수 없습니다.');
          setShowErrors(true);
        } finally {
          setIsLoading(false);
        }
      };

      fetchArtwork();
    }
  }, [isEditMode, artworkId]);

  // 메인 이미지 URL 생성 및 정리
  useEffect(() => {
    if (formData.mainImage) {
      const url = URL.createObjectURL(formData.mainImage);
      setMainImageUrl(url);
      
      // 컴포넌트 언마운트 시 URL 정리
      return () => URL.revokeObjectURL(url);
    }
    // 수정 모드에서는 기존 이미지 URL을 유지
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
    
    setDetailImageUrls(prev => {
      const newUrls = [...prev];
      urls.forEach((url, index) => {
        if (url) newUrls[index] = url;
      });
      return newUrls;
    });
    
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
    
    // 입력 완성도 확인
    const hasMainImage = formData.mainImage || mainImageUrl;
    const hasTitle = formData.title && formData.title.trim();
    const hasDescription = formData.description && formData.description.trim();
    
    // 모든 필수 항목이 완성되었는지 확인
    const isComplete = hasMainImage && hasTitle && hasDescription;
    
    // 1순위: 메인 이미지 없음 (수정 모드에서는 기존 이미지가 있으면 OK)
    if (!hasMainImage) {
      errorMsg = '메인 이미지를 등록해주세요';
      hasError = true;
    }
    // 2순위: 작품 소개 500자 이상
    else if (formData.description && formData.description.length > 500) {
      errorMsg = '작품 소개는 최대 500자까지만 가능해요';
      hasError = true;
    }
    // 3순위: 작품명 없음
    else if (!hasTitle) {
      errorMsg = '작품명을 작성해주세요';
      hasError = true;
    }
    // 4순위: 작품 소개 없음
    else if (!hasDescription) {
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

  // 모달 상태 변화 추적
  useEffect(() => {
    console.log('모달 상태 변경됨:', modal);
  }, [modal]);

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
      } else if (fromDraft) {
        // 임시저장 페이지에서 왔을 경우 임시저장 페이지로 돌아가기
        navigate('/artwork/drafts');
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
      
      // 새로운 디테일컷을 추가한 경우, 해당 인덱스를 originalDetailImageIds에서 제거
      // (새 파일이므로 기존 ID가 아님)
      if (originalDetailImageIds[index]) {
        setOriginalDetailImageIds(prev => {
          const newIds = [...prev];
          newIds[index] = null; // 해당 인덱스의 기존 ID 제거
          return newIds;
        });
      }
    }
  };

  const removeDetailImage = (index) => {
    setFormData(prev => {
      const newDetailImages = [...prev.detailImages];
      newDetailImages[index] = null;
      return {
        ...prev,
        detailImages: newDetailImages
      };
    });
    
    // detailImageUrls 상태도 함께 업데이트
    setDetailImageUrls(prev => {
      const newUrls = [...prev];
      newUrls[index] = null;
      return newUrls;
    });
    
    // 기존 디테일컷을 삭제한 경우 originalDetailImageIds에서도 제거
    if (detailImageUrls[index] && !detailImageUrls[index].startsWith('blob:')) {
      // blob: URL이 아닌 경우 (기존 S3 이미지)
      setOriginalDetailImageIds(prev => {
        const newIds = [...prev];
        newIds[index] = null;
        return newIds;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 즉시 검증 실행하고 에러 여부 확인
    const hasError = validateForm();
    
    // 에러가 있으면 제출 중단
    if (hasError) {
      return;
    }
    
    // 모든 필수 항목이 완성된 경우 - 등록/수정 확인 모달
    setModal({ isOpen: true, type: isEditMode ? 'edit' : 'register' });
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

  const handleEditConfirm = async () => {
    if (isSubmitting) return;
    
    console.log('handleEditConfirm 시작 - 현재 모달 상태:', modal);
    console.log('기존 디테일컷 ID들:', originalDetailImageIds);
    console.log('새로 추가할 디테일컷들:', formData.detailImages);
    
    setIsSubmitting(true);
    
    try {
      // 폼 완성도에 따라 saveStatus 결정
      const hasMainImage = formData.mainImage || mainImageUrl;
      const hasTitle = formData.title && formData.title.trim();
      const hasDescription = formData.description && formData.description.trim();
      const isComplete = hasMainImage && hasTitle && hasDescription;
      
      const saveStatus = isComplete ? 'APPLICATION' : 'DRAFT';
      console.log('결정된 saveStatus:', saveStatus);
      
      // remainPieceDetailIds: 기존 디테일컷 중에서 유지할 이미지의 ID들
      // (새로운 이미지로 교체하지 않고 기존에 남겨둘 이미지들)
      const remainPieceDetailIds = originalDetailImageIds.filter(id => id !== null);
      console.log('유지할 기존 디테일컷 ID들:', remainPieceDetailIds);
      
      // 작품 수정 API 호출 (기존 이미지 유지 + 새로운 이미지 추가)
      const response = await updatePiece(artworkId, formData, saveStatus, remainPieceDetailIds);
      
      if (response?.success === true && (response?.code === 200 || response?.code === 201)) {
        console.log('작품 수정 완료:', response.data);
        console.log('API 성공 후 현재 모달 상태:', modal);
        console.log('complete 모달을 표시합니다...');
        
        // 수정 완료 모달 표시
        setModal({ isOpen: true, type: 'complete' });
        console.log('setModal 호출 완료 - 새로운 상태: { isOpen: true, type: "complete" }');
        
        // 즉시 상태 확인 (비동기 업데이트 확인용)
        setTimeout(() => {
          console.log('setTimeout 후 모달 상태:', modal);
        }, 0);
      } else {
        throw new Error('작품 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('작품 수정 실패:', error);
      setErrorMessage('작품 수정에 실패했습니다. 다시 시도해주세요.');
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
    console.log('handleCompleteConfirm 호출됨 - 완료 모달 확인 버튼 클릭');
    
    // 등록/수정 완료시 모달 닫고 페이지 이동
    setModal({ isOpen: false, type: null });
    console.log('모달 닫힘, 내 작품 페이지로 이동합니다...');
    
    // 전시 등록에서 넘어온 경우 draft 데이터와 함께 돌아가기
    if (fromExhibition && returnTo === 'exhibition-upload') {
      navigate('/exhibition/upload', {
        state: { draft: draft }
      });
    } else if (fromDraft) {
      // 임시저장 페이지에서 왔을 경우 임시저장 페이지로 돌아가기
      navigate('/artwork/drafts');
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
    
    // 입력값이 1개 이상 있는지 확인
    const hasMainImage = formData.mainImage || mainImageUrl;
    const hasTitle = formData.title && formData.title.trim();
    const hasDescription = formData.description && formData.description.trim();
    
    if (!hasMainImage && !hasTitle && !hasDescription) {
      setErrorMessage('임시저장할 내용이 없습니다.');
      setShowErrors(true);
      
      setTimeout(() => {
        setShowErrors(false);
        setErrorMessage('');
      }, 3000);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        // 수정 모드: updatePiece API 호출 (DRAFT)
        // remainPieceDetailIds: 기존 디테일컷 중에서 유지할 이미지의 ID들
        const remainPieceDetailIds = originalDetailImageIds.filter(id => id !== null);
        console.log('임시저장 시 유지할 기존 디테일컷 ID들:', remainPieceDetailIds);
        
        const response = await updatePiece(artworkId, formData, 'DRAFT', remainPieceDetailIds);
        
        if (response?.success === true && (response?.code === 200 || response?.code === 201)) {
          console.log('작품 임시저장 완료:', response.data);
          setErrorMessage('임시저장이 완료되었어요');
          setShowErrors(true);
          
          // 3초 후 에러 메시지 숨기기
          setTimeout(() => {
            setShowErrors(false);
            setErrorMessage('');
          }, 3000);
        } else {
          throw new Error('작품 임시저장에 실패했습니다.');
        }
      } else {
        // 등록 모드: createPiece API 호출 (DRAFT)
        const response = await createPiece(formData, 'DRAFT');
        
        if (response?.success === true && (response?.code === 200 || response?.code === 201)) {
          console.log('작품 임시저장 완료:', response.data);
          setErrorMessage('임시저장이 완료되었어요');
          setShowErrors(true);
          
          // 3초 후 에러 메시지 숨기기
          setTimeout(() => {
            setShowErrors(false);
            setErrorMessage('');
          }, 3000);
        } else {
          throw new Error('작품 임시저장에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error('작품 임시저장 실패:', error);
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

  const handleContactRegistration = () => {
    // 연락 정보 등록 페이지로 이동
    navigate('/user/contact', {
      state: { 
        returnTo: isEditMode ? `/artwork/edit/${artworkId}` : '/artwork/upload',
        fromArtwork: true
      }
    });
  };

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <div className={styles.page}>
        <div style={{height: '54px'}}></div>
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <button className={styles.backButton} onClick={handleBack}>
                <img src={chevronLeft} alt="back" className={styles.backIcon} />
              </button>
              <h1 className={styles.title}>{isEditMode ? '작품 수정하기' : '작품 등록하기'}</h1>
            </div>
          </div>
          <div style={{textAlign: 'center', padding: '50px'}}>
            작품 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className={styles.title}>{isEditMode ? '작품 수정하기' : '작품 등록하기'}</h1>
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
                      {detailImageUrls[index] && detailImageUrls[index] !== null ? (
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
                userContact?.email || userContact?.instagram ? styles.contactRegistered : ''
              }`}
              onClick={handleContactRegistration}
            >
              {userContact?.email || userContact?.instagram ? '연락 정보 등록됨' : '연락 정보 등록하기'}
            </button>
          </div>

        </form>
        
        {/* 등록/수정하기 버튼 (고정 위치) */}
        <div className={styles.submitButtonContainer}>
          <button type="submit" form="artworkForm" className={styles.submitButton}>
            {isEditMode ? '작품 수정하기' : '작품 등록하기'}
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
          modal.type === 'edit' ? handleEditConfirm :
          modal.type === 'complete' ? handleCompleteConfirm :
          modal.type === 'cancel' ? handleCancelConfirm :
          closeModal
        }
        onCancel={
          modal.type === 'register' ? closeModal :
          modal.type === 'edit' ? closeModal :
          modal.type === 'cancel' ? handleCancelModal :
          undefined
        }
      />
    </div>
  );
}