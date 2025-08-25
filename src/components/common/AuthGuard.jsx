import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { APIService } from "../../apis/axios";

// 인증이 필요하지 않은 페이지들
const PUBLIC_ROUTES = ["/login"];

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 공개 페이지인지 확인
  const isPublicRoute = PUBLIC_ROUTES.includes(location.pathname);

  useEffect(() => {
    if (isPublicRoute) {
      console.log("🔓 공개 페이지 접근:", location.pathname);
      setIsChecking(false);
      setIsAuthenticated(true);
      return;
    }

    // 보호된 페이지의 경우 초기 인증 체크
    const checkAuth = async () => {
      try {
        console.log(
          "🔒 보호된 페이지 접근 - 인증 체크 시작:",
          location.pathname
        );

        // 간단한 인증 체크 API 호출 (예: 사용자 정보 가져오기)
        await APIService.private.get("/api/users/me");

        console.log("✅ 인증 성공");
        setIsAuthenticated(true);
      } catch (error) {
        console.log("❌ 인증 실패:", error.response?.status);

        // 401, 403만 로그인으로 리다이렉트 (네트워크 오류는 제외)
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.log("🚪 인증 오류로 인한 로그인 페이지 리다이렉트");
          navigate("/login", { replace: true });
          return;
        }

        // 네트워크 오류나 기타 오류는 그냥 인증된 상태로 처리
        console.log("⚠️ 네트워크 오류 또는 기타 오류 - 페이지 표시 계속");
        setIsAuthenticated(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [location.pathname, isPublicRoute, navigate]);

  // 공개 페이지는 바로 렌더링
  if (isPublicRoute) {
    return children;
  }

  // 인증 체크 중일 때 로딩 표시
  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          ></div>
          <p>인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증 성공 시 자식 컴포넌트 렌더링
  if (isAuthenticated) {
    return children;
  }

  // 기본적으로 아무것도 렌더링하지 않음 (리다이렉트 처리됨)
  return null;
};

export default AuthGuard;
