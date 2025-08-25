import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { checkTokenStatus } from "../../apis/axios";

// 인증이 필요하지 않은 페이지들
const PUBLIC_ROUTES = ["/login"];

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log("=== AuthGuard 인증 체크 시작 ===");
    console.log("현재 경로:", location.pathname);
    console.log("현재 URL:", window.location.href);
    console.log("현재 쿠키:", document.cookie);

    // 공개 페이지인지 확인
    const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
    
    if (isPublicRoute) {
      console.log("공개 페이지 - 인증 체크 건너뜀");
      setIsAuthChecked(true);
      setIsAuthenticated(true);
      return;
    }

    // 토큰 상태 체크
    const tokenStatus = checkTokenStatus();
    console.log("토큰 상태:", tokenStatus);

    // 토큰이 없으면 로그인 페이지로 리다이렉트
    if (!tokenStatus.accessToken && !tokenStatus.refreshToken) {
      console.log("토큰이 없어서 로그인 페이지로 리다이렉트합니다.");
      console.log("navigate 함수 타입:", typeof navigate);
      
      // 즉시 리다이렉트를 위해 setTimeout 사용
      setTimeout(() => {
        try {
          navigate("/login", { replace: true });
          console.log("navigate() 호출 완료");
        } catch (error) {
          console.error("navigate() 오류:", error);
          // 대안: window.location 사용
          console.log("window.location으로 대체 리다이렉트 시도");
          window.location.replace("/login");
        }
      }, 0);
      
      // 인증 실패 상태로 설정
      setIsAuthenticated(false);
      setIsAuthChecked(true);
      return;
    }

    console.log("인증 체크 완료 - 토큰 존재");
    setIsAuthenticated(true);
    setIsAuthChecked(true);
  }, [navigate, location.pathname]);

  // 인증 체크가 완료되기 전까지는 로딩 상태 표시
  if (!isAuthChecked) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif'
      }}>
        인증 확인 중...
      </div>
    );
  }

  // 인증되지 않은 경우 빈 화면 (리다이렉트 중)
  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif'
      }}>
        로그인 페이지로 이동 중...
      </div>
    );
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return children;
};

export default AuthGuard;
