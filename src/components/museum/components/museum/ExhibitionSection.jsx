import exhibitionStyles from './exhibitionSection.module.css';
import commonStyles from './common.module.css';

export default function ExhibitionSection({ exhibitions = [], totalElements = 0 }) {
  console.log('ExhibitionSection 렌더링:', { exhibitions, totalElements, exhibitionsType: typeof exhibitions, totalElementsType: typeof totalElements });
  
  const maxVisible = 5;
  const visibleExhibitions = exhibitions.slice(0, maxVisible);
  const hasMoreExhibitions = totalElements > maxVisible;

  // 날짜 형식 변환 헬퍼 함수
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2); // 24, 25
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 12, 02
    const day = date.getDate().toString().padStart(2, '0'); // 05, 19
    return `${year}.${month}.${day}`;
  };

  const handleShowMore = () => {
    console.log('전체 전시 페이지로 이동');
  };

  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 전시</h3>
          <span className={commonStyles.sectionCount}>_ {totalElements}개</span>
        </div>
      </div>
      
      <div className={exhibitionStyles.exhibitionGrid}>
        {visibleExhibitions.map((exhibition, index) => (
          <div key={exhibition.exhibitionId || index}>
            <div 
              className={`${exhibitionStyles.exhibitionCard} ${exhibitionStyles.large}`}
              style={{
                backgroundImage: exhibition.thumbnail ? `url(${exhibition.thumbnail})` : 'none',
                backgroundColor: exhibition.thumbnail ? 'transparent' : '#f0f0f0'
              }}
            />
            <div className={exhibitionStyles.exhibitionInfo}>
               <h4 className={exhibitionStyles.exhibitionTitle}>
                 {exhibition.title || `전시 ${exhibition.exhibitionId || index + 1}`}
               </h4>
               <p className={exhibitionStyles.exhibitionDate}>
                 {exhibition.startDate && exhibition.endDate ? 
                   `${formatDate(exhibition.startDate)} - ${formatDate(exhibition.endDate)}` : 
                   '등록 완료'
                 }
               </p>
             </div>
          </div>
        ))}
        
        {hasMoreExhibitions && (
          <div onClick={handleShowMore}>
            <div 
              className={`${exhibitionStyles.exhibitionCard} ${exhibitionStyles.large}`}
              style={{
                backgroundImage: exhibitions[maxVisible] ? `url(${exhibitions[maxVisible].thumbnail})` : 'none',
                backgroundColor: exhibitions[maxVisible]?.thumbnail ? 'transparent' : '#f0f0f0'
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
              <p className={exhibitionStyles.exhibitionTitle}>&nbsp;</p>
            </div>
          </div>
        )}
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <a href="/exhibition/my" className={commonStyles.sectionAction}>
          내 전시 등록&보러가기
        </a>
      </div>
    </section>
  );
}
