import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3, Euler } from 'three';

function CameraController() {
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
  
  // 카메라 기본 위치와 줌 레벨을 분리
  const cameraState = useRef({
    basePosition: new Vector3(0, 2, 8), // WASD로 조정되는 기본 위치
    zoomLevel: 1.0, // 마우스 휠로 조정되는 줌 레벨
    baseDistance: 8 // 기본 거리
  });
  
  const moveSpeed = 0.1;
  const mouseSensitivity = 0.002;
  const minZoom = 0.3;  // 최대 확대 (가까이)
  const maxZoom = 2.5;  // 최대 축소 (멀리)
  const fixedHeight = 2; // 고정된 카메라 높이

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
      event.preventDefault();
      
      // 줌 레벨만 조정 (기본 위치는 건드리지 않음)
      const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
      const newZoomLevel = cameraState.current.zoomLevel * zoomFactor;
      
      // 줌 레벨 제한
      if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
        cameraState.current.zoomLevel = newZoomLevel;
      }
    };

    const handleMouseMove = (event) => {
      if (mouseRef.current.isPointerLocked) {
        const deltaX = event.movementX * mouseSensitivity;
        // deltaY는 사용하지 않음 (상하 시점 변경 비활성화)
        
        cameraRotation.current.yaw -= deltaX;
        // pitch는 고정값으로 유지 (0도)
        cameraRotation.current.pitch = 0;
      }
    };

    const handleClick = () => {
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
  }, [camera, gl, minZoom, maxZoom, mouseSensitivity, fixedHeight]);

  useFrame(() => {
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

    // WASD 키에 따른 기본 위치 이동
    if (keysPressed.current.w) {
      cameraState.current.basePosition.add(forward.clone().multiplyScalar(moveSpeed));
      moved = true;
    }
    if (keysPressed.current.s) {
      cameraState.current.basePosition.add(forward.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keysPressed.current.a) {
      cameraState.current.basePosition.add(right.clone().multiplyScalar(-moveSpeed));
      moved = true;
    }
    if (keysPressed.current.d) {
      cameraState.current.basePosition.add(right.clone().multiplyScalar(moveSpeed));
      moved = true;
    }

    // 벽 충돌 방지 및 높이 고정 (기본 위치에 적용)
    if (moved) {
      const boundary = 8;
      cameraState.current.basePosition.x = Math.max(-boundary, Math.min(boundary, cameraState.current.basePosition.x));
      cameraState.current.basePosition.z = Math.max(-boundary, Math.min(boundary, cameraState.current.basePosition.z));
      cameraState.current.basePosition.y = fixedHeight;
    }

    // 최종 카메라 위치 = 기본 위치 + 줌 오프셋
    // 현재 시점 방향으로 줌 레벨만큼 앞뒤로 이동
    const zoomOffset = forward.clone().multiplyScalar(cameraState.current.baseDistance * (cameraState.current.zoomLevel - 1));
    camera.position.copy(cameraState.current.basePosition).add(zoomOffset);
  });

  return null;
}

export default CameraController; 