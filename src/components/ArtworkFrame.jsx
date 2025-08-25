import React, { useState, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { TextureLoader } from 'three';
import PropTypes from 'prop-types';
import { Text, Box, Plane } from "@react-three/drei";

function ArtworkFrame({ artwork, position, onArtworkClick }) {
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const frameRef = useRef();

  // 이미지 텍스처 로드
  useEffect(() => {
    const loadTexture = async () => {
      try {
        const textureLoader = new TextureLoader();
        
        // S3 이미지인 경우 Canvas를 통해 변환 시도
        if (artwork.image.startsWith('http')) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              try {
                // Canvas 크기 설정
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                
                // Canvas에 이미지 그리기
                ctx.drawImage(img, 0, 0);
                
                // Canvas를 base64로 변환
                const dataURL = canvas.toDataURL('image/jpeg', 0.9);
                
                // base64 이미지로 텍스처 로드
                textureLoader.load(dataURL, (texture) => {
                  texture.flipY = false;
                  setTexture(texture);
                  resolve();
                }, undefined, (error) => {
                  reject(error);
                });
                
              } catch (canvasError) {
                reject(canvasError);
              }
            };
            
            img.onerror = () => {
              reject(new Error('Image load failed'));
            };
            
            img.src = artwork.image;
          });
          
        } else {
          // 로컬 이미지 로딩
          const loadedTexture = await new Promise((resolve, reject) => {
            textureLoader.load(
              artwork.image,
              (texture) => resolve(texture),
              undefined,
              (error) => reject(error)
            );
          });
          
          loadedTexture.flipY = false;
          setTexture(loadedTexture);
        }
        
      } catch (error) {
        // 에러 발생 시 로컬 이미지 사용
        try {
          const fallbackImages = ['/artwork1.png', '/artwork2.png', '/artwork3.png', '/example1.png'];
          const artworkId = artwork.id.toString();
          const lastDigit = parseInt(artworkId.slice(-1)) || 0;
          const fallbackImage = fallbackImages[lastDigit % fallbackImages.length];
          
          const fallbackTexture = await new Promise((resolve, reject) => {
            const fallbackLoader = new TextureLoader();
            fallbackLoader.load(
              fallbackImage,
              (texture) => resolve(texture),
              undefined,
              (error) => reject(error)
            );
          });
          
          fallbackTexture.flipY = false;
          setTexture(fallbackTexture);
          
        } catch (fallbackError) {
          setTexture(null);
        }
      }
    };
    
    loadTexture();
  }, [artwork.image]);

  // 벽 위치에 따른 회전 계산
  const getRotation = () => {
    const [x, y, z] = position;

    // 왼쪽 벽 (x < -16)
    if (x < -16) {
      return [0, Math.PI / 2, 0]; // 90도 회전
    }
    // 오른쪽 벽 (x > 16)
    else if (x > 16) {
      return [0, -Math.PI / 2, 0]; // -90도 회전
    }
    // 앞쪽 벽 (z > 7)
    else if (z > 7) {
      return [0, Math.PI, 0]; // 180도 회전
    }
    // 뒷벽 (z < -7) 또는 기본
    else {
      return [0, 0, 0]; // 회전 없음
    }
  };

  // 호버 효과를 위한 애니메이션
  useFrame((state) => {
    if (frameRef.current) {
      const [x, y, z] = position;
      const offset = hovered ? 0.1 : 0;

      // 벽 방향에 따라 호버 오프셋 방향 조정
      if (x < -16) {
        // 왼쪽 벽
        frameRef.current.position.x = x + offset;
      } else if (x > 16) {
        // 오른쪽 벽
        frameRef.current.position.x = x - offset;
      } else if (z > 7) {
        // 앞쪽 벽
        frameRef.current.position.z = z - offset;
      } else {
        // 뒷벽
        frameRef.current.position.z = z + offset;
      }
    }
  });

  const handleClick = () => {
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };

  return (
    <group ref={frameRef} position={position} rotation={getRotation()}>
      {/* 프레임 */}
      <Box
        args={[2.2, 1.7, 0.1]}
        position={[0, 0, -0.05]}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={hovered ? "#d4af37" : "#8b4513"}
          metalness={0.3}
          roughness={0.7}
        />
      </Box>

      {/* 작품 이미지 영역 */}
      <Plane
        args={[1.8, 1.3]}
        position={[0, 0, 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <meshStandardMaterial 
          map={texture} 
          transparent={false}
          color={texture ? undefined : "#cccccc"} // 텍스처가 없으면 회색
        />
      </Plane>

      {/* 작품 정보 플레이트 */}
      <Plane args={[1.8, 0.2]} position={[0, -0.9, 0.01]}>
        <meshStandardMaterial color="#f0f0f0" />
      </Plane>

      {/* 작품 제목 */}
      <Text
        position={[0, -0.85, 0.02]}
        fontSize={0.08}
        color="#333333"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
      >
        {artwork.title}
      </Text>

      {/* 작가명 */}
      <Text
        position={[0, -0.95, 0.02]}
        fontSize={0.06}
        color="#666666"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
      >
        {artwork.artist}, {artwork.year}
      </Text>
    </group>
  );
}

ArtworkFrame.propTypes = {
  artwork: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  onArtworkClick: PropTypes.func,
};

export default ArtworkFrame;
