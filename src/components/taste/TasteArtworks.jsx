import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import likeIcon from "../../assets/feed/like.svg";
import unlikeIcon from "../../assets/feed/unlike.svg";
import styles from "./tasteArtworks.module.css";
import { getLikedPieces, unlikePiece } from "../../apis/exhibition/exhibition";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

const HeartIcon = ({ filled = false, onClick }) => (
  <img
    src={filled ? likeIcon : unlikeIcon}
    alt={filled ? "좋아요" : "좋아요 안함"}
    width="24"
    height="24"
    onClick={onClick}
    style={{ cursor: "pointer" }}
  />
);

const TasteArtworks = () => {
  const navigate = useNavigate();

  const {
    data: artworks,
    loading,
    error,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll(getLikedPieces, 10);

  const handleArtworkClick = (artworkId) => {
    navigate(`/artwork/${artworkId}`);
  };

  const handleLikeToggle = async (artworkId, event) => {
    event.stopPropagation();

    try {
      await unlikePiece(artworkId);
      console.log("작품 좋아요 취소 성공");
      // 페이지 새로고침하여 최신 목록 표시
      window.location.reload();
    } catch (error) {
      console.error("작품 좋아요 취소 실패:", error);
    }
  };

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>좋아요한 작품을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.artworksContainer}>
      <div className={styles.artworksGrid}>
        {artworks.map((artwork, index) => (
          <div
            key={artwork.pieceId || artwork.id}
            className={styles.artworkItem}
            ref={index === artworks.length - 1 ? lastElementRef : null}
          >
            <div
              className={styles.artworkImage}
              onClick={() => handleArtworkClick(artwork.pieceId || artwork.id)}
            >
              <img
                src={artwork.imageUrl || artwork.image || "/artwork1.png"}
                alt={artwork.title}
                className={styles.image}
              />

              <div className={styles.likeButton}>
                <HeartIcon
                  filled={true} // 좋아요한 작품 목록이므로 항상 채워진 하트
                  onClick={(e) =>
                    handleLikeToggle(artwork.pieceId || artwork.id, e)
                  }
                />
              </div>
            </div>

            <div className={styles.artworkInfo}>
              <h3 className={styles.artworkTitle}>{artwork.title}</h3>
              <p className={styles.artworkCreator}>
                {artwork.creator || artwork.artistName || "작가 정보 없음"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <ClipLoader color="var(--color-main)" size={30} />
        </div>
      )}

      {!hasMore && artworks.length > 0 && (
        <div className={styles.endMessage}>
          <p>모든 작품을 확인했습니다.</p>
        </div>
      )}

      {artworks.length === 0 && !loading && (
        <div className={styles.emptyContainer}>
          <p>좋아요한 작품이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TasteArtworks;
