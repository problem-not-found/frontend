import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../pages/FeedPage";
import Gallery3D from "../components/Gallery3D";

// 간단한 플레이스홀더 페이지들
const Placeholder = (label) => () => <div style={{ padding: 24 }}>{label}</div>;
const MuseumPage = Placeholder("내 전시장");
const SearchPage = Placeholder("검색");
const TastePage = Placeholder("내 취향");
const UserPage = Placeholder("내 정보");

const router = createBrowserRouter([
  { path: "/", element: <FeedPage /> },
  { path: "/gallery", element: <Gallery3D /> },
  { path: "/museum", element: <MuseumPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/taste", element: <TastePage /> },
  { path: "/user", element: <UserPage /> },
]);

export default router;
