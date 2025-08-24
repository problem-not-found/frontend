import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png';
import ExhibitionArtworkModal from '@museum/components/exhibition/ExhibitionArtworkModal';
import styles from './sharedLibraryEntryPage.module.css';

export default function SharedLibraryEntryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 선택된 공유 라이브러리 정보
  const { selectedLibrary } = location.state || {};
  
  
  // 로컬 상태로 관리 (공유 라이브러리 작품 정보)
  const [sharedLibraryData, setSharedLibraryData] = useState({
    title: selectedLibrary?.name || '공유 라이브러리',
    description: '',
    startDate: null,
    endDate: null,
    totalDays: 0
  });

  // 모달 상태 추가
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [isChangeMode, setIsChangeMode] = useState(false);
  
  // 썸네일 및 작품 상태
  const [thumbnail, setThumbnail] = useState(null);
  const [artworks, setArtworks] = useState([]); // 작품 객체 배열

  const handleBack = () => {
    navigate('/exhibition/shared-library-selection');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSharedLibraryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 작품 라이브러리에서 돌아왔을 때 선택된 작품들 처리
  useEffect(() => {
    if (location.state?.returnFromLibrary && location.state?.selectedArtworks) {
      const { selectedArtworks, artworkIndex, isThumbnail, draft } = location.state;
      
      console.log('라이브러리에서 선택된 작품들:', selectedArtworks);
      console.log('복원할 draft:', draft);
      
      // 먼저 draft에서 상태 복원
      if (draft) {
        if (draft.sharedLibraryData) {
          setSharedLibraryData(prev => ({
            ...prev,
            ...draft.sharedLibraryData
          }));
        }
        if (draft.thumbnail) setThumbnail(draft.thumbnail);
        if (draft.artworks) setArtworks(draft.artworks);
      }
      
      // 그 다음 선택된 작품 처리
      if (isThumbnail) {
        // 썸네일로 선택된 경우
        if (selectedArtworks.length > 0) {
          setThumbnail(selectedArtworks[0]);
        }
      } else {
        // 공유 라이브러리 작품으로 선택된 경우
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

  // draft에서 상태 복원
  useEffect(() => {
    if (location.state?.draft) {
      const draft = location.state.draft;
      
      if (draft.sharedLibraryData) {
        setSharedLibraryData(prev => ({
          ...prev,
          ...draft.sharedLibraryData
        }));
      }
      
      if (draft.thumbnail) setThumbnail(draft.thumbnail);
      if (draft.artworks) setArtworks(draft.artworks);
    }
  }, [location.state]);

  // 새 작품 등록 페이지에서 돌아왔을 때 처리
  useEffect(() => {
    if (location.state?.returnFromArtworkUpload && location.state?.draft) {
      const { draft, newArtwork, isThumbnail } = location.state;
      
      console.log('새 작품 등록 후 복원 데이터:', { draft, newArtwork, isThumbnail });
      
      // draft에서 상태 복원
      if (draft) {
        if (draft.sharedLibraryData) {
          setSharedLibraryData(prev => ({
            ...prev,
            ...draft.sharedLibraryData
          }));
        }
        if (draft.thumbnail) setThumbnail(draft.thumbnail);
        if (draft.artworks) setArtworks(draft.artworks);
      }
      
      // 새로 등록된 작품 처리
      if (newArtwork) {
        if (isThumbnail) {
          setThumbnail(newArtwork);
        } else {
          addArtwork(newArtwork);
        }
      }
    }
  }, [location.state]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
    }
  };

  // 공유 라이브러리 작품 등록 모달 열기
  const openArtworkModal = (index) => {
    setCurrentArtworkIndex(index);
    setIsChangeMode(false);
    setIsArtworkModalOpen(true);
  };

  // 공유 라이브러리 작품 변경 모달 열기
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

  // 새 작품 등록 페이지로 이동
  const handleNewArtworkPage = () => {
    navigate('/artwork/upload', {
      state: {
        fromSharedLibrary: true,
        currentArtworkIndex: currentArtworkIndex,
        isChangeMode,
        returnTo: 'shared-library-entry',
        draft: buildDraft() // 현재 상태를 draft로 전달
      }
    });
  };

  // 현재 입력 상태를 하나로 묶어 라우팅 state로 넘길 draft
  const buildDraft = () => {
    const draft = {
      sharedLibraryData,
      thumbnail,
      artworks,
      startDate: sharedLibraryData.startDate || null,
      endDate: sharedLibraryData.endDate || null,
      totalDays: sharedLibraryData.totalDays
    };
    
    console.log('buildDraft 호출됨:', draft);
    return draft;
  };

  // 작품 라이브러리에서 가져오기 처리
  const handleLoadFromLibrary = () => {
    // 작품 라이브러리 페이지로 이동
    navigate('/artwork/library', {
      state: {
        fromSharedLibrary: true,
        currentArtworkIndex,
        isChangeMode,
        draft: buildDraft() // 현재 상태를 draft로 전달
      }
    });
  };

  // 작품 추가/수정/삭제
  const addArtwork = (artwork) => setArtworks(prev => [...prev, artwork]);
  const updateArtwork = (index, artwork) => {
    setArtworks(prev => {
      const next = [...prev];
      next[index] = artwork;
      return next;
    });
  };
  
  // 작품 제거 처리
  const removeArtwork = (index) => {
    setArtworks(prev => prev.filter((_, i) => i !== index));
  };

  // 공유 라이브러리 작품 슬라이드 렌더링
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
                  src={artwork.imageUrl || artwork} 
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
                  공유 라이브러리 작품을 등록해주세요<br />
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
                공유 라이브러리 작품을 등록해주세요<br />
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
          <h1 className={styles.title}>공유 라이브러리</h1>
        </div>
      </div>

      <div className={styles.form}>
        {/* 공유 라이브러리 썸네일 및 작품 등록 */}
        <div className={styles.artworkSection}>
          <h2 className={styles.sectionTitle}>공유 라이브러리 작품 등록</h2>
          <div className={styles.artworkSlideContainer}>
            {/* 공유 라이브러리 썸네일 */}
            <div className={styles.artworkSlide}>
              <div className={styles.artworkImageContainer}>
                {thumbnail ? (
                  <div className={styles.artworkImageWrapper}>
                    <img 
                      src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : (thumbnail.imageUrl || thumbnail)} 
                      alt="공유 라이브러리 썸네일" 
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
                      공유 라이브러리 썸네일을 등록해주세요<br />
                      (필수)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 공유 라이브러리 작품 슬라이드 (동적으로 생성) */}
            {renderArtworkSlides()}
          </div>
        </div>

        {/* 공유 라이브러리명 입력 */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="title"
            value={sharedLibraryData.title}
            onChange={handleInputChange}
            placeholder="공유 라이브러리명을 작성하세요"
            className={styles.titleInput}
          />
        </div>

        {/* 공유 라이브러리 소개 입력 */}
        <div className={styles.inputGroup}>
          <textarea
            name="description"
            value={sharedLibraryData.description}
            onChange={handleInputChange}
            placeholder="공유 라이브러리 소개를 작성하세요. (최대 500자)"
            className={styles.descriptionInput}
            rows={15}
            maxLength={500}
          />
        </div>

        {/* 하단 고정 버튼 */}
        <div className={styles.bottomButtonContainer}>
          <button 
            className={styles.enterButton}
            onClick={() => navigate('/artwork/library')}
          >
            작품 등록하기
          </button>
        </div>
      </div>

      {/* 공유 라이브러리 작품 등록 모달 */}
      <ExhibitionArtworkModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        onNewArtwork={handleNewArtworkPage}
        onLoadFromLibrary={handleLoadFromLibrary}
        isThumbnail={currentArtworkIndex === -1}
        isChangeMode={isChangeMode}
        currentDraft={buildDraft()} // 현재 상태를 모달에 전달
        returnTo="shared-library-entry" // 돌아올 페이지 지정
      />
    </div>
  );
}
