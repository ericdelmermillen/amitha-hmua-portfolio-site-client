import { useContext } from 'react';
import AppContext from '../../AppContext'; 
import './Home.scss';
import Shoots from '../../components/Shoots/Shoots';

const Home = () => {
  const { 
    isLoggedIn, 
    setIsLoggedIn
   } = useContext(AppContext);

  return ( 
    <>
      <div className="home">
        <h1 className="home__h1">From Home/Work</h1>
        <Shoots />
      </div>
    </>
  )};

export default Home;
