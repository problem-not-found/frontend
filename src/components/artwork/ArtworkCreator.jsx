import styles from './artworkCreator.module.css';
import arrowIcon from '../../assets/exhibition/화살표.svg';

const ArtworkCreator = ({ 
  creatorName = "김땡땡 크리에이터",
  creatorImage = "/creator-profile.png" 
}) => {
  return (
    <div className={styles.creatorSection}>
      <div className={styles.creatorInfo}>
        <img 
          src={creatorImage} 
          alt="크리에이터 프로필" 
          className={styles.creatorAvatar}
        />
        <div className={styles.creatorDetails}>
          <div className={styles.creatorNameContainer}>
            <span className={styles.creatorName}>{creatorName.replace(' 크리에이터', '')}</span>
            <span className={styles.creatorLabel}> 크리에이터</span>
          </div>
        </div>
      </div>
      <div className={styles.arrowContainer}>
        <img src={arrowIcon} alt="화살표" className={styles.arrowIcon} />
      </div>
    </div>
  );
};

export default ArtworkCreator;
