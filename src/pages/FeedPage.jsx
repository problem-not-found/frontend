import FeedHeader from "../components/feed/Header";
import FeedSearchBar from "../components/feed/SearchBar";
import FeedHeroCard from "../components/feed/HeroCard";
import SectionHeading from "../components/feed/SectionHeading";
import FeedHorizontalList from "../components/feed/HorizontalList";
import ExhibitionCardSmall from "../components/feed/CardSmall";
import ExhibitionCardMedium from "../components/feed/CardMedium";
import ExhibitionCardCompact from "../components/feed/CardCompact";
import NearbyExhibitionCard from "../components/feed/NearbyCard";
import BackToTopButton from "../components/common/BackToTopButton";
import AppFooter from "../components/footer/AppFooter";
import styles from "../components/feed/feed.module.css";

export default function FeedPage() {
  // 임시 목데이터 (API 연동 전)
  const myTaste = [
    {
      id: 1,
      title: "김땡땡 개인전 : 두 번째 여름",
      date: "24.10.25 - 25.02.19",
    },
    { id: 2, title: "성북구 유화 기획전", date: "24.10.29 - 25.01.30" },
    { id: 3, title: "모네 특별전", date: "24.11.10 - 25.01.05" },
    { id: 4, title: "고흐와 친구들", date: "24.11.12 - 25.02.01" },
  ];

  const newOpen = [
    { id: 11, title: "홍익대 디자인 졸전 2024", date: "24.11.26 - 24.11.30" },
    { id: 12, title: "성북구 미술주간", date: "24.11.26 - 24.11.30" },
  ];

  const diffTaste = [
    { id: 21, title: "이몽규 네온 사진전", date: "24.11.26 - 24.11.30" },
    { id: 22, title: "SEOUL LIGHT DDP 2024 가을", date: "24.11.26 - 24.11.30" },
    { id: 22, title: "SEOUL LIGHT DDP 2024 가을", date: "24.11.26 - 24.11.30" },
  ];

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
      <FeedHeader />
      <FeedSearchBar placeholder="키워드로 검색하기" />
      <FeedHeroCard
        title="정땡땡 유화전 : 끝나지 않은 여행"
        subtitle="지금 뜨는 전시"
      />

      <main className={styles.main}>
        <SectionHeading
          title="내 취향 저격 전시 리스트"
          caption="좋아하는 것 기반으로 분석해서 모아봤어요."
          isFirst={true}
        />
        <FeedHorizontalList
          items={myTaste}
          renderItem={(item) => (
            <ExhibitionCardSmall key={item.id} item={item} />
          )}
          showIndex={true}
          totalCount={myTaste.length}
        />

        <SectionHeading
          title="새로 오픈"
          caption="최근 7일 동안 새로 오픈한 전시장이에요."
        />
        <FeedHorizontalList
          items={newOpen}
          renderItem={(item) => (
            <ExhibitionCardMedium key={item.id} item={item} showBookmark />
          )}
          showVerticalLine={true}
        />

        <SectionHeading
          title="색다른 도전"
          caption="내 취향 범주와 다른 종류의 전시를 추천해요."
        />
        <FeedHorizontalList
          items={diffTaste}
          renderItem={(item) => (
            <ExhibitionCardCompact key={item.id} item={item} showBookmark />
          )}
          showVerticalLine={true}
          verticalLineHeight={199}
        />
      </main>
      <SectionHeading
        title="내 주변 전시"
        caption="내 위치 기준 가까운 곳에서 오프라인 전시를 진행 중인 곳이에요."
      />
      <div className={styles.nearbyList}>
        {nearby.map((n) => (
          <NearbyExhibitionCard key={n.id} item={n} />
        ))}
      </div>

      <BackToTopButton />
      <AppFooter />
    </div>
  );
}
