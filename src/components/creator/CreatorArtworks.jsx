import { useState } from "react";
import styles from "./creatorArtworks.module.css";

const CreatorArtworks = ({
  artworkCount = 17,
  artworks = [],
  exhibitionCount = 2,
  exhibitions = [],
}) => {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className={styles.artworksSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>작품 활동</h3>
        <span className={styles.countText}>_ {artworkCount}개</span>
      </div>

      <div className={styles.artworkContainer}>
        {artworks.length > 0 ? (
          <>
            {/* 작은 이미지들 - 가로 스크롤 */}
            <div className={styles.smallArtworkScroll}>
              {artworks.map((artwork) => (
                <div key={artwork.id} className={styles.smallArtwork}>
                  <img
                    src={artwork.image}
                    alt={`작품 ${artwork.id}`}
                    className={styles.artworkImage}
                  />
                </div>
              ))}
            </div>

            <div className={styles.showMoreContainer}>
              <button
                className={styles.showMoreButton}
                onClick={handleShowMore}
              >
                <span className={styles.showMoreText}>자세히 보기</span>
                <div className={styles.showMoreLines}>
                  <div className={styles.line}></div>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>아직 등록된 작품이 없습니다.</p>
          </div>
        )}
      </div>

      {/* 참여한 전시 섹션 */}
      <div className={styles.exhibitionsSection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>참여한 전시</h3>
          <span className={styles.countText}>_ {exhibitionCount}개</span>
        </div>

        <div className={styles.exhibitionContainer}>
          {exhibitions.length > 0 ? (
            <>
              <div className={styles.largeExhibitionScroll}>
                {exhibitions.map((exhibition) => (
                  <div key={exhibition.id} className={styles.largeExhibition}>
                    <img
                      src={exhibition.image}
                      alt={`전시 ${exhibition.id}`}
                      className={styles.artworkImage}
                    />
                    <div className={styles.exhibitionInfo}>
                      <p className={styles.exhibitionTitle}>
                        {exhibition.title}
                      </p>
                      <p className={styles.exhibitionDate}>{exhibition.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.showMoreContainer}>
                <button
                  className={styles.showMoreButton}
                  onClick={handleShowMore}
                >
                  <span className={styles.showMoreText}>자세히 보기</span>
                  <div className={styles.showMoreLines}>
                    <div className={styles.line}></div>
                  </div>
                </button>
              </div>
            </>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>아직 참여한 전시가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorArtworks;
