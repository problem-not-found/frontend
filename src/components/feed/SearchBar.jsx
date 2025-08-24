import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./searchBar.module.css";

export default function SearchBar({ placeholder }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (isAnimating) return;

    setIsAnimating(true);

    // 페이드 아웃 애니메이션 후 페이지 이동
    setTimeout(() => {
      navigate("/search");
    }, 300); // 0.3초 후 이동
  };

  return (
    <div
      className={`${styles.wrap} ${isAnimating ? styles.fadeOut : ""}`}
      onClick={handleSearchClick}
      style={{ cursor: "pointer" }}
    >
      <div className={styles.box}>
        <input
          className={styles.input}
          placeholder={placeholder}
          readOnly
          style={{ cursor: "pointer" }}
        />
        <button className={styles.btn} aria-label="검색">
          <span className={styles.icon} aria-hidden />
        </button>
      </div>
    </div>
  );
}
