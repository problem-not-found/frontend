import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, Euler, MathUtils } from "three";

function CameraController({ isModalOpen }) {
  const { camera, gl } = useThree();
  const keysPressed = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  const mouseRef = useRef({
    isPointerLocked: false,
    lastX: 0,
    lastY: 0,
  });

  // 터치 관련 상태 추가
  const touchRef = useRef({
    isTouching: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    startTime: 0,
    isMoving: false,
    moveThreshold: 3, // 픽셀 단위 이동 임계값 (낮춰서 더 민감하게 반응)
    // 핀치 줌을 위한 상태 추가
    isPinching: false,
    startDistance: 0,
    lastDistance: 0,
  });

  const cameraRotation = useRef({
    yaw: 0, // 좌우 회전만 사용
    pitch: 0, // 고정값으로 유지
  });

  // 카메라를 눈 위치에 고정하고 줌은 FOV로 처리
  const cameraState = useRef({
    position: new Vector3(0, 2, 0), // 실제 눈 위치 - 전시장 가운데에서 시작
    baseFOV: 75, // 기본 FOV
    zoomLevel: 1.0, // FOV 조정용 줌 레벨
  });

  // 초기 위치와 회전값 저장
  const initialPosition = new Vector3(0, 2, 0);
  const initialRotation = { yaw: 0, pitch: 0 };
  const initialZoom = 1.0;

  const moveSpeed = 0.1;
  const mouseSensitivity = 0.002;
  const touchSensitivity = 0.015; // 터치 감도를 적당히 조정하여 적절한 회전 속도 제공
  const minZoom = 0.8; // 최대 확대 (FOV: 93.75도)
  const maxZoom = 1.3; // 최대 축소 (FOV: 57.7도)
  const fixedHeight = 2; // 고정된 카메라 높이

  // 전시장 경계 설정
  const boundaries = {
    minX: -16, // 왼쪽 벽에서 1.5미터 떨어진 거리
    maxX: 16, // 오른쪽 벽에서 1.5미터 떨어진 거리
    minZ: -7, // 뒷벽에서 1미터 떨어진 거리
    maxZ: 7, // 앞쪽 벽에서 1미터 떨어진 거리
  };

  // 부드러운 회전을 위한 보간 변수 추가
  const smoothRotation = useRef({
    targetYaw: 0,
    currentYaw: 0,
    lerpFactor: 0.12, // 보간 계수 (적당히 조정하여 반응성과 부드러움의 균형)
  });

  // 초기 위치로 리셋하는 함수
  const resetToInitialPosition = () => {
    // 위치 리셋
    cameraState.current.position.copy(initialPosition);
    
    // 회전 리셋
    cameraRotation.current.yaw = initialRotation.yaw;
    cameraRotation.current.pitch = initialRotation.pitch;
    
    // 줌 리셋
    cameraState.current.zoomLevel = initialZoom;
    camera.fov = cameraState.current.baseFOV / initialZoom;
    camera.updateProjectionMatrix();
    
    // 부드러운 회전 값도 리셋
    smoothRotation.current.targetYaw = initialRotation.yaw;
    smoothRotation.current.currentYaw = initialRotation.yaw;
  };

  // 전역으로 리셋 함수 노출
  useEffect(() => {
    window.resetCameraToInitialPosition = resetToInitialPosition;
    
    return () => {
      delete window.resetCameraToInitialPosition;
    };
  }, []);

  // 모달 상태에 따른 포인터 락 관리
  useEffect(() => {
    if (isModalOpen) {
      // 모달이 열리면 포인터 락 해제
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    }
    
    // 초기화 시 smoothRotation 값 설정
    smoothRotation.current.targetYaw = cameraRotation.current.yaw;
    smoothRotation.current.currentYaw = cameraRotation.current.yaw;
  }, [isModalOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keysPressed.current) {
        keysPressed.current[key] = true;
      }
      
      // R키를 누르면 초기 위치로 리셋
      if (key === 'r') {
        resetToInitialPosition();
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

        // 마우스로도 부드러운 회전 적용
        const targetYaw = cameraRotation.current.yaw - deltaX;
        smoothRotation.current.targetYaw = targetYaw;
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
      mouseRef.current.isPointerLocked =
        document.pointerLockElement === gl.domElement;
    };

    // 터치 이벤트 핸들러 추가
    const handleTouchStart = (event) => {
      if (isModalOpen) return;
      
      if (event.touches.length === 1) {
        // 단일 터치
        const touch = event.touches[0];
        touchRef.current.isTouching = true;
        touchRef.current.isPinching = false;
        touchRef.current.startX = touch.clientX;
        touchRef.current.startY = touch.clientY;
        touchRef.current.lastX = touch.clientX;
        touchRef.current.lastY = touch.clientY;
        touchRef.current.startTime = Date.now();
        touchRef.current.isMoving = false;
      } else if (event.touches.length === 2) {
        // 핀치 제스처 시작
        touchRef.current.isPinching = true;
        touchRef.current.isTouching = false;
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch1.clientX - touch2.clientX, 2) +
          Math.pow(touch1.clientY - touch2.clientY, 2)
        );
        touchRef.current.startDistance = distance;
        touchRef.current.lastDistance = distance;
      }
      
      event.preventDefault();
    };

    const handleTouchMove = (event) => {
      if (isModalOpen) return;
      
      if (event.touches.length === 1 && touchRef.current.isTouching) {
        // 단일 터치 드래그
        const touch = event.touches[0];
        const deltaX = touch.clientX - touchRef.current.lastX;
        const deltaY = touch.clientY - touchRef.current.lastY;
        
        // 이동 거리 계산
        const moveDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (moveDistance > touchRef.current.moveThreshold) {
          touchRef.current.isMoving = true;
          
          // 터치 드래그로 카메라 회전 (부드럽게)
          const targetYaw = cameraRotation.current.yaw + deltaX * touchSensitivity;
          smoothRotation.current.targetYaw = targetYaw;
          
          // 터치 드래그로 줌 (수직 드래그) - 더 민감하게
          if (Math.abs(deltaY) > 5) { // 수직 이동이 충분할 때만 줌 적용
            const zoomSpeed = 0.005; // 줌 속도 조정
            const zoomFactor = deltaY > 0 ? (1 - zoomSpeed * Math.abs(deltaY)) : (1 + zoomSpeed * Math.abs(deltaY));
            const newZoomLevel = cameraState.current.zoomLevel * zoomFactor;
            
            if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
              cameraState.current.zoomLevel = newZoomLevel;
              camera.fov = cameraState.current.baseFOV / newZoomLevel;
              camera.updateProjectionMatrix();
            }
          }
        }
        
        touchRef.current.lastX = touch.clientX;
        touchRef.current.lastY = touch.clientY;
      } else if (event.touches.length === 2 && touchRef.current.isPinching) {
        // 핀치 줌
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch1.clientX - touch2.clientX, 2) +
          Math.pow(touch1.clientY - touch2.clientY, 2)
        );
        
        const deltaDistance = distance - touchRef.current.lastDistance;
        if (Math.abs(deltaDistance) > 5) {
          const pinchZoomSpeed = 0.01;
          const zoomFactor = deltaDistance > 0 ? (1 + pinchZoomSpeed) : (1 - pinchZoomSpeed);
          const newZoomLevel = cameraState.current.zoomLevel * zoomFactor;
          
          if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
            cameraState.current.zoomLevel = newZoomLevel;
            camera.fov = cameraState.current.baseFOV / newZoomLevel;
            camera.updateProjectionMatrix();
          }
        }
        
        touchRef.current.lastDistance = distance;
      }
      
      event.preventDefault();
    };

    const handleTouchEnd = (event) => {
      if (isModalOpen) return;
      
      if (touchRef.current.isTouching) {
        // 단일 터치 종료
        const touchDuration = Date.now() - touchRef.current.startTime;
        const moveDistance = Math.sqrt(
          Math.pow(touchRef.current.lastX - touchRef.current.startX, 2) +
          Math.pow(touchRef.current.lastY - touchRef.current.startY, 2)
        );
        
        // 짧은 터치 + 적은 이동 = 클릭으로 인식하여 이동
        if (touchDuration < 300 && moveDistance < 20 && !touchRef.current.isMoving) {
          // 터치 위치에 따른 이동 방향 결정
          const centerX = gl.domElement.clientWidth / 2;
          const centerY = gl.domElement.clientHeight / 2;
          const touchX = touchRef.current.startX;
          const touchY = touchRef.current.startY;
          
          // 기본적으로 앞으로 이동 (W키)
          keysPressed.current.w = true;
          setTimeout(() => { keysPressed.current.w = false; }, 300);
          
          // 사이드 영역 터치 시 추가로 옆으로 이동
          if (touchX < centerX - 80) {
            // 왼쪽 영역 - A키 (왼쪽 이동)
            keysPressed.current.a = true;
            setTimeout(() => { keysPressed.current.a = false; }, 200);
          } else if (touchX > centerX + 80) {
            // 오른쪽 영역 - D키 (오른쪽 이동)
            keysPressed.current.d = true;
            setTimeout(() => { keysPressed.current.d = false; }, 200);
          }
        }
        
        touchRef.current.isTouching = false;
        touchRef.current.isMoving = false;
      }
      
      if (touchRef.current.isPinching) {
        // 핀치 제스처 종료
        touchRef.current.isPinching = false;
      }
      
      event.preventDefault();
    };

    // 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    gl.domElement.addEventListener("wheel", handleWheel, { passive: false });
    gl.domElement.addEventListener("click", handleClick);
    gl.domElement.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    
    // 터치 이벤트 리스너 등록
    gl.domElement.addEventListener("touchstart", handleTouchStart, { passive: false });
    gl.domElement.addEventListener("touchmove", handleTouchMove, { passive: false });
    gl.domElement.addEventListener("touchend", handleTouchEnd, { passive: false });

    // 정리 함수
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      gl.domElement.removeEventListener("wheel", handleWheel);
      gl.domElement.removeEventListener("click", handleClick);
      gl.domElement.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      
      // 터치 이벤트 리스너 제거
      gl.domElement.removeEventListener("touchstart", handleTouchStart);
      gl.domElement.removeEventListener("touchmove", handleTouchMove);
      gl.domElement.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    camera,
    gl,
    minZoom,
    maxZoom,
    mouseSensitivity,
    touchSensitivity,
    fixedHeight,
    isModalOpen,
  ]);

  useFrame(() => {
    // 모달이 열려있으면 카메라 조작 중단
    if (isModalOpen) return;

    // 부드러운 회전 적용
    smoothRotation.current.currentYaw = MathUtils.lerp(
      smoothRotation.current.currentYaw,
      smoothRotation.current.targetYaw,
      smoothRotation.current.lerpFactor
    );
    cameraRotation.current.yaw = smoothRotation.current.currentYaw;
    
    // pitch는 고정값으로 유지 (0도)
    cameraRotation.current.pitch = 0;

    // 카메라 회전 적용 (Y축 회전만, pitch는 0으로 고정)
    camera.rotation.set(
      0, // pitch 고정 (상하 시점 변경 없음)
      cameraRotation.current.yaw,
      0,
      "YXZ"
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
      cameraState.current.position.add(
        forward.clone().multiplyScalar(moveSpeed)
      );
      moved = true;
    }
    if (keysPressed.current.s) {
      cameraState.current.position.add(
        forward.clone().multiplyScalar(-moveSpeed)
      );
      moved = true;
    }
    if (keysPressed.current.a) {
      cameraState.current.position.add(
        right.clone().multiplyScalar(-moveSpeed)
      );
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

  // 초기 위치로 돌아가기 버튼 렌더링
  return null;
}

export default CameraController;