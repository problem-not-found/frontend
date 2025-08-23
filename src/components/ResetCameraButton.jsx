import React from 'react';

function ResetCameraButton() {
  const handleReset = () => {
    if (window.resetCameraToInitialPosition) {
      window.resetCameraToInitialPosition();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        userSelect: 'none',
        transition: 'background 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.9)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(0, 0, 0, 0.7)';
      }}
      onClick={handleReset}
      title="R키를 눌러도 초기 위치로 돌아갑니다"
    >
      🏠 처음위치로
    </div>
  );
}

export default ResetCameraButton;
