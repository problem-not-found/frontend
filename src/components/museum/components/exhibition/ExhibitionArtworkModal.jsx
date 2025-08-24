import { useNavigate } from 'react-router-dom';
import styles from './exhibitionArtworkModal.module.css';

export default function ExhibitionArtworkModal({ 
  isOpen, 
  onClose, 
  isThumbnail = false,
  isChangeMode = false,
  currentDraft = null,
  returnTo = 'exhibition-upload'
}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNewArtwork = () => {
    // 새 작품 등록 페이지로 이동하면서 draft 데이터 전달
    navigate('/artwork/upload', {
      state: {
        fromExhibition: true,
        isThumbnail,
        isChangeMode,
        returnTo,
        draft: currentDraft
      }
    });
    onClose();
  };

  const handleLoadFromLibrary = () => {
    // 작품 라이브러리 페이지로 이동하면서 draft 데이터 전달
    navigate('/artwork/library', {
      state: {
        fromExhibition: true,
        isThumbnail,
        isChangeMode,
        returnTo,
        draft: currentDraft
      }
    });
    onClose();
  };

  // 변경 모드일 때와 새로 추가할 때의 메시지 구분
  const getTitle = () => {
    if (isThumbnail) {
      return isChangeMode ? '전시 썸네일을 변경할게요' : '전시 썸네일을 등록할게요';
    } else {
      return isChangeMode ? '전시 작품을 변경할게요' : '전시에 등록될 작품을 등록할게요';
    }
  };

  const getDescription = () => {
    if (isThumbnail) {
      return isChangeMode 
        ? '새 이미지로 변경하거나,\n미리 등록한 이미지를\n라이브러리에서 선택할 수 있어요'
        : '새 이미지를 등록하거나,\n미리 등록한 이미지를\n라이브러리에서 불러올 수 있어요';
    } else {
      return isChangeMode 
        ? '새 작품으로 변경하거나,\n미리 등록한 작품을\n라이브러리에서 선택할 수 있어요'
        : '새 작품을 등록하거나,\n미리 등록한 작품을\n라이브러리에서 불러올 수 있어요';
    }
  };

  const getPrimaryButtonText = () => {
    if (isThumbnail) {
      return isChangeMode ? '새 이미지로 변경하기' : '새 이미지 등록하기';
    } else {
      return isChangeMode ? '새 작품으로 변경하기' : '새 작품 등록하기';
    }
  };

  const getSecondaryButtonText = () => {
    if (isThumbnail) {
      return isChangeMode ? '이미지 라이브러리에서 선택하기' : '이미지 라이브러리에서 불러오기';
    } else {
      return isChangeMode ? '작품 라이브러리에서 선택하기' : '작품 라이브러리에서 불러오기';
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {getTitle()}
          </h2>
          <p className={styles.description}>
            {getDescription()}
          </p>
          
          <div className={styles.buttonContainer}>
            <button 
              className={`${styles.button} ${styles.primaryButton}`}
              onClick={handleNewArtwork}
            >
              {getPrimaryButtonText()}
            </button>
            <button 
              className={`${styles.button} ${styles.secondaryButton}`}
              onClick={handleLoadFromLibrary}
            >
              {getSecondaryButtonText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
