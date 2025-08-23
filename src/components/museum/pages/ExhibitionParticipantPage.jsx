import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import searchIcon from '@/assets/footer/search.svg';
import styles from './exhibitionParticipantPage.module.css';

export default function ExhibitionParticipantPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // URL state에서 전시 정보 받아오기
  const exhibitionData = location.state?.exhibitionData || {};

  // 더미 사용자 데이터 (실제로는 API에서 가져올 예정)
  const dummyUsers = [
    { id: 1, username: 'kimdangdeng', displayName: '김땡땡', profileImage: null },
    { id: 2, username: 'simonkim', displayName: '정땡땡', profileImage: null },
    { id: 3, username: 'kimchiman', displayName: 'kimman', profileImage: null },
  ];

  useEffect(() => {
    // 검색어가 있을 때만 검색 결과 표시
    if (searchQuery.trim()) {
      const filtered = dummyUsers.filter(user => 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
      setIsSearching(true);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleBack = () => {
    navigate('/museum');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    const isSelected = selectedParticipants.some(p => p.id === user.id);
    
    if (isSelected) {
      // 이미 선택된 사용자라면 제거
      setSelectedParticipants(prev => prev.filter(p => p.id !== user.id));
    } else {
      // 새로운 사용자라면 추가
      setSelectedParticipants(prev => [...prev, user]);
    }
  };

  const handleComplete = () => {
    // 성공 모달 표시
    setShowSuccessModal(true);
    
    // 2초 후 화면 전환
    setTimeout(() => {
      // 전시 업로드 페이지로 돌아가면서 선택된 참여자 정보 전달
      navigate('/exhibition/upload', {
        state: {
          participants: selectedParticipants,
          exhibitionData
        }
      });
    }, 2000);
  };

  const isUserSelected = (userId) => {
    return selectedParticipants.some(p => p.id === userId);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>
            {selectedParticipants.length > 0 ? '전시 참여자 등록됨' : '전시 참여자 등록하기'}
          </h1>
        </div>
      </div>

      {/* 검색창 */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="아이디로 사용자를 검색"
            className={styles.searchInput}
          />
          <div className={styles.searchIcon}>
            <img src={searchIcon} alt="검색" />
          </div>
        </div>
      </div>

      {/* 안내 메시지 */}
      {isSearching && searchResults.length > 0 && (
        <p className={styles.infoText}>
          {selectedParticipants.length === 0 
            ? '프로필을 누르면 등록이 완료됩니다'
            : `프로필을 누르면 등록이 취소됩니다 (${selectedParticipants.length})`
          }
        </p>
      )}

      {/* 검색 결과 목록 */}
      {isSearching && searchResults.length > 0 && (
        <div className={styles.userList}>
          {searchResults.map((user) => (
            <div
              key={user.id}
              className={`${styles.userCard} ${isUserSelected(user.id) ? styles.selected : ''}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className={styles.userInfo}>
                <div className={styles.profileImage}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="프로필" />
                  ) : (
                    <div className={styles.defaultProfile} />
                  )}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.displayName}>{user.displayName}</span>
                  <span className={styles.username}>@{user.username}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 선택된 참여자 목록 */}
      {selectedParticipants.length > 0 && (
        <div className={styles.selectedList}>
          <h3 className={styles.selectedTitle}>선택된 참여자</h3>
          {selectedParticipants.map((user) => (
            <div
              key={user.id}
              className={`${styles.userCard} ${styles.selected}`}
              onClick={() => handleUserSelect(user)}
            >
              <div className={styles.userInfo}>
                <div className={styles.profileImage}>
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="프로필" />
                  ) : (
                    <div className={styles.defaultProfile} />
                  )}
                </div>
                <div className={styles.userDetails}>
                  <span className={styles.displayName}>{user.displayName}</span>
                  <span className={styles.username}>@{user.username}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 등록 완료 버튼 */}
      <button 
        className={`${styles.completeButton} ${selectedParticipants.length === 0 ? styles.disabledButton : ''}`}
        onClick={handleComplete}
        disabled={selectedParticipants.length === 0}
      >
        등록 완료하기
      </button>

      {/* 성공 모달 */}
      {showSuccessModal && (
        <div className={styles.successModal}>
          <div className={styles.successMessage}>
            참여자 등록 요청이 전송되었습니다
          </div>
        </div>
      )}
    </div>
  );
}
