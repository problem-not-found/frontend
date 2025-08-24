import { useState } from 'react';
import { getImageUrl, getStatusStyle } from '@apis/museum/artwork';
import styles from './artworkCard.module.css';
import checkIcon from '@/assets/museum/check.png';

export default function ArtworkCard({ 
  artwork, 
  layoutMode = 'vertical', 
  onClick,
  showStatus = true,
  showDate = true,
  showDescription = true,
  isEditMode = false,
  onDelete,
  isSelected = false,
  onSelect,
  checkboxSize = 'normal' // 'normal' (24x24) 또는 'large' (36x36)
}) {
  const [imageError, setImageError] = useState(false);

  const imageUrl = getImageUrl(artwork);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleClick = () => {
    if (onClick) {
      onClick(artwork);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    if (isEditMode && onSelect) {
      onSelect(artwork);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(artwork);
    }
  };

  if (layoutMode === 'grid') {
    return (
      <div className={styles.gridCard} onClick={handleClick}>
        <div 
          className={styles.gridImage}
          style={{
            backgroundImage: imageUrl && !imageError ? `url(${imageUrl})` : 'none'
          }}
        >
          {!imageUrl || imageError ? (
            <div className={styles.noImagePlaceholder}>
              <span>이미지 없음</span>
            </div>
          ) : null}
          
          {showStatus && artwork.progressStatus === 'ON_DISPLAY' && (
            <div className={`${styles.statusBadge} ${styles.statusExhibiting}`}>
              전시 중
            </div>
          )}
          {isEditMode && (
            <div 
              className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''} ${checkboxSize === 'large' ? styles.checkboxLarge : ''}`}
              onClick={handleCheckboxClick}
            >
              {isSelected && (
                <img src={checkIcon} alt="선택됨" className={`${styles.checkIcon} ${checkboxSize === 'large' ? styles.checkIconLarge : ''}`} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verticalCard} onClick={handleClick}>
      <div className={styles.mainContainer}>
        <div className={styles.imageContainer}>
          <div 
            className={styles.verticalImage}
            style={{
              backgroundImage: imageUrl && !imageError ? `url(${imageUrl})` : 'none'
            }}
          >
            {!imageUrl || imageError ? (
              <div className={styles.noImagePlaceholder}>
                <span>이미지 없음</span>
              </div>
            ) : null}
            
            {showStatus && artwork.progressStatus === 'ON_DISPLAY' && (
              <div className={`${styles.statusBadge} ${styles.statusExhibiting}`}>
                전시 중
              </div>
            )}
            {isEditMode && (
              <div 
                className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''} ${checkboxSize === 'large' ? styles.checkboxLarge : ''}`}
                onClick={handleCheckboxClick}
              >
                {isSelected && (
                  <img src={checkIcon} alt="선택됨" className={`${styles.checkIcon} ${checkboxSize === 'large' ? styles.checkIconLarge : ''}`} />
                )}
              </div>
            )}
          </div>
          
          {showDate && artwork.createdAt && (
            <div className={styles.dateDisplay}>
              {artwork.createdAt}
            </div>
          )}
        </div>
        
        {showDescription && (
          <div className={styles.artworkInfo}>
            <h3 className={styles.artworkTitle}>{artwork.title}</h3>
            <p className={styles.artworkDescription}>{artwork.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
