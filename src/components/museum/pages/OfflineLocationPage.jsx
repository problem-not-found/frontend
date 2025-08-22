import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import searchIcon from '@/assets/footer/search.svg';
import styles from './offlineLocationPage.module.css';

export default function OfflineLocationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1); // 1: 검색, 2: 결과, 3: 소개입력
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [exhibitionDescription, setExhibitionDescription] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiLoadingMessage, setApiLoadingMessage] = useState('카카오맵 API 로딩 중...');

  // 카카오맵 API 스크립트 로드
  useEffect(() => {
    console.log('=== 카카오맵 API 초기화 시작 ===');
    console.trace('useEffect 호출 스택');
    
    // 이미 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      console.log('카카오맵 API가 이미 로드되어 있습니다.');
      console.log('기존 window.kakao 객체:', window.kakao);
      return;
    }

    console.log('기존 window.kakao 상태:', {
      'window.kakao': !!window.kakao,
      'window.kakao.maps': !!(window.kakao && window.kakao.maps),
      'window.kakao.maps.services': !!(window.kakao && window.kakao.maps && window.kakao.maps.services)
    });

    const script = document.createElement('script');
    // 환경 변수에서 API 키를 가져오거나, 직접 입력
    const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY || '7ad52f7b94094552a3513f9f7218363c';
    
    if (!apiKey || apiKey === 'YOUR_KAKAO_APP_KEY') {
      console.error('카카오맵 API 키가 설정되지 않았습니다.');
      alert('카카오맵 API 키를 설정해주세요.');
      return;
    }
    
    console.log('=== 스크립트 생성 정보 ===');
    console.log('API 키:', apiKey);
    console.log('스크립트 URL:', `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services`);
    console.trace('스크립트 생성 위치');
    
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services`;
    script.async = true;
    
    console.log('스크립트 태그 생성 완료:', script);
    console.log('스크립트 src:', script.src);
    console.log('스크립트 async:', script.async);
    console.log('스크립트 readyState:', script.readyState);
    
    script.onload = () => {
      console.log('=== 스크립트 onload 이벤트 발생 ===');
      console.trace('onload 콜백 스택');
      console.log('카카오맵 스크립트 로드 완료');
      
      // 카카오맵 SDK의 공식적인 초기화 완료 감지 사용
      if (window.kakao && window.kakao.maps) {
        console.log('카카오맵 기본 객체 확인됨');
        console.log('현재 readyState:', window.kakao.maps.readyState);
        
        // services 라이브러리가 로드되지 않은 경우 명시적으로 로드
        if (!window.kakao.maps.services || Object.keys(window.kakao.maps.services).length === 0) {
          console.log('services 라이브러리가 로드되지 않음, 명시적으로 로드 시도');
          
          // services.js 스크립트 직접 로드
          const servicesScript = document.createElement('script');
          servicesScript.src = '//t1.daumcdn.net/mapjsapi/js/libs/services/1.0.2/services.js';
          servicesScript.async = true;
          
          servicesScript.onload = () => {
            console.log('services.js 로드 완료');
            // 약간의 지연 후 services 객체 확인
            setTimeout(() => {
              if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
                console.log('Geocoder 서비스 사용 가능 (명시적 로드 후)');
                setIsApiReady(true);
                setApiLoadingMessage('카카오맵 API 준비 완료!');
              } else {
                console.error('여전히 Geocoder 서비스를 찾을 수 없습니다');
                setApiLoadingMessage('Geocoder 서비스 로드 실패');
              }
            }, 500);
          };
          
          servicesScript.onerror = () => {
            console.error('services.js 로드 실패');
            setApiLoadingMessage('services 라이브러리 로드 실패');
          };
          
          document.head.appendChild(servicesScript);
          return;
        }
        
        // readyState가 2가 아니면 아직 로딩 중
        if (window.kakao.maps.readyState !== 2) {
          console.log('카카오맵 SDK 아직 로딩 중, load 콜백 등록');
          
          window.kakao.maps.load(() => {
            console.log('=== 카카오맵 SDK 로딩 완료 ===');
            console.log('최종 readyState:', window.kakao.maps.readyState);
            console.log('사용 가능한 서비스들:', Object.keys(window.kakao.maps.services || {}));
            
            if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
              console.log('Geocoder 서비스 사용 가능');
              setIsApiReady(true);
              setApiLoadingMessage('카카오맵 API 준비 완료!');
              console.log('API 상태 업데이트: 준비 완료');
            } else {
              console.error('Geocoder 서비스를 찾을 수 없습니다');
              setApiLoadingMessage('Geocoder 서비스를 찾을 수 없습니다');
            }
          });
        } else {
          console.log('카카오맵 SDK 이미 로딩 완료됨');
          console.log('사용 가능한 서비스들:', Object.keys(window.kakao.maps.services || {}));
          
          if (window.kakao.maps.services && window.kakao.maps.services.Geocoder) {
            console.log('Geocoder 서비스 사용 가능 (이미 로딩됨)');
            setIsApiReady(true);
            setApiLoadingMessage('카카오맵 API 준비 완료!');
          } else {
            console.error('Geocoder 서비스를 찾을 수 없습니다 (이미 로딩됨)');
            setApiLoadingMessage('Geocoder 서비스를 찾을 수 없습니다');
          }
        }
      } else {
        console.error('카카오맵 기본 객체를 찾을 수 없습니다');
      }
    };
    
    script.onerror = (error) => {
      console.error('=== 카카오맵 API 스크립트 로드 실패 ===');
      console.trace('onerror 콜백 스택');
      console.error('에러 객체:', error);
      console.error('에러 타입:', error?.type);
      console.error('에러 타겟:', error?.target);
      console.error('에러 메시지:', error?.message);
      alert('지도 API 로드에 실패했습니다. API 키와 도메인 설정을 확인해주세요.');
    };
    
    console.log('=== 스크립트 DOM에 추가 ===');
    console.trace('DOM 추가 위치');
    document.head.appendChild(script);
    console.log('스크립트가 DOM에 추가되었습니다.');
    console.log('현재 head의 스크립트 태그들:', document.head.querySelectorAll('script[src*="kakao"]'));

    return () => {
      console.log('=== useEffect 정리 함수 실행 ===');
      if (document.head.contains(script)) {
        document.head.removeChild(script);
        console.log('스크립트가 DOM에서 제거되었습니다.');
      }
    };
  }, []);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/exhibition/upload');
    }
  };

  const handleSearch = async () => {
    console.log('=== 검색 함수 호출 시작 ===');
    console.trace('handleSearch 호출 스택');
    
    if (!searchQuery.trim()) {
      console.log('검색어가 비어있습니다.');
      return;
    }
    
    console.log('검색어:', searchQuery);
    console.log('API 준비 상태:', isApiReady);
    
    // API 상태 확인
    if (!isApiReady) {
      console.error('=== API 상태 확인 실패 ===');
      console.trace('API 상태 확인 실패 위치');
      console.error('isApiReady:', isApiReady);
      alert('카카오맵 API가 아직 로드되지 않았습니다. 잠시만 기다려주세요.');
      return;
    }
    
    console.log('API 상태 확인 완료, 검색 시작');
    setIsLoading(true);
    
    try {
      // 카카오 주소 검색 API 사용
      const results = await searchAddress(searchQuery);
      console.log('검색 성공, 결과:', results);
      setSearchResults(results);
      setCurrentStep(2);
    } catch (error) {
      console.error('=== 주소 검색 실패 ===');
      console.trace('주소 검색 실패 위치');
      console.error('에러 객체:', error);
      console.error('에러 메시지:', error.message);
      console.error('에러 스택:', error.stack);
      alert(error.message || '주소 검색에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
      console.log('검색 완료, 로딩 상태 해제');
    }
  };

  // 카카오 주소 검색 함수
  const searchAddress = async (query) => {
    console.log('=== searchAddress 함수 호출 ===');
    console.trace('searchAddress 호출 스택');
    console.log('검색 쿼리:', query);
    
    return new Promise((resolve, reject) => {
      try {
        console.log('=== Geocoder 서비스 사용 시작 ===');
        console.log('window.kakao.maps.services.Geocoder 생성 시도');
        
        if (!window.kakao.maps.services.Geocoder) {
          console.error('Geocoder 생성자 함수가 존재하지 않습니다.');
          console.log('window.kakao.maps.services의 사용 가능한 키들:', Object.keys(window.kakao.maps.services));
          reject(new Error('Geocoder 서비스를 사용할 수 없습니다.'));
          return;
        }
        
        const geocoder = new window.kakao.maps.services.Geocoder();
        console.log('Geocoder 인스턴스 생성 성공:', geocoder);
        
        console.log('addressSearch 메서드 호출 시작');
        geocoder.addressSearch(query, (result, status) => {
          console.log('=== addressSearch 콜백 실행 ===');
          console.log('검색 결과:', result);
          console.log('검색 상태:', status);
          console.log('결과 타입:', typeof result);
          console.log('결과 길이:', Array.isArray(result) ? result.length : '배열이 아님');
          
          if (status === window.kakao.maps.services.Status.OK) {
            console.log('검색 성공, 결과 변환 시작');
            const addresses = result.map((item, index) => {
              console.log(`결과 ${index}번째 아이템:`, item);
              return {
                id: item.id,
                roadName: item.road_address?.address_name || item.address_name,
                address: item.address_name,
                buildingName: item.road_address?.building_name || '',
                zoneNumber: item.road_address?.zone_no || '',
                detailAddress: item.address_name,
                x: item.x,
                y: item.y
              };
            });
            console.log('변환된 주소:', addresses);
            resolve(addresses);
          } else {
            console.error('=== 검색 실패 ===');
            console.error('실패 상태:', status);
            console.error('실패 상태 타입:', typeof status);
            reject(new Error(`주소를 찾을 수 없습니다. (상태: ${status})`));
          }
        });
      } catch (error) {
        console.error('=== Geocoder 사용 중 오류 ===');
        console.trace('Geocoder 오류 위치');
        console.error('에러 객체:', error);
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
        reject(new Error(`주소 검색 중 오류가 발생했습니다: ${error.message}`));
      }
    });
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCurrentStep(3);
  };

  const handleComplete = () => {
    // 여기에 완료 로직 추가
    console.log('오프라인 장소 등록 완료:', {
      location: selectedLocation,
      description: exhibitionDescription
    });
    navigate('/exhibition/upload');
  };

  const renderSearchStep = () => (
    <>
      <div className={styles.searchSection}>
        <div className={styles.searchInput}>
          <input
            type="text"
            placeholder="도로명, 건물명, 지번 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={styles.searchField}
            disabled={!isApiReady}
          />
          <button 
            className={styles.searchButton} 
            onClick={handleSearch} 
            disabled={isLoading || !isApiReady}
          >
            <img src={searchIcon} alt="search" />
          </button>
        </div>
        {isLoading && <div className={styles.loadingText}>검색 중...</div>}
      </div>
      
      <div className={styles.exampleSection}>
        <h3 className={styles.exampleTitle}>입력 예시</h3>
        <div className={styles.exampleText}>
          <p className={styles.label}>도로명+ 건물번호</p>
          <p className={styles.value}>남대문로 9길 40</p>
          <br />
          <p className={styles.label}>지역명(동/리) + 번지</p>
          <p className={styles.value}>중구 다동 155</p>
          <br />
          <p className={styles.label}>지역명(동/리)+ 건물명</p>
          <p className={styles.value}>분당 주공</p>
        </div>
      </div>
    </>
  );

  const renderResultStep = () => (
    <div className={styles.resultSection}>
      <div className={styles.locationResults}>
        {searchResults.length > 0 ? (
          searchResults.map((location, index) => (
            <div 
              key={location.id || index} 
              className={styles.locationItem} 
              onClick={() => handleLocationSelect(location)}
            >
              <div className={styles.locationLabel}>도로명</div>
              <div className={styles.locationValue}>
                {location.roadName || location.address}
              </div>
              <div className={styles.locationLabel}>지번</div>
              <div className={styles.locationValue}>
                {location.detailAddress}
              </div>
              {location.buildingName && (
                <>
                  <div className={styles.locationLabel}>건물명</div>
                  <div className={styles.locationValue}>
                    {location.buildingName}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            검색 결과가 없습니다. 다른 키워드로 검색해보세요.
          </div>
        )}
      </div>
    </div>
  );

  const renderDescriptionStep = () => (
    <div className={styles.descriptionSection}>
      <div className={styles.selectedLocation}>
        <div className={styles.locationLabel}>도로명</div>
        <div className={styles.locationValue}>{selectedLocation?.roadName || selectedLocation?.address}</div>
        <div className={styles.locationLabel}>지번</div>
        <div className={styles.locationValue}>{selectedLocation?.detailAddress}</div>
        {selectedLocation?.buildingName && (
          <>
            <div className={styles.locationLabel}>건물명</div>
            <div className={styles.locationValue}>{selectedLocation.buildingName}</div>
          </>
        )}
      </div>
      
      <div className={styles.descriptionInput}>
        <textarea
          placeholder="오프라인 전시에 대한 소개를 작성해보세요&#10;(최대 500자)"
          value={exhibitionDescription}
          onChange={(e) => setExhibitionDescription(e.target.value)}
          maxLength={500}
          className={styles.descriptionField}
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
        {currentStep === 1 && renderSearchStep()}
        {currentStep === 2 && renderResultStep()}
        {currentStep === 3 && renderDescriptionStep()}
      </div>

      {/* 하단 버튼 */}
      {currentStep === 3 && (
        <div className={styles.bottomButton}>
          <button 
            className={styles.completeButton}
            onClick={handleComplete}
            disabled={!exhibitionDescription.trim()}
          >
            등록 완료하기
          </button>
        </div>
      )}
    </div>
  );
}
