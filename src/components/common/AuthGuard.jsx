import { useLocation } from "react-router-dom";

// 인증이 필요하지 않은 페이지들
const PUBLIC_ROUTES = ["/login"];

const AuthGuard = ({ children }) => {
  const location = useLocation();

  // 공개 페이지인지 확인
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);
  
  if (isPublicRoute) {
    console.log("🔓 공개 페이지 접근:", location.pathname);
    return children;
  }

  console.log("🔒 보호된 페이지 접근:", location.pathname);
  console.log("📋 401/403 에러 발생 시 axios 인터셉터가 자동으로 /login으로 리다이렉트합니다.");
  
  // 토큰 체크 없이 바로 자식 컴포넌트 렌더링
  // 실제 인증은 API 호출 시 axios 인터셉터에서 처리
  return children;
};

export default AuthGuard;
