import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Plane } from "@react-three/drei";
import { TextureLoader } from "three";
import PropTypes from "prop-types";

// 안전한 이미지 로더 컴포넌트
function SafeImagePlane({
  imageUrl,
  args,
  position,
  onPointerOver,
  onPointerOut,
  onClick,
}) {
  const [texture, setTexture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      console.warn("이미지 URL이 없습니다");
      setError(true);
      setLoading(false);
      return;
    }

    console.log("이미지 로딩 시작:", imageUrl);
    
    // S3 URL에서 파일명만 추출하는 함수
    const extractFilenameFromS3Url = (url) => {
      if (!url) return '';
      
      console.log("원본 URL:", url);
      
      // UUID 패턴으로 파일명 추출 (가장 우선순위)
      const uuidPattern = /([a-f0-9-]{36})/;
      const match = url.match(uuidPattern);
      if (match && match[1]) {
        const filename = match[1];
        console.log("UUID 패턴에서 추출:", filename);
        return filename;
      }
      
      // UUID가 없는 경우 원본 반환
      console.log("UUID 패턴 매칭 실패, 원본 반환:", url);
      return url;
    };
    
    // 파일명 추출
    const filename = extractFilenameFromS3Url(imageUrl);
    console.log("추출된 파일명:", filename);
    
    // HTML Image 객체를 사용하여 백엔드 프록시를 통해 이미지 로드
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      console.log("✅ HTML Image 로드 성공, TextureLoader로 변환 중...");

      // HTML Image를 Three.js TextureLoader로 변환
      const loader = new TextureLoader();
      const texture = loader.load(
        `https://api.artium.life/api/piece?filename=${filename}`, // 파일명만 전송
        undefined,
        undefined,
        (err) => {
          console.error("❌ TextureLoader 로드 실패", err);
          setError(true);
          setLoading(false);
        }
      );

      // 이미지 뒤집기 설정
      texture.flipY = true;

      setTexture(texture);ㅎ
      setLoading(false);
      console.log("🎨 Three.js 텍스처 변환 완료!");
    };

    img.onerror = (err) => {
      console.error("❌ HTML Image 로드 실패:", imageUrl);
      console.error("에러 상세:", err);
      
      // 백엔드 프록시 URL로 재시도 (파일명만 사용)
      const proxyUrl = `https://api.artium.life/api/piece?filename=${filename}`;
      console.log("🔄 백엔드 프록시 URL로 재시도:", proxyUrl);
      
      const retryImg = new Image();
      retryImg.crossOrigin = "anonymous";
      
      retryImg.onload = () => {
        console.log("✅ 백엔드 프록시로 로딩 성공:", proxyUrl);
        
        const retryLoader = new TextureLoader();
        const retryTexture = retryLoader.load(
          proxyUrl,
          undefined,
          undefined,
          (retryErr) => {
            console.error("❌ 백엔드 프록시로도 실패:", retryErr);
            setError(true);
            setLoading(false);
          }
        );
        
        retryTexture.flipY = true;
        setTexture(retryTexture);
        setLoading(false);
      };
      
      retryImg.onerror = (retryErr) => {
        console.error("❌ 백엔드 프록시로도 실패:", retryErr);
        setError(true);
        setLoading(false);
      };
      
      retryImg.src = proxyUrl;
    };

    // 백엔드 프록시 URL로 이미지 로드 시작 (파일명만 사용)
    const proxyUrl = `https://api.artium.life/api/piece?filename=${filename}`;
    img.src = proxyUrl;
  }, [imageUrl]);

  if (loading) {
    return (
      <Plane
        args={args}
        position={position}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <meshStandardMaterial color="#f0f0f0" />
        {/* 로딩 텍스트 */}
      </Plane>
    );
  }

  if (error || !texture) {
    console.warn("❌ SafeImagePlane: 에러 상태 또는 텍스처 없음", {
      error,
      hasTexture: !!texture,
      imageUrl,
    });
    return (
      <Plane
        args={args}
        position={position}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <meshStandardMaterial color="#ff6b6b" />
        {/* 에러 표시를 위해 빨간색 사용 */}
      </Plane>
    );
  }

  console.log("✅ SafeImagePlane: 텍스처 렌더링 성공", { imageUrl, texture });
  return (
    <Plane
      args={args}
      position={position}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    >
      <meshStandardMaterial map={texture} transparent={false} />
    </Plane>
  );
}

function ArtworkFrame({ artwork, position, onArtworkClick }) {
  const [hovered, setHovered] = useState(false);
  const frameRef = useRef();

  // 디버깅을 위한 로그
  console.log("ArtworkFrame 렌더링:", artwork.title, position, artwork.image);

  // 벽 위치에 따른 회전 계산
  const getRotation = () => {
    const [x, , z] = position;

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
  useFrame(() => {
    if (frameRef.current) {
      const [x, , z] = position;
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
      <SafeImagePlane
        imageUrl={artwork.image}
        args={[1.8, 1.3]}
        position={[0, 0, 0.01]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      />

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

SafeImagePlane.propTypes = {
  imageUrl: PropTypes.string,
  args: PropTypes.array.isRequired,
  position: PropTypes.array.isRequired,
  onPointerOver: PropTypes.func,
  onPointerOut: PropTypes.func,
  onClick: PropTypes.func,
};

ArtworkFrame.propTypes = {
  artwork: PropTypes.shape({
    image: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    year: PropTypes.number,
  }).isRequired,
  position: PropTypes.array.isRequired,
  onArtworkClick: PropTypes.func,
};

export default ArtworkFrame;
