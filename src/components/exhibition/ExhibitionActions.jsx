import { useNavigate, useParams } from "react-router-dom";
import BackToTopButton from "../common/BackToTopButton";
import styles from "./exhibitionActions.module.css";

const ExhibitionActions = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 현재 전시 ID 가져오기

  const handleViewExhibition = () => {
    navigate(`/gallery/${id}`); // 전시 ID와 함께 gallery로 이동
  };

  return (
    <>
      <BackToTopButton />

      {/* View Exhibition Button */}
      <div className={styles.actionsContainer}>
        <button
          className={styles.viewExhibitionButton}
          onClick={handleViewExhibition}
        >
          전시 보러가기
        </button>
      </div>
    </>
  );
};

export default ExhibitionActions;
