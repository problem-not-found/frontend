import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import styles from './offlineLocationPage.module.css';

export default function OfflineLocationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState('');
  const [addressName, setAddressName] = useState('');
  
  // URL state에서 draft 정보 받아오기
  const draft = location.state?.draft || {};
  const exhibitionData = draft.exhibitionData || {};
  

    const handleBack = () => {
    // draft 데이터가 있으면 그대로 전달, 없으면 기존 방식 사용
    if (draft && Object.keys(draft).length > 0) {
      navigate('/exhibition/upload', {
        state: {
          draft: draft
        }
      });
    } else {
      // 기존 방식 (하위 호환성)
      const exhibitionData = location.state?.exhibitionData || {};
      
      navigate('/exhibition/upload', {
        state: {
          draft: {
            exhibitionData: exhibitionData,
            thumbnail: location.state?.thumbnail || null,
            artworks: location.state?.artworks || [],
            offlineLocation: location.state?.offlineLocation || null,
            participants: location.state?.participants || [],
            contactRegistered: location.state?.contactRegistered || false
          }
        }
      });
    }
  };

  const handleComplete = () => {
    // draft 데이터가 있으면 기존 데이터에 오프라인 장소만 추가, 없으면 새로 생성
    if (draft && Object.keys(draft).length > 0) {
      const updatedDraft = {
        ...draft,
        offlineLocation: {
          address,
          addressName,
          offlineDescription: address // 주소를 설명으로도 사용
        }
      };
      
      navigate('/exhibition/upload', {
        state: {
          draft: updatedDraft
        }
      });
    } else {
      // 기존 방식 (하위 호환성)
      const exhibitionData = location.state?.exhibitionData || {};
      
      navigate('/exhibition/upload', {
        state: {
          draft: {
            exhibitionData,
            thumbnail: location.state?.thumbnail || null,
            artworks: location.state?.artworks || [],
            offlineLocation: {
              address,
              addressName,
            },
            participants: location.state?.participants || [],
            contactRegistered: location.state?.contactRegistered || false
          }
        }
      });
    }
  };

  const renderAddressInput = () => (
    <div className={styles.addressSection}>
      <div className={styles.addressInput}>
        <label className={styles.inputLabel}>주소</label>
        <textarea
          placeholder="도로명, 건물명, 지번을 입력해주세요."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={100}
          className={styles.addressField}
        />
      </div>
      <div className={styles.addressInput}>
        <label className={styles.inputLabel}>건물명</label>
        <textarea
          placeholder="건물명을 입력해주세요."
          value={addressName}
          onChange={(e) => setAddressName(e.target.value)}
          maxLength={50}
          className={styles.addressField}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {/* Status Bar 공간 */}
      <div style={{height: '54px'}}></div>
      
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="back" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>오프라인 장소 등록하기</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div style={{height: '10px'}}></div>
        {renderAddressInput()}
      </div>

      {/* 하단 버튼 */}
      <div className={styles.bottomButton}>
                 <button 
           className={styles.completeButton}
           onClick={handleComplete}
           disabled={!address.trim() || !addressName.trim()}
         >
          등록 완료하기
        </button>
      </div>
    </div>
  );
}