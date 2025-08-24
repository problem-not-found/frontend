import styles from './exhibitionCard.module.css';
import checkIcon from '@/assets/museum/check.png';

export default function ExhibitionCard({ 
  exhibition, 
  layoutMode = 'vertical', 
  onClick,
  showStatus = true,
  showDate = true,
  showDescription = true,
  isEditMode = false,
  onDelete,
  isSelected = false,
  onSelect
}) {
  const handleClick = () => {
    if (isEditMode && onSelect) {
      onSelect(exhibition);
    } else if (!isEditMode && onClick) {
      onClick(exhibition);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(exhibition);
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
            backgroundImage: exhibition.thumbnailImageUrl ? `url(${exhibition.thumbnailImageUrl})` : 'none'
          }}
        >
          {showStatus && exhibition.status === 'ONGOING' && (
            <div className={`${styles.statusBadge} ${styles.statusExhibiting}`}>
              전시 중
            </div>
          )}
          {isEditMode && (
            <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
              {isSelected && (
                <img src={checkIcon} alt="선택됨" className={styles.checkIcon} />
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
              backgroundImage: exhibition.thumbnailImageUrl ? `url(${exhibition.thumbnailImageUrl})` : 'none'
            }}
          >
            {showStatus && exhibition.status === 'ONGOING' && (
              <div className={`${styles.statusBadge} ${styles.statusExhibiting}`}>
                전시 중
              </div>
            )}
            {isEditMode && (
              <div className={`${styles.checkbox} ${isSelected ? styles.checkboxSelected : ''}`}>
                {isSelected && (
                  <img src={checkIcon} alt="선택됨" className={styles.checkIcon} />
                )}
              </div>
            )}
          </div>
        </div>
        
        {showDescription && (
          <div className={styles.exhibitionInfo}>
            <h3 className={styles.exhibitionTitle}>{exhibition.title}</h3>
            {showDate && exhibition.startDate && exhibition.endDate && (
              <p className={styles.exhibitionDate}>
                {`${exhibition.startDate.slice(2, 4)}.${exhibition.startDate.slice(5, 7)}.${exhibition.startDate.slice(8, 10)} - ${exhibition.endDate.slice(2, 4)}.${exhibition.endDate.slice(5, 7)}.${exhibition.endDate.slice(8, 10)}`}
              </p>
            )}
            <p className={styles.exhibitionDescription}>{exhibition.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
