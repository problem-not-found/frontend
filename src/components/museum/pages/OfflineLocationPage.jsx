import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import styles from './offlineLocationPage.module.css';
import SearchBar from '@/components/feed/SearchBar';

export default function OfflineLocationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [address, setAddress] = useState('');
  const [exhibitionDescription, setExhibitionDescription] = useState('');



  const handleBack = () => {
    // 전시 데이터를 포함하여 뒤로 가기
    const exhibitionData = location.state?.exhibitionData || {};
    
    // Date 객체를 YYYY-MM-DD 문자열로 변환
    const safeExhibitionData = {
      ...exhibitionData,
      startDate: exhibitionData.startDate instanceof Date 
        ? exhibitionData.startDate.toISOString().split('T')[0] 
        : exhibitionData.startDate,
      endDate: exhibitionData.endDate instanceof Date 
        ? exhibitionData.endDate.toISOString().split('T')[0] 
        : exhibitionData.endDate
    };
    
    console.log('뒤로 가기 시 전달할 데이터:', {
      original: exhibitionData,
      converted: safeExhibitionData
    });
    
    navigate('/exhibition/upload', {
      state: {
        draft: {
          exhibitionData: safeExhibitionData,
          thumbnail: location.state?.thumbnail || null,
          artworks: location.state?.artworks || [],
          offlineLocation: location.state?.offlineLocation || null,
          participants: location.state?.participants || [],
          contactRegistered: location.state?.contactRegistered || false
        }
      }
    });
  };

  const handleComplete = () => {
    // 오프라인 장소 등록 완료
    console.log('오프라인 장소 등록 완료:', {
      address
    });
    
    // 전시 등록 페이지로 돌아가면서 오프라인 장소 데이터 전달
    const exhibitionData = location.state?.exhibitionData || {};
    
    navigate('/exhibition/upload', {
      state: {
        draft: {
          exhibitionData,
          thumbnail: location.state?.thumbnail || null,
          artworks: location.state?.artworks || [],
          offlineLocation: {
            address,
            addressName: address,
            offlineDescription: address
          },
          participants: location.state?.participants || [],
          contactRegistered: location.state?.contactRegistered || false
        }
      }
    });
  };

  const renderAddressInput = () => (
    <div className={styles.addressSection}>
      <div className={styles.addressInput}>
        <textarea
          placeholder="주소를 입력해주세요."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={100}
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
           disabled={!address.trim()}
         >
          등록 완료하기
        </button>
      </div>
    </div>
  );
}
