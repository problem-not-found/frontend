import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler } from 'three';

function CameraController({ isModalOpen }) {
  const { camera, gl } = useThree();
  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false
  });
  
  const mouseRef = useRef({
    isPointerLocked: false,
    lastX: 0,
    lastY: 0
  });
  
  const cameraRotation = useRef({
    yaw: 0,   // 좌우 회전만 사용
    pitch: 0  // 고정값으로 유지
  });
  
  // 카메라를 눈 위치에 고정하고 줌은 FOV로 처리
  const cameraState = useRef({
    position: new Vector3(0, 2, 8), // 실제 눈 위치
    baseFOV: 75, // 기본 FOV
    zoomLevel: 1.0 // FOV 조정용 줌 레벨
  });
  
  const moveSpeed = 0.1;
  const mouseSensitivity = 0.002;
  const minZoom = 0.8;  // 최대 확대 (FOV: 93.75도)
  const maxZoom = 1.3;  // 최대 축소 (FOV: 57.7도)
  const fixedHeight = 2; // 고정된 카메라 높이
  
  // 전시장 경계 설정
  const boundaries = {
    minX: -9.5,  // 왼쪽 벽에서 0.5 떨어진 거리
    maxX: 9.5,   // 오른쪽 벽에서 0.5 떨어진 거리
    minZ: -4.5,  // 뒷벽에서 0.5 떨어진 거리
    maxZ: 4.5    // 앞쪽 벽에서 0.5 떨어진 거리
  };

  // 모달 상태에 따른 포인터 락 관리
  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열리면 포인터 락 해제
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key] = true;
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key] = false;
      }
    };

    const handleWheel = (event) => {
      // 모달이 열려있으면 휠 이벤트 무시
      if (isModalOpen) return;
      
      event.preventDefault();
      
      // 줌 레벨 조정 (FOV 변경용) - 더 부드럽게
      const zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
      const newZoomLevel = cameraState.current.zoomLevel * zoomFactor;
      
      // 줌 레벨 제한
      if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
        cameraState.current.zoomLevel = newZoomLevel;
        
        // FOV 조정 (줌 레벨이 낮을수록 FOV가 좁아짐 = 확대)
        camera.fov = cameraState.current.baseFOV / newZoomLevel;
        camera.updateProjectionMatrix();
      }
    };

    const handleMouseMove = (event) => {
      if (mouseRef.current.isPointerLocked && !isModalOpen) {
        const deltaX = event.movementX * mouseSensitivity;
        // deltaY는 사용하지 않음 (상하 시점 변경 비활성화)
        
        cameraRotation.current.yaw -= deltaX;
        // pitch는 고정값으로 유지 (0도)
        cameraRotation.current.pitch = 0;
      }
    };

    const handleClick = () => {
      // 모달이 열려있으면 포인터 락 요청하지 않음
      if (isModalOpen) return;
      
      // 캔버스 클릭 시 포인터 락 요청
      if (!mouseRef.current.isPointerLocked) {
        gl.domElement.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      mouseRef.current.isPointerLocked = document.pointerLockElement === gl.domElement;
    };

    // 이벤트 리스너 등록
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('wheel', handleWheel, { passive: false });
    gl.domElement.addEventListener('click', handleClick);
    gl.domElement.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    // 정리 함수
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('wheel', handleWheel);
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [camera, gl, minZoom, maxZoom, mouseSensitivity, fixedHeight, isModalOpen]);

  useFrame(() => {
    // 모달이 열려있으면 카메라 조작 중단
    if (isModalOpen) return;
    
    // 카메라 회전 적용 (Y축 회전만, pitch는 0으로 고정)
    camera.rotation.set(
      0,  // pitch 고정 (상하 시점 변경 없음)
      cameraRotation.current.yaw,
      0,
      'YXZ'
    );

    // 카메라의 현재 방향 벡터들 계산
    const forward = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    
    // Y축 이동을 제거하여 수평 이동만 가능하게 함
    forward.y = 0;
    right.y = 0;
    forward.normalize();
    right.normalize();

    let moved = false;

    // WASD 키에 따른 실제 눈 위치 이동
    if (keysPressed.current.w) {
      cameraState.current.position.add(forward.clone().multiplyScalar(moveSpeed));
      moved = true;
    }
    if (keysPressed.current.s) {
      cameraState.current.position.add(forward.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keysPressed.current.a) {
      cameraState.current.position.add(right.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keysPressed.current.d) {
      cameraState.current.position.add(right.clone().multiplyScalar(moveSpeed));
      moved = true;
    }

    // 전시장 경계 제한 및 높이 고정
    if (moved) {
      // X축 경계 제한 (왼쪽/오른쪽 벽)
      cameraState.current.position.x = Math.max(
        boundaries.minX, 
        Math.min(boundaries.maxX, cameraState.current.position.x)
      );
      
      // Z축 경계 제한 (앞쪽/뒷벽)
      cameraState.current.position.z = Math.max(
        boundaries.minZ, 
        Math.min(boundaries.maxZ, cameraState.current.position.z)
      );
      
      // 높이 고정
      cameraState.current.position.y = fixedHeight;
    }

    // 카메라는 항상 눈 위치에 고정 (1인칭 시점)
    camera.position.copy(cameraState.current.position);
  });

  return null;
}

export default CameraController; 