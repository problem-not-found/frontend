import SearchItem from "./SearchItem";
import CreatorSearchItem from "./CreatorSearchItem";
import styles from "./searchResults.module.css";

const SearchResults = ({
  results,
  activeTab = "전시",
  loading = false,
  error = null,
}) => {
  if (loading) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.loadingResults}>
          <p>검색 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.errorResults}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className={styles.resultsContainer}>
        <div className={styles.noResults}>
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultsContainer}>
      <div className={styles.resultsList}>
        {results.map((item) =>
          activeTab === "크리에이터" ? (
            <CreatorSearchItem key={item.id} creator={item} />
          ) : (
            <SearchItem key={item.id} item={item} />
          )
        )}
      </div>
    </div>
  );
};

export default SearchResults;
