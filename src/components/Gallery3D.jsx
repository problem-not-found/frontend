import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense, useState } from 'react';
import Exhibition from './Exhibition';
import CameraController from './CameraController';
import './Gallery3D.css';

function LoadingFallback() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>전시장을 불러오는 중...</p>
    </div>
  );
}

function Gallery3D() {
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const handleArtworkClick = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const closeModal = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h1>Artium Gallery</h1>
        <p>현대 미술의 새로운 시선</p>
      </div>
      
      <div className="canvas-container">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{
              position: [0, 2, 8],
              fov: 75
            }}
            shadows
          >
            {/* 조명 설정 */}
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <pointLight position={[0, 3, 0]} intensity={0.5} />
            
            {/* 환경 설정 */}
            <Environment preset="studio" />
            
            {/* 전시장 */}
            <Exhibition onArtworkClick={handleArtworkClick} />
            
            {/* 카메라 컨트롤러 */}
            <CameraController />
          </Canvas>
        </Suspense>
      </div>
      
      {/* 작품 정보 모달 */}
      {selectedArtwork && (
        <div className="artwork-modal-overlay" onClick={closeModal}>
          <div className="artwork-modal" onClick={(e) => e.stopPropagation()}>
            <div className="artwork-modal-header">
              <h2>{selectedArtwork.title}</h2>
              <button className="close-button" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="artwork-modal-content">
              <div className="artwork-image">
                <img src={selectedArtwork.image} alt={selectedArtwork.title} />
              </div>
              <div className="artwork-info">
                <div className="artist-info">
                  <h3>{selectedArtwork.artist}</h3>
                  <p className="year">{selectedArtwork.year}</p>
                </div>
                <p className="description">{selectedArtwork.description}</p>
                <div className="price">{selectedArtwork.price}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="gallery-footer">
        <div className="controls-info">
          <p>⌨️ WASD로 이동 | 🔍 휠로 확대/축소 | ✋ 클릭으로 작품 정보 보기</p>
        </div>
      </div>
    </div>
  );
}

export default Gallery3D; 