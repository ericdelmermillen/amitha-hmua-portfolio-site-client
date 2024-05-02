import { useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext'; 
import Shoots from '../../components/Shoots/Shoots';
import './Home.scss';

const Home = () => {
  const { 
    setShowSideNav,
  } = useContext(AppContext);
  
  // initial load useEffect
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
