import styles from './museumProfile.module.css';

export default function MuseumProfile({ user }) {
  return (
    <div className={styles.profileSection}>
      <div className={styles.profileInfo}>
        <div 
          className={styles.profileImage}
          style={{
            backgroundImage: user.profileImageUrl ? `url(${user.profileImageUrl})` : 'none'
          }}
        />
        <div className={styles.profileDetails}>
          <h2>{user.nickname || '사용자'}</h2>
          <p>크리에이터의 전시장</p>
        </div>
      </div>
    </div>
  );
}