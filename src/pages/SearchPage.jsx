import { useState, useEffect } from "react";
import SearchHeader from "../components/search/SearchHeader";
import SearchFilters from "../components/search/SearchFilters";
import SearchResults from "../components/search/SearchResults";
import SearchEmpty from "../components/search/SearchEmpty";
import AppFooter from "../components/footer/AppFooter";
import BackToTopButton from "../components/common/BackToTopButton";
import { searchExhibitions } from "../apis/exhibition/search";
import { searchPieces } from "../apis/piece/search";
import { searchUsers } from "../apis/user/search";
import styles from "./searchPage.module.css";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("전시");
  const [sortBy, setSortBy] = useState("HOTTEST");
  const [exhibitionResults, setExhibitionResults] = useState([]);
  const [pieceResults, setPieceResults] = useState([]);
  const [creatorResults, setCreatorResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 디바운스를 위한 useEffect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setExhibitionResults([]);
      setPieceResults([]);
      setCreatorResults([]);
      return;
    }

    const timer = setTimeout(() => {
      handleSearch(searchQuery, sortBy, activeTab);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery, sortBy, activeTab]);

  // 검색 API 호출 함수
  const handleSearch = async (keyword, currentSortBy, currentTab) => {
    if (!keyword.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (currentTab === "전시") {
        const response = await searchExhibitions(keyword, currentSortBy);
        console.log("전시 검색 결과 받음:", response);

        if (response.success && response.data) {
          const formattedResults = response.data.map((exhibition) => ({
            id: exhibition.exhibitionId,
            title: exhibition.title,
            type: "exhibition",
          }));
          setExhibitionResults(formattedResults);
        } else {
          setExhibitionResults([]);
        }
      } else if (currentTab === "작품") {
        const response = await searchPieces(keyword, currentSortBy);
        console.log("작품 검색 결과 받음:", response);

        if (response.success && response.data) {
          const formattedResults = response.data.map((piece) => ({
            id: piece.pieceId || piece.id,
            title: piece.title,
            type: "artwork",
          }));
          setPieceResults(formattedResults);
        } else {
          setPieceResults([]);
        }
      } else if (currentTab === "크리에이터") {
        const response = await searchUsers(keyword);
        console.log("크리에이터 검색 결과 받음:", response);

        if (response.success && response.data) {
          const formattedResults = response.data.map((user) => ({
            id: user.userId || user.id,
            name: user.name || user.nickname,
            username: user.code ? `${user.code}` : user.username || user.handle,
            profileImage: user.profileImage || user.profileImageUrl,
            type: "creator",
          }));
          setCreatorResults(formattedResults);
        } else {
          setCreatorResults([]);
        }
      }
    } catch (err) {
      setError("검색 중 오류가 발생했습니다.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleSearchClick = (query) => {
    // 돋보기 클릭 시 즉시 검색 실행
    if (query.trim()) {
      handleSearch(query, sortBy, activeTab);
    }
  };

  const handleKeywordSelect = (keyword) => {
    setSearchQuery(keyword);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy === "인기순" ? "HOTTEST" : "LATEST");
  };

  const hasSearchQuery = searchQuery.trim().length > 0;

  const getCurrentResults = () => {
    if (activeTab === "크리에이터") {
      return creatorResults;
    } else if (activeTab === "작품") {
      return pieceResults;
    }
    return exhibitionResults;
  };

  return (
    <div className={styles.container}>
      <SearchHeader
        onSearchChange={handleSearchChange}
        onSearchClick={handleSearchClick}
        searchQuery={searchQuery}
        hasSearchQuery={hasSearchQuery}
      />

      {hasSearchQuery ? (
        <>
          <SearchFilters
            onTabChange={handleTabChange}
            onSortChange={handleSortChange}
          />
          <SearchResults
            results={getCurrentResults()}
            activeTab={activeTab}
            loading={loading}
            error={error}
          />
        </>
      ) : (
        <SearchEmpty onKeywordSelect={handleKeywordSelect} />
      )}

      <AppFooter />
      <BackToTopButton />
    </div>
  );
};

export default SearchPage;
