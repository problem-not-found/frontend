import exhibitionStyles from './exhibitionSection.module.css';
import commonStyles from './common.module.css';

export default function ExhibitionSection({ exhibitions = [] }) {
  const maxVisible = 5;
  const visibleExhibitions = exhibitions.slice(0, maxVisible);
  const hasMoreExhibitions = exhibitions.length > maxVisible;

  const handleShowMore = () => {
    console.log('전체 전시 페이지로 이동');
  };

  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 전시</h3>
          <span className={commonStyles.sectionCount}>_ {exhibitions.length}개</span>
        </div>
      </div>
      
      <div className={exhibitionStyles.exhibitionGrid}>
        {visibleExhibitions.map((exhibition, index) => (
          <div key={exhibition.id || index}>
            <div 
              className={`${exhibitionStyles.exhibitionCard} ${exhibitionStyles.large}`}
              style={{
                backgroundImage: exhibition.image ? `url(${exhibition.image})` : 'none'
              }}
            />
            <div className={exhibitionStyles.exhibitionInfo}>
              <h4 className={exhibitionStyles.exhibitionTitle}>{exhibition.title}</h4>
              <p className={exhibitionStyles.exhibitionDate}>{exhibition.date}</p>
            </div>
          </div>
        ))}
        
        {hasMoreExhibitions && (
          <div onClick={handleShowMore}>
            <div 
              className={`${exhibitionStyles.exhibitionCard} ${exhibitionStyles.large}`}
              style={{
                backgroundImage: exhibitions[maxVisible] ? `url(${exhibitions[maxVisible].image})` : 'none'
              }}
            >
              <div className={exhibitionStyles.moreOverlay}>
                <div className={exhibitionStyles.overlayContent}>
                  <span className={exhibitionStyles.moreText}>더 보기</span>
                </div>
              </div>
            </div>
            <div className={exhibitionStyles.exhibitionInfo}>
              <h4 className={exhibitionStyles.exhibitionTitle}>&nbsp;</h4>
              <p className={exhibitionStyles.exhibitionDate}>&nbsp;</p>
            </div>
          </div>
        )}
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <a href="#" className={commonStyles.sectionAction}>
          내 전시 등록&보러가기
        </a>
      </div>
    </section>
  );
}
