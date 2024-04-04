import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
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
          <i className="moon">m</i>
          <i className="sun">s</i>
          <span className="ball"></span>
        </label>
      </div>

      

      
    </>
  )};

export default ColorModeToggle;