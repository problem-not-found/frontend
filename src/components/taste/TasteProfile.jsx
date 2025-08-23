import styles from './tasteProfile.module.css';

const TasteProfile = ({ profile }) => {
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <span className={styles.profileText}>
          {profile.age} {profile.gender}
        </span>
      </div>
    </div>
  );
};

export default TasteProfile;
