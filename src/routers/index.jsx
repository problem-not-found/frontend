import { createBrowserRouter } from "react-router-dom";
import AuthGuard from "../components/common/AuthGuard";
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
import ExhibitionInvitationPage from "@/components/museum/pages/ExhibitionInvitationPage";

import MyTypePage from "../pages/MyTypePage";
import ExhibitionDetailPage from "../pages/ExhibitionDetailPage";
import ArtworkDetailPage from "../pages/ArtworkDetailPage";
import CreatorDetailPage from "../pages/CreatorDetailPage";
import ReviewsPage from "../pages/ReviewsPage";
import WriteReviewPage from "../pages/WriteReviewPage";
import SearchPage from "../pages/SearchPage";
import TastePage from "../pages/TastePage";
import LoginPage from "../pages/LoginPage";

// 간단한 플레이스홀더 페이지들
const Placeholder = (label) => () => <div style={{ padding: 24 }}>{label}</div>;

const router = createBrowserRouter([
  { path: "/", element: <AuthGuard><FeedPage /></AuthGuard> },
  { path: "/gallery", element: <AuthGuard><Gallery3D /></AuthGuard> },
  { path: "/museum", element: <AuthGuard><MuseumPage /></AuthGuard> },
  { path: "/mytype", element: <AuthGuard><MyTypePage /></AuthGuard> },
  { path: "/exhibition/:id", element: <AuthGuard><ExhibitionDetailPage /></AuthGuard> },
  { path: "/artwork/:id", element: <AuthGuard><ArtworkDetailPage /></AuthGuard> },
  { path: "/creator/:id", element: <AuthGuard><CreatorDetailPage /></AuthGuard> },
  { path: "/reviews/:exhibitionId", element: <AuthGuard><ReviewsPage /></AuthGuard> },
  { path: "/write-review/:exhibitionId", element: <AuthGuard><WriteReviewPage /></AuthGuard> },
  { path: "/search", element: <AuthGuard><SearchPage /></AuthGuard> },
  { path: "/taste", element: <AuthGuard><TastePage /></AuthGuard> },
  { path: "/login", element: <LoginPage /> },
  { path: "/user", element: <AuthGuard><MyPage /></AuthGuard> },
  { path: "/user/profile", element: <AuthGuard><UserProfileDetailPage /></AuthGuard> },
  { path: "/user/edit", element: <AuthGuard><UserEditPage /></AuthGuard> },
  { path: "/user/contact", element: <AuthGuard><ContactEditPage /></AuthGuard> },
  { path: "/artwork", element: <AuthGuard><MyArtworkPage /></AuthGuard> },
  { path: "/artwork/my", element: <AuthGuard><MyArtworkPage /></AuthGuard> },
  { path: "/artwork/drafts", element: <AuthGuard><DraftArtworkPage /></AuthGuard> },
  { path: "/artwork/upload", element: <AuthGuard><ArtworkUploadPage /></AuthGuard> },
  { path: "/exhibition", element: <AuthGuard><MyExhibitionPage /></AuthGuard> },
  { path: "/exhibition/my", element: <AuthGuard><MyExhibitionPage /></AuthGuard> },
  { path: "/exhibition/invitations", element: <AuthGuard><ExhibitionInvitationPage /></AuthGuard> },
  { path: "/exhibition/upload", element: <AuthGuard><ExhibitionUploadPage /></AuthGuard> },
  { path: "/exhibition/participants", element: <AuthGuard><ExhibitionParticipantPage /></AuthGuard> },
  { path: "/exhibition/offline-location", element: <AuthGuard><OfflineLocationPage /></AuthGuard> },
  { path: "/artwork/library", element: <AuthGuard><ArtworkLibraryPage /></AuthGuard> },
  { path: "/exhibition/date-picker", element: <AuthGuard><ExhibitionDatePicker /></AuthGuard> },
]);

export default router;
