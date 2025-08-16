import AppFooter from "../components/footer/AppFooter";
import UserProfileHeader from "../components/user/UserProfileHeader";
import UserSettingsMenu from "../components/user/UserSettingsMenu";
import styles from "../components/user/myPage.module.css";

export default function MyPage() {
  return (
    <div className={styles.page}>
      <div style={{height: '40px'}}></div>
      <div className={styles.content}>
        {/* 첫 번째 화면: 기본 마이페이지 */}
        <UserProfileHeader />
        
        {/* 설정 메뉴들 */}
        <UserSettingsMenu />
      </div>

      <AppFooter />
    </div>
  );
}