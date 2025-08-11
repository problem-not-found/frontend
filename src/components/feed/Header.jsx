import { useState } from "react";
import styles from "./header.module.css";

export default function Header() {
  const menus = ["전시", "작품", "크리에이터", "상품", "AR체험"];
  const [active, setActive] = useState("전시");

  return (
    <header className={styles.header}>
      <div className={styles.brand}>artium</div>

      <nav className={styles.nav} aria-label="주요 메뉴">
        {menus.map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.navItem} ${
              item === active ? styles.active : ""
            }`}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}
