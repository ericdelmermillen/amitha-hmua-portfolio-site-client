import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from './utils/utils.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ colorMode, setColorMode ] = useState(localStorage.getItem('colorMode') || "light");
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ minLoadingInterval, setMinLoadingInterval ] = useState(250); 
  const [ isFirefox, setIsFirefox ] = useState(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  const [ showFloatingButton, setShowfloatingButton ] = useState(!location.pathname.includes("edit") || !location.pathname.includes("add"));

  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);
  
  const [ showSideNav, setShowSideNav ] = useState(false);

  const [ selectedShoot, setSelectedShoot ] = useState(null);
  const [ shouldUpdateShoots, setShouldUpdateShoots ] = useState(false);
  
  const [ selectedPhotogModelTag, setSelectedPhotogModelTag ] = useState({});

  const [ showDeleteOrEditShootModal, setShowDeleteOrEditShootModal ] = useState(false);

  const [ deleteOrEditClickAction, setDeleteOrEditClickAction ] = useState('')
  const [ showPhotogModelTagModal, setShowPhotogModelTagModal ] = useState({modalType: null});
  
  const [ shouldUpdatePhotographers, setShouldUpdatePhotographers ] = useState(false);
  const [ shouldUpdateModels, setShouldUpdateModels ] = useState(false);
  const [ tags, setTags ] = useState([]);
  const [ shouldUpdateTags, setShouldUpdateTags ] = useState(false);
  
  const navigate = useNavigate(); 

  // fetch tags
  useEffect(() => {
    const token = localStorage.getItem('token');
    const headers = {};

    headers['Authorization'] = `Bearer ${token}`;

    const fetchTags = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tags/all`, { headers });
        
        if(!response.ok) {
          throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }

        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.log(error);
      } 
    };
    
    // if(isInitialLoad || shouldUpdateTags) {
    if(shouldUpdateTags) {
      setIsLoading(true);
      setShouldUpdateTags(false);
      fetchTags();
      setTimeout(() => {
        setIsLoading(false);
      })
    }
    fetchTags();
  }, [BASE_URL, shouldUpdateTags]);

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
    showDeleteOrEditShootModal, 
    setShowDeleteOrEditShootModal,
    deleteOrEditClickAction, 
    setDeleteOrEditClickAction,
    showPhotogModelTagModal, 
    setShowPhotogModelTagModal,
    selectedPhotogModelTag, 
    setSelectedPhotogModelTag,
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    shouldUpdateShoots, 
    setShouldUpdateShoots,
    shouldUpdateTags, 
    setShouldUpdateTags,
    isLoading, 
    setIsLoading,
    minLoadingInterval, 
    setMinLoadingInterval,
    isFirefox, 
    setIsFirefox,
    showFloatingButton, 
    setShowfloatingButton,
    tags, 
    setTags
   }
  
  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
