import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Exhibition from "./Exhibition";
import CameraController from "./CameraController";
import ResetCameraButton from "./ResetCameraButton";
import ControlsInfoModal from "./ControlsInfoModal";
import ErrorBoundary from "./common/ErrorBoundary";
import {
  useExhibitionDetail,
  usePieceImages,
} from "../apis/exhibition/exhibition";
import { ClipLoader } from "react-spinners";
import "./Gallery3D.css";

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>전시장을 불러오는 중...</p>
    </div>
  );
}

function Gallery3D({ exhibitionId: propExhibitionId = "1" }) {
  console.log('🏛️ Gallery3D 컴포넌트 렌더링:', { propExhibitionId });
  
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const { id } = useParams(); // URL에서 전시 ID 가져오기
  const exhibitionId = id ? parseInt(id, 10) : parseInt(propExhibitionId, 10);

  // Canvas 재생성을 위한 키 생성
  const canvasKey = useMemo(() => `canvas-${exhibitionId}-${Date.now()}`, [exhibitionId]);

  // 전시 정보 가져오기
  const {
    exhibition,
    loading: exhibitionLoading,
    error: exhibitionError,
  } = useExhibitionDetail(exhibitionId);

  // 전시 작품 이미지들 가져오기
  const { pieceImages, loading: pieceImagesLoading } = usePieceImages(
    exhibition?.pieceIdList
  );

  const handleArtworkClick = (artwork) => {
    console.log('🖱️ 작품 클릭:', artwork);
    
    // pieceImages에서 해당 작품의 상세 정보 찾기
    const pieceInfo = pieceImages?.find(piece => piece.pieceId === artwork.id);
    
    if (pieceInfo) {
      // API에서 가져온 실제 데이터로 작품 정보 구성
      const artworkData = {
        id: pieceInfo.pieceId,
        title: pieceInfo.title || `작품 ${pieceInfo.pieceId}`,
        artist: pieceInfo.creatorName || "작가 미상",
        year: pieceInfo.createdYear || new Date().getFullYear(),
        description: pieceInfo.description || "작품 설명이 없습니다.",
        image: pieceInfo.imageUrl || "/artwork1.png"
      };
      setSelectedArtwork(artworkData);
    } else {
      // fallback: 클릭된 artwork 데이터 사용
      setSelectedArtwork(artwork);
    }
  };

  const closeModal = () => {
    console.log('❌ 모달 닫기');
    setSelectedArtwork(null);
  };

  // WebGL 에러 처리 함수
  const handleWebGLError = () => {
    console.log('🔄 WebGL 컨텍스트 손실, Canvas 재생성 시도');
    // Canvas가 자동으로 재생성되도록 key를 업데이트
    window.location.reload();
  };

  // 로딩 상태
  if (exhibitionLoading || pieceImagesLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <ClipLoader color="#fff" size={40} />
        <p>전시장을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (exhibitionError || (!exhibitionId && id)) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
          backgroundColor: "#000",
          color: "#fff",
        }}
      >
        <h2>전시 정보를 불러올 수 없습니다.</h2>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>{exhibition?.title || "Artium Gallery"}</h1>
        <p>{exhibition?.description || "현대 미술의 새로운 시선"}</p>
      </div>

      {/* 초기 위치로 돌아가기 버튼 */}
      <ResetCameraButton />

      {/* 조작법 정보 모달 */}
      <ControlsInfoModal />

      <div className="canvas-container">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Canvas
              key={canvasKey} // Canvas 재생성을 위한 키
              camera={{
                position: [0, 2, 0],
                fov: 75,
              }}
              shadows
              onError={(error) => {
                console.error('❌ Canvas 에러 발생:', error);
                if (error.message.includes('Context Lost')) {
                  handleWebGLError();
                }
              }}
            >
              {/* 조명 설정 - 어둡고 분위기 있는 갤러리 */}
              <ambientLight intensity={1} color="#2a2a2a" />
              <directionalLight
                position={[15, 15, 8]}
                intensity={0.3}
                color="#4a4a4a"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-camera-far={50}
                shadow-camera-left={-25}
                shadow-camera-right={25}
                shadow-camera-top={25}
                shadow-camera-bottom={-25}
              />

              {/* 환경 설정 - 어두운 분위기 */}
              <Environment preset="night" intensity={0.1} />

            {/* 전시장 */}
            <Exhibition
              onArtworkClick={handleArtworkClick}
              exhibition={exhibition}
              pieceImages={pieceImages}
            />

              {/* 카메라 컨트롤러 */}
              <CameraController isModalOpen={!!selectedArtwork} />
            </Canvas>
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* 작품 정보 모달 */}
      {selectedArtwork && (
        <div className="artwork-modal-overlay" onClick={closeModal}>
          <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
            <div className="artwork-modal-header">
              <h2>{selectedArtwork.title || `작품 ${selectedArtwork.id}`}</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="artwork-modal-content">
              <div className="artwork-image">
                <img 
                  src={selectedArtwork.image || "/artwork1.png"} 
                  alt={selectedArtwork.title || `작품 ${selectedArtwork.id}`} 
                  onError={(e) => {
                    console.log('🖼️ 이미지 로딩 실패, 대체 이미지 사용:', selectedArtwork.image);
                    e.target.src = "/artwork1.png";
                  }}
                  onLoad={() => {
                    console.log('✅ 이미지 로딩 성공:', selectedArtwork.image);
                  }}
                />
              </div>
              <div className="artwork-info">
                <div className="artist-info">
                  <h3>{selectedArtwork.artist || "작가 미상"}</h3>
                  <p className="year">{selectedArtwork.year || "연도 없음"}</p>
                </div>
                <p className="description">
                  {selectedArtwork.description || "작품 설명이 없습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

Gallery3D.propTypes = {
  exhibitionId: PropTypes.string,
};

export default Gallery3D;
