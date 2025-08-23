import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import checkImage from '@/assets/museum/check.png';
import styles from './exhibitionInvitationPage.module.css';
import useUserStore from '@/stores/userStore';

export default function ExhibitionInvitationPage() {
  const navigate = useNavigate();
  const { updateInvitation } = useUserStore();
  
  // 상태 관리
  const [invitations, setInvitations] = useState([]);
  const [selectedInvitations, setSelectedInvitations] = useState([]);

  // 더미 초대 데이터 (실제로는 API에서 가져올 예정)
  const dummyInvitations = [
    {
      id: 1,
      exhibitionTitle: '2025 성북구 작가 단체전',
      exhibitionImage: null,
      status: 'pending' // pending, accepted, declined
    },
    {
      id: 2,
      exhibitionTitle: '2025 성북구 작가 단체전',
      exhibitionImage: null,
      status: 'pending'
    },
    {
      id: 3,
      exhibitionTitle: '2025 강남구 작가 단체전',
      exhibitionImage: null,
      status: 'pending'
    }
  ];

  useEffect(() => {
    // 초대 목록 가져오기 (실제로는 API 호출)
    setInvitations(dummyInvitations);
  }, []);

  const handleBack = () => {
    navigate('/museum');
  };

  const handleInvitationSelect = (invitationId) => {
    const isSelected = selectedInvitations.includes(invitationId);
    
    if (isSelected) {
      setSelectedInvitations(prev => prev.filter(id => id !== invitationId));
    } else {
      setSelectedInvitations(prev => [...prev, invitationId]);
    }
  };

  const handleAcceptInvitations = () => {
    if (selectedInvitations.length > 0) {
      // 선택된 초대들을 수락 처리
      console.log('수락할 초대:', selectedInvitations);
      
      // TODO: API 호출로 초대 수락 처리
      
      // userStore 상태 업데이트
      updateInvitation({
        hasInvitation: false, // 공동 전시 참여 요청 알림 숨김
        hasSharedLibraryRequest: true, // 작품 공유 라이브러리 등록 안내 표시
        invitationCount: 0 // 요청 개수 0으로 설정
      });
      
      // 내 전시장 페이지로 돌아가기
      navigate('/museum');
    } else {
      alert('수락할 초대를 선택해주세요.');
    }
  };

  const isInvitationSelected = (invitationId) => {
    return selectedInvitations.includes(invitationId);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>참여 요청 받은 전시</h1>
        </div>
      </div>

      {/* 초대 목록 */}
      <div className={styles.invitationList}>
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className={`${styles.invitationCard}`}
          >
            <div className={styles.exhibitionInfo}>
              <div className={styles.exhibitionImage}>
                {invitation.exhibitionImage ? (
                  <img src={invitation.exhibitionImage} alt="전시 이미지" />
                ) : (
                  <div className={styles.defaultImage} />
                )}
              </div>
              <div className={styles.exhibitionDetails}>
                <span className={styles.exhibitionTitle}>{invitation.exhibitionTitle}</span>
              </div>
            </div>
            
            {/* 커스텀 체크박스 - check.png 이미지 사용 */}
            <div 
              className={`${styles.customCheckbox} ${isInvitationSelected(invitation.id) ? styles.checked : ''}`}
              onClick={() => handleInvitationSelect(invitation.id)}
            >
              {isInvitationSelected(invitation.id) && (
                <img src={checkImage} alt="체크됨" className={styles.checkIcon} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 수락하기 버튼 */}
      <button 
        className={`${styles.acceptButton} ${selectedInvitations.length === 0 ? styles.disabledButton : ''}`}
        onClick={handleAcceptInvitations}
        disabled={selectedInvitations.length === 0}
      >
        {selectedInvitations.length > 0 ? `${selectedInvitations.length}개 수락하기` : '수락하기'}
      </button>
    </div>
  );
}
