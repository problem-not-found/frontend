import { useRef, useState, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Box, Plane } from '@react-three/drei';
import { TextureLoader } from 'three';

function ArtworkFrame({ artwork, position, onArtworkClick }) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef();
  
  // 작품 이미지 텍스처 로드
  const texture = useLoader(TextureLoader, artwork.image);
  
  // 텍스처 설정
  useEffect(() => {
    if (texture) {
      texture.flipY = false;
    }
  }, [texture]);
  
  // 호버 효과를 위한 애니메이션
  useFrame((state) => {
    if (frameRef.current) {
      frameRef.current.position.z = position[2] + (hovered ? 0.1 : 0);
    }
  });

  const handleClick = () => {
    if (onArtworkClick) {
      onArtworkClick(artwork);
    }
  };

  return (
    <group ref={frameRef} position={position}>
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
        />
      </Plane>
      
      {/* 작품 정보 플레이트 */}
      <Plane
        args={[1.8, 0.2]}
        position={[0, -0.9, 0.01]}
      >
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

export default ArtworkFrame; 