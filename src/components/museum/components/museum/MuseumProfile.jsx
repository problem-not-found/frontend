import styles from './museumProfile.module.css';

export default function MuseumProfile({ user }) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <div 
          className={styles.profileImage}
          style={{
            backgroundImage: user.profileImage ? `url(${user.profileImage})` : 'none'
          }}
        />
        <div className={styles.profileDetails}>
          <h2>{user.name}</h2>
          <p>{user.title}</p>
        </div>
      </div>
    </div>
  );
}
