import artworkStyles from './artworkSection.module.css';
import commonStyles from './common.module.css';

export default function ArtworkSection({ artworks = [] }) {
  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 작품</h3>
          <span className={commonStyles.sectionCount}>_ {artworks.length}개</span>
        </div>
      </div>
      
      <div className={artworkStyles.artworkGrid}>
        {artworks.map((artwork, index) => (
          <div 
            key={artwork.id || index}
            className={artworkStyles.artworkCard}
            style={{
              backgroundImage: artwork.image ? `url(${artwork.image})` : 'none'
            }}
          />
        ))}
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <a href="#" className={commonStyles.sectionAction}>
          내 작품 등록&보러가기
        </a>
      </div>
    </section>
  );
}
