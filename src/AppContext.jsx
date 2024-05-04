import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from './utils/utils.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ colorMode, setColorMode ] = useState(localStorage.getItem('colorMode') || "light");
  const [ showSideNav, setShowSideNav ] = useState(false);
  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);

  const [ selectedShoot, setSelectedShoot ] = useState(null);
  
  const [ selectedPhotogOrModel, setSelectedPhotogOrModel ] = useState({});

  const [ showDeleteShootModal, setShowDeleteShootModal ] = useState(false);

  const [ showPhotogOrModelModal, setShowPhotogOrModelModal ] = useState({modalType: null});
  
  const [ shouldUpdateShoots, setShouldUpdateShoots ] = useState(false);
  const [ shouldUpdatePhotographers, setShouldUpdatePhotographers ] = useState(false);
  const [ shouldUpdateModels, setShouldUpdateModels ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ isFirefox, setIsFirefox ] = useState(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);

  const navigate = useNavigate(); 

  useEffect(() => {
    checkTokenExpiration(setIsLoggedIn, navigate);
  }, []);

  useEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');  
    setColorMode(storedColorMode || "light");
  }, []);

  // Update local storage when color mode state changes
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  const contextValues = {
    isLoggedIn, 
    setIsLoggedIn,
    colorMode, 
    setColorMode,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    selectedShoot, 
    setSelectedShoot,
    showDeleteShootModal, 
    setShowDeleteShootModal,
    showPhotogOrModelModal, 
    setShowPhotogOrModelModal,
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    shouldUpdateShoots, 
    setShouldUpdateShoots,
    isLoading, 
    setIsLoading,
    isFirefox, 
    setIsFirefox
   }
  
  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
