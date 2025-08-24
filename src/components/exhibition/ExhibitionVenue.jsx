import styles from "./exhibitionVenue.module.css";

const ExhibitionVenue = ({
  venueName = "석파정 서울 미술관 2관",
  venueAddress = "서울특별시 종로구 창의문로11길 4-1",
  venueDates = "24.11.26 - 24.11.30",
  venueNote = "아르티움 회원은 무료. 광화문역에서 하차 후 1164번 버스 탑승후 10분 소요.",
  mapImage = "/wood-floor.jpg",
}) => {
  return (
    <div className={styles.offlineSection}>
      <div className={styles.offlineContent}>
        <div className={styles.offlineHeader}>
          <h3 className={styles.sectionTitle}>오프라인 전시장 정보</h3>
        </div>

        {/* <div className={styles.mapContainer}>
          <img 
            src={mapImage} 
            alt="지도" 
            className={styles.mapImage}
          />
          <div className={styles.mapMarker}></div>
        </div> */}

        <div className={styles.venueInfo}>
          <h4 className={styles.venueName}>{venueName}</h4>
          <p className={styles.venueAddress}>{venueAddress}</p>
          <p className={styles.venueDates}>{venueDates}</p>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionVenue;
