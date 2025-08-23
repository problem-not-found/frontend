import React, { useEffect, useState } from 'react';

function ControlsInfoModal() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3초 후 자동으로 숨김
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

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
        zIndex: 1500,
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '25px',
        borderRadius: '12px',
        textAlign: 'left',
        maxWidth: '350px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
        animation: 'slideInUp 0.6s ease-out',
        backdropFilter: 'blur(10px)',
      }}
    >
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '18px', 
        color: '#ffd700',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        🎮 조작법
      </h3>
      
      <div style={{ 
        lineHeight: '1.5', 
        fontSize: '14px',
        marginBottom: '20px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <strong>📱 터치:</strong> 앞으로 이동
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>↔️ 슬라이드:</strong> 화면 회전
        </div>
        
        <div style={{ marginBottom: '12px' }}>
          <strong>👆 핀치:</strong> 확대 / 축소
        </div>
      </div>
      
      <div style={{ 
        fontSize: '11px', 
        color: '#aaa', 
        padding: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '6px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        textAlign: 'center'
      }}>
        ⏱️ 3초 후 자동으로<br/>사라집니다
      </div>
    </div>
  );
}

export default ControlsInfoModal;
