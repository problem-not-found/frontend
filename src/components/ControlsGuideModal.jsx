import React, { useEffect, useState } from 'react';

function ControlsGuideModal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2초 후 자동으로 숨김
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.9)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        textAlign: 'center',
        maxWidth: '400px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 0.5s ease-in-out',
      }}
    >
      <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#ffd700' }}>
        🎮 전시장 조작법
      </h2>
      
      <div style={{ lineHeight: '1.6', fontSize: '14px' }}>
        <div style={{ marginBottom: '15px' }}>
          <strong>🖱️ 마우스:</strong> 드래그로 시점 회전
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>⌨️ 키보드:</strong> WASD로 이동
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>📱 터치:</strong> 슬라이드로 시점 회전, 핀치로 줌
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>🖱️ 휠:</strong> 줌 인/아웃
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>🏠 R키:</strong> 처음 위치로 돌아가기
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <strong>👆 클릭:</strong> 작품 정보 보기
        </div>
      </div>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#ccc', 
        marginTop: '20px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '8px'
      }}>
        ⏱️ 2초 후 자동으로 사라집니다
      </div>
    </div>
  );
}

export default ControlsGuideModal;
