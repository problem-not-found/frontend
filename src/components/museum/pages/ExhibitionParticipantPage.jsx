import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUserStore from '@/stores/userStore';
import chevronLeft from '@/assets/museum/chevron-left.png';
import searchIcon from '@/assets/footer/search.svg';
import styles from './exhibitionParticipantPage.module.css';

export default function ExhibitionParticipantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUserStore();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // URL state에서 전시 정보 받아오기
  useEffect(() => {
    if (location.state?.exhibitionData) {
      console.log('전시 정보:', location.state.exhibitionData);
    }
  }, [location.state]);

  // 전시 정보가 없으면 전시 등록 페이지로 리다이렉트
  useEffect(() => {
    if (!location.state?.exhibitionData) {
      navigate('/exhibition/upload');
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    navigate('/exhibition/upload', {
      state: {
        exhibitionData: location.state?.exhibitionData
      }
    });
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // 검색어가 있을 때만 검색 결과 표시
    if (query.trim()) {
      // 실제로는 API 호출을 통해 사용자 검색
      // 여기서는 더미 데이터 사용
      const dummyResults = [
        { id: 1, name: '김땡땡', username: 'kimdangdeng', profileImage: null },
        { id: 2, name: '정땡땡', username: 'simonkim', profileImage: null },
        { id: 3, name: 'kimman', username: 'kimchiman', profileImage: null }
      ].filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.username.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(dummyResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleParticipantToggle = (participant) => {
    setSelectedParticipants(prev => {
      const isSelected = prev.find(p => p.id === participant.id);
      if (isSelected) {
        return prev.filter(p => p.id !== participant.id);
      } else {
        return [...prev, participant];
      }
    });
  };

  const handleCompleteRegistration = () => {
    if (selectedParticipants.length === 0) {
      alert('참여자를 선택해주세요.');
      return;
    }

    // 전시 등록 페이지로 돌아가면서 참여자 정보 전달
    navigate('/exhibition/upload', {
      state: {
        exhibitionData: location.state?.exhibitionData,
        participants: selectedParticipants
      }
    });
  };

  const isParticipantSelected = (participantId) => {
    return selectedParticipants.find(p => p.id === participantId);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="back" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>전시 참여자 등록하기</h1>
        </div>
      </div>

      {/* 검색 입력창 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="아이디로 사용자를 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              flex: 1,
              fontSize: '16px',
              fontWeight: 500,
              color: '#f37021'
            }}
          />
          <img src={searchIcon} alt="search" className={styles.searchIcon} />
        </div>
      </div>

      {/* 검색 결과가 있을 때만 표시 */}
      {searchResults.length > 0 && (
        <>
          <p className={styles.instructionText}>
            {selectedParticipants.length > 0 
              ? "프로필을 누르면 등록이 취소됩니다" 
              : "프로필을 누르면 등록이 완료됩니다"
            }
          </p>

          {/* 참여자 목록 */}
          <div className={styles.participantList}>
            {searchResults.map((participant) => (
              <div
                key={participant.id}
                className={`${styles.participantCard} ${isParticipantSelected(participant.id) ? styles.selected : ''}`}
                onClick={() => handleParticipantToggle(participant)}
              >
                <div className={styles.profileImage}>
                  {participant.profileImage ? (
                    <img src={participant.profileImage} alt={participant.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', backgroundColor: '#eeeeee' }} />
                  )}
                </div>
                <div className={styles.participantInfo}>
                  <h3 className={styles.participantName}>
                    {participant.name} @{participant.username}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 하단 버튼 */}
      <button 
        className={styles.bottomButton}
        onClick={handleCompleteRegistration}
        disabled={selectedParticipants.length === 0}
      >
        등록 완료하기
      </button>

      {/* 알림 배너 */}
      {showNotification && (
        <div className={styles.notificationBanner}>
          참여자가 등록 요청이 전송되었습니다
        </div>
      )}
    </div>
  );
}
