import { useEffect, useContext } from 'react';
import AppContext from '../../AppContext'; 
import Shoots from '../../components/Shoots/Shoots';
import { scrollToTop } from '../../utils/utils';
import './Home.scss';

const Home = () => {
  const { 
    showSideNav, 
    setShowSideNav,
  } = useContext(AppContext);
  
  useEffect(() => {
    setShowSideNav(false);
    scrollToTop();
  }, [])

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
