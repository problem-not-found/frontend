import exhibitionStyles from './exhibitionSection.module.css';
import commonStyles from './common.module.css';

export default function ExhibitionSection({ exhibitions = [] }) {
  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 전시</h3>
          <span className={commonStyles.sectionCount}>_ {exhibitions.length}개</span>
        </div>
      </div>
      
      <div className={exhibitionStyles.exhibitionGrid}>
        {exhibitions.map((exhibition, index) => (
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
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <a href="#" className={commonStyles.sectionAction}>
          내 전시 등록&보러가기
        </a>
      </div>
    </section>
  );
}
