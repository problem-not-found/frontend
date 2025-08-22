import styles from './artworkModal.module.css';
import exclamationMark from '@/assets/museum/exclamation-mark.png';
import { useEffect } from 'react';

export default function ArtworkModal({ 
  type, 
  isOpen, 
  onClose, 
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null;

  const getModalContent = () => {
    switch (type) {
      case 'register':
        return {
          title: '작품을 등록할게요!',
          description: '관리자의 승인을 거쳐 작품이 게시됩니다.\n승인까지는 최대 7일까지 소요될 수 있습니다.',
          regulationText: '규정에 어긋나는 작품은 거절될 수 있습니다.',
          showCancel: true,
          cancelText: '취소',
          confirmText: '확인',
          confirmColor: 'orange'
        };
      case 'complete':
        return {
          title: '작품이 등록되었습니다',
          description: '관리자의 승인을 거쳐 작품이 게시됩니다.\n승인까지는 최대 7일까지 소요될 수 있습니다.',
          regulationText: '규정에 어긋나는 작품은 거절될 수 있습니다.',
          showCancel: false,
          confirmText: '확인했어요!',
          confirmColor: 'orange'
        };
      case 'cancel':
        return {
          title: '작품 등록을 취소할까요?',
          description: '작성 취소 선택시,\n작성 된 글은 저장되지 않습니다.',
          showCancel: true,
          cancelText: '작성 취소',
          confirmText: '임시 저장',
          confirmColor: 'orange'
        };
      case 'drafts':
        return {
          title: '임시저장 목록',
          description: '불러올 임시저장을 선택하세요.',
          showCancel: false,
          confirmText: '닫기',
          confirmColor: 'gray'
        };
      case 'saveComplete':
        return {
          title: '임시 저장이 완료되었어요',
          description: '',
          showCancel: false,
          confirmText: '',
          confirmColor: 'gray',
          autoClose: true
        };
      case 'registerComplete':
        return {
          title: '등록이 완료되었어요',
          description: '심사는 최대 7일까지 소요될 수 있어요',
          showCancel: false,
          confirmText: '',
          confirmColor: 'gray',
          autoClose: true
        };
      case 'validationError':
        return {
          title: '입력이 필요해요',
          description: '',
          showCancel: false,
          confirmText: '',
          confirmColor: 'gray',
          autoClose: true,
          errorMessages: []
        };
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  // autoClose가 true인 모달은 1.5초 후 자동으로 닫기
  useEffect(() => {
    if (isOpen && content?.autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, content?.autoClose, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirmClick = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} type={type}>
        {/* X 버튼 - 취소 모달에만 표시 */}
        {type === 'cancel' && (
          <button className={styles.closeButton} onClick={onClose}>
            <span className={styles.closeIcon}>✕</span>
          </button>
        )}
        
        <div className={styles.content}>
          <h2 className={styles.title}>{content.title}</h2>
          <p className={styles.description}>{content.description}</p>
          
          {content.regulationText && (
            <div className={styles.regulationSection}>
              <img src={exclamationMark} alt="경고" className={styles.exclamationIcon} />
              <span className={styles.regulationText}>
                <span className={styles.regulationHighlight}>규정에 어긋나는 작품</span>
                은 거절될 수 있습니다.
              </span>
            </div>
          )}
          
          {content.errorMessages && content.errorMessages.length > 0 && (
            <div className={styles.errorSection}>
              {content.errorMessages.map((message, index) => (
                <div key={index} className={styles.errorMessage}>
                  {message}
                </div>
              ))}
            </div>
          )}
          
          <div className={styles.buttonContainer}>
            {content.showCancel && (
              <button 
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={handleCancelClick}
              >
                {content.cancelText}
              </button>
            )}
            <button 
              className={`${styles.button} ${styles.confirmButton}`}
              onClick={handleConfirmClick}
            >
              {content.confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
