import styles from './creatorContact.module.css';
import mailIcon from '../../assets/artwork/mail.svg';
import instagramIcon from '../../assets/artwork/instagram.svg';

const CreatorContact = ({ 
  email = "asd123@naver.com",
  instagram = "@simonisnextdoor"
}) => {
  return (
    <div className={styles.contactSection}>
      <div className={styles.contactContent}>
        <div className={styles.iconSection}>
          <div className={styles.iconContainer}>
            <img src={mailIcon} alt="메일" className={styles.contactIcon} />
          </div>
          <div className={styles.iconContainer}>
            <img src={instagramIcon} alt="인스타그램" className={styles.contactIcon} />
          </div>
        </div>
        <div className={styles.textSection}>
          <p className={styles.contactText}>
            이메일 <span className={styles.contactValue}>{email}</span>
          </p>
          <p className={styles.contactText}>
            인스타그램 <span className={styles.contactValue}>{instagram}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatorContact;
