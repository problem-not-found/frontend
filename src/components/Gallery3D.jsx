import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Exhibition from "./Exhibition";
import CameraController from "./CameraController";
import ResetCameraButton from "./ResetCameraButton";
import ControlsInfoModal from "./ControlsInfoModal";
import ErrorBoundary from "./common/ErrorBoundary";
import "./Gallery3D.css";

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>전시장을 불러오는 중...</p>
    </div>
  );
}

function Gallery3D({ exhibitionId = "1" }) {
  console.log('🏛️ Gallery3D 컴포넌트 렌더링:', { exhibitionId });
  
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [canvasKey, setCanvasKey] = useState(0); // Canvas 재생성을 위한 키

  const handleArtworkClick = (artwork) => {
    console.log('🖱️ 작품 클릭:', artwork);
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    console.log('❌ 모달 닫기');
    setSelectedArtwork(null);
  };

  // WebGL Context Lost 에러 처리
  const handleWebGLError = () => {
    console.log('⚠️ WebGL Context Lost 감지, Canvas 재생성 시도');
    setCanvasKey(prev => prev + 1);
  };

  // Canvas 에러 이벤트 리스너
  useEffect(() => {
    const handleContextLost = () => {
      console.log('❌ WebGL Context Lost 발생');
      handleWebGLError();
    };

    const handleContextRestored = () => {
      console.log('✅ WebGL Context Restored');
    };

    // Canvas 요소에 이벤트 리스너 추가
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost);
      canvas.addEventListener('webglcontextrestored', handleContextRestored);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost);
        canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      }
    };
  }, [canvasKey]);

  console.log('📊 Gallery3D 상태:', { selectedArtwork, canvasKey });

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Artium Gallery</h1>
        <p>현대 미술의 새로운 시선</p>
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
                exhibitionId={exhibitionId} 
                onArtworkClick={handleArtworkClick} 
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
                  <h3>{selectedArtwork.artist || "작가명 없음"}</h3>
                  <p className="year">{selectedArtwork.year || "연도 없음"}</p>
                </div>
                <p className="description">
                  {selectedArtwork.description || "작품 설명이 없습니다."}
                </p>
                <div className="price">
                  {selectedArtwork.price || "가격 정보 없음"}
                </div>
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