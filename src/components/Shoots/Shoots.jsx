import { useState, useEffect, useContext } from 'react';
import './Shoots.scss';
import Shoot from '../Shoot/Shoot';
import AppContext from '../../AppContext';

const Shoots = () => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    shootsData, 
    setShootsData
    } = useContext(AppContext);

  return (
    <>
      <div className="shoots">
        <div className="shoots__inner">
        {shootsData.map(shoot => (
          <Shoot 
            key={shoot.shoot_id} 
            shoot_id={shoot.shoot_id}
            title={shoot.shoot_title}
            thumbnail_url={shoot.thumbnail_url}
            models={shoot.models}
            photographers={shoot.photographers}
          /> 
          )
        )}
          
        </div>
      </div>
    </>
  )};

export default Shoots;