import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '@/stores/userStore';
import useExhibitionPhotoStore from '@museum/services/exhibitionPhotoStore';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png';
import ExhibitionArtworkModal from '@museum/components/exhibition/ExhibitionArtworkModal';
import styles from './exhibitionUploadPage.module.css';

export default function ExhibitionUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, contactInfo } = useUserStore();
  
  // Zustand store 사용
  const { 
    thumbnail, 
    artworks, 
    setThumbnail, 
    addArtwork, 
    updateArtwork, 
    removeArtwork: removeArtworkFromStore 
  } = useExhibitionPhotoStore();
  
  // 로컬 상태로 관리 (전시 정보)
  const [exhibitionData, setExhibitionData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    totalDays: 0
  });

  // 모달 상태 추가
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [isChangeMode, setIsChangeMode] = useState(false);

  // URL state에서 선택된 날짜 받아오기
  useEffect(() => {
    if (location.state?.selectedDates) {
      const { startDate, endDate, totalDays } = location.state.selectedDates;
      setExhibitionData(prev => ({
        ...prev,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalDays
      }));
    }
  }, [location.state]);

  // URL state에서 참여자 정보 받아오기
  useEffect(() => {
    if (location.state?.participants) {
      console.log('참여자 정보:', location.state.participants);
      // 여기서 참여자 정보를 처리할 수 있습니다
    }
  }, [location.state]);

  const handleBack = () => {
    navigate('/museum');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExhibitionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  // 전시 작품 등록 모달 열기 (새로 추가)
  const openArtworkModal = (index) => {
    setCurrentArtworkIndex(index);
    setIsChangeMode(false);
    setIsArtworkModalOpen(true);
  };

  // 전시 작품 변경 모달 열기
  const openChangeArtworkModal = (index) => {
    setCurrentArtworkIndex(index);
    setIsChangeMode(true);
    setIsArtworkModalOpen(true);
  };

  // 새 작품 등록 처리
  const handleNewArtwork = (file) => {
    if (currentArtworkIndex === -1) {
      // 썸네일인 경우
      setThumbnail(file);
    } else {
      // 작품인 경우
      if (isChangeMode) {
        // 변경 모드: 해당 인덱스의 작품만 수정
        updateArtwork(currentArtworkIndex, file);
      } else {
        // 새로 추가 모드: 작품 추가
        addArtwork(file);
      }
    }
  };

  // 작품 라이브러리에서 가져오기 처리
  const handleLoadFromLibrary = () => {
    // 작품 라이브러리 페이지로 이동
    navigate('/artwork/library', {
      state: {
        fromExhibition: true,
        currentArtworkIndex,
        isChangeMode
      }
    });
  };

  // 작품 제거 처리
  const removeArtwork = (index) => {
    removeArtworkFromStore(index);
  };

  // 기간 설정 페이지로 이동
  const openDatePicker = () => {
    navigate('/exhibition/date-picker', {
      state: {
        initialDates: {
          startDate: exhibitionData.startDate,
          endDate: exhibitionData.endDate
        }
      }
    });
  };

  // 전시 작품 슬라이드 렌더링
  const renderArtworkSlides = () => {
    const slides = [];
    
    // 기존 작품들 렌더링
    artworks.forEach((artwork, index) => {
      slides.push(
        <div key={`artwork-${index}`} className={styles.artworkSlide}>
          <div className={styles.artworkImageContainer}>
            {artwork ? (
              <div className={styles.artworkImageWrapper}>
                <img 
                  src={URL.createObjectURL(artwork)} 
                  alt={`작품 ${index + 1}`} 
                  className={styles.artworkImage}
                />
                <button 
                  className={styles.changeButton}
                  onClick={() => openChangeArtworkModal(index)}
                >
                  변경
                </button>
                <button 
                  className={styles.removeButton}
                  onClick={() => removeArtwork(index)}
                >
                  삭제
                </button>
              </div>
            ) : (
              <div 
                className={styles.imagePlaceholder}
                onClick={() => openArtworkModal(index)}
                style={{ cursor: 'pointer' }}
              >
                <img src={plusCircleIcon} alt="plus" className={styles.plusIcon} />
                <p className={styles.placeholderText}>
                  전시 작품을 등록해주세요<br />
                  (선택)
                </p>
              </div>
            )}
          </div>
        </div>
      );
    });
    
    // 새 작품 추가 버튼 (최대 10개)
    if (artworks.length < 10) {
      slides.push(
        <div key="add-artwork" className={styles.artworkSlide}>
          <div className={styles.artworkImageContainer}>
            <div 
              className={styles.imagePlaceholder}
              onClick={() => openArtworkModal(artworks.length)}
              style={{ cursor: 'pointer' }}
            >
              <img src={plusCircleIcon} alt="plus" className={styles.plusIcon} />
              <p className={styles.placeholderText}>
                전시 작품을 등록해주세요<br />
                (선택)
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return slides;
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>전시 등록하기</h1>
        </div>
      </div>

      <div className={styles.form}>
          {/* 전시 썸네일 및 작품 등록 */}
          <div className={styles.artworkSection}>
            <h2 className={styles.sectionTitle}>전시 작품 등록</h2>
            <div className={styles.artworkSlideContainer}>
              {/* 전시 썸네일 */}
              <div className={styles.artworkSlide}>
                <div className={styles.artworkImageContainer}>
                  {thumbnail ? (
                    <div className={styles.artworkImageWrapper}>
                      <img 
                        src={URL.createObjectURL(thumbnail)} 
                        alt="전시 썸네일" 
                        className={styles.artworkImage}
                      />
                      <button 
                        className={styles.changeButton}
                        onClick={() => openChangeArtworkModal(-1)}
                      >
                        변경
                      </button>
                    </div>
                  ) : (
                    <div 
                      className={styles.imagePlaceholder}
                      onClick={() => openArtworkModal(-1)} // -1은 썸네일을 의미
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
                      <p className={styles.placeholderText}>
                        전시 썸네일을 등록해주세요<br />
                        (필수)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* 전시 작품 슬라이드 (동적으로 생성) */}
              {renderArtworkSlides()}
            </div>
          </div>

          {/* 전시명 입력 */}
          <div className={styles.inputGroup}>
            <input
              type="text"
              name="title"
              value={exhibitionData.title}
              onChange={handleInputChange}
              placeholder="전시명을 작성하세요"
              className={styles.titleInput}
            />
          </div>

          {/* 전시 소개 입력 */}
          <div className={styles.inputGroup}>
            <textarea
              name="description"
              value={exhibitionData.description}
              onChange={handleInputChange}
              placeholder="전시 소개를 작성하세요. (최대 500자)"
              className={styles.descriptionInput}
              rows={15}
              maxLength={500}
            />
          </div>

          {/* 추가 기능 버튼들 */}
          <div className={styles.additionalFeatures}>
            <button 
              type="button" 
              className={`${styles.featureButton} ${exhibitionData.startDate && exhibitionData.endDate ? styles.completed : ''}`}
              onClick={openDatePicker}
            >
              기간 설정하기 (필수)
              {exhibitionData.startDate && exhibitionData.endDate && (
                <span className={styles.completedText}>
                  ✓ {exhibitionData.startDate.toLocaleDateString('ko-KR')} ~ {exhibitionData.endDate.toLocaleDateString('ko-KR')}
                </span>
              )}
            </button>
            <button 
              type="button" 
              className={`${styles.featureButton} ${contactInfo.isRegistered ? styles.contactRegistered : ''}`}
            >
              {contactInfo.isRegistered ? '연락 정보 등록됨' : '연락 정보 등록하기'}
            </button>
            <button 
              type="button" 
              className={styles.featureButton}
              onClick={() => navigate('/exhibition/offline-location')}
            >
              오프라인 장소 등록하기
            </button>
            <button 
              type="button" 
              className={styles.featureButton}
            >
              전시장 만들기
            </button>
            <button 
              type="button" 
              className={`${styles.featureButton} ${location.state?.participants ? styles.completed : ''}`}
              onClick={() => navigate('/exhibition/participants', {
                state: {
                  exhibitionData: {
                    title: exhibitionData.title,
                    description: exhibitionData.description,
                    startDate: exhibitionData.startDate,
                    endDate: exhibitionData.endDate,
                    totalDays: exhibitionData.totalDays
                  }
                }
              })}
            >
              {location.state?.participants ? '전시 참여자 등록됨' : '전시 참여자 등록하기'}
            </button>
          </div>
        </div>

      {/* 전시 작품 등록 모달 */}
      <ExhibitionArtworkModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        onNewArtwork={handleNewArtwork}
        onLoadFromLibrary={handleLoadFromLibrary}
        isThumbnail={currentArtworkIndex === -1}
        isChangeMode={isChangeMode}
      />
    </div>
  );
}
