import styles from './tasteTags.module.css';

const TasteTags = ({ tags }) => {
  return (
    <div className={styles.tagsContainer}>
      <div className={styles.tagsGrid}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tagItem}>
            <span className={styles.tagText}>{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasteTags;
