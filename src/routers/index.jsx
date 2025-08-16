import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../pages/FeedPage";
import MuseumPage from "../pages/MuseumPage";
import MyPage from "../pages/MyPage";
import UserProfileDetailPage from "../pages/UserProfileDetailPage";
import UserEditPage from "../pages/UserEditPage";
import Gallery3D from "../components/Gallery3D";

// 간단한 플레이스홀더 페이지들
const Placeholder = (label) => () => <div style={{ padding: 24 }}>{label}</div>;
const SearchPage = Placeholder("검색");
const TastePage = Placeholder("내 취향");

const router = createBrowserRouter([
  { path: "/", element: <FeedPage /> },
  { path: "/gallery", element: <Gallery3D /> },
  { path: "/museum", element: <MuseumPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/taste", element: <TastePage /> },
  { path: "/user", element: <MyPage /> },
  { path: "/user/profile", element: <UserProfileDetailPage /> },
  { path: "/user/edit", element: <UserEditPage /> },
]);

export default router;
