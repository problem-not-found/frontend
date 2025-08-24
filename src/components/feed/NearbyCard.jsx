import styles from "./nearbyCard.module.css";
import defaultImg from "../../assets/feed/예시3.png";

export default function NearbyCard({ item = {} }) {
  const {
    img = defaultImg,
    title = "성북구 신인 작가 합동 전시 : 두 번째 여름",
    date = "2024.06.22 - 2025.02.07",
    tags = ["박명희", "정구민", "윤희준", "골목길", "감기기"],
  } = item;
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img src={img} alt={title} className={styles.image} />
      </div>
      <div className={styles.overlay}>
        <div className={styles.title}>{title}</div>
        <div className={styles.date}>{date}</div>
        <div className={styles.tags}>
          {Array.isArray(tags) ? tags.join(", ") : String(tags)}
        </div>
      </div>
    </div>
  );
}
