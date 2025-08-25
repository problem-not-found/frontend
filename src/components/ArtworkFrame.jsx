import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Plane } from "@react-three/drei";
import { TextureLoader } from "three";
import PropTypes from "prop-types";

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

    console.log("🖼️ React 방식으로 이미지 로딩 시작:", imageUrl);

    // React <img> 태그 방식처럼 HTML Image 객체 사용
    const img = new Image();

    // CORS 설정 (React img 태그처럼)
    img.crossOrigin = "anonymous";

    img.onload = () => {
      console.log("✅ HTML Image 로드 성공, TextureLoader로 변환 중...");

      // HTML Image를 Three.js TextureLoader로 변환
      const loader = new TextureLoader();
      const texture = loader.load(img.src);

      // 이미지 뒤집기 설정
      texture.flipY = true;

      setTexture(texture);
      setLoading(false);
      console.log("🎨 Three.js 텍스처 변환 완료!");
    };

    img.onerror = (err) => {
      console.error("❌ HTML Image 로드 실패:", err);
      console.error("실패한 URL:", imageUrl);

      // React img 태그처럼 fallback 시도 (CORS 없이)
      console.log("🔄 CORS 없이 재시도...");
      const fallbackImg = new Image();

      fallbackImg.onload = () => {
        console.log("✅ Fallback 로드 성공!");
        const loader = new TextureLoader();
        const texture = loader.load(fallbackImg.src);
        texture.flipY = true;
        setTexture(texture);
        setLoading(false);
      };

      fallbackImg.onerror = () => {
        console.error("❌ 모든 로드 방법 실패");
        setError(true);
        setLoading(false);
      };

      // CORS 설정 없이 시도
      fallbackImg.src = imageUrl;
    };

    // 이미지 로드 시작 (React img처럼)
    img.src = imageUrl;
  }, [imageUrl]);

  console.log(
    `✅ SafeImagePlane: ${
      error ? "에러 상태" : texture ? "텍스처 렌더링 성공" : "로딩 중"
    }`,
    {
      error,
      hasTexture: !!texture,
      imageUrl,
      texture,
    }
  );

  // 로딩 중일 때 회색 배경
  if (loading && !texture) {
    return (
      <Plane args={args} position={position}>
        <meshBasicMaterial color="#f0f0f0" />
      </Plane>
    );
  }

  // 에러 상태일 때 빨간 배경
  if (error && !texture) {
    return (
      <Plane args={args} position={position}>
        <meshBasicMaterial color="#ff6b6b" />
      </Plane>
    );
  }

  // 텍스처가 있을 때 이미지 렌더링
  if (texture) {
    return (
      <Plane
        args={args}
        position={position}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={onClick}
      >
        <meshBasicMaterial map={texture} transparent />
      </Plane>
    );
  }

  return null;
}

SafeImagePlane.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  args: PropTypes.array,
  position: PropTypes.array,
  onPointerOver: PropTypes.func,
  onPointerOut: PropTypes.func,
  onClick: PropTypes.func,
};

function ArtworkFrame({ artwork, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  console.log("🖼️ ArtworkFrame:", artwork.title);

  useFrame((state, delta) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "default";
  };

  const handleClick = () => {
    if (onClick) {
      onClick(artwork);
    }
  };

  return (
    <group ref={meshRef} position={artwork.position}>
      {/* 작품 프레임 */}
      <Box args={[4.2, 3.2, 0.1]} position={[0, 0, 0.05]}>
        <meshBasicMaterial color="#8B4513" />
      </Box>

      {/* 작품 이미지 */}
      <SafeImagePlane
        imageUrl={artwork.image}
        args={[4, 3]}
        position={[0, 0, 0.11]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      {/* 작품 정보 텍스트 */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {artwork.title}
      </Text>
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="#cccccc"
        anchorX="center"
        anchorY="middle"
        maxWidth={4}
      >
        {artwork.artist} ({artwork.year})
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
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default ArtworkFrame;
