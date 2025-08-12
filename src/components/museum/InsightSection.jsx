import insightStyles from './insightSection.module.css';
import commonStyles from './common.module.css';
import useUserStore from '../../stores/userStore';
import exhibition1 from '../../assets/museum/큰사진1.png';
import exhibition2 from '../../assets/museum/큰사진2.png';
import artwork1 from '../../assets/museum/사진1.png';
import artwork2 from '../../assets/museum/사진2.png';
import lockImage from '../../assets/museum/잠금사진.png';

export default function InsightSection({ insights = [] }) {
  const { subscription } = useUserStore();
  const defaultInsights = [
    {
      id: 1,
      title: "관람객이 가장 오래 머문 작품",
      value: "평균 1분 20초",
      image: exhibition1
    },
    {
      id: 2,
      title: "종합적으로 가장 인기가 많은",
      value: "종합 점수 195점",
      image: exhibition2
    },
    {
      id: 3,
      title: "이번 달 가장 많이 본 작품",
      value: "조회수 1,250회",
      image: artwork1
    },
    {
      id: 4,
      title: "관람객 선호도 1위",
      value: "만족도 98%",
      image: artwork2
    }
  ];

  const insightData = insights && insights.length > 0 ? insights : defaultInsights;

  return (
    <section>
      <div className={commonStyles.sectionHeader}>
        <div className={commonStyles.sectionTitle}>
          <h3>내 전시장 인사이트</h3>
        </div>
      </div>
      
      {/* 인사이트 카드들 (이미지 + 설명) */}
      <div className={insightStyles.insightGrid}>
        {insightData.map((insight) => (
          <div key={insight.id} className={insightStyles.insightCard}>
            <div 
              className={`${insightStyles.insightImage} ${!subscription.isPremium ? insightStyles.locked : ''}`}
              style={{
                backgroundImage: insight.image ? `url(${insight.image})` : 'none'
              }}
            >
              {!subscription.isPremium && (
                <div className={insightStyles.lockOverlay}>
                  <img src={lockImage} alt="잠금" className={insightStyles.lockIcon} />
                </div>
              )}
            </div>
            <div className={insightStyles.insightInfo}>
              <h4 className={insightStyles.insightTitle}>{insight.title}</h4>
              <p className={insightStyles.insightValue}>{insight.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={commonStyles.sectionActionWrapper}>
        <a href="#" className={commonStyles.sectionAction}>
          전시 인사이트 보러가기
        </a>
      </div>
    </section>
  );
}
