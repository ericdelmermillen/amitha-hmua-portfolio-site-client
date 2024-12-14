import { useEffect, useState } from 'react';
import { useAppContext} from '../../AppContext';
import sun from '../../assets/icons/sun.svg';
import moon from '../../assets/icons/crescent_moon.svg';
import './ColorModeToggle.scss';

const ColorModeToggle = ({ inputId }) => {
  const { 
    colorMode, 
    setColorMode,
  } = useAppContext();

  const [ isDarkMode, setIsDarkMode ] = useState(colorMode === 'dark');

  const handleToggleColorMode = () => {
    const currentMode = colorMode === 'light' 
      ? 'dark' 
      : 'light';
    setColorMode(currentMode);
  };

  useEffect(() => {
    setIsDarkMode(colorMode === 'dark');
  }, [colorMode]);


  return (
    <>
      <div className='colorModeToggle'>
        <input 
          className="colorModeToggle__checkbox" 
          type="checkbox" 
          id={inputId} 
          onChange={handleToggleColorMode}
          checked={isDarkMode}
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