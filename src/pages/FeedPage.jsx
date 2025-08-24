import FeedHeader from "@/components/feed/Header";
import FeedSearchBar from "@/components/feed/SearchBar";
import FeedHeroCard from "@/components/feed/HeroCard";
import SectionHeading from "@/components/feed/SectionHeading";
import FeedHorizontalList from "@/components/feed/HorizontalList";
import ExhibitionCardSmall from "@/components/feed/CardSmall";
import ExhibitionCardMedium from "@/components/feed/CardMedium";
import ExhibitionCardCompact from "@/components/feed/CardCompact";
import NearbyExhibitionCard from "@/components/feed/NearbyCard";
import BackToTopButton from "@/components/common/BackToTopButton";
import AppFooter from "@/components/footer/AppFooter";
import styles from "@/components/feed/feed.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useHottestExhibitions,
  useHottestPieces,
  useLatestExhibitions,
  useLatestPieces,
  useLatestOpenCreators,
  usePeerGroupCreators,
  useMyTasteExhibitions,
  useDifferentTasteExhibitions,
  useMyTastePieces,
  useDifferentTastePieces,
  useHottestCreator,
} from "../apis/feed/feed";
import { ClipLoader } from "react-spinners";
import CreatorContent from "../components/feed/CreatorContent";

export default function FeedPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("전시"); // '전시', '작품', '크리에이터'

  // URL 파라미터에서 탭 정보 읽기
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && ["전시", "작품", "크리에이터"].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // 탭 변경 시 URL 파라미터 업데이트
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // 핫한 전시 3개 가져오기
  const {
    exhibitions: hottestExhibitions,
    loading: exhibitionsLoading,
    error: exhibitionsError,
  } = useHottestExhibitions();

  // 핫한 작품 3개 가져오기
  const {
    pieces: hottestPieces,
    loading: piecesLoading,
    error: piecesError,
  } = useHottestPieces();

  // 최신 전시 3개 가져오기
  const {
    exhibitions: latestExhibitions,
    loading: latestExhibitionsLoading,
    error: latestExhibitionsError,
  } = useLatestExhibitions();

  // 최신 작품 3개 가져오기
  const {
    pieces: latestPieces,
    loading: latestPiecesLoading,
    error: latestPiecesError,
  } = useLatestPieces();

  // 최근 전시 오픈한 크리에이터 5명 가져오기
  const {
    creators: latestOpenCreators,
    loading: latestOpenCreatorsLoading,
    error: latestOpenCreatorsError,
  } = useLatestOpenCreators();

  // 비슷한 연령대 크리에이터 5명 가져오기
  const {
    creators: peerGroupCreators,
    loading: peerGroupCreatorsLoading,
    error: peerGroupCreatorsError,
  } = usePeerGroupCreators();

  // 내 취향 저격 전시 5개 가져오기
  const {
    exhibitions: myTasteExhibitions,
    loading: myTasteExhibitionsLoading,
    error: myTasteExhibitionsError,
  } = useMyTasteExhibitions();

  // 색다른 도전 전시 5개 가져오기
  const {
    exhibitions: differentTasteExhibitions,
    loading: differentTasteExhibitionsLoading,
    error: differentTasteExhibitionsError,
  } = useDifferentTasteExhibitions();

  // 내 취향 저격 작품 5개 가져오기
  const {
    pieces: myTastePieces,
    loading: myTastePiecesLoading,
    error: myTastePiecesError,
  } = useMyTastePieces();

  // 색다른 도전 작품 5개 가져오기
  const {
    pieces: differentTastePieces,
    loading: differentTastePiecesLoading,
    error: differentTastePiecesError,
  } = useDifferentTastePieces();

  // 지금 뜨는 크리에이터 1명 가져오기
  const {
    creator: hottestCreator,
    loading: hottestCreatorLoading,
    error: hottestCreatorError,
  } = useHottestCreator();

  const nearby = [
    {
      id: 31,
      title: "성북구 신인 작가 합동 전시 : 두 번째 여름",
      date: "2024.06.22 - 2025.02.07",
      tags: ["박명희", "정구민", "윤희준", "골목길", "감기기"],
    },
    {
      id: 32,
      title: "성북구 신인 작가 합동 전시 : 두 번째 여름",
      date: "2024.06.22 - 2025.02.07",
      tags: ["박명희", "정구민", "윤희준", "골목길", "감기기"],
    },
  ];

  return (
    <div className={styles.page}>
      <FeedHeader activeTab={activeTab} onTabChange={handleTabChange} />
      <FeedSearchBar placeholder="키워드로 검색하기" />

      {(activeTab === "전시" || activeTab === "작품") && (
        <div>
          {activeTab === "전시" ? (
            // 전시 탭일 때
            exhibitionsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <ClipLoader color="var(--color-main)" size={35} />
                <p style={{ color: "#666", fontSize: "14px" }}>
                  핫한 전시를 찾고 있어요...
                </p>
              </div>
            ) : exhibitionsError ? (
              <FeedHeroCard />
            ) : hottestExhibitions.length > 0 ? (
              <FeedHeroCard exhibitions={hottestExhibitions} />
            ) : (
              <FeedHeroCard />
            )
          ) : // 작품 탭일 때
          piecesLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <ClipLoader color="var(--color-main)" size={35} />
              <p style={{ color: "#666", fontSize: "14px" }}>
                핫한 작품을 찾고 있어요...
              </p>
            </div>
          ) : piecesError ? (
            <FeedHeroCard />
          ) : hottestPieces.length > 0 ? (
            <FeedHeroCard pieces={hottestPieces} />
          ) : (
            <FeedHeroCard />
          )}
        </div>
      )}

      {(activeTab === "전시" || activeTab === "작품") && (
        <main className={styles.main}>
          <SectionHeading
            title={
              activeTab === "전시"
                ? "내 취향 저격 전시 리스트"
                : "내 취향 저격 작품 리스트"
            }
            caption="좋아하는 것 기반으로 분석해서 모아봤어요."
            isFirst={true}
          />
          {activeTab === "전시" ? (
            // 내 취향 저격 전시
            myTasteExhibitionsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                  margin: "20px 0",
                }}
              >
                <ClipLoader color="var(--color-main)" size={25} />
              </div>
            ) : myTasteExhibitionsError ? (
              <FeedHorizontalList
                items={[]}
                renderItem={() => null}
                showIndex={true}
                totalCount={0}
              />
            ) : (
              <FeedHorizontalList
                items={myTasteExhibitions}
                renderItem={(item) => (
                  <ExhibitionCardSmall key={item.exhibitionId} item={item} />
                )}
                showIndex={true}
                totalCount={myTasteExhibitions.length}
              />
            )
          ) : // 내 취향 저격 작품
          myTastePiecesLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                margin: "20px 0",
              }}
            >
              <ClipLoader color="var(--color-main)" size={25} />
            </div>
          ) : myTastePiecesError ? (
            <FeedHorizontalList
              items={[]}
              renderItem={() => null}
              showIndex={true}
              totalCount={0}
            />
          ) : (
            <FeedHorizontalList
              items={myTastePieces}
              renderItem={(item) => (
                <ExhibitionCardSmall key={item.pieceId} item={item} />
              )}
              showIndex={true}
              totalCount={myTastePieces.length}
            />
          )}

          <SectionHeading
            title="새로 오픈"
            caption={
              activeTab === "전시"
                ? "최근 7일 동안 새로 오픈한 전시장이에요."
                : "최근에 업로드된 작품들이에요."
            }
          />
          {activeTab === "전시" ? (
            // 최신 전시
            latestExhibitionsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                  margin: "20px 0",
                }}
              >
                <ClipLoader color="var(--color-main)" size={25} />
              </div>
            ) : latestExhibitionsError ? (
              <FeedHorizontalList
                items={[]}
                renderItem={() => null}
                showVerticalLine={true}
              />
            ) : (
              <FeedHorizontalList
                items={latestExhibitions}
                renderItem={(item) => (
                  <ExhibitionCardMedium
                    key={item.exhibitionId}
                    item={item}
                    showBookmark
                  />
                )}
                showVerticalLine={true}
              />
            )
          ) : // 최신 작품
          latestPiecesLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                margin: "20px 0",
              }}
            >
              <ClipLoader color="var(--color-main)" size={25} />
            </div>
          ) : latestPiecesError ? (
            <FeedHorizontalList
              items={[]}
              renderItem={() => null}
              showVerticalLine={true}
            />
          ) : (
            <FeedHorizontalList
              items={latestPieces}
              renderItem={(item) => (
                <ExhibitionCardMedium
                  key={item.pieceId}
                  item={item}
                  showBookmark
                />
              )}
              showVerticalLine={true}
            />
          )}

          <SectionHeading
            title="색다른 도전"
            caption="내 취향 범주와 다른 종류의 전시를 추천해요."
          />
          {activeTab === "전시" ? (
            // 색다른 도전 전시
            differentTasteExhibitionsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100px",
                  margin: "20px 0",
                }}
              >
                <ClipLoader color="var(--color-main)" size={25} />
              </div>
            ) : differentTasteExhibitionsError ? (
              <FeedHorizontalList
                items={[]}
                renderItem={() => null}
                showVerticalLine={true}
                verticalLineHeight={199}
              />
            ) : (
              <FeedHorizontalList
                items={differentTasteExhibitions}
                renderItem={(item) => (
                  <ExhibitionCardCompact
                    key={item.exhibitionId}
                    item={item}
                    showBookmark
                  />
                )}
                showVerticalLine={true}
                verticalLineHeight={199}
              />
            )
          ) : // 색다른 도전 작품
          differentTastePiecesLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
                margin: "20px 0",
              }}
            >
              <ClipLoader color="var(--color-main)" size={25} />
            </div>
          ) : differentTastePiecesError ? (
            <FeedHorizontalList
              items={[]}
              renderItem={() => null}
              showVerticalLine={true}
              verticalLineHeight={199}
            />
          ) : (
            <FeedHorizontalList
              items={differentTastePieces}
              renderItem={(item) => (
                <ExhibitionCardCompact
                  key={item.pieceId}
                  item={item}
                  showBookmark
                />
              )}
              showVerticalLine={true}
              verticalLineHeight={199}
            />
          )}

          <SectionHeading
            title="내 주변 전시"
            caption="내 위치 기준 가까운 곳에서 오프라인 전시를 진행 중인 곳이에요."
          />
          <div className={styles.nearbyList}>
            {nearby.map((n) => (
              <NearbyExhibitionCard key={n.id} item={n} />
            ))}
          </div>
        </main>
      )}

      {activeTab === "크리에이터" && (
        <CreatorContent
          trendingCreator={hottestCreator}
          trendingCreatorLoading={hottestCreatorLoading}
          trendingCreatorError={hottestCreatorError}
          recentCreators={latestOpenCreators}
          recentCreatorsLoading={latestOpenCreatorsLoading}
          recentCreatorsError={latestOpenCreatorsError}
          similarAgeCreators={peerGroupCreators}
          similarAgeCreatorsLoading={peerGroupCreatorsLoading}
          similarAgeCreatorsError={peerGroupCreatorsError}
        />
      )}

      <BackToTopButton />
      <AppFooter />
    </div>
  );
}
