import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png';
import ExhibitionArtworkModal from '@museum/components/exhibition/ExhibitionArtworkModal';
import { getUserContact, getCurrentUser } from '@/apis/user/user.js';
import { createExhibition } from '@/apis/museum/exhibition.js';
import styles from './exhibitionUploadPage.module.css';

export default function ExhibitionUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 로컬 상태로 관리 (전시 정보)
  const [exhibitionData, setExhibitionData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    totalDays: 0
  });


  // 모달 상태
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [isChangeMode, setIsChangeMode] = useState(false);
  
  // 썸네일 및 작품 상태
  const [thumbnail, setThumbnail] = useState(null);
  const [artworks, setArtworks] = useState([]); // 작품 객체 배열 (ID와 imageUrl 포함)
  
  // 연락 정보 상태
  const [contactInfo, setContactInfo] = useState({
    isRegistered: false
  });
  
  // 전시 등록 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineLocation, setOfflineLocation] = useState({
    address: '',
    addressName: '',
    offlineDescription: ''
  });
  const [participants, setParticipants] = useState([]);

  // 기간 설정 완료 상태 확인 함수
  const isDateRangeSet = () => {
    const { startDate, endDate } = exhibitionData;
    
    console.log('isDateRangeSet 호출됨:', {
      startDate,
      endDate,
      startDateType: typeof startDate,
      endDateType: typeof endDate,
      startDateIsDate: startDate instanceof Date,
      endDateIsDate: endDate instanceof Date
    });
    
    // Date 객체인 경우
    if (startDate instanceof Date && endDate instanceof Date) {
      const result = !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
      console.log('Date 객체 처리 결과:', result);
      return result;
    }
    
    // 문자열인 경우 (YYYY-MM-DD 형식)
    if (typeof startDate === 'string' && typeof endDate === 'string') {
      const startPattern = /^\d{4}-\d{2}-\d{2}$/;
      const endPattern = /^\d{4}-\d{2}-\d{2}$/;
      const startValid = startPattern.test(startDate);
      const endValid = endPattern.test(endDate);
      const result = startValid && endValid;
      
      console.log('문자열 처리 결과:', {
        startValid,
        endValid,
        startPattern: startPattern.test(startDate),
        endPattern: endPattern.test(endDate),
        result
      });
      
      return result;
    }
    
    console.log('조건에 맞지 않음, false 반환');
    return false;
  };

  // 오프라인 장소 등록 완료 상태 확인 함수
  const isOfflineLocationSet = () => {
    const { address, addressName, offlineDescription } = offlineLocation;
    
    console.log('isOfflineLocationSet 호출됨:', {
      address,
      addressName,
      offlineDescription,
      addressType: typeof address,
      addressNameType: typeof addressName,
      offlineDescriptionType: typeof offlineDescription,
      addressValid: address && address.trim().length > 0,
      addressNameValid: addressName && addressName.trim().length > 0,
      offlineDescriptionValid: offlineDescription && offlineDescription.trim().length > 0
    });
    
    const result = address && address.trim().length > 0;
    console.log('오프라인 장소 설정 결과:', result);
    return result;
  };

  // 현재 입력 상태를 하나로 묶어 라우팅 state로 넘길 draft
  const buildDraft = () => {
    const draft = {
      exhibitionData,
      thumbnail,
      artworks,
      offlineLocation,
      participants,
      contactRegistered: contactInfo.isRegistered,
      // API 요청 형식에 맞춰 날짜 데이터 저장 (이미 YYYY-MM-DD 형식)
      startDate: exhibitionData.startDate || null,
      endDate: exhibitionData.endDate || null,
      totalDays: exhibitionData.totalDays
    };
    
    console.log('buildDraft 호출됨:', draft);
    console.log('날짜 형식 확인 - startDate:', draft.startDate, 'endDate:', draft.endDate);
    return draft;
  };

    // 기간 설정 페이지에서 돌아왔을 때 데이터 복원 (통합)
  useEffect(() => {
    console.log('useEffect 실행 - location.state:', location.state);
    
    // location.state가 실제로 유효한 데이터를 가지고 있을 때만 처리
    if (location.state && (location.state.selectedDates || location.state.draft)) {
      const { selectedDates, draft } = location.state;
      
      console.log('데이터 복원 시작:', { selectedDates, draft });
      
      setExhibitionData(prev => {
        let newData = { ...prev };
        
        // 1단계: draft 데이터 처리 (기본 데이터 먼저)
        if (draft) {
          // draft.exhibitionData에서 날짜 정보는 제외하고 기본 데이터만 설정
          if (draft.exhibitionData) {
            // 날짜 관련 필드를 명시적으로 제외
            const safeExhibitionData = { ...draft.exhibitionData };
            delete safeExhibitionData.startDate;
            delete safeExhibitionData.endDate;
            delete safeExhibitionData.totalDays;
            
            newData = {
              ...newData,
              ...safeExhibitionData
            };
          }
        }
        
        // 2단계: 기간 설정 데이터 처리 (최우선 - 나중에 덮어씀)
        if (selectedDates) {
          const { startDate, endDate, totalDays } = selectedDates;
          
          newData = {
            ...newData,
            startDate: startDate, // 이미 YYYY-MM-DD 문자열
            endDate: endDate,     // 이미 YYYY-MM-DD 문자열
            totalDays
          };
        }
        
        // 3단계: draft에서 날짜 데이터 복원 (selectedDates가 없을 때만)
        if (!selectedDates && draft) {
          // draft에서 직접 날짜 데이터 복원
          if (draft.startDate && draft.endDate) {
            console.log('draft에서 날짜 데이터 복원:', {
              startDate: draft.startDate,
              endDate: draft.endDate,
              totalDays: draft.totalDays
            });
            
            newData = {
              ...newData,
              startDate: draft.startDate,
              endDate: draft.endDate,
              totalDays: draft.totalDays || 0
            };
          }
          
          // draft.exhibitionData에서도 날짜 데이터 확인 및 복원
          if (draft.exhibitionData && draft.exhibitionData.startDate && draft.exhibitionData.endDate) {
            console.log('draft.exhibitionData에서 날짜 데이터 복원:', {
              startDate: draft.exhibitionData.startDate,
              endDate: draft.exhibitionData.endDate,
              totalDays: draft.exhibitionData.totalDays
            });
            
            newData = {
              ...newData,
              startDate: draft.exhibitionData.startDate,
              endDate: draft.exhibitionData.endDate,
              totalDays: draft.exhibitionData.totalDays || 0
            };
          }
        }
        
        return newData;
      });
      
      // 기타 상태 업데이트 (exhibitionData와 독립적)
      if (draft) {
        if (draft.thumbnail) setThumbnail(draft.thumbnail);
        if (draft.artworks) setArtworks(draft.artworks);
        if (draft.offlineLocation) {
          console.log('오프라인 장소 데이터 복원:', draft.offlineLocation);
          setOfflineLocation(draft.offlineLocation);
        }
        if (draft.participants) setParticipants(draft.participants);
        if (typeof draft.contactRegistered === 'boolean') {
          setContactInfo(prev => ({ ...prev, isRegistered: draft.contactRegistered }));
        }
      }
    }
  }, [location.state]);

  // ✅ URL state에 draft가 있으면 전부 복원 (통합된 useEffect에서 처리하므로 주석 처리)
  // useEffect(() => {
  //   if (location.state?.draft) {
  //     const d = location.state.draft;
  //     if (d.exhibitionData) setExhibitionData(prev => ({ ...prev, ...d.exhibitionData }));
  //     if (d.thumbnail) setThumbnail(d.thumbnail);
  //     if (d.artworks) setArtworks(d.artworks);
  //     if (d.offlineLocation) setOfflineLocation(d.offlineLocation);
  //     if (d.participants) setParticipants(d.participants);
  //     if (typeof d.contactRegistered === 'boolean') {
  //       setContactInfo(prev => ({ ...prev, isRegistered: d.contactRegistered }));
  //     }
  //   }
  // }, [location.state]);

  // URL state에서 참여자 정보 받아오기 (필요 시 추가 처리)
  useEffect(() => {
    if (location.state?.participants) {
      console.log('참여자 정보:', location.state.participants);
      // 여기서 참여자 정보를 처리할 수 있습니다
    }
  }, [location.state]);

  // 사용자 연락 정보 확인
  useEffect(() => {
    const checkUserContact = async () => {
      try {
        const userResponse = await getCurrentUser();
        if (userResponse && userResponse.data && userResponse.data.userId) {
          const userId = userResponse.data.userId;
          const contactResponse = await getUserContact(userId);
          
          if (contactResponse && contactResponse.data) {
            const contactData = contactResponse.data;
            if (contactData.email || contactData.instagram) {
              setContactInfo(prev => ({
                ...prev,
                isRegistered: true
              }));
            }
          }
        }
      } catch (error) {
        console.error('연락 정보 확인 실패:', error);
      }
    };
    checkUserContact();
  }, []);

  // 연락 정보 등록 페이지에서 돌아왔을 때 전시 정보 복원
  useEffect(() => {
    if (location.state?.contactUpdated && location.state?.exhibitionData) {
      const { exhibitionData: savedExhibitionData, thumbnail: savedThumbnail, artworks: savedArtworks } = location.state;
      
      console.log('연락 정보 등록 후 복원 데이터:', {
        savedExhibitionData,
        savedThumbnail,
        savedArtworks
      });
      
      setExhibitionData(prev => ({
        ...prev,
        ...savedExhibitionData
      }));
      
      if (savedThumbnail) setThumbnail(savedThumbnail);
      if (savedArtworks) setArtworks(savedArtworks);
      
      setContactInfo(prev => ({
        ...prev,
        isRegistered: true
      }));
    }
  }, [location.state]);

  // 오프라인 장소 등록 페이지에서 돌아왔을 때 정보 복원
  useEffect(() => {
    if (location.state?.offlineLocationData && location.state?.returnTo === 'exhibition-upload') {
      const { address, addressName, offlineDescription } = location.state.offlineLocationData;
      setOfflineLocation({
        address: address || '',
        addressName: addressName || '',
        offlineDescription: offlineDescription || ''
      });
    }
  }, [location.state]);

  // 전시 참여자 등록 페이지에서 돌아왔을 때 정보 복원
  useEffect(() => {
    if (location.state?.participantsData && location.state?.returnTo === 'exhibition-upload') {
      setParticipants(location.state.participantsData);
    }
  }, [location.state]);

  // 작품 라이브러리에서 돌아왔을 때 선택된 작품들 처리
  useEffect(() => {
    if (location.state?.returnFromLibrary && location.state?.selectedArtworks) {
      const { selectedArtworks, artworkIndex, isThumbnail } = location.state;
      
      console.log('라이브러리에서 선택된 작품들:', selectedArtworks);
      
      if (isThumbnail) {
        // 썸네일로 선택된 경우
        if (selectedArtworks.length > 0) {
          setThumbnail(selectedArtworks[0]);
        }
      } else {
        // 전시 작품으로 선택된 경우
        if (artworkIndex !== undefined) {
          // 특정 인덱스에 작품 추가/교체
          if (artworkIndex >= 0) {
            if (artworkIndex < artworks.length) {
              // 기존 작품 교체
              updateArtwork(artworkIndex, selectedArtworks[0]);
            } else {
              // 새 작품 추가
              addArtwork(selectedArtworks[0]);
            }
          } else {
            // 새 작품 추가
            addArtwork(selectedArtworks[0]);
          }
        } else {
          // 여러 작품 추가
          selectedArtworks.forEach(artwork => {
            addArtwork(artwork);
          });
        }
      }
    }
  }, [location.state]);

  // 전시 등록 처리
  const handleSubmitExhibition = async () => {
    // 필수 입력 검증
    if (!exhibitionData.title || !exhibitionData.title.trim()) {
      alert('전시명을 입력해주세요.');
      return;
    }
    if (!exhibitionData.description || !exhibitionData.description.trim()) {
      alert('전시 소개를 입력해주세요.');
      return;
    }
    if (!exhibitionData.startDate || !exhibitionData.endDate) {
      alert('전시 기간을 설정해주세요.');
      return;
    }
    if (artworks.length < 3) {
      alert('작품을 3개 이상 등록해주세요.');
      return;
    }
    if (!contactInfo.isRegistered) {
      alert('연락 정보를 등록해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // 실제 pieceIdList 사용
      const pieceIdList = artworks.map(artwork => artwork.pieceId);
      const participantIdList = participants.map(p => p.userId);

      // draft에서 날짜 데이터 사용 (이미 YYYY-MM-DD 형식)
      const startDate = exhibitionData.startDate ? exhibitionData.startDate.toISOString().split('T')[0] : null;
      const endDate = exhibitionData.endDate ? exhibitionData.endDate.toISOString().split('T')[0] : null;
      
      const exhibitionPayload = {
        pieceIdList,
        endDate,
        participantIdList,
        startDate,
        address: offlineLocation.address || '주소 미입력',
        title: exhibitionData.title.trim(),
        offlineDescription: offlineLocation.offlineDescription || '오프라인 전시 설명 미입력',
        description: exhibitionData.description.trim(),
        addressName: offlineLocation.addressName || '장소명 미입력'
      };
      
      console.log('전시 등록 요청 데이터:', exhibitionPayload);
      const response = await createExhibition(exhibitionPayload);
      console.log('전시 등록 성공:', response);
      
      alert('전시가 성공적으로 등록되었습니다!');
      navigate('/museum');
    } catch (error) {
      console.error('전시 등록 실패:', error);
      alert('전시 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    if (file) setThumbnail(file);
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
      setThumbnail(file);
    } else {
      if (isChangeMode) {
        updateArtwork(currentArtworkIndex, file);
      } else {
        addArtwork(file);
      }
    }
  };

  // 작품 라이브러리에서 가져오기 처리
  const handleLoadFromLibrary = () => {
    navigate('/artwork/library', {
      state: {
        fromExhibition: true,
        currentArtworkIndex,
        isChangeMode,
        isThumbnail: currentArtworkIndex === -1
      }
    });
  };

  // 작품 추가/수정/삭제 (객체 기반)
  const addArtwork = (artwork) => setArtworks(prev => [...prev, artwork]);
  const updateArtwork = (index, artwork) => {
    setArtworks(prev => {
      const next = [...prev];
      next[index] = artwork;
      return next;
    });
  };
  const removeArtwork = (index) => {
    setArtworks(prev => prev.filter((_, i) => i !== index));
  };

  // 기간 설정 페이지로 이동 (초안 동봉!)
  const openDatePicker = () => {
    navigate('/exhibition/date-picker', {
      state: {
        initialDates: {
          startDate: exhibitionData.startDate,
          endDate: exhibitionData.endDate
        },
        draft: buildDraft(),         // ✅ 현재까지 입력한 값 모두
        returnTo: 'exhibition-upload'
      }
    });
  };

  // 전시 작품 슬라이드 렌더링 (객체 기반)
  const renderArtworkSlides = () => {
    const slides = [];
    artworks.forEach((artwork, index) => {
      slides.push(
        <div key={`artwork-${index}`} className={styles.artworkSlide}>
          <div className={styles.artworkImageContainer}>
            <div className={styles.artworkImageWrapper}>
              <img 
                src={artwork.imageUrl}
                alt={`작품 ${index + 1}`} 
                className={styles.artworkImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className={styles.placeholderText} style={{ display: 'none' }}>
                이미지를 불러올 수 없습니다
              </div>
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
          </div>
        </div>
      );
    });

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
                    onClick={() => openArtworkModal(-1)} // -1은 썸네일
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

            {/* 전시 작품 슬라이드 */}
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
            className={`${styles.featureButton} ${isDateRangeSet() ? styles.completed : ''}`}
            onClick={openDatePicker}
          >
            {isDateRangeSet() ? '기간 설정 완료' : '기간 설정하기 (필수)'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${contactInfo.isRegistered ? styles.contactRegistered : ''}`}
            onClick={() => navigate('/user/contact', {
              state: {
                exhibitionData: {
                  title: exhibitionData.title,
                  description: exhibitionData.description,
                  startDate: exhibitionData.startDate,
                  endDate: exhibitionData.endDate,
                  totalDays: exhibitionData.totalDays
                },
                thumbnail,
                artworks
              }
            })}
          >
            {contactInfo.isRegistered ? '연락 정보 등록됨' : '연락 정보 등록하기'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${isOfflineLocationSet() ? styles.completed : ''}`}
            onClick={() => navigate('/exhibition/offline-location', {
              state: {
                offlineLocation,
                returnTo: 'exhibition-upload',
                exhibitionData: {
                  title: exhibitionData.title,
                  description: exhibitionData.description,
                  startDate: exhibitionData.startDate,
                  endDate: exhibitionData.endDate,
                  totalDays: exhibitionData.totalDays
                },
                thumbnail,
                artworks
              }
            })}
          >
            {isOfflineLocationSet() ? '오프라인 장소 등록됨' : '오프라인 장소 등록하기'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${participants.length > 0 ? styles.completed : ''}`}
            onClick={() => navigate('/exhibition/participants', {
              state: {
                participants,
                returnTo: 'exhibition-upload',
                exhibitionData: {
                  title: exhibitionData.title,
                  description: exhibitionData.description,
                  startDate: exhibitionData.startDate,
                  endDate: exhibitionData.endDate,
                  totalDays: exhibitionData.totalDays
                },
                thumbnail,
                artworks
              }
            })}
          >
            {participants.length > 0 ? '전시 참여자 등록됨' : '전시 참여자 등록하기'}
          </button>
        </div>
      </div>

      {/* 하단 고정 전시 등록하기 버튼 */}
      <div className={styles.submitButtonContainer}>
        <button 
          type="button" 
          className={styles.submitButton}
          onClick={handleSubmitExhibition}
          disabled={isSubmitting}
        >
          {isSubmitting ? '등록 중...' : '전시 등록하기'}
        </button>
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
