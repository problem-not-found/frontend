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
import { useState } from "react";
import CreatorContent from "../components/feed/CreatorContent";


export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('전시'); // '전시', '작품', '크리에이터'

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
    { id: 23, title: "SEOUL LIGHT DDP 2024 가을", date: "24.11.26 - 24.11.30" },
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

  // 크리에이터 데이터
  const trendingCreator = {
    id: 0,
    name: "정땡땡 크리에이터",
    username: "@simonisnextdoor",
    profileImage: "/creator-profile.png",
    artworks: [
      { id: 1, image: "/artwork1.png" },
      { id: 2, image: "/artwork2.png" },
      { id: 3, image: "/artwork3.png" },
    ]
  };

  const recentCreators = [
    {
      id: 1,
      name: "김땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 4, image: "/artwork1.png" },
        { id: 5, image: "/artwork2.png" },
      ]
    },
    {
      id: 2,
      name: "박땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 6, image: "/artwork2.png" },
        { id: 7, image: "/artwork3.png" },
      ]
    },
    {
      id: 3,
      name: "이땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 8, image: "/artwork3.png" },
        { id: 9, image: "/artwork1.png" },
      ]
    },
    {
      id: 4,
      name: "최땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 10, image: "/artwork1.png" },
        { id: 11, image: "/artwork2.png" },
      ]
    }
  ];

  const similarAgeCreators = [
    {
      id: 5,
      name: "김땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 12, image: "/artwork1.png" },
        { id: 13, image: "/artwork2.png" },
      ]
    },
    {
      id: 6,
      name: "정땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 14, image: "/artwork1.png" },
        { id: 15, image: "/artwork2.png" },
        { id: 16, image: "/artwork3.png" },
      ]
    },
    {
      id: 7,
      name: "박땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 17, image: "/artwork2.png" },
        { id: 18, image: "/artwork3.png" },
      ]
    },
    {
      id: 8,
      name: "이땡땡 크리에이터",
      username: "@simonisnextdoor",
      profileImage: "/creator-profile.png",
      artworks: [
        { id: 19, image: "/artwork3.png" },
        { id: 20, image: "/artwork1.png" },
      ]
    }
  ];

  return (
    <div className={styles.page}>
      <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <FeedSearchBar placeholder="키워드로 검색하기" />
      
      {(activeTab === '전시' || activeTab === '작품') && (
        <FeedHeroCard
          title="정땡땡 유화전 : 끝나지 않은 여행"
          subtitle={activeTab === '전시' ? "지금 뜨는 전시" : "지금 뜨는 작품"}
        />
      )}
      
      {(activeTab === '전시' || activeTab === '작품') && (
        <main className={styles.main}>
        <SectionHeading
          title={activeTab === '전시' ? "내 취향 저격 전시 리스트" : "내 취향 저격 작품 리스트"}
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

      {activeTab === '크리에이터' && (
        <CreatorContent 
          trendingCreator={trendingCreator}
          recentCreators={recentCreators}
          similarAgeCreators={similarAgeCreators}
        />
      )}

      <BackToTopButton />
      <AppFooter />
    </div>
  );
}
