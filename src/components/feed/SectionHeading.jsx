import { useState } from "react";
import styles from "./feed.module.css";
import alertIcon from "../../assets/feed/alert-circle.svg";

export default function SectionHeading({ title, caption, isFirst = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.sectionHeader}>
      {open && (
        <div className={styles.noticeBox}>
          AI가 내 취향 목록과 자주 보는 것, 등록한 내 관심사 등을 종합적으로
          분석해 좋아할 만 한 것을 추천해줘요.
        </div>
      )}

      <div className={styles.titleRow}>
        <h3
          className={isFirst ? styles.sectionTitleFirst : styles.sectionTitle}
        >
          {title}
        </h3>
        <button
          type="button"
          className={styles.alertBtn}
          onClick={() => setOpen((v) => !v)}
          aria-label="안내 보기"
        >
          <img src={alertIcon} alt="알림" className={styles.alertIcon} />
        </button>
      </div>

      {caption && <span className={styles.sectionCaption}>{caption}</span>}
    </div>
  );
}
