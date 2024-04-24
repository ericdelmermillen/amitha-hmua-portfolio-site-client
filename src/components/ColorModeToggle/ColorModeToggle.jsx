import { useContext } from 'react';
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
    const currentMode = colorMode === 'light' 
      ? 'dark' 
      : 'light';
    setColorMode(currentMode);
  };

  return (
    <>
      <div className='colorModeToggle'>
        <input 
          className="colorModeToggle__checkbox" 
          type="checkbox" 
          id={inputId} 
          onClick={handleToggleColorMode}
        />
        <label 
          className="colorModeToggle__checkbox-label"
          htmlFor={inputId} 
          >
          <img 
            className='colorModeToggle__sun-icon'
            src={sun} 
            alt="Color Mode Light sun icon" />
          <img 
            className='colorModeToggle__moon-icon'
            src={moon} 
            alt="Color Mode Dark sun icon" />
          <span className="colorModeToggle__ball"></span>
        </label>
      </div>
    </>
  )};

export default ColorModeToggle;