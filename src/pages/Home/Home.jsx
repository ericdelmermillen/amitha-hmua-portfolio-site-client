import { useContext } from 'react';
import AppContext from '../../AppContext'; 
import './Home.scss';

const Home = () => {
  const { 
    isLoggedIn, 
    setIsLoggedIn
   } = useContext(AppContext);

  return ( 
    <div className="home">
      <h1 className="home__h1">From Home/Work</h1>
    </div>
  )};

export default Home;
