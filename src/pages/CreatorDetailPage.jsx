import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import CreatorHeader from "../components/creator/CreatorHeader";
import CreatorProfile from "../components/creator/CreatorProfile";
import CreatorDescription from "../components/creator/CreatorDescription";
import CreatorContact from "../components/creator/CreatorContact";
import CreatorExhibitions from "../components/creator/CreatorExhibitions";
import CreatorArtworks from "../components/creator/CreatorArtworks";
import BackToTopButton from "../components/common/BackToTopButton";
import {
  useExhibitionAuthor,
  useUserContact,
  useUserPieces,
  useUserExhibitions,
} from "../apis/exhibition/exhibition";
import styles from "./creatorDetailPage.module.css";

const CreatorDetailPage = () => {
  const { id } = useParams(); // URL에서 크리에이터 ID 가져오기
  const creatorId = id ? parseInt(id, 10) : null;

  // 크리에이터 기본 정보 가져오기
  const {
    author: creator,
    loading: creatorLoading,
    error: creatorError,
  } = useExhibitionAuthor(creatorId);

  // 크리에이터 연락처 정보 가져오기
  const { contact, loading: contactLoading } = useUserContact(creatorId);

  // 크리에이터 작품 목록 가져오기
  const { pieces, loading: piecesLoading } = useUserPieces(creatorId, 1, 5);

  // 크리에이터 전시 목록 가져오기
  const { exhibitions, loading: exhibitionsLoading } = useUserExhibitions(
    creatorId,
    1,
    5
  );

  // 로딩 상태
  if (creatorLoading) {
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
  if (creatorError || !creator) {
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
        <h2>크리에이터 정보를 불러올 수 없습니다.</h2>
        <p>잠시 후 다시 시도해주세요.</p>
      </div>
    );
  }

  // 작품 데이터 변환
  const artworksForComponent = pieces.map((piece) => ({
    id: piece.pieceId,
    image: piece.imageUrl || "/artwork1.png",
  }));

  // 전시 데이터 변환
  const exhibitionsForComponent = exhibitions.map((exhibition) => ({
    id: exhibition.exhibitionId,
    title: exhibition.title,
    date: `${exhibition.startDate} - ${exhibition.endDate}`,
    image: exhibition.thumbnailImageUrl || "/example1.png",
  }));

  return (
    <div className={styles.container}>
      <CreatorHeader />

      <CreatorProfile
        creatorName={creator.nickname || "크리에이터"}
        creatorImage={creator.profileImageUrl || "/creator-profile.png"}
        loading={creatorLoading}
        creator={creator}
      />

      <CreatorDescription
        description={creator.introduction || "소개 정보가 없습니다."}
      />

      <CreatorContact
        email={contact?.email || ""}
        instagram={contact?.instagram || ""}
        loading={contactLoading}
      />

      <CreatorArtworks
        artworkCount={pieces.length}
        artworks={artworksForComponent}
        exhibitionCount={exhibitions.length}
        exhibitions={exhibitionsForComponent}
        artworksLoading={piecesLoading}
        exhibitionsLoading={exhibitionsLoading}
      />

      <BackToTopButton />
    </div>
  );
};

export default CreatorDetailPage;
