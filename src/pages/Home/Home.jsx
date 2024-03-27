import { useContext } from 'react';
import AppContext from '../../AppContext'; 
import Shoots from '../../components/Shoots/Shoots';
import './Home.scss';

const Home = () => {

  return ( 
    <>
      <div className="home">
        <Shoots />
      </div>
    </>
  )};

export default Home;
