import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '@apis/museum/artwork';
import artworkStyles from './artworkSection.module.css';
import commonStyles from './common.module.css';

export default function ArtworkSection({ artworks = [], totalElements = 0 }) {
  const navigate = useNavigate();
  const maxVisible = 5;
  const visibleArtworks = artworks.slice(0, maxVisible);
  const hasMoreArtworks = totalElements > maxVisible;

  const handleShowMore = () => {
    navigate('/artwork/my'); // 내 작품 페이지로 이동
  };

  const handleGoToMyArtworks = () => {
    navigate('/artwork/my'); // 내 작품 페이지로 이동
  };

  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 작품</h3>
          <span className={commonStyles.sectionCount}>_ {totalElements}개</span>
        </div>
      </div>
      
      <div className={artworkStyles.artworkGrid}>
        {visibleArtworks.map((artwork, index) => {
          const imageUrl = getImageUrl(artwork);
          return (
            <div 
              key={artwork.id || index}
              className={artworkStyles.artworkCard}
              style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundColor: imageUrl ? 'transparent' : '#f0f0f0'
              }}
              title={artwork.title || `작품 ${index + 1}`}
            />
          );
        })}
        
        {hasMoreArtworks && (
          <div 
            className={artworkStyles.artworkCard}
            style={{
              backgroundImage: (() => {
                const imageUrl = getImageUrl(artworks[maxVisible]);
                return imageUrl ? `url(${imageUrl})` : 'none';
              })(),
              backgroundColor: (() => {
                const imageUrl = getImageUrl(artworks[maxVisible]);
                return imageUrl ? 'transparent' : '#f0f0f0';
              })()
            }}
            onClick={handleShowMore}
          >
            <div className={artworkStyles.moreOverlay}>
              <div className={artworkStyles.overlayContent}>
                <span className={artworkStyles.moreText}>더 보기</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <button onClick={handleGoToMyArtworks} className={commonStyles.sectionAction}>
          내 작품 등록&보러가기
        </button>
      </div>
    </section>
  );
}
