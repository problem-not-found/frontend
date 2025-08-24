import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./footer.module.css";

import iconMuseum from "../../assets/footer/museum.svg";
import iconSearch from "../../assets/footer/search.svg";
import iconFeed from "../../assets/footer/feed.svg";
import iconHeart from "../../assets/footer/heart.svg";
import iconUser from "../../assets/footer/user.svg";

const items = [
  { to: "/museum", label: "내 전시장", icon: iconMuseum },
  { to: "/search", label: "검색", icon: iconSearch },
  { to: "/", label: "피드", icon: iconFeed, exact: true },
  { to: "/taste", label: "내 취향", icon: iconHeart },
  { to: "/user", label: "내 정보", icon: iconUser },
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
            className={styles.icon}
            aria-hidden
            style={{
              WebkitMaskImage: `url(${it.icon})`,
              maskImage: `url(${it.icon})`,
            }}
          />
          <span className={styles.label}>{it.label}</span>
          <span className={styles.underline} />
        </NavLink>
      ))}
    </footer>
  );
}

export default AppFooter;
