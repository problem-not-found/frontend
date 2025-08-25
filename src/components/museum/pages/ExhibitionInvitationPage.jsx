import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import checkImage from '@/assets/museum/check.png';
import styles from './exhibitionInvitationPage.module.css';
import { getUserParticipation, approveUserParticipation } from '@/apis/user/user.js';

export default function ExhibitionInvitationPage() {
  const navigate = useNavigate();
  
  // 상태 관리
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 초대 목록 가져오기
  const loadInvitations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // status는 항상 REQUESTED로 고정 (아직 승인하지 않은 초대만 조회)
      const response = await getUserParticipation({ status: 'REQUESTED' });
      console.log('=== 초대 목록 API 응답 ===');
      console.log('전체 응답:', response);
      console.log('response.data:', response?.data);
      console.log('response.data.data:', response?.data?.data);
      console.log('response.data.data 타입:', typeof response?.data?.data);
      console.log('Array.isArray(response.data.data):', Array.isArray(response?.data?.data));
      console.log('response.data.data 길이:', response?.data?.data?.length);
      
      // 배열 데이터 존재 여부를 명확하게 확인
      if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
        console.log('초대 데이터 설정 전:', response.data);
        console.log('초대 개수:', response.data.length);
        setInvitations(response.data);
        console.log('초대 데이터 설정 완료');
      } else {
        console.log('초대 데이터가 없음, 빈 배열 설정');
        setInvitations([]);
      }
    } catch (error) {
      console.error('초대 목록 로드 오류:', error);
      setError('초대 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
  }, []);

  const handleBack = () => {
    navigate('/museum');
  };

  // 초대 수락 처리
  const handleAcceptInvitation = async (exhibitionId) => {
    try {
      console.log('=== 초대 수락 시작 ===');
      console.log('수락할 전시 ID:', exhibitionId);
      
      // PUT /api/users/join/approve API 호출
      const response = await approveUserParticipation(exhibitionId);
      console.log('API 응답 전체:', response);
      console.log('API 응답 data:', response?.data);
      console.log('API 응답 success:', response?.data?.success);
      console.log('API 응답 message:', response?.data?.message);

      if (response?.data?.success === true || response?.data?.success === "true") {
        console.log('초대 수락 성공:', exhibitionId);
        
        // 성공 메시지 표시
        alert('초대를 수락했습니다!');
        
        // 초대 목록 새로고침
        await loadInvitations();
        
        // MuseumPage의 초대 상태도 업데이트 (부모 컴포넌트에 알림)
        // TODO: 부모 컴포넌트에 초대 상태 변경 알림
      } else {
        console.error('초대 수락 실패:', response?.data?.message || '알 수 없는 오류');
        console.error('success 값:', response?.data?.success, '타입:', typeof response?.data?.success);
        alert('초대 수락에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('초대 수락 오류:', error);
      console.error('오류 상세:', error.response?.data);
      alert('초대 수락 중 오류가 발생했습니다.');
    }
  };

  // 초대 목록 렌더링
  const renderInvitationList = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          초대 목록을 불러오는 중...
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={loadInvitations}>
            다시 시도
          </button>
        </div>
      );
    }

    if (invitations.length === 0) {
      return (
        <div className={styles.emptyState}>
          받은 초대가 없습니다.
        </div>
      );
    }

    return (
      <div className={styles.invitationList}>
        {invitations.map((invitation, index) => (
          <div
            key={invitation.exhibitionId}
            className={styles.invitationCard}
            onClick={() => handleAcceptInvitation(invitation.exhibitionId)}
          >
            
            <div className={styles.exhibitionInfo}>
              {/* 전시 이미지 */}
              <div className={styles.exhibitionImage}>
                {invitation.thumbnailImageUrl ? (
                  <img 
                    src={invitation.thumbnailImageUrl} 
                    alt={invitation.title}
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.noImage}>이미지 없음</div>
                )}
              </div>
              
              {/* 전시 정보 */}
              <div className={styles.exhibitionDetails}>
                <h3 className={styles.exhibitionTitle}>
                  {invitation.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
            </button>
            <h1 className={styles.title}>참여 요청 받은 전시</h1>
          </div>
        </div>
        <div className={styles.loadingContainer}>
          <p>초대 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={handleBack}>
              <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
            </button>
            <h1 className={styles.title}>참여 요청 받은 전시</h1>
          </div>
        </div>
        <div className={styles.errorContainer}>
          <p>{error}</p>
          <button onClick={loadInvitations} className={styles.retryButton}>
            다시 시도
          </button>
        </div>
      </div>
    );
  }

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
      {renderInvitationList()}

    </div>
  );
}