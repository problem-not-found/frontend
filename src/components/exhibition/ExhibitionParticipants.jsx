import styles from './exhibitionParticipants.module.css';
import arrowIcon from '../../assets/exhibition/화살표.svg';

const ExhibitionParticipants = ({ 
  participants = []
}) => {
  return (
    <div className={styles.participantsSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>참여 크리에이터</h3>
      </div>
      
      <div className={styles.participantsList}>
        {participants.map((participant) => (
          <div key={participant.id} className={styles.participantCard}>
            <div className={styles.participantInfo}>
              <img 
                src={participant.image} 
                alt="크리에이터 프로필" 
                className={styles.participantAvatar}
              />
              <div className={styles.participantDetails}>
                <div className={styles.creatorNameContainer}>
                  <span className={styles.creatorName}>
                    {participant.name.replace(' 크리에이터', '')}
                  </span>
                  <span className={styles.creatorLabel}> 크리에이터</span>
                </div>
              </div>
            </div>
            <div className={styles.arrowContainer}>
              <img src={arrowIcon} alt="화살표" className={styles.arrowIcon} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExhibitionParticipants;
