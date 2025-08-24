import PropTypes from "prop-types";
import styles from "./header.module.css";
import logoImage from "../../assets/feed/logo.png";

export default function Header({ activeTab, onTabChange }) {
  const menus = ["전시", "작품", "크리에이터"];

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <img src={logoImage} alt="Artium" className={styles.logo} />
      </div>

      <nav className={styles.nav} aria-label="주요 메뉴">
        {menus.map((item) => (
          <button
            key={item}
            type="button"
            className={`${styles.navItem} ${
              item === activeTab ? styles.active : ""
            }`}
            onClick={() => onTabChange(item)}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
}

Header.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
