import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getUserPreferences } from "../apis/user/user";
import TasteHeader from "../components/taste/TasteHeader";
import TasteCategories from "../components/taste/TasteCategories";
import TasteProfile from "../components/taste/TasteProfile";
import TasteTags from "../components/taste/TasteTags";
import TasteExhibitions from "../components/taste/TasteExhibitions";
import TasteArtworks from "../components/taste/TasteArtworks";
import TasteCreators from "../components/taste/TasteCreators";
import TasteActions from "../components/taste/TasteActions";
import AppFooter from "../components/footer/AppFooter";
import BackToTopButton from "../components/common/BackToTopButton";
import styles from "./tastePage.module.css";

const TastePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("전시");
  const [userProfile, setUserProfile] = useState({
    age: "20대",
    gender: "남성",
  });
  const [interestTags, setInterestTags] = useState([]);
  const [loading, setLoading] = useState(false);

  // URL에서 탭 상태 초기화
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["전시", "작품", "크리에이터", "관심사"].includes(tab)) {
      setActiveCategory(tab);
    }
  }, [searchParams]);

  // 사용자 관심사 정보 가져오기
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        setLoading(true);
        const response = await getUserPreferences();
        const data = response.data?.data || response.data;

        if (data) {
          setUserProfile({
            age: data.age || "20대",
            gender: data.gender || "남성",
          });

          // 모든 선호도를 하나의 배열로 합치기
          const allPreferences = [
            ...(data.themePreferences || []),
            ...(data.moodPreferences || []),
            ...(data.formatPreferences || []),
          ];
          setInterestTags(allPreferences);
        }
      } catch (error) {
        console.error("사용자 관심사 정보 로드 실패:", error);
        // 에러 발생 시 기본값 유지
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // URL 업데이트
    setSearchParams({ tab: category });
  };

  return (
    <div className={styles.container}>
      <TasteHeader />
      <TasteCategories
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      {activeCategory === "전시" && <TasteExhibitions />}
      {activeCategory === "작품" && <TasteArtworks />}
      {activeCategory === "크리에이터" && <TasteCreators />}
      {activeCategory === "관심사" && (
        <>
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                margin: "20px 0",
              }}
            >
              <ClipLoader color="var(--color-main)" size={30} />
            </div>
          ) : (
            <>
              <TasteProfile profile={userProfile} />
              <TasteTags tags={interestTags} />
              <TasteActions />
            </>
          )}
        </>
      )}
      <AppFooter />
      <BackToTopButton />
    </div>
  );
};

export default TastePage;
