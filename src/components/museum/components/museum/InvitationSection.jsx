import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './invitationSection.module.css';

export default function InvitationSection({ hasInvitation, hasSharedLibraryRequest, invitationCount = 0 }) {
  const navigate = useNavigate();

  const handleInvitationClick = () => {
    navigate('/exhibition/invitations');
  };

  const handleSharedLibraryClick = () => {
    navigate('/exhibition/shared-library-selection');
  };

  return (
    <section className={styles.invitationSection}>
      {/* 공동 전시 참여 요청 알림 */}
      {hasInvitation && (
        <div className={styles.invitationAlert} onClick={handleInvitationClick}>
          <span>공동 전시 참여 요청 ({invitationCount}개)</span>
        </div>
      )}
      
      {/* 작품 공유 라이브러리 등록 안내 */}
      {hasSharedLibraryRequest && (
        <div className={styles.sharedLibraryAlert} onClick={handleSharedLibraryClick}>
          <span>작품을 공유 라이브러리에 등록해주세요</span>
        </div>
      )}
    </section>
  );
}
