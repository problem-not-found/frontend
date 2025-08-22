import { createBrowserRouter } from "react-router-dom";
import FeedPage from "../pages/FeedPage";
import MuseumPage from "../pages/MuseumPage";
import MyPage from "../pages/MyPage";
import UserProfileDetailPage from "@/components/user/UserProfileDetailPage";
import UserEditPage from "@/components/user/UserEditPage";
import ContactEditPage from "@/components/user/ContactEditPage";
import MyArtworkPage from "@/components/museum/pages/MyArtworkPage";
import DraftArtworkPage from "@/components/museum/pages/DraftArtworkPage";
import ArtworkUploadPage from "@/components/museum/pages/ArtworkUploadPage";
import ExhibitionUploadPage from "@/components/museum/pages/ExhibitionUploadPage";
import ExhibitionParticipantPage from "@/components/museum/pages/ExhibitionParticipantPage";
import OfflineLocationPage from "@/components/museum/pages/OfflineLocationPage";
import MyExhibitionPage from "@/components/museum/pages/MyExhibitionPage";
import ArtworkLibraryPage from "@/components/museum/pages/ArtworkLibraryPage";
import ExhibitionDatePicker from "@/components/museum/components/exhibition/ExhibitionDatePicker";
import Gallery3D from "@/components/Gallery3D";


// 간단한 플레이스홀더 페이지들
const Placeholder = (label) => () => <div style={{ padding: 24 }}>{label}</div>;
const SearchPage = Placeholder("검색");
const TastePage = Placeholder("내 취향");

const router = createBrowserRouter([
  { path: "/", element: <FeedPage /> },
  { path: "/gallery", element: <Gallery3D /> },
  { path: "/museum", element: <MuseumPage /> },
  { path: "/mytype", element: <MyTypePage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/taste", element: <TastePage /> },
  { path: "/user", element: <MyPage /> },
  { path: "/user/profile", element: <UserProfileDetailPage /> },
  { path: "/user/edit", element: <UserEditPage /> },
  { path: "/user/contact", element: <ContactEditPage /> },
  { path: "/artwork", element: <MyArtworkPage /> },
  { path: "/artwork/my", element: <MyArtworkPage /> },
  { path: "/artwork/drafts", element: <DraftArtworkPage /> },
  { path: "/artwork/upload", element: <ArtworkUploadPage /> },
  { path: "/exhibition", element: <MyExhibitionPage /> },
  { path: "/exhibition/my", element: <MyExhibitionPage /> },
  { path: "/exhibition/upload", element: <ExhibitionUploadPage /> },
  { path: "/exhibition/participants", element: <ExhibitionParticipantPage /> },
  { path: "/exhibition/offline-location", element: <OfflineLocationPage /> },
  { path: "/artwork/library", element: <ArtworkLibraryPage /> },
  { path: "/exhibition/date-picker", element: <ExhibitionDatePicker /> },
]);

export default router;
