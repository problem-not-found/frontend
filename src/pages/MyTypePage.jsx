import { useState } from 'react';
import styles from './myTypePage.module.css';
import WelcomeHeader from '../components/mytype/WelcomeHeader';
import IdInputSection from '../components/mytype/IdInputSection';
import NicknameInputSection from '../components/mytype/NicknameInputSection';
import GenderSelection from '../components/mytype/GenderSelection';
import AgeSelection from '../components/mytype/AgeSelection';
import ExhibitionPreferences from '../components/mytype/ExhibitionPreferences';
import ArtworkMoodPreferences from '../components/mytype/ArtworkMoodPreferences';
import SubmitButton from '../components/mytype/SubmitButton';
import CompletionScreen from '../components/mytype/CompletionScreen';
import useUserStore from '../stores/userStore';

const MyTypePage = () => {
  const [currentStep, setCurrentStep] = useState(1); // 1: 기본정보, 2: 성별/연령, 3: 전시 선호도, 4: 작품 분위기, 5: 완료화면
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  
  // 1단계 상태
  const [userId, setUserId] = useState('');
  const [nickname, setNickname] = useState('');
  
  // 2단계 상태
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  
  const { updateExhibitionPreferences, updateArtworkMoodPreferences } = useUserStore();

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreferenceChange = (preferences) => {
    setSelectedPreferences(preferences);
  };

  const handleMoodChange = (moods) => {
    setSelectedMoods(moods);
  };

  const handleExhibitionComplete = () => {
    updateExhibitionPreferences(selectedPreferences);
    setCurrentStep(4);
  };

  const handleFinalComplete = () => {
    updateArtworkMoodPreferences(selectedMoods);
    console.log('회원가입 완료');
    setCurrentStep(5); // 완료 화면으로 이동
  };

  // 각 단계별 완성도 체크
  const isStep1Complete = userId.trim().length >= 3 && nickname.trim().length >= 2;
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
            onNext={selectedPreferences.length >= 3 && selectedPreferences.length <= 5 ? handleExhibitionComplete : null} 
            disabled={selectedPreferences.length < 3 || selectedPreferences.length > 5}
            buttonText="다음"
          />
        </>
      ) : currentStep === 4 ? (
        <>
          <ArtworkMoodPreferences onSelectionChange={handleMoodChange} />
          <SubmitButton 
            onNext={selectedMoods.length >= 3 && selectedMoods.length <= 5 ? handleFinalComplete : null} 
            disabled={selectedMoods.length < 3 || selectedMoods.length > 5}
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

