import { useState } from 'react';
import SearchHeader from '../components/search/SearchHeader';
import SearchFilters from '../components/search/SearchFilters';
import SearchResults from '../components/search/SearchResults';
import SearchEmpty from '../components/search/SearchEmpty';
import AppFooter from '../components/footer/AppFooter';
import BackToTopButton from '../components/common/BackToTopButton';
import styles from './searchPage.module.css';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('전시');
  
  const exhibitionResults = [
    {
      id: 1,
      title: "서경대학교 비주얼디자인전공 졸업 전시",
      type: "exhibition"
    },
    {
      id: 2,
      title: "국민대학교 컴퓨터공학과 졸업 전시",
      type: "exhibition"
    },
    {
      id: 3,
      title: "서경대학교 소프트웨어학과 졸업 전시",
      type: "exhibition"
    }
  ];

  const creatorResults = [
    {
      id: 1,
      name: "정땡땡",
      username: "simonisnextdoor",
      profileImage: "/creator-profile.png",
      type: "creator"
    },
    {
      id: 2,
      name: "정땡구",
      username: "simonisnextdoor",
      profileImage: "/artwork1.png",
      type: "creator"
    },
    {
      id: 3,
      name: "땡정땡",
      username: "simonisnextdoor",
      profileImage: "/artwork2.png",
      type: "creator"
    },
    {
      id: 4,
      name: "정정땡땡",
      username: "simonisnextdoor",
      profileImage: "/artwork3.png",
      type: "creator"
    },
    {
      id: 5,
      name: "김땡정땡땡",
      username: "simonisnextdoor",
      profileImage: "/creator-hero-image.png",
      type: "creator"
    }
  ];

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleKeywordSelect = (keyword) => {
    setSearchQuery(keyword);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const hasSearchQuery = searchQuery.trim().length > 0;
  
  const getCurrentResults = () => {
    if (activeTab === '크리에이터') {
      return creatorResults;
    }
    return exhibitionResults;
  };

  return (
    <div className={styles.container}>
      <SearchHeader 
        onSearchChange={handleSearchChange}
        hasSearchQuery={hasSearchQuery}
      />
      
      {hasSearchQuery ? (
        <>
          <SearchFilters onTabChange={handleTabChange} />
          <SearchResults results={getCurrentResults()} activeTab={activeTab} />
        </>
      ) : (
        <SearchEmpty onKeywordSelect={handleKeywordSelect} />
      )}
      
      <AppFooter />
      <BackToTopButton />
    </div>
  );
};

export default SearchPage;
