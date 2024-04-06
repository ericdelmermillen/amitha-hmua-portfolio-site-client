import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import sun from '../../assets/icons/sun.svg';
import moon from '../../assets/icons/crescent_moon.svg';
import './ColorModeToggle.scss';

const ColorModeToggle = ({ inputId }) => {

  const { 
    colorMode, 
    setColorMode,
  } = useContext(AppContext);

  const handleToggleColorMode = () => {
    const currentMode = colorMode === 'light' ? 'dark' : 'light'
    setColorMode(currentMode);
  };

  return (
    <>
      <div className='colorModeToggle'>
        <input 
          type="checkbox" 
          className="checkbox" 
          id={inputId} 
          onClick={handleToggleColorMode}
        />
        <label 
          htmlFor={inputId} 
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