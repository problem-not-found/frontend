import { useNavigate } from 'react-router-dom';
import exhibitionStyles from './exhibitionSection.module.css';
import commonStyles from './common.module.css';

export default function ExhibitionSection({ exhibitions = [], totalElements = 0 }) {
  const navigate = useNavigate();
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
    navigate('/exhibition/my');
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
               className={`${exhibitionStyles.exhibitionCard} ${exhibitionStyles.large} ${exhibitionStyles.clickable}`}
               style={{
                 backgroundImage: exhibition.thumbnailImageUrl ? `url(${exhibition.thumbnailImageUrl})` : 'none',
                 backgroundColor: exhibition.thumbnailImageUrl ? 'transparent' : '#f0f0f0'
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
                
                {/* 전시에 포함된 작품들 표시 */}
                {exhibition.pieceIdList && exhibition.pieceIdList.length > 0 && (
                  <div className={exhibitionStyles.artworkList}>
                    <p className={exhibitionStyles.artworkCount}>
                      작품 {exhibition.pieceIdList.length}개
                    </p>
                    {/* 작품 이미지들을 작게 표시 */}
                    <div className={exhibitionStyles.artworkThumbnails}>
                      {exhibition.pieceIdList.slice(0, 3).map((pieceId, pieceIndex) => (
                        <div 
                          key={pieceId} 
                          className={exhibitionStyles.artworkThumbnail}
                          title={`작품 ${pieceId}`}
                        >
                          {/* 실제로는 작품 이미지를 가져와서 표시해야 함 */}
                          <div className={exhibitionStyles.artworkPlaceholder}>
                            {pieceIndex + 1}
                          </div>
                        </div>
                      ))}
                      {exhibition.pieceIdList.length > 3 && (
                        <div className={exhibitionStyles.artworkMore}>
                          +{exhibition.pieceIdList.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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