import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import styles from './sharedLibrarySelectionPage.module.css';

export default function SharedLibrarySelectionPage() {
  const navigate = useNavigate();
  
  // 상태 관리
  const [sharedLibraries, setSharedLibraries] = useState([]);

  // 더미 공유 라이브러리 데이터 (실제로는 API에서 가져올 예정)
  const dummyLibraries = [
    {
      id: 1,
      name: '2025 성북구 작가 단체전',
      image: null,
      status: 'available'
    },
    {
      id: 2,
      name: '2025 성북구 작가 단체전',
      image: null,
      status: 'available'
    }
  ];

  useEffect(() => {
    // 공유 라이브러리 목록 가져오기 (실제로는 API 호출)
    setSharedLibraries(dummyLibraries);
  }, []);

  const handleBack = () => {
    navigate('/museum');
  };

  const handleLibrarySelect = (library) => {
    // 선택된 공유 라이브러리로 입장
    console.log('입장할 라이브러리:', library);
    
    // TODO: API 호출로 라이브러리 입장 처리
    
    // 공유 라이브러리 입장 페이지로 이동
    navigate('/exhibition/shared-library-entry', {
      state: { selectedLibrary: library }
    });
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>공유 라이브러리 선택</h1>
        </div>
      </div>

      {/* 안내 메시지 */}
      <div className={styles.infoMessage}>
        <span>입장하고 싶은 공유라이브러리를 선택해주세요</span>
      </div>

      {/* 공유 라이브러리 목록 */}
      <div className={styles.libraryList}>
        {sharedLibraries.map((library) => (
          <div
            key={library.id}
            className={styles.libraryCard}
            onClick={() => handleLibrarySelect(library)}
          >
            <div className={styles.libraryInfo}>
              <div className={styles.libraryImage}>
                {library.image ? (
                  <img src={library.image} alt="라이브러리 이미지" />
                ) : (
                  <div className={styles.defaultImage} />
                )}
              </div>
              <div className={styles.libraryDetails}>
                <span className={styles.libraryName}>{library.name}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
