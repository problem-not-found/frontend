import PropTypes from 'prop-types';
import styles from './trendingCreatorCard.module.css';

const TrendingCreatorCard = ({ creator }) => {
  return (
    <div className={styles.card}>
      {/* 배경 작품 이미지들 - 가로 스크롤 */}
      <div className={styles.artworkBackground}>
        <div className={styles.artworkScrollContainer}>
          {creator.artworks.map((artwork, index) => (
            <div key={artwork.id} className={styles.artworkFrame}>
              <img 
                src={artwork.image} 
                alt={`작품 ${index + 1}`}
                className={styles.artworkImage}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <img 
          src={creator.profileImage} 
          alt={`${creator.name} 프로필`}
          className={styles.profileImage}
        />
        <div className={styles.nameSection}>
          <h3 className={styles.name}>
            {creator.name.replace(' 크리에이터', '')} 
            <span className={styles.creatorLabel}> 크리에이터</span>
          </h3>
          <p className={styles.username}>{creator.username}</p>
        </div>
      </div>

      {/* 지금 뜨는 크리에이터 라벨 */}
      <div className={styles.trendingLabel}>
        <span>지금 뜨는 크리에이터</span>
      </div>
    </div>
  );
};

TrendingCreatorCard.propTypes = {
  creator: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    profileImage: PropTypes.string.isRequired,
    artworks: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};

export default TrendingCreatorCard;
