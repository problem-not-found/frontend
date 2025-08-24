import { useNavigate } from "react-router-dom";
import styles from "./artworkExhibition.module.css";
import arrowIcon from "../../assets/exhibition/화살표.svg";

const ArtworkExhibition = ({
  exhibitionTitle = "김땡땡 개인전 : 두 번째 여름",
  exhibitionImage = "/example1.png",
  statusText = "지금 전시 중",
  exhibitionId,
}) => {
  const navigate = useNavigate();

  const handleExhibitionClick = () => {
    if (exhibitionId) {
      navigate(`/exhibition/${exhibitionId}`);
    }
  };
  return (
    <>
      <div className={styles.statusSection}>
        <h3 className={styles.statusTitle}>{statusText}</h3>
      </div>

      <div
        className={styles.exhibitionSection}
        onClick={handleExhibitionClick}
        style={{ cursor: exhibitionId ? "pointer" : "default" }}
      >
        <div className={styles.exhibitionInfo}>
          {exhibitionId && (
            <img
              src={exhibitionImage}
              alt="전시 이미지"
              className={styles.exhibitionAvatar}
            />
          )}
          <div className={styles.exhibitionDetails}>
            <span className={styles.exhibitionTitle}>{exhibitionTitle}</span>
          </div>
        </div>
        {exhibitionId && (
          <div className={styles.arrowContainer}>
            <img src={arrowIcon} alt="화살표" className={styles.arrowIcon} />
          </div>
        )}
      </div>
    </>
  );
};

export default ArtworkExhibition;
