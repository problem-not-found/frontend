import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { updateUserInfo, updateUserPreferences } from "../apis/user/user";
import styles from "./myTypePage.module.css";
import WelcomeHeader from "../components/mytype/WelcomeHeader";
import IdInputSection from "../components/mytype/IdInputSection";
import NicknameInputSection from "../components/mytype/NicknameInputSection";
import GenderSelection from "../components/mytype/GenderSelection";
import AgeSelection from "../components/mytype/AgeSelection";
import ExhibitionPreferences from "../components/mytype/ExhibitionPreferences";
import ArtworkMoodPreferences from "../components/mytype/ArtworkMoodPreferences";
import FormatPreferences from "../components/mytype/FormatPreferences";
import SubmitButton from "../components/mytype/SubmitButton";
import CompletionScreen from "../components/mytype/CompletionScreen";
import useUserStore from "../stores/userStore";

const MyTypePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1); // 1: 기본정보, 2: 성별/연령, 3: 전시 선호도, 4: 작품 분위기, 5: 형식 선호도, 6: 완료화면
  const [initialStep, setInitialStep] = useState(1); // 처음 진입할 때의 step을 기억
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);

  // 1단계 상태
  const [userId, setUserId] = useState("");
  const [nickname, setNickname] = useState("");

  // 2단계 상태
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAge, setSelectedAge] = useState("");

  // 성별 매핑 (컴포넌트에서 전달하는 id 값 기준)
  const genderMapping = {
    male: "MALE",
    female: "FEMALE",
    "prefer-not-to-say": "NOT_SPECIFIED",
  };

  // 나이 매핑 (컴포넌트에서 전달하는 id 값 기준)
  const ageMapping = {
    "10s": "TEENS",
    "20s": "TWENTIES",
    "30s": "THIRTIES",
    "40s": "FORTIES",
    "50plus": "FIFTIES_PLUS",
  };

  const {
    updateExhibitionPreferences,
    updateArtworkMoodPreferences,
    updateBasicInfo,
    updateFormatPreferences,
  } = useUserStore();

  // URL에서 step 파라미터 읽어서 currentStep 설정
  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      const stepNumber = parseInt(step, 10);
      if (stepNumber >= 1 && stepNumber <= 6) {
        setCurrentStep(stepNumber);
        setInitialStep(stepNumber); // 처음 진입할 때의 step 기억
      }
    } else {
      // step 파라미터가 없으면 기본값 1로 설정하고 URL 업데이트
      updateStepInURL(1);
      setInitialStep(1);
    }
  }, [searchParams]);

  // currentStep 변경 시 URL 업데이트
  const updateStepInURL = (step) => {
    setSearchParams({ step: step.toString() });
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      // 1단계에서 2단계로 넘어갈 때 로컬 상태만 저장
      if (currentStep === 1) {
        updateBasicInfo({
          nickname,
          userId,
        });
      }

      // 2단계에서 3단계로 넘어갈 때 로컬 상태만 저장
      if (currentStep === 2) {
        updateBasicInfo({
          gender: selectedGender,
          age: selectedAge,
          nickname,
          userId,
        });
      }

      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      updateStepInURL(nextStep);
    }
  };

  const handlePreferenceChange = (preferences) => {
    setSelectedPreferences(preferences);
  };

  const handleMoodChange = (moods) => {
    setSelectedMoods(moods);
  };

  const handleFormatChange = (formats) => {
    setSelectedFormats(formats);
  };

  const handleExhibitionComplete = () => {
    updateExhibitionPreferences(selectedPreferences);
    setCurrentStep(4);
    updateStepInURL(4);
  };

  const handleMoodComplete = () => {
    updateArtworkMoodPreferences(selectedMoods);
    setCurrentStep(5);
    updateStepInURL(5);
  };

  const handleFinalComplete = async () => {
    try {
      // step=2로 바로 온 경우(관심사 수정)가 아닐 때만 사용자 기본 정보 등록
      const isEditMode = initialStep === 2;
      
      if (!isEditMode && userId && nickname) {
        // 1. 사용자 기본 정보 등록
        await updateUserInfo(nickname, userId);
        console.log("사용자 기본 정보 등록 성공");
      } else if (isEditMode) {
        console.log("관심사 수정 모드 - updateUserInfo 건너뜀");
      }

      // 2. 모든 선호도 정보 한번에 업데이트
      const apiGender = genderMapping[selectedGender];
      const apiAge = ageMapping[selectedAge];

      console.log(
        "디버깅 - 선택된 성별:",
        selectedGender,
        "-> API 값:",
        apiGender
      );
      console.log("디버깅 - 선택된 나이:", selectedAge, "-> API 값:", apiAge);
      console.log("디버깅 - 주제 선호도:", selectedPreferences);
      console.log("디버깅 - 분위기 선호도:", selectedMoods);
      console.log("디버깅 - 형식 선호도:", selectedFormats);

      const preferencesData = {
        gender: apiGender,
        age: apiAge,
        themePreferences: selectedPreferences,
        moodPreferences: selectedMoods,
        formatPreferences: selectedFormats,
      };

      console.log("디버깅 - 최종 전송 데이터:", preferencesData);

      await updateUserPreferences(preferencesData);
      console.log("사용자 선호도 업데이트 성공");

      // 로컬 상태 업데이트
      updateFormatPreferences(selectedFormats);
      console.log("회원가입 완료");
      setCurrentStep(6); // 완료 화면으로 이동
      updateStepInURL(6);
    } catch (error) {
      console.error("회원가입 완료 실패:", error);
      // 에러 발생해도 완료 화면으로 이동 (사용자 경험)
      setCurrentStep(6);
      updateStepInURL(6);
    }
  };

  // 각 단계별 완성도 체크
  const isStep1Complete =
    userId.trim().length >= 3 && nickname.trim().length >= 2;
  const isStep2Complete = selectedGender && selectedAge;

  return (
    <div className={styles.container}>
      {currentStep <= 2 && <WelcomeHeader currentStep={currentStep} />}
      {currentStep === 1 ? (
        <>
          <IdInputSection onIdChange={setUserId} />
          <NicknameInputSection onNicknameChange={setNickname} />
          <SubmitButton
            onNext={isStep1Complete ? handleNextStep : null}
            disabled={!isStep1Complete}
          />
        </>
      ) : currentStep === 2 ? (
        <>
          <GenderSelection onGenderChange={setSelectedGender} />
          <AgeSelection onAgeChange={setSelectedAge} />
          <SubmitButton
            onNext={isStep2Complete ? handleNextStep : null}
            disabled={!isStep2Complete}
            showPrivacyNotice={true}
          />
        </>
      ) : currentStep === 3 ? (
        <>
          <ExhibitionPreferences onSelectionChange={handlePreferenceChange} />
          <SubmitButton
            onNext={
              selectedPreferences.length >= 1 && selectedPreferences.length <= 5
                ? handleExhibitionComplete
                : null
            }
            disabled={
              selectedPreferences.length < 1 || selectedPreferences.length > 5
            }
            buttonText="다음"
          />
        </>
      ) : currentStep === 4 ? (
        <>
          <ArtworkMoodPreferences onSelectionChange={handleMoodChange} />
          <SubmitButton
            onNext={
              selectedMoods.length >= 1 && selectedMoods.length <= 5
                ? handleMoodComplete
                : null
            }
            disabled={selectedMoods.length < 1 || selectedMoods.length > 5}
            buttonText="다음"
          />
        </>
      ) : currentStep === 5 ? (
        <>
          <FormatPreferences onSelectionChange={handleFormatChange} />
          <SubmitButton
            onNext={
              selectedFormats.length >= 1 && selectedFormats.length <= 5
                ? handleFinalComplete
                : null
            }
            disabled={selectedFormats.length < 1 || selectedFormats.length > 5}
            buttonText="완료"
          />
        </>
      ) : (
        <CompletionScreen />
      )}
    </div>
  );
};

export default MyTypePage;
