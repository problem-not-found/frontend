import useUserStore from '@/stores/userStore';
import styles from './premiumBar.module.css';

export default function PremiumBar() {
  const { subscription } = useUserStore();
  
  if (subscription.isPremium) {
    return (
      <div className={styles.premiumBar}>
        <span className={styles.premiumText}>
          {subscription.plan === 'pro' ? '프로' : '프리미엄'} 등급 구독 중
        </span>
      </div>
    );
  } else {
    return (
      <div className={styles.subscriptionPrompt}>
        <span className={styles.promptText}>
          구독을 통해 더 많은 기능을 사용해보세요.
        </span>
      </div>
    );
  }
}