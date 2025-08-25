import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";

const items = [
  { to: "/museum", label: "내 전시장" },
  { to: "/search", label: "검색" },
  { to: "/", label: "피드", exact: true },
  { to: "/taste", label: "내 취향" },
  { to: "/user", label: "내 정보" },
];

function AppFooter() {
  return (
    <footer className={styles.footer}>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          end={it.exact}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }
        >
          <span
            className={`${styles.icon} ${styles[`icon_${it.to.replace('/', '') || 'home'}`]}`}
            aria-hidden
          />
          <span className={styles.label}>{it.label}</span>
          <span className={styles.underline} />
        </NavLink>
      ))}
    </footer>
  );
}

export default AppFooter;
