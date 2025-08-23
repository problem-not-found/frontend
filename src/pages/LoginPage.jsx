import { useNavigate } from 'react-router-dom';
import { testLogin, redirectToKakaoLogin } from '../apis/login/auth';
import logoImage from '../assets/login/logo.png';
import styles from './loginPage.module.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    try {
      redirectToKakaoLogin();
    } catch (error) {
      console.error('카카오 로그인 오류:', error);
      alert('카카오 로그인 중 오류가 발생했습니다.');
    }
  };

  const handleGuestLogin = async () => {
    try {
      await testLogin();
      // 로그인 성공 시 메인 페이지로 이동
      navigate('/');
    } catch (error) {
      console.error('테스트 로그인 오류:', error);
      alert('테스트 로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>

      {/* Logo */}
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <img 
            src={logoImage} 
            alt="Artium Logo" 
            className={styles.logoImage}
          />
        </div>
      </div>

      {/* Login Buttons */}
      <div className={styles.buttonContainer}>
        <button 
          className={styles.kakaoButton}
          onClick={handleKakaoLogin}
        >
          <div className={styles.kakaoIcon}>
            <svg width="18" height="17" viewBox="0 0 18 17" fill="none">
              <path 
                d="M9 0C4.03125 0 0 3.13281 0 6.98438C0 9.57031 1.6875 11.8594 4.21875 13.0781L3.28125 16.4062C3.21875 16.6406 3.46875 16.8281 3.65625 16.7031L7.59375 14.2031C8.0625 14.25 8.53125 14.2812 9 14.2812C13.9688 14.2812 18 11.1484 18 7.29688C18 3.44531 13.9688 0.3125 9 0.3125V0Z" 
                fill="black"
              />
            </svg>
          </div>
          <span className={styles.kakaoText}>카카오 로그인</span>
        </button>

        <button 
          className={styles.guestButton}
          onClick={handleGuestLogin}
        >
          체험용 로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
