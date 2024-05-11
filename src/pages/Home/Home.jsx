import { useState, useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import { useLocation } from 'react-router-dom';
import AppContext from '../../AppContext'; 
import Shoots from '../../components/Shoots/Shoots';
import './Home.scss';

const Home = () => {
  const { 
    setShowSideNav,
    tags, 
    setTags,
    selectedTag, 
    setSelectedTag
  } = useContext(AppContext);

  // const location = useLocation();

  // const [ searchTerm, setSearchTerm ] = useState(location.search.split("=")[1] || null);

  // // console.log(location.search.split("=")[1])
  
  
  // // initial load useEffect
  // useEffect(() => {
  //   let searchedTerm;

  //   if(tags && searchTerm) {
  //     searchedTerm = tags.find(tag => tag.tag_name.toLowerCase() === searchTerm);
  //   }

  //   if(searchedTerm) {
  //     // console.log(searchedTerm)
  //     setSelectedTag(searchedTerm)
  //   }

  //   setShowSideNav(false);
  //   scrollToTop();
  // }, [searchTerm, tags])

  return ( 
    <>
      <div className="home">
        <div className="home__inner">
          <Shoots />
        </div>
      </div>
    </>
  )};

export default Home;
