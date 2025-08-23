import styles from './tasteActions.module.css';

const TasteActions = () => {
  const handleEditInterests = () => {
    console.log('내 관심사 수정하기 클릭');
  };

  const handleGetRecommendations = () => {
    console.log('내 취향대로 추천받기 클릭');
  };

  return (
    <div className={styles.actionsContainer}>
      <button className={styles.actionButton} onClick={handleEditInterests}>
        내 관심사 수정하기
      </button>
      <button className={styles.actionButton} onClick={handleGetRecommendations}>
        내 취향대로 추천받기
      </button>
    </div>
  );
};

export default TasteActions;
