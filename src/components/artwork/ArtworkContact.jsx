import styles from "./artworkContact.module.css";
import mailIcon from "../../assets/artwork/mail.svg";
import instagramIcon from "../../assets/artwork/instagram.svg";

const ArtworkContact = ({
  email = "asd123@naver.com",
  instagram = "@simonisnextdoor",
  loading = false,
}) => {
  return (
    <div className={styles.contactSection}>
      <div className={styles.contactContent}>
        <div className={styles.iconSection}>
          <div className={styles.iconContainer}>
            <img src={mailIcon} alt="메일" className={styles.contactIcon} />
          </div>
          <div className={styles.iconContainer}>
            <img
              src={instagramIcon}
              alt="인스타그램"
              className={styles.contactIcon}
            />
          </div>
        </div>
        <div className={styles.textSection}>
          {loading ? (
            <>
              <p className={styles.contactText}>
                이메일 <span className={styles.contactValue}>로딩 중...</span>
              </p>
              <p className={styles.contactText}>
                인스타그램{" "}
                <span className={styles.contactValue}>로딩 중...</span>
              </p>
            </>
          ) : (
            <>
              <p className={styles.contactText}>
                이메일{" "}
                {email ? (
                  <span
                    className={`${styles.contactValue} ${styles.clickable}`}
                    onClick={() => window.open(`mailto:${email}`, "_blank")}
                    style={{ cursor: "pointer" }}
                  >
                    {email}
                  </span>
                ) : (
                  <span className={styles.contactValue}>정보 없음</span>
                )}
              </p>
              <p className={styles.contactText}>
                인스타그램{" "}
                {instagram ? (
                  <span
                    className={`${styles.contactValue} ${styles.clickable}`}
                    onClick={() =>
                      window.open(
                        `https://instagram.com/${instagram.replace("@", "")}`,
                        "_blank"
                      )
                    }
                    style={{ cursor: "pointer" }}
                  >
                    @{instagram.replace("@", "")}
                  </span>
                ) : (
                  <span className={styles.contactValue}>정보 없음</span>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtworkContact;
