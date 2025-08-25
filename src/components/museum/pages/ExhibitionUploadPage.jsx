import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import chevronLeft from '@/assets/museum/chevron-left.png';
import cameraIcon from '@/assets/user/camera.png';
import plusCircleIcon from '@/assets/museum/plus-circle.png';
import ExhibitionArtworkModal from '@museum/components/exhibition/ExhibitionArtworkModal';
import { getUserContact, getCurrentUser } from '@/apis/user/user.js';
import { createExhibition, updateExhibition, getExhibitionDetail } from '@/apis/museum/exhibition.js';
import { getMyPieceDetail } from '@/apis/museum/artwork.js';
import styles from './exhibitionUploadPage.module.css';

export default function ExhibitionUploadPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 수정 모드인지 확인 (URL 파라미터나 location.state로 판단)
  const isEditMode = location.state?.isEditMode || false;
  const exhibitionId = location.state?.exhibitionId || null;
  
  // 로컬 상태로 관리 (전시 정보)
  const [exhibitionData, setExhibitionData] = useState({
    title: '',
    description: '',
    startDate: null,
    endDate: null,
    totalDays: 0
  });


  // 모달 상태
  const [isArtworkModalOpen, setIsArtworkModalOpen] = useState(false);
  const [currentArtworkIndex, setCurrentArtworkIndex] = useState(0);
  const [isChangeMode, setIsChangeMode] = useState(false);
  
  // 썸네일과 전시 작품을 완전히 분리
  const [thumbnailFile, setThumbnailFile] = useState(null); // 썸네일 이미지 파일 (File 객체)
  const [thumbnailPreview, setThumbnailPreview] = useState(null); // 썸네일 미리보기 URL
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState(null); // 기존 썸네일 URL (수정 모드용)
  const [artworks, setArtworks] = useState([]); // 전시 작품만 (썸네일 제외)
  
  // 연락 정보 상태
  const [contactInfo, setContactInfo] = useState({
    isRegistered: false
  });
  
  // 전시 등록 관련 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offlineLocation, setOfflineLocation] = useState({
    address: '',
    addressName: '',
    offlineDescription: ''
  });
  const [participants, setParticipants] = useState([]);

  // 기간 설정 완료 상태 확인 함수
  const isDateRangeSet = () => {
    const { startDate, endDate } = exhibitionData;
    
    // Date 객체인 경우
    if (startDate instanceof Date && endDate instanceof Date) {
      return !isNaN(startDate.getTime()) && !isNaN(endDate.getTime());
    }
    
    // 문자열인 경우 (YYYY-MM-DD 형식)
    if (typeof startDate === 'string' && typeof endDate === 'string') {
      const startPattern = /^\d{4}-\d{2}-\d{2}$/;
      const endPattern = /^\d{4}-\d{2}-\d{2}$/;
      return startPattern.test(startDate) && endPattern.test(endDate);
    }
    
    return false;
  };

  // 오프라인 장소 등록 완료 상태 확인 함수
  const isOfflineLocationSet = () => {
    const { address, addressName } = offlineLocation;
    return address && address.trim().length > 0 && addressName && addressName.trim().length > 0;
  };

    // 현재 입력 상태를 하나로 묶어 라우팅 state로 넘길 draft
  const buildDraft = () => {
         // 전시 작품만 pieceId 리스트에 포함 (썸네일은 별도로 관리)
     const pieceIdList = artworks.map(artwork => artwork.pieceId || artwork.id).filter(Boolean);
    
    const draft = {
      exhibitionData,
      thumbnailFile, // 썸네일 파일 객체
      thumbnailPreview, // 썸네일 미리보기 URL
      existingThumbnailUrl, // 기존 썸네일 URL (수정 모드용)
      artworks, // 전시 작품만
      pieceIdList, // 전시 작품 ID 리스트
      offlineLocation,
      participantIdList: participants.map(participant => participant.userId || participant.id).filter(Boolean),
      contactRegistered: contactInfo.isRegistered,
      // API 요청 형식에 맞춰 날짜 데이터 저장 (이미 YYYY-MM-DD 형식)
      startDate: exhibitionData.startDate || null,
      endDate: exhibitionData.endDate || null,
             totalDays: exhibitionData.totalDays
     };
     
     return draft;
   };

    // 기간 설정 페이지에서 돌아왔을 때 데이터 복원 (통합)
  useEffect(() => {
    // location.state가 실제로 유효한 데이터를 가지고 있을 때만 처리
    if (location.state && (location.state.selectedDates || location.state.draft)) {
      const { selectedDates, draft } = location.state;
      
      setExhibitionData(prev => {
        let newData = { ...prev };
        
        // 1단계: draft 데이터 처리 (기본 데이터 먼저)
        if (draft) {
          // draft.exhibitionData에서 날짜 정보는 제외하고 기본 데이터만 설정
          if (draft.exhibitionData) {
            // 날짜 관련 필드를 명시적으로 제외
            const safeExhibitionData = { ...draft.exhibitionData };
            delete safeExhibitionData.startDate;
            delete safeExhibitionData.endDate;
            delete safeExhibitionData.totalDays;
            
            newData = {
              ...newData,
              ...safeExhibitionData
            };
          }
        }
        
        // 2단계: 기간 설정 데이터 처리 (최우선 - 나중에 덮어씀)
        if (selectedDates) {
          const { startDate, endDate, totalDays } = selectedDates;
          
          newData = {
            ...newData,
            startDate: startDate, // 이미 YYYY-MM-DD 문자열
            endDate: endDate,     // 이미 YYYY-MM-DD 문자열
            totalDays
          };
        }
        
        // 3단계: draft에서 날짜 데이터 복원 (selectedDates가 없을 때만)
        if (!selectedDates && draft) {
          // draft에서 직접 날짜 데이터 복원
          if (draft.startDate && draft.endDate) {
            newData = {
              ...newData,
              startDate: draft.startDate,
              endDate: draft.endDate,
              totalDays: draft.totalDays || 0
            };
          }
          
          // draft.exhibitionData에서도 날짜 데이터 확인 및 복원
          if (draft.exhibitionData && draft.exhibitionData.startDate && draft.exhibitionData.endDate) {
            newData = {
              ...newData,
              startDate: draft.exhibitionData.startDate,
              endDate: draft.exhibitionData.endDate,
              totalDays: draft.exhibitionData.totalDays || 0
            };
          }
        }
        
        return newData;
      });
      
      // 기타 상태 업데이트 (exhibitionData와 독립적)
      if (draft) {
        if (draft.artworks) setArtworks(draft.artworks);
        if (draft.offlineLocation) {
          setOfflineLocation(draft.offlineLocation);
        }
        if (draft.participants && Array.isArray(draft.participants)) {
          setParticipants(draft.participants);
        }
        if (typeof draft.contactRegistered === 'boolean') {
          setContactInfo(prev => ({ ...prev, isRegistered: draft.contactRegistered }));
        }
      }
    }
  }, [location.state]);


     // URL state에서 참여자 정보 받아오기 (필요 시 추가 처리)
   useEffect(() => {
     if (location.state?.participants) {
       // 여기서 참여자 정보를 처리할 수 있습니다
     }
   }, [location.state]);

  // 사용자 연락 정보 확인 및 기존 전시 정보 로드
  useEffect(() => {
    const checkUserContact = async () => {
      try {
        const userResponse = await getCurrentUser();
        if (userResponse && userResponse.data && userResponse.data.userId) {
          const userId = userResponse.data.userId;
          const contactResponse = await getUserContact(userId);
          
          if (contactResponse && contactResponse.data) {
            const contactData = contactResponse.data;
            if (contactData.email || contactData.instagram) {
              setContactInfo(prev => ({
                ...prev,
                isRegistered: true
              }));
            }
          }
        }
      } catch (error) {
        console.error('연락 정보 확인 실패:', error);
      }
    };

    // 수정 모드인 경우 기존 전시 정보 로드
    const loadExistingExhibition = async () => {
      if (isEditMode && exhibitionId) {
        try {
          const response = await getExhibitionDetail(exhibitionId);
          if (response?.data?.data) {
            const exhibition = response.data.data;
            
            // 기존 전시 정보 설정
            setExhibitionData({
              title: exhibition.title || '',
              description: exhibition.description || '',
              startDate: exhibition.startDate || null,
              endDate: exhibition.endDate || null,
              totalDays: exhibition.totalDays || 0
            });
            
            // 오프라인 장소 정보 설정
            setOfflineLocation({
              address: exhibition.address || '',
              addressName: exhibition.addressName || '',
              offlineDescription: exhibition.offlineDescription || ''
            });
            
            // 썸네일 설정 (수정 모드에서는 기존 썸네일을 미리보기에 로드하지 않음)
            if (exhibition.thumbnailImageUrl) {
              if (isEditMode) {
                // 수정 모드: 기존 썸네일 URL을 별도로 저장 (미리보기에는 로드하지 않음)
                setExistingThumbnailUrl(exhibition.thumbnailImageUrl);
              } else {
                // 신규 등록 모드: 썸네일 미리보기에 로드
                setThumbnailPreview(exhibition.thumbnailImageUrl);
              }
            }
            
                         // 전시 작품 목록 설정 (pieceIdList가 있는 경우)
             if (exhibition.pieceIdList && exhibition.pieceIdList.length > 0) {
               try {
                 console.log('전시 작품 ID 목록:', exhibition.pieceIdList);
                 
                 // 각 작품의 상세 정보를 가져와서 설정
                 const artworkPromises = exhibition.pieceIdList.map(async (pieceId) => {
                   try {
                     console.log(`작품 ${pieceId} 상세 정보 로드 중...`);
                     const artworkResponse = await getMyPieceDetail(pieceId);
                     
                      if (artworkResponse?.data) {
                        const artworkData = artworkResponse.data;
                        console.log(`작품 ${pieceId} 상세 정보:`, artworkData);
                        console.log(`작품 ${pieceId} API 응답 전체:`, artworkResponse);
                        console.log(`작품 ${pieceId} 응답 데이터 구조:`, {
                          hasData: !!artworkResponse.data,
                          hasDataData: !!artworkResponse.data,
                          dataKeys: artworkResponse.data ? Object.keys(artworkResponse.data) : [],
                          artworkDataKeys: artworkData ? Object.keys(artworkData) : []
                        });
                        
                        console.log(`작품 ${pieceId} 이미지 URL:`, artworkData.imageUrl);
                        console.log(`작품 ${pieceId} 메인 이미지 URL:`, artworkData.mainImageUrl);
                        console.log(`작품 ${pieceId} 썸네일 이미지 URL:`, artworkData.thumbnailImageUrl);
                        return {
                          pieceId: pieceId,
                          id: pieceId,
                          title: artworkData.title || `작품 ${pieceId}`,
                          description: artworkData.description || '',
                          mainImageUrl: artworkData.imageUrl, // 실제 이미지 URL
                          thumbnailImageUrl: artworkData.imageUrl, // 실제 이미지 URL
                          imageUrl: artworkData.imageUrl // fallback
                        };
                     } else {
                       console.warn(`작품 ${pieceId} 응답 데이터가 없습니다:`, artworkResponse);
                       return {
                         pieceId: pieceId,
                         id: pieceId,
                         title: `작품 ${pieceId}`,
                         mainImageUrl: null,
                         thumbnailImageUrl: null
                       };
                     }
                   } catch (error) {
                     console.error(`작품 ${pieceId} 상세 정보 로드 실패:`, error);
                     // 실패한 경우 기본 정보만 반환
                     return {
                       pieceId: pieceId,
                       id: pieceId,
                       title: `작품 ${pieceId}`,
                       imageUrl: null,
                       mainImageUrl: null,
                       thumbnailImageUrl: null
                     };
                   }
                 });
                 
                                   const artworkList = await Promise.all(artworkPromises);
                  
                  // 유효한 작품만 필터링 (pieceId가 있는 작품만)
                  const validArtworks = artworkList.filter(artwork => 
                    artwork && typeof artwork === 'object' && (artwork.pieceId || artwork.id)
                  );
                  
                  setArtworks(validArtworks);
                 
               } catch (error) {
                 console.error('전시 작품 상세 정보 로드 실패:', error);
                 // 에러 발생 시 기본 정보만 설정
                 const artworkList = exhibition.pieceIdList.map(pieceId => ({
                   pieceId: pieceId,
                   id: pieceId,
                   title: `작품 ${pieceId}`,
                   mainImageUrl: null,
                   thumbnailImageUrl: null
                 }));
                 setArtworks(artworkList);
               }
             }
            
            // 참여자 목록 설정 (participantIdList가 있는 경우)
            if (exhibition.participantIdList && exhibition.participantIdList.length > 0) {
              const participantList = exhibition.participantIdList.map(userId => ({
                userId: userId,
                id: userId
              }));
              setParticipants(participantList);
                         }
           }
        } catch (error) {
          console.error('기존 전시 정보 로드 실패:', error);
        }
      }
    };

    checkUserContact();
    loadExistingExhibition();
  }, [isEditMode, exhibitionId]);

  // 연락 정보 등록 페이지에서 돌아왔을 때 전시 정보 복원
  useEffect(() => {
    if (location.state?.contactUpdated && location.state?.draft) {
      const { draft } = location.state;
      
      // draft에서 모든 상태 복원
      if (draft.exhibitionData) {
        setExhibitionData(prev => ({
          ...prev,
          ...draft.exhibitionData
        }));
      }
      if (draft.artworks) setArtworks(draft.artworks);
      if (draft.offlineLocation) setOfflineLocation(draft.offlineLocation);
      if (draft.participants) setParticipants(draft.participants);
      
      setContactInfo(prev => ({
        ...prev,
        isRegistered: true
      }));
    } else if (location.state?.contactUpdated && location.state?.exhibitionData) {
             const { exhibitionData: savedExhibitionData, artworks: savedArtworks } = location.state;
       
       setExhibitionData(prev => ({
        ...prev,
        ...savedExhibitionData
      }));
      
      if (savedArtworks) setArtworks(savedArtworks);
      
      setContactInfo(prev => ({
        ...prev,
        isRegistered: true
      }));
    }
  }, [location.state]);

  // 오프라인 장소 등록 페이지에서 돌아왔을 때 정보 복원
  useEffect(() => {
    if (location.state?.offlineLocationData && location.state?.returnTo === 'exhibition-upload') {
      const { address, addressName, offlineDescription } = location.state.offlineLocationData;
      setOfflineLocation({
        address: address || '',
        addressName: addressName || '',
        offlineDescription: offlineDescription || ''
      });
    }
  }, [location.state]);

  // 전시 참여자 등록 페이지에서 돌아왔을 때 정보 복원
  useEffect(() => {
    if (location.state?.participantsData && location.state?.returnTo === 'exhibition-upload') {
      setParticipants(location.state.participantsData);
    }
  }, [location.state]);

  // 작품 라이브러리에서 돌아왔을 때 선택된 작품들 처리
  useEffect(() => {
    if (location.state?.returnFromLibrary && location.state?.selectedArtworks) {
      const { selectedArtworks, artworkIndex, isThumbnail, draft } = location.state;
      
      console.log('라이브러리에서 선택된 작품들:', selectedArtworks);
      console.log('복원할 draft:', draft);
      console.log('isThumbnail:', isThumbnail);
      console.log('artworkIndex:', artworkIndex);
      
      // 먼저 draft에서 상태 복원
      if (draft) {
        if (draft.exhibitionData) {
          setExhibitionData(prev => ({
            ...prev,
            ...draft.exhibitionData
          }));
        }
        if (draft.artworks) setArtworks(draft.artworks);
        if (draft.offlineLocation) setOfflineLocation(draft.offlineLocation);
        if (draft.participants) setParticipants(draft.participants);
        if (typeof draft.contactRegistered === 'boolean') {
          setContactInfo(prev => ({ ...prev, isRegistered: draft.contactRegistered }));
        }
      }
      
             // 그 다음 선택된 작품 처리
       if (isThumbnail) {
         // 썸네일로 선택된 경우 - 첫 번째 작품을 썸네일로 설정
         if (selectedArtworks.length > 0) {
           const thumbnailArtwork = selectedArtworks[0];
           console.log('썸네일로 선택된 작품:', thumbnailArtwork);
           
           // 현재 작품 목록이 비어있으면 첫 번째 작품으로 설정
           if (artworks.length === 0) {
             addThumbnailArtwork(thumbnailArtwork);
           } else {
             // 첫 번째 작품을 썸네일 작품으로 교체
             updateThumbnailArtwork(thumbnailArtwork);
           }
         }
       } else {
        // 전시 작품으로 선택된 경우
        if (artworkIndex !== undefined) {
          // 특정 인덱스에 작품 추가/교체
          if (artworkIndex >= 0) {
            if (artworkIndex < artworks.length) {
              // 기존 작품 교체
              updateArtwork(artworkIndex, selectedArtworks[0]);
            } else {
              // 새 작품 추가
              addArtwork(selectedArtworks[0]);
            }
          } else {
            // 새 작품 추가
            addArtwork(selectedArtworks[0]);
          }
        } else {
          // 여러 작품 추가
          selectedArtworks.forEach(artwork => {
            addArtwork(artwork);
          });
        }
      }
    }
  }, [location.state]);

  // 새 작품 등록 페이지에서 돌아왔을 때 처리
  useEffect(() => {
    if (location.state?.returnFromArtworkUpload && location.state?.draft) {
      const { draft, newArtwork, isThumbnail } = location.state;
      
      console.log('새 작품 등록 후 복원 데이터:', { draft, newArtwork, isThumbnail });
      
      // draft에서 상태 복원
      if (draft) {
        if (draft.exhibitionData) {
          setExhibitionData(prev => ({
            ...prev,
            ...draft.exhibitionData
          }));
        }
        if (draft.artworks) setArtworks(draft.artworks);
        if (draft.offlineLocation) setOfflineLocation(draft.offlineLocation);
        if (draft.participants) setParticipants(draft.participants);
        if (typeof draft.contactRegistered === 'boolean') {
          setContactInfo(prev => ({ ...prev, isRegistered: draft.contactRegistered }));
        }
      }
      
             // 새로 등록된 작품 처리
       if (newArtwork) {
         if (isThumbnail) {
           // 썸네일로 등록된 경우 - 첫 번째 작품으로 설정
           console.log('썸네일로 등록된 새 작품:', newArtwork);
           
           // 현재 작품 목록이 비어있으면 첫 번째 작품으로 설정
           if (artworks.length === 0) {
             addThumbnailArtwork(newArtwork);
           } else {
             // 첫 번째 작품을 새 썸네일 작품으로 교체
             updateThumbnailArtwork(newArtwork);
           }
         } else {
           addArtwork(newArtwork);
         }
       }
    }
  }, [location.state]);

  // Draft 초기화 함수
  const resetDraft = () => {
    setExhibitionData({
      title: '',
      description: '',
      startDate: '', // YYYY-MM-DD 형식 문자열로 초기화
      endDate: '',   // YYYY-MM-DD 형식 문자열로 초기화
      totalDays: 0
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setArtworks([]);
    setOfflineLocation({
      address: '',
      addressName: '',
      offlineDescription: ''
    });
    setParticipants([]);
    setContactInfo({
      isRegistered: false
    });

  };

  // 전시 등록 처리
  const handleSubmitExhibition = async () => {
    // 필수 입력 검증
    if (!exhibitionData.title || !exhibitionData.title.trim()) {
      alert('전시명을 입력해주세요.');
      return;
    }
    if (!exhibitionData.description || !exhibitionData.description.trim()) {
      alert('전시 소개를 입력해주세요.');
      return;
    }
    if (!exhibitionData.startDate || !exhibitionData.endDate) {
      alert('전시 기간을 설정해주세요.');
      return;
    }
         // 썸네일 파일이 필요한지 확인
     if (!thumbnailFile) {
       alert('전시 썸네일을 등록해주세요.');
       return;
     }
     
     // 전시 작품은 3개 이상 필요
     if (artworks.length < 3) {
       alert('전시 작품을 3개 이상 등록해주세요.');
       return;
     }
    if (!contactInfo.isRegistered) {
      alert('연락 정보를 등록해주세요.');
      return;
    }
    
    setIsSubmitting(true);
                     try {
                   // buildDraft()에서 모든 데이터를 가져와서 서버에 전송
          const draft = buildDraft();
         
                             // draft에서 데이터를 그대로 사용 (변환 과정 없이)
                     const pieceIdList = draft.pieceIdList || [];
           const participantIdList = draft.participantIdList || [];
           const thumbnailFile = draft.thumbnailFile;
        
        const exhibitionPayload = {
          pieceIdList,
          endDate: exhibitionData.endDate,
          participantIdList,
          startDate: exhibitionData.startDate,
          address: offlineLocation.address || '주소 미입력',
          title: exhibitionData.title.trim(),
          offlineDescription: offlineLocation.offlineDescription || '오프라인 전시 설명 미입력',
          description: exhibitionData.description.trim(),
          addressName: offlineLocation.addressName || '장소명 미입력'
          // thumbnailImageUrl 제거 - 이미지 파일로 전송
                 };
        
        // 수정 모드인지에 따라 다른 API 호출
        let response;
        if (isEditMode && exhibitionId) {
          response = await updateExhibition(exhibitionId, exhibitionPayload, thumbnailFile);
          alert('전시가 성공적으로 수정되었습니다!');
        } else {
          response = await createExhibition(exhibitionPayload, thumbnailFile);
          alert('전시가 성공적으로 등록되었습니다!');
        }
      
      // Draft 초기화
      resetDraft();
      
      // 전시 등록/수정 성공 후 뮤지엄 페이지로 이동하면서 refresh 플래그 전달
      navigate('/museum', { state: { refreshExhibitions: true } });
    } catch (error) {
      console.error('전시 등록 실패:', error);
      alert('전시 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/museum');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExhibitionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 썸네일 파일 처리 함수
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 유효성 검사
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택할 수 있습니다.');
        return;
      }
      
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      // 다른 필수 데이터들이 입력되지 않았으면 안내 메시지 표시
      if (!exhibitionData.title || !exhibitionData.title.trim()) {
        alert('썸네일 파일은 제일 마지막에 등록해주세요.\n먼저 전시명을 입력해주세요.');
        return;
      }
      
      if (!exhibitionData.description || !exhibitionData.description.trim()) {
        alert('썸네일 파일은 제일 마지막에 등록해주세요.\n먼저 전시 소개를 입력해주세요.');
        return;
      }
      
      if (!exhibitionData.startDate || !exhibitionData.endDate) {
        alert('썸네일 파일은 제일 마지막에 등록해주세요.\n먼저 전시 기간을 설정해주세요.');
        return;
      }
      
      if (!contactInfo.isRegistered) {
        alert('썸네일 파일은 제일 마지막에 등록해주세요.\n먼저 연락 정보를 등록해주세요.');
        return;
      }
      
      if (artworks.length < 3) {
        alert('썸네일 파일은 제일 마지막에 등록해주세요.\n먼저 전시 작품을 3개 이상 등록해주세요.');
        return;
      }
      
             // 모든 필수 데이터가 입력된 경우에만 썸네일 파일 저장
       setThumbnailFile(file);
       const previewUrl = URL.createObjectURL(file);
       setThumbnailPreview(previewUrl);
    }
  };

  // 전시 작품 등록 모달 열기 (새로 추가)
  const openArtworkModal = (index) => {
    setCurrentArtworkIndex(index);
    setIsChangeMode(false);
    setIsArtworkModalOpen(true);
  };

  // 전시 작품 변경 모달 열기
  const openChangeArtworkModal = (index) => {
    setCurrentArtworkIndex(index);
    setIsChangeMode(true);
    setIsArtworkModalOpen(true);
  };

  // 새 작품 등록 처리
  const handleNewArtwork = (file) => {
    if (currentArtworkIndex === -1) {
      // setThumbnail(file); // 제거
    } else {
      if (isChangeMode) {
        updateArtwork(currentArtworkIndex, file);
      } else {
        addArtwork(file);
      }
    }
  };





  // 썸네일 작품 관련 함수들은 더 이상 필요하지 않음 (파일 업로드 방식으로 변경)
  
  // 전시 작품 추가/수정/삭제 (객체 기반)
  const addArtwork = (artwork) => {
    // artwork 객체가 유효한지 확인
    if (!artwork || typeof artwork !== 'object') {
      console.error('유효하지 않은 작품 객체:', artwork);
      return;
    }
    
    // 작품 객체에 필요한 필드들이 모두 있는지 확인하고 추가
    const artworkWithRequiredFields = {
      ...artwork,
      // 이미지 URL을 여러 필드에서 찾아서 imageUrl로 통일
      imageUrl: artwork.imageUrl || artwork.mainImageUrl || artwork.thumbnailUrl || artwork.image || artwork.mainImage || artwork.url,
      // pieceId가 없으면 id 사용
      pieceId: artwork.pieceId || artwork.id
    };
    
         setArtworks(prev => [...prev, artworkWithRequiredFields]);
  };
  
  const updateArtwork = (index, artwork) => {
    // artwork 객체가 유효한지 확인
    if (!artwork || typeof artwork !== 'object') {
      console.error('유효하지 않은 작품 객체:', artwork);
      return;
    }
    
    // 작품 객체에 필요한 필드들이 모두 있는지 확인하고 수정
    const artworkWithRequiredFields = {
      ...artwork,
      // 이미지 URL을 여러 필드에서 찾아서 imageUrl로 통일
      imageUrl: artwork.imageUrl || artwork.mainImageUrl || artwork.thumbnailUrl || artwork.image || artwork.mainImage || artwork.url,
      // pieceId가 없으면 id 사용
      pieceId: artwork.pieceId || artwork.id
    };
    
         setArtworks(prev => {
      const next = [...prev];
      next[index] = artworkWithRequiredFields;
      return next;
    });
  };
  const removeArtwork = (index) => {
    // 인덱스 유효성 검사
    if (index < 0 || index >= artworks.length) {
      console.error('유효하지 않은 작품 인덱스:', index);
      return;
    }
    
    setArtworks(prev => prev.filter((_, i) => i !== index));
  };

  // 기간 설정 페이지로 이동 (초안 동봉!)
  const openDatePicker = () => {
    navigate('/exhibition/date-picker', {
      state: {
        initialDates: {
          startDate: exhibitionData.startDate,
          endDate: exhibitionData.endDate
        },
        draft: buildDraft(),         // ✅ 현재까지 입력한 값 모두
        returnTo: 'exhibition-upload'
      }
    });
  };

  // 전시 작품 슬라이드 렌더링 (전시 작품만)
  const renderArtworkSlides = () => {
    const slides = [];
    
    artworks.forEach((artwork, index) => {
      // artwork 객체가 유효한지 확인
      if (!artwork || typeof artwork !== 'object') {
        return; // 이 작품은 건너뛰기
      }
      
      slides.push(
        <div key={`artwork-${index}`} className={styles.artworkSlide}>
          <div className={styles.artworkImageContainer}>
            <div className={styles.artworkImageWrapper}>
                             <img 
                 src={artwork.imageUrl}
                 alt={`작품 ${index + 1}`} 
                 className={styles.artworkImage}
                 onError={(e) => {
                   e.target.style.display = 'none';
                   e.target.nextSibling.style.display = 'block';
                 }}
               />
              <button 
                className={styles.changeButton}
                onClick={() => openChangeArtworkModal(index)}
              >
                변경
              </button>
              <button 
                className={styles.removeButton}
                onClick={() => removeArtwork(index)}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      );
    });

    // 전시 작품은 최대 10개까지
    if (artworks.length < 10) {
      slides.push(
        <div key="add-artwork" className={styles.artworkSlide}>
          <div className={styles.artworkImageContainer}>
            <div 
              className={styles.imagePlaceholder}
              onClick={() => openArtworkModal(artworks.length)}
              style={{ cursor: 'pointer' }}
            >
              <img src={plusCircleIcon} alt="plus" className={styles.plusIcon} />
              <p className={styles.placeholderText}>
                전시 작품을 등록해주세요<br />
                (선택)
              </p>
            </div>
          </div>
        </div>
      );
    }
    return slides;
  };

  return (
    <div className={styles.container}>
      {/* 헤더 */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backButton} onClick={handleBack}>
            <img src={chevronLeft} alt="뒤로가기" className={styles.backIcon} />
          </button>
          <h1 className={styles.title}>{isEditMode ? '전시 수정하기' : '전시 등록하기'}</h1>
        </div>
      </div>

      <div className={styles.form}>
        {/* 전시 썸네일 및 작품 등록 */}
        <div className={styles.artworkSection}>
          <h2 className={styles.sectionTitle}>전시 작품 등록</h2>
          <div className={styles.artworkSlideContainer}>
                         {/* 전시 썸네일 */}
             <div className={styles.artworkSlide}>
               <div className={styles.artworkImageContainer}>
                 {thumbnailPreview ? (
                   <div className={styles.artworkImageWrapper}>
                     <img 
                       src={thumbnailPreview} 
                       alt="전시 썸네일" 
                       className={styles.artworkImage}
                       onError={(e) => {
                         e.target.style.display = 'none';
                       }}
                     />
                     <button 
                       className={styles.changeButton}
                       onClick={() => {
                         setThumbnailFile(null);
                         setThumbnailPreview(null);
                         alert('썸네일을 변경하려면 새로운 이미지 파일을 선택해주세요.');
                       }}
                     >
                       변경
                     </button>
                   </div>
                 ) : (
                   <div className={styles.imagePlaceholder}>
                     {isEditMode && existingThumbnailUrl ? (
                       // 수정 모드에서 기존 썸네일이 있는 경우
                       <div style={{ textAlign: 'center' }}>
                         <p className={styles.placeholderText} style={{ color: '#666', marginBottom: '10px' }}>
                           기존 썸네일이 있습니다
                         </p>
                         <p className={styles.placeholderText} style={{ fontSize: '12px', color: '#999' }}>
                           변경하려면 새 이미지를 선택하세요
                         </p>
                       </div>
                     ) : (
                       // 신규 등록 모드 또는 기존 썸네일이 없는 경우
                       <>
                         <input
                           type="file"
                           accept="image/*"
                           onChange={handleThumbnailChange}
                           style={{ display: 'none' }}
                           id="thumbnail-upload"
                         />
                         <label 
                           htmlFor="thumbnail-upload"
                           style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                         >
                           <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
                           <p className={styles.placeholderText}>
                             전시 썸네일을 등록해주세요<br />
                             (모든 정보 입력 후 마지막에 등록)
                           </p>
                         </label>
                       </>
                     )}
                     
                     {/* 수정 모드에서는 항상 파일 업로드 가능하도록 */}
                     <input
                       type="file"
                       accept="image/*"
                       onChange={handleThumbnailChange}
                       style={{ display: 'none' }}
                       id="thumbnail-upload-edit"
                     />
                     <label 
                       htmlFor="thumbnail-upload-edit"
                       style={{ 
                         cursor: 'pointer', 
                         display: 'flex', 
                         flexDirection: 'column', 
                         alignItems: 'center',
                         marginTop: '10px'
                       }}
                     >
                       <img src={cameraIcon} alt="camera" className={styles.cameraIcon} />
                       <p className={styles.placeholderText} style={{ fontSize: '12px' }}>
                         {isEditMode && existingThumbnailUrl ? '새 썸네일 선택' : '썸네일 선택'}
                       </p>
                     </label>
                   </div>
                 )}
               </div>
             </div>

            {/* 전시 작품 슬라이드 */}
            {renderArtworkSlides()}
          </div>
        </div>

        {/* 전시명 입력 */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            name="title"
            value={exhibitionData.title}
            onChange={handleInputChange}
            placeholder="전시명을 작성하세요"
            className={styles.titleInput}
          />
        </div>

        {/* 전시 소개 입력 */}
        <div className={styles.inputGroup}>
          <textarea
            name="description"
            value={exhibitionData.description}
            onChange={handleInputChange}
            placeholder="전시 소개를 작성하세요. (최대 500자)"
            className={styles.descriptionInput}
            rows={15}
            maxLength={500}
          />
        </div>

        {/* 추가 기능 버튼들 */}
        <div className={styles.additionalFeatures}>
          <button 
            type="button" 
            className={`${styles.featureButton} ${isDateRangeSet() ? styles.completed : ''}`}
            onClick={openDatePicker}
          >
            {isDateRangeSet() ? '기간 설정 완료' : '기간 설정하기 (필수)'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${contactInfo.isRegistered ? styles.contactRegistered : ''}`}
            onClick={() => navigate('/user/contact', {
              state: {
                draft: buildDraft()
              }
            })}
          >
            {contactInfo.isRegistered ? '연락 정보 등록됨' : '연락 정보 등록하기'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${isOfflineLocationSet() ? styles.completed : ''}`}
            onClick={() => navigate('/exhibition/offline-location', {
              state: {
                draft: buildDraft()
              }
            })}
          >
            {isOfflineLocationSet() ? '오프라인 장소 등록됨' : '오프라인 장소 등록하기'}
          </button>

          <button 
            type="button" 
            className={`${styles.featureButton} ${participants.length > 0 ? styles.completed : ''}`}
            onClick={() => navigate('/exhibition/participants', {
              state: {
                draft: buildDraft()
              }
            })}
          >
            {participants.length > 0 ? '전시 참여자 등록됨' : '전시 참여자 등록하기'}
          </button>
        </div>
      </div>

      {/* 하단 고정 전시 등록하기 버튼 */}
      <div className={styles.submitButtonContainer}>
        <button 
          type="button" 
          className={styles.submitButton}
          onClick={handleSubmitExhibition}
          disabled={isSubmitting}
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : (isEditMode ? '전시 수정하기' : '전시 등록하기')}
        </button>
      </div>

      {/* 전시 작품 등록 모달 */}
      <ExhibitionArtworkModal
        isOpen={isArtworkModalOpen}
        onClose={() => setIsArtworkModalOpen(false)}
        isThumbnail={currentArtworkIndex === -1}
        isChangeMode={isChangeMode}
        currentDraft={buildDraft()} // 현재 상태를 모달에 전달
        returnTo="exhibition-upload" // 돌아올 페이지 지정
      />
    </div>
  );
}