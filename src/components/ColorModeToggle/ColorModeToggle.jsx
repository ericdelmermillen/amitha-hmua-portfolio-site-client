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
      <div 
        className="colorModeToggle"
        onClick={handleToggleColorMode}
        >ColorModeToggle
      </div>
    </>
  )};

export default ColorModeToggle;