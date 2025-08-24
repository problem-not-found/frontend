import styles from './tasteHeader.module.css';

const TasteHeader = () => {
  return (
    <div className={styles.headerContainer}>
      <h1 className={styles.title}>내 취향</h1>
    </div>
  );
};

export default TasteHeader;
