import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Text, Box, Plane } from '@react-three/drei';
import { TextureLoader } from 'three';
import { artworks } from '../dummy';
import ArtworkFrame from './ArtworkFrame';

function Exhibition({ onArtworkClick }) {
  return (
    <group>
      {/* 바닥 */}
      <Plane
        args={[20, 20]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#f5f5f5" />
      </Plane>
      
      {/* 벽들 */}
      {/* 뒷벽 */}
      <Plane
        args={[20, 6]}
        position={[0, 3, -5]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>
      
      {/* 왼쪽 벽 */}
      <Plane
        args={[10, 6]}
        position={[-10, 3, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>
      
      {/* 오른쪽 벽 */}
      <Plane
        args={[10, 6]}
        position={[10, 3, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>
      
      {/* 앞쪽 벽 (입구) */}
      <Plane
        args={[20, 6]}
        position={[0, 3, 5]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" />
      </Plane>
      
      {/* 천장 */}
      <Plane
        args={[20, 20]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#f8f8f8" />
      </Plane>
      
      {/* 전시 작품들 */}
      {artworks.map((artwork) => (
        <ArtworkFrame
          key={artwork.id}
          artwork={artwork}
          position={artwork.position}
          onArtworkClick={onArtworkClick}
        />
      ))}
      
      {/* 전시 제목 */}
      <Text
        position={[0, 4, -4.9]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
        anchorY="middle"
      >
        현대 미술의 새로운 시선
      </Text>
      
      <Text
        position={[0, 3.5, -4.9]}
        fontSize={0.15}
        color="#666666"
        anchorX="center"
        anchorY="middle"
      >
        Contemporary Art Exhibition 2023
      </Text>
    </group>
  );
}

export default Exhibition; 