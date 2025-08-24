import PropTypes from 'prop-types';
import SectionHeading from './SectionHeading';
import CreatorCard from './CreatorCard';
import TrendingCreatorCard from './TrendingCreatorCard';
import FeedHorizontalList from './HorizontalList';
import styles from './creatorContent.module.css';
import { ClipLoader } from 'react-spinners';

const CreatorContent = ({ 
  trendingCreator, 
  trendingCreatorLoading,
  trendingCreatorError,
  recentCreators, 
  recentCreatorsLoading, 
  recentCreatorsError,
  similarAgeCreators, 
  similarAgeCreatorsLoading, 
  similarAgeCreatorsError 
}) => {
  return (
    <div className={styles.container}>
      {/* 지금 뜨는 크리에이터 */}
      {trendingCreatorLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          margin: '20px 0'
        }}>
          <ClipLoader color="var(--color-main)" size={30} />
        </div>
      ) : trendingCreatorError ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          margin: '20px 0',
          color: '#666'
        }}>
          지금 뜨는 크리에이터를 불러올 수 없습니다.
        </div>
      ) : (
        <TrendingCreatorCard creator={trendingCreator} />
      )}
      
      <div className={styles.main}>
        <SectionHeading
        title="최근 전시 오픈한 크리에이터"
        caption="최근 7일 동안 새로 전시를 오픈한 크리에이터예요"
        isFirst={true}
      />
      
      {recentCreatorsLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100px',
          margin: '20px 0'
        }}>
          <ClipLoader color="var(--color-main)" size={25} />
        </div>
      ) : recentCreatorsError ? (
        <FeedHorizontalList
          items={[]}
          renderItem={() => null}
          showIndex={true}
          totalCount={0}
          isCreatorTab={true}
        />
      ) : (
        <FeedHorizontalList
          items={recentCreators}
          renderItem={(creator) => (
            <CreatorCard key={creator.userId} creator={creator} />
          )}
          showIndex={true}
          totalCount={recentCreators.length}
          isCreatorTab={true}
        />
      )}

      <SectionHeading
        title="나와 비슷한 연령대의 크리에이터"
        caption="내 또래들의 작품 활동이에요"
      />
      
      {similarAgeCreatorsLoading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100px',
          margin: '20px 0'
        }}>
          <ClipLoader color="var(--color-main)" size={25} />
        </div>
      ) : similarAgeCreatorsError ? (
        <FeedHorizontalList
          items={[]}
          renderItem={() => null}
          showVerticalLine={true}
          verticalLineHeight={244}
          isCreatorTab={true}
        />
      ) : (
        <FeedHorizontalList
          items={similarAgeCreators}
          renderItem={(creator) => (
            <CreatorCard key={creator.userId} creator={creator} />
          )}
          showVerticalLine={true}
          verticalLineHeight={244}
          isCreatorTab={true}
        />
      )}
      </div>
    </div>
  );
};

CreatorContent.propTypes = {
  trendingCreator: PropTypes.object,
  trendingCreatorLoading: PropTypes.bool,
  trendingCreatorError: PropTypes.object,
  recentCreators: PropTypes.array.isRequired,
  recentCreatorsLoading: PropTypes.bool,
  recentCreatorsError: PropTypes.object,
  similarAgeCreators: PropTypes.array.isRequired,
  similarAgeCreatorsLoading: PropTypes.bool,
  similarAgeCreatorsError: PropTypes.object,
};

export default CreatorContent;
