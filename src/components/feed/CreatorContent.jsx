import PropTypes from 'prop-types';
import SectionHeading from './SectionHeading';
import CreatorCard from './CreatorCard';
import TrendingCreatorCard from './TrendingCreatorCard';
import FeedHorizontalList from './HorizontalList';
import styles from './creatorContent.module.css';

const CreatorContent = ({ trendingCreator, recentCreators, similarAgeCreators }) => {
  return (
    <div className={styles.container}>
      {/* 지금 뜨는 크리에이터 */}
      <TrendingCreatorCard creator={trendingCreator} />
      
      <div className={styles.main}>
        <SectionHeading
        title="최근 전시 오픈한 크리에이터"
        caption="최근 7일 동안 새로 전시를 오픈한 크리에이터예요"
        isFirst={true}
      />
      
      <FeedHorizontalList
        items={recentCreators}
        renderItem={(creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        )}
        showIndex={true}
        totalCount={4}
        isCreatorTab={true}
      />

      <SectionHeading
        title="나와 비슷한 연령대의 크리에이터"
        caption="내 또래들의 작품 활동이에요"
      />
      
      <FeedHorizontalList
        items={similarAgeCreators}
        renderItem={(creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        )}
        showVerticalLine={true}
        verticalLineHeight={244}
        isCreatorTab={true}
      />
      </div>
    </div>
  );
};

CreatorContent.propTypes = {
  trendingCreator: PropTypes.object.isRequired,
  recentCreators: PropTypes.array.isRequired,
  similarAgeCreators: PropTypes.array.isRequired,
};

export default CreatorContent;
