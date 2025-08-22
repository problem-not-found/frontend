import styles from './userSettingsMenu.module.css';

import settingsIcon from "../../assets/user/settings.png";
import supportIcon from "../../assets/user/headphones.png";
import feedbackIcon from "../../assets/user/mail.png";
import policyIcon from "../../assets/user/info.png";
import notificationIcon from "../../assets/user/bell.png";
import chevronRightIcon from "../../assets/user/chevron-right.svg";

export default function UserSettingsMenu() {
  const settingsMenu = [
    { title: "앱 설정", icon: settingsIcon },
    { title: "고객센터", icon: supportIcon },
    { title: "의견 남기기", icon: feedbackIcon },
    { title: "약관 및 정책", icon: policyIcon },
    { title: "알림 설정", icon: notificationIcon }
  ];

  return (
    <div className={styles.settingsContainer}>
      {settingsMenu.map((item, index) => (
        <div key={index} className={styles.settingItem}>
          <div className={styles.settingContent}>
            <img 
              src={item.icon} 
              alt={item.title} 
              className={styles.settingIcon}
              style={{ width: 24, height: 24 }}
            />
            <span className={styles.settingTitle}>{item.title}</span>
          </div>
          <div className={styles.chevron}>
            <img src={chevronRightIcon} alt="arrow" className={styles.chevronIcon} />
          </div>
        </div>
      ))}
    </div>
  );
}
