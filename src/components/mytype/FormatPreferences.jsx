import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./exhibitionPreferences.module.css"; // 동일한 CSS 사용

const FormatPreferences = ({ onSelectionChange }) => {
  const [selectedFormats, setSelectedFormats] = useState([]);

  // 형식 매핑: 화면 표시용 한글 -> API 전송용 영어 키
  const formatOptions = {
    유화: "OIL_PAINTING",
    수채화: "WATERCOLOR",
    아크릴화: "ACRYLIC_PAINTING",
    먹화: "INK_PAINTING",
    콜라주: "COLLAGE",
    스케치: "SKETCH",
    "혼합매체(Mixed Media)": "MIXED_MEDIA",
    "디지털 페인팅": "DIGITAL_PAINTING",
    목조각: "WOOD_SCULPTURE",
    석조각: "STONE_SCULPTURE",
    "금속 조형물": "METAL_SCULPTURE",
    "대형 설치미술": "LARGE_INSTALLATION",
    "환경 설치": "ENVIRONMENTAL_INSTALLATION",
    "재활용 소재 아트": "RECYCLED_MATERIAL_ART",
    "필름 사진": "FILM_PHOTOGRAPHY",
    "디지털 사진": "DIGITAL_PHOTOGRAPHY",
    "다큐멘터리 영상": "DOCUMENTARY_VIDEO",
    "3D 영상": "THREE_D_VIDEO",
    애니메이션: "ANIMATION",
    스톱모션: "STOP_MOTION",
    시네마그래프: "CINEMAGRAPH",
    춤: "DANCE",
    연극: "THEATER",
    "음악 퍼포먼스": "MUSIC_PERFORMANCE",
    "실시간 라이브 아트": "LIVE_ART",
    플래시몹: "FLASH_MOB",
    "AR/VR": "AR_VR",
    "인터랙티브 아트": "INTERACTIVE_ART",
    "AI 생성 아트": "AI_GENERATED_ART",
    "데이터 아트": "DATA_ART",
    "프로젝션 매핑": "PROJECTION_MAPPING",
    "NFT 아트": "NFT_ART",
    홀로그램: "HOLOGRAM",
    도자기: "CERAMICS",
    유리공예: "GLASS_ART",
    "섬유·패브릭 아트": "TEXTILE_ART",
    "가구 디자인": "FURNITURE_DESIGN",
    주얼리: "JEWELRY",
    "패션 아트": "FASHION_ART",
    "건축 모형": "ARCHITECTURAL_MODEL",
    "도시 설치물": "URBAN_INSTALLATION",
    "게임 아트": "GAME_ART",
    "실험적 사운드 아트": "EXPERIMENTAL_SOUND_ART",
  };

  const formats = Object.keys(formatOptions);

  const handleFormatToggle = (format) => {
    let newSelection;
    if (selectedFormats.includes(format)) {
      newSelection = selectedFormats.filter((item) => item !== format);
    } else {
      if (selectedFormats.length < 5) {
        newSelection = [...selectedFormats, format];
      } else {
        return; // 5개 초과 선택 방지
      }
    }

    setSelectedFormats(newSelection);
    // API 전송용 영어 키값으로 변환
    const apiValues = newSelection.map((item) => formatOptions[item]);
    onSelectionChange(apiValues);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>어떤 형식의 전시를 선호하시나요?</h2>
      <p className={styles.subtitle}>
        1개 이상 선택해주세요. 5개까지 선택할 수 있어요.
      </p>

      <div className={styles.preferencesGrid}>
        {formats.map((format) => (
          <button
            key={format}
            className={`${styles.preferenceButton} ${
              selectedFormats.includes(format) ? styles.selected : ""
            }`}
            onClick={() => handleFormatToggle(format)}
          >
            {format}
          </button>
        ))}
      </div>
    </div>
  );
};

FormatPreferences.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default FormatPreferences;
