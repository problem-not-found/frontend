import { useLoader } from "@react-three/fiber";
import { Text, Box, Plane, SpotLight } from "@react-three/drei";
import { TextureLoader, RepeatWrapping } from "three";
import PropTypes from "prop-types";
import { useExhibitionArtworks } from "../hooks/useExhibitionArtworks";
import ArtworkFrame from "./ArtworkFrame";

function Exhibition({ exhibitionId, onArtworkClick }) {
  console.log('🎭 Exhibition 컴포넌트 렌더링:', { exhibitionId });
  
  // 전시 정보와 작품들 로드
  const { exhibition, artworks, loading, error } = useExhibitionArtworks(exhibitionId);
  
  console.log('📊 Exhibition 상태:', { exhibition, artworksCount: artworks.length, loading, error });

  // 나무 바닥 텍스처 로드
  const woodTexture = useLoader(TextureLoader, "/wood-floor.jpg");

  // 텍스처 설정
  if (woodTexture) {
    woodTexture.wrapS = RepeatWrapping;
    woodTexture.wrapT = RepeatWrapping;
    woodTexture.repeat.set(8, 6); // 바닥 크기에 맞게 반복
  }

  // 로딩 중이거나 에러가 있으면 빈 그룹 반환
  if (loading) {
    console.log('⏳ Exhibition: 로딩 중...');
    return <group />;
  }
  
  if (error) {
    console.log('❌ Exhibition: 에러 발생:', error);
    return <group />;
  }
  
  if (!exhibition) {
    console.log('⚠️ Exhibition: 전시 정보가 없습니다.');
    return <group />;
  }

  console.log('🎨 Exhibition: 작품 렌더링 시작, 작품 수:', artworks.length);

  return (
    <group>
      {/* 바닥 - 나무 텍스처 적용 (어둡게) */}
      <Plane
        args={[35, 30]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          map={woodTexture}
          metalness={0.1}
          roughness={0.8}
          envMapIntensity={0.1}
        />
      </Plane>

      {/* 벽들 - 더 어둡게 */}
      {/* 뒷벽 */}
      <Plane args={[35, 10]} position={[0, 5, -8]} receiveShadow>
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* 왼쪽 벽 */}
      <Plane
        args={[16, 10]}
        position={[-17.5, 5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* 오른쪽 벽 */}
      <Plane
        args={[16, 10]}
        position={[17.5, 5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* 앞쪽 벽 (입구) */}
      <Plane
        args={[35, 10]}
        position={[0, 5, 8]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#e8e8e8" />
      </Plane>

      {/* 천장 - 어둡게 */}
      <Plane
        args={[35, 30]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 10, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#d0d0d0" />
      </Plane>

      {/* 각 작품별 스포트라이트 - 정면에서 비추도록 */}
      {artworks.map((artwork) => {
        console.log('💡 스포트라이트 생성:', artwork.id, artwork.position);
        
        // 벽 위치에 따라 조명 위치와 각도 계산
        const [x, y, z] = artwork.position;
        let lightPosition, lightTarget;

        if (z < -7) {
          // 뒷벽
          lightPosition = [x, 8.5, z + 3]; // 앞쪽에서 비춤
          lightTarget = [x, y, z];
        } else if (x < -16) {
          // 왼쪽 벽
          lightPosition = [x + 3, 8.5, z]; // 오른쪽에서 비춤
          lightTarget = [x, y, z];
        } else if (x > 16) {
          // 오른쪽 벽
          lightPosition = [x - 3, 8.5, z]; // 왼쪽에서 비춤
          lightTarget = [x, y, z];
        } else {
          // 앞쪽 벽
          lightPosition = [x, 8.5, z - 3]; // 뒤쪽에서 비춤
          lightTarget = [x, y, z];
        }

        return (
          <group key={`spotlight-${artwork.id}`}>
            <SpotLight
              position={lightPosition}
              target-position={lightTarget}
              angle={0.6}
              penumbra={0.4}
              intensity={3.0}
              color="#fff8e1"
              castShadow
              shadow-mapSize={[1024, 1024]}
              distance={15}
              decay={1.8}
            />

            {/* 천장의 조명 기구 */}
            <Box
              args={[0.4, 0.15, 0.4]}
              position={[lightPosition[0], 9.7, lightPosition[2]]}
              castShadow
            >
              <meshStandardMaterial
                color="#2a2a2a"
                metalness={0.8}
                roughness={0.2}
              />
            </Box>

            {/* 조명 기구의 빛나는 부분 */}
            <Box
              args={[0.3, 0.05, 0.3]}
              position={[lightPosition[0], 9.6, lightPosition[2]]}
            >
              <meshStandardMaterial
                color="#fff8e1"
                emissive="#fff8e1"
                emissiveIntensity={0.3}
              />
            </Box>
          </group>
        );
      })}

      {/* 전시 작품들 */}
      {artworks.map((artwork) => {
        console.log('🖼️ 작품 프레임 생성:', artwork.id, artwork.title, artwork.position);
        
        return (
          <ArtworkFrame
            key={artwork.id}
            artwork={artwork}
            position={artwork.position}
            onArtworkClick={onArtworkClick}
          />
        );
      })}

      {/* 전시 제목 - 별도 조명 */}
      <SpotLight
        position={[0, 9, -6]}
        target-position={[0, 6.5, -7.8]}
        angle={0.6}
        penumbra={0.4}
        intensity={1.5}
        color="#ffffff"
        distance={8}
      />

      <Text
        position={[0, 7, -7.8]}
        fontSize={0.4}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        {exhibition.title || "현대 미술의 새로운 시선"}
      </Text>

      <Text
        position={[0, 6.3, -7.8]}
        fontSize={0.2}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        {exhibition.startDate && exhibition.endDate 
          ? `${exhibition.startDate} - ${exhibition.endDate}`
          : "Contemporary Art Exhibition 2023"
        }
      </Text>
    </group>
  );
}

Exhibition.propTypes = {
  exhibitionId: PropTypes.string.isRequired,
  onArtworkClick: PropTypes.func.isRequired,
};

export default Exhibition;
