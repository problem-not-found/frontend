import styles from './creatorDescription.module.css';

const CreatorDescription = ({ 
  description = "안녕하세요. 아름다운 바다 그림을 통해 많은 사람들에게 행복을 주고 싶은 크리에이터 김땡땡입니다."
}) => {
  return (
    <div className={styles.descriptionSection}>
      <div className={styles.descriptionContent}>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default CreatorDescription;
