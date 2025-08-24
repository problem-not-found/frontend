import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import ArtworkHeader from "../components/artwork/ArtworkHeader";
import ArtworkImage from "../components/artwork/ArtworkImage";
import ArtworkInfo from "../components/artwork/ArtworkInfo";
import ArtworkCreator from "../components/artwork/ArtworkCreator";
import ArtworkDescription from "../components/artwork/ArtworkDescription";
import ArtworkContact from "../components/artwork/ArtworkContact";
import ArtworkExhibition from "../components/artwork/ArtworkExhibition";
import BackToTopButton from "../components/common/BackToTopButton";
import {
  usePieceDetail,
  useExhibitionAuthor,
  useUserContact,
} from "../apis/exhibition/exhibition";
import styles from "./artworkDetailPage.module.css";

const ArtworkDetailPage = () => {
  const { id } = useParams(); // URL에서 작품 ID 가져오기
  const pieceId = id ? parseInt(id, 10) : null;

  // 작품 상세 정보 가져오기
  const {
    piece,
    loading: pieceLoading,
    error: pieceError,
  } = usePieceDetail(pieceId);

  // 작품 작가 정보 가져오기
  const { author, loading: authorLoading } = useExhibitionAuthor(piece?.userId);

  // 작가 연락처 정보 가져오기
  const { contact, loading: contactLoading } = useUserContact(piece?.userId);

  // 로딩 상태
  if (pieceLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <ClipLoader color="var(--color-main)" size={40} />
      </div>
    );
  }

  // 에러 상태
  if (pieceError || !piece) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2>작품 정보를 불러올 수 없습니다.</h2>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ArtworkHeader />

      <ArtworkImage
        images={[
          piece.imageUrl || "/artwork1.png",
          ...(piece.pieceDetails?.map((detail) => detail.imageUrl) || []),
        ]}
        alt={piece.title || "작품 이미지"}
        overlayText="디테일 컷을 미리보기로 확인해보세요"
      />

      <ArtworkInfo
        title={piece.title || "제목 없음"}
        medium={piece.medium || ""}
        description={piece.description || "작품 설명이 없습니다."}
        piece={piece}
      />

      <ArtworkDescription
        medium={piece.medium || ""}
        description={piece.description || "작품 설명이 없습니다."}
      />

      <ArtworkCreator
        creatorName={author?.nickname || "작가 정보 없음"}
        creatorImage={author?.profileImageUrl || "/creator-profile.png"}
        loading={authorLoading}
        creatorId={piece?.userId}
      />

      <ArtworkContact
        email={contact?.email || ""}
        instagram={contact?.instagram || ""}
        loading={contactLoading}
      />

      <ArtworkExhibition
        exhibitionTitle={
          piece.exhibitions?.[0]?.title || "현재 전시 중이지 않습니다"
        }
        exhibitionImage={
          piece.exhibitions?.[0]?.thumbnailImageUrl || "/example1.png"
        }
        statusText={piece.exhibitions?.[0] ? "지금 전시 중" : "전시 상태 정보"}
        exhibitionId={piece.exhibitions?.[0]?.exhibitionId}
      />

      <BackToTopButton />
    </div>
  );
};

export default ArtworkDetailPage;
