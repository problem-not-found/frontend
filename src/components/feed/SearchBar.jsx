import styles from "./searchBar.module.css";

export default function SearchBar({ placeholder }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <input className={styles.input} placeholder={placeholder} />
        <button className={styles.btn} aria-label="검색">
          <span className={styles.icon} aria-hidden />
        </button>
      </div>
    </div>
  );
}
