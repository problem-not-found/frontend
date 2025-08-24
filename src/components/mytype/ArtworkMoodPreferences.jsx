import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./exhibitionPreferences.module.css"; // 3단계와 동일한 CSS 사용

const ArtworkMoodPreferences = ({ onSelectionChange }) => {
  const [selectedMoods, setSelectedMoods] = useState([]);

  // 분위기 매핑: 화면 표시용 한글 -> API 전송용 영어 키
  const moodOptions = {
    "휴양지 감성": "RESORT_VIBES",
    몽환적: "DREAMY",
    차분한: "CALM",
    화려한: "GORGEOUS",
    따뜻한: "WARM",
    시원한: "COOL",
    고독한: "LONELY",
    서정적: "LYRICAL",
    유머러스: "HUMOROUS",
    "위트 있는": "WITTY",
    철학적: "PHILOSOPHICAL",
    낭만적: "ROMANTIC",
    "에너지 넘치는": "ENERGETIC",
    "불안/긴장감 있는": "ANXIOUS_OR_TENSE",
    경건한: "REVERENT",
    미니멀리즘: "MINIMALISM",
    팝아트: "POP_ART",
    빈티지: "VINTAGE",
    레트로: "RETRO",
    퓨처리즘: "FUTURISM",
    아방가르드: "AVANT_GARDE",
    "네온 감성": "NEON_VIBES",
    자연주의: "NATURALISM",
    키치: "KITSCH",
    그로테스크: "GROTESQUE",
    초현실주의: "SURREALISM",
    사실주의: "REALISM",
    "익스프레셔니즘(표현주의)": "EXPRESSIONISM",
    "기괴·이상한": "BIZARRE_OR_WEIRD",
    파스텔톤: "PASTEL_TONE",
    모노톤: "MONOTONE",
    "원색 대비": "PRIMARY_COLOR_CONTRAST",
    흑백: "BLACK_AND_WHITE",
    세피아톤: "SEPIA_TONE",
    메탈릭: "METALLIC",
    그라데이션: "GRADATION",
    "강한 대비 채도": "HIGH_CONTRAST_SATURATION",
    "톤다운 컬러": "TONE_DOWN_COLOR",
  };

  const moods = Object.keys(moodOptions);

  const handleMoodToggle = (mood) => {
    let newSelection;
    if (selectedMoods.includes(mood)) {
      newSelection = selectedMoods.filter((item) => item !== mood);
    } else {
      if (selectedMoods.length < 5) {
        newSelection = [...selectedMoods, mood];
      } else {
        return; // 5개 초과 선택 방지
      }
    }

    setSelectedMoods(newSelection);
    // API 전송용 영어 키값으로 변환
    const apiValues = newSelection.map((item) => moodOptions[item]);
    onSelectionChange(apiValues);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>작품의 어떤 분위기를 좋아하시나요?</h2>
      <p className={styles.subtitle}>
        1개 이상 선택해주세요. 5개까지 선택할 수 있어요.
      </p>

      <div className={styles.preferencesGrid}>
        {moods.map((mood) => (
          <button
            key={mood}
            className={`${styles.preferenceButton} ${
              selectedMoods.includes(mood) ? styles.selected : ""
            }`}
            onClick={() => handleMoodToggle(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
};

ArtworkMoodPreferences.propTypes = {
  onSelectionChange: PropTypes.func.isRequired,
};

export default ArtworkMoodPreferences;
