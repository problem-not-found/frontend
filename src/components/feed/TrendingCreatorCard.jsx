import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./trendingCreatorCard.module.css";

const TrendingCreatorCard = ({ creator }) => {
  const navigate = useNavigate();

  if (!creator) {
    return null;
  }

  // API 응답 데이터 매핑
  const profileImage = creator.profileImageUrl || creator.profileImage;
  const name = creator.nickname || creator.name;
  const username = creator.code ? `@${creator.code}` : "";
  const artworks = creator.pieceImageUrls
    ? creator.pieceImageUrls.map((url, index) => ({ id: index, image: url }))
    : creator.artworks || [];

  const handleCardClick = () => {
    const creatorId = creator.userId || creator.id;
    if (creatorId) {
      navigate(`/creator/${creatorId}`, {
        state: { previousTab: "크리에이터", fromFeed: true },
      });
    }
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* 배경 작품 이미지들 - 가로 스크롤 */}
      <div className={styles.artworkBackground}>
        <div className={styles.artworkScrollContainer}>
          {artworks.map((artwork, index) => (
            <div key={artwork.id || index} className={styles.artworkFrame}>
              <img
                src={artwork.image}
                alt={`작품 ${index + 1}`}
                className={styles.artworkImage}
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <img
          src={profileImage}
          alt={`${name} 프로필`}
          className={styles.profileImage}
          loading="lazy"
          onError={(e) => {
            e.target.src = "/public/creator-profile.png"; // fallback image
          }}
        />
        <div className={styles.nameSection}>
          <h3 className={styles.name}>
            {name.replace(" 크리에이터", "")}
            <span className={styles.creatorLabel}> 크리에이터</span>
          </h3>
          {username && <p className={styles.username}>{username}</p>}
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
    // API 응답 필드
    userId: PropTypes.number,
    nickname: PropTypes.string,
    profileImageUrl: PropTypes.string,
    pieceImageUrls: PropTypes.arrayOf(PropTypes.string),
    isLike: PropTypes.bool,
    // 기존 필드 (호환성 유지)
    id: PropTypes.number,
    name: PropTypes.string,
    username: PropTypes.string,
    profileImage: PropTypes.string,
    artworks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        image: PropTypes.string,
      })
    ),
  }),
};

export default TrendingCreatorCard;
