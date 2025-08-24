import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./exhibitionPreferences.module.css";

const ExhibitionPreferences = ({ onSelectionChange }) => {
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  // 주제 매핑: 화면 표시용 한글 -> API 전송용 영어 키
  const themeOptions = {
    불교미술: "BUDDHIST_ART",
    "고대 유물": "ANCIENT_ARTIFACTS",
    근대사: "MODERN_HISTORY",
    "전통 민속": "TRADITIONAL_FOLK",
    "궁중 문화": "ROYAL_CULTURE",
    "신화와 전설": "MYTHS_AND_LEGENDS",
    "종교 예술": "RELIGIOUS_ART",
    "세계 문화유산": "WORLD_HERITAGE",
    "지역 문화": "REGIONAL_CULTURE",
    "전통 의상": "TRADITIONAL_COSTUME",
    "무속 신앙": "SHAMANISM",
    "문학·시에서 영감받은 작품": "LITERATURE_AND_POETRY_INSPIRED",
    바다: "SEA",
    숲: "FOREST",
    사막: "DESERT",
    설원: "SNOWFIELD",
    폭포: "WATERFALL",
    "하늘과 구름": "SKY_AND_CLOUDS",
    "꽃과 식물": "FLOWERS_AND_PLANTS",
    동물: "ANIMALS",
    곤충: "INSECTS",
    "기후 변화": "CLIMATE_CHANGE",
    "계절(봄·여름·가을·겨울)": "SEASONS",
    "별·천체": "STARS_AND_CELESTIAL",
    초상화: "PORTRAIT",
    "인물 사진": "PEOPLE_PHOTOGRAPHY",
    "도시 인물": "URBAN_PORTRAIT",
    "일상 기록": "DAILY_LIFE",
    "사회 운동": "SOCIAL_MOVEMENT",
    "노동과 산업": "LABOR_AND_INDUSTRY",
    "가족·관계": "FAMILY_RELATIONSHIP",
    자화상: "SELF_PORTRAIT",
    패션: "FASHION",
    "유명 인물": "CELEBRITY",
    기하학: "GEOMETRY",
    패턴: "PATTERN",
    "무한 반복": "INFINITE_LOOP",
    "색채 실험": "COLOR_EXPERIMENT",
    "시간의 흐름": "PASSAGE_OF_TIME",
    "데이터 기반 시각화": "DATA_VISUALIZATION",
    "상징과 은유": "SYMBOL_AND_METAPHOR",
    "심리학/마음": "PSYCHOLOGY_AND_MIND",
    "관념적 풍경": "CONCEPTUAL_LANDSCAPE",
    음식: "FOOD",
    여행지: "TRAVEL_DESTINATION",
    "판타지 세계": "FANTASY_WORLD",
    "과학과 기술": "SCIENCE_AND_TECHNOLOGY",
    "미래 도시": "FUTURE_CITY",
    로봇: "ROBOT",
    "게임·서브컬처": "GAME_AND_SUBCULTURE",
    스포츠: "SPORTS",
  };

  const preferences = Object.keys(themeOptions);

  const handlePreferenceToggle = (preference) => {
    let newSelection;
    if (selectedPreferences.includes(preference)) {
      newSelection = selectedPreferences.filter((item) => item !== preference);
    } else {
      if (selectedPreferences.length < 5) {
        newSelection = [...selectedPreferences, preference];
      } else {
        return; // 5개 초과 선택 방지
      }
    }

    setSelectedPreferences(newSelection);
    // API 전송용 영어 키값으로 변환
    const apiValues = newSelection.map((item) => themeOptions[item]);
    onSelectionChange(apiValues);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>어떤 주제의 전시를 좋아하시나요?</h2>
      <p className={styles.subtitle}>
        1개 이상 선택해주세요. 5개까지 선택할 수 있어요.
      </p>

      <div className={styles.preferencesGrid}>
        {preferences.map((preference) => (
          <button
            key={preference}
            className={`${styles.preferenceButton} ${
              selectedPreferences.includes(preference) ? styles.selected : ""
            }`}
            onClick={() => handlePreferenceToggle(preference)}
          >
            {preference}
          </button>
        ))}
      </div>
    </div>
  );
};

ExhibitionPreferences.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default ExhibitionPreferences;
