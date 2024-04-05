import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
// import sun from '../../assets/icons/sun.svg';
// import sun from '../../assets/icons/sun_1.svg';
import sun from '../../assets/icons/sun_2.svg';
// import sun from '../../assets/icons/sun_3.svg';
import moon from '../../assets/icons/crescent_moon.svg';
import './ColorModeToggle.scss';

const ColorModeToggle = () => {

  const { 
    colorMode, 
    setColorMode,
  } = useContext(AppContext);

  const handleToggleColorMode = () => {
    const currentMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(currentMode);
    console.log(currentMode)
  };

  
  return (
    <>
      <div className='colorModeToggle'>
        <input 
          type="checkbox" 
          className="checkbox" 
          id="checkbox" 
          onClick={handleToggleColorMode}
        />
        <label 
          htmlFor="checkbox" 
          className="checkbox-label"
          >
          <img 
            className='colorModeToggle__sun-icon'
            src={sun} 
            alt="" />
          <img 
            className='colorModeToggle__moon-icon'
            src={moon} 
            alt="" />
          <span className="ball"></span>
        </label>
      </div>

      

      
    </>
  )};

export default ColorModeToggle;