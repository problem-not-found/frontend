import { useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Text, Box, Plane } from "@react-three/drei";
import { TextureLoader } from "three";

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
        <meshStandardMaterial map={texture} transparent={false} />
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

export default ArtworkFrame;
