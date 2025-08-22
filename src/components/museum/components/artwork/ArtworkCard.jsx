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
  const handleClick = () => {
    if (isEditMode && onSelect) {
      onSelect(artwork);
    } else if (!isEditMode && onClick) {
      onClick(artwork);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(artwork);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case '전시 중':
        return styles.statusExhibiting;
      case '미승인':
        return styles.statusRejected;
      case '승인 대기':
        return styles.statusPending;
      default:
        return styles.statusDefault;
    }
  };

  if (layoutMode === 'grid') {
    return (
      <div className={styles.gridCard} onClick={handleClick}>
        <div 
          className={styles.gridImage}
          style={{
            backgroundImage: artwork.image ? `url(${artwork.image})` : 'none'
          }}
        >
          {showStatus && artwork.status && (
            <div className={`${styles.statusBadge} ${getStatusStyle(artwork.status)}`}>
              {artwork.status}
            </div>
          )}
          {isEditMode && (
            <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''} ${checkboxSize === 'large' ? styles.checkboxLarge : ''}`}>
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
              backgroundImage: artwork.image ? `url(${artwork.image})` : 'none'
            }}
          >
            {showStatus && artwork.status && (
              <div className={`${styles.statusBadge} ${getStatusStyle(artwork.status)}`}>
                {artwork.status}
              </div>
            )}
            {isEditMode && (
              <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''} ${checkboxSize === 'large' ? styles.checkboxLarge : ''}`}>
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
