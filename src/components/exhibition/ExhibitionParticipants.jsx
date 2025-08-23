import { ClipLoader } from 'react-spinners';
import styles from './exhibitionParticipants.module.css';
import arrowIcon from '../../assets/exhibition/화살표.svg';

const ExhibitionParticipants = ({ 
  participants = [],
  loading = false,
  error = null
}) => {
  return (
    <div className={styles.participantsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>참여 크리에이터</h3>
      </div>
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100px',
          margin: '20px 0'
        }}>
          <ClipLoader color="var(--color-main)" size={25} />
        </div>
      ) : error ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100px',
          margin: '20px 0',
          color: '#666'
        }}>
          참여 크리에이터 정보를 불러올 수 없습니다.
        </div>
      ) : (
        <div className={styles.participantsList}>
          {participants.map((participant) => {
            // API 응답 데이터 매핑
            const profileImage = participant.profileImageUrl || participant.image || "/creator-profile.png";
            const name = participant.nickname || participant.name || "크리에이터";
            const userId = participant.userId || participant.id;
            
            return (
              <div key={userId} className={styles.participantCard}>
                <div className={styles.participantInfo}>
                  <img 
                    src={profileImage} 
                    alt="크리에이터 프로필" 
                    className={styles.participantAvatar}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/creator-profile.png";
                    }}
                  />
                  <div className={styles.participantDetails}>
                    <div className={styles.creatorNameContainer}>
                      <span className={styles.creatorName}>
                        {name.replace(' 크리에이터', '')}
                      </span>
                      <span className={styles.creatorLabel}> 크리에이터</span>
                    </div>
                  </div>
                </div>
                <div className={styles.arrowContainer}>
                  <img src={arrowIcon} alt="화살표" className={styles.arrowIcon} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExhibitionParticipants;
