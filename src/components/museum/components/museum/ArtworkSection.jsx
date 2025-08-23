import { useNavigate } from 'react-router-dom';
import artworkStyles from './artworkSection.module.css';
import commonStyles from './common.module.css';

export default function ArtworkSection({ artworks = [] }) {
  const navigate = useNavigate();
  const maxVisible = 5;
  const visibleArtworks = artworks.slice(0, maxVisible);
  const hasMoreArtworks = artworks.length > maxVisible;

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
          <span className={commonStyles.sectionCount}>_ {artworks.length}개</span>
        </div>
      </div>
      
      <div className={artworkStyles.artworkGrid}>
        {visibleArtworks.map((artwork, index) => (
          <div 
            key={artwork.id || index}
            className={artworkStyles.artworkCard}
            style={{
              backgroundImage: artwork.image ? `url(${artwork.image})` : 'none'
            }}
            title={artwork.title || `작품 ${index + 1}`}
          />
        ))}
        
        {hasMoreArtworks && (
          <div 
            className={artworkStyles.artworkCard}
            style={{
              backgroundImage: artworks[maxVisible] ? `url(${artworks[maxVisible].image})` : 'none'
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
