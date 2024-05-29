import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkTokenExpiration, scrollToTop } from './utils/utils.js';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const location = useLocation();

  const [ prevURL, setPrevURL ] = useState("");

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ colorMode, setColorMode ] = useState(localStorage.getItem('colorMode') || "light");
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ minLoadingInterval, setMinLoadingInterval ] = useState(250); 
  const [ isFirefox, setIsFirefox ] = useState(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
  const [ isSafari, setIsSafari ] = useState(false);

  const [ showFloatingButton, setShowFloatingButton ] = useState(!location.pathname.includes("edit") || !location.pathname.includes("add"));

  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);
  
  const [ showSideNav, setShowSideNav ] = useState(false);

  const [ selectedShoot, setSelectedShoot ] = useState(null);
  const [ shouldUpdateShoots, setShouldUpdateShoots ] = useState(false);
  
  const [ selectedPhotogModelTag, setSelectedPhotogModelTag ] = useState({});

  // ---
  const [ showDeleteOrEditModal, setShowDeleteOrEditModal ] = useState(false);
  // --
  const [ deleteOrEditClickAction, setDeleteOrEditClickAction ] = useState('')
  const [ showPhotogModelTagModal, setShowPhotogModelTagModal ] = useState({modalType: null});
  
  const [ shouldUpdatePhotographers, setShouldUpdatePhotographers ] = useState(false);
  const [ shouldUpdateModels, setShouldUpdateModels ] = useState(false);

  const [ tags, setTags ] = useState([]);
  const [ selectedTag, setSelectedTag ] = useState(null);
  const [ shouldUpdateTags, setShouldUpdateTags ] = useState(false);
  
  const [ selectValue, setSelectValue ] = useState(null);

  const [ shootDetails, setShootDetails ] = useState(null);

  const [ isInitialShootsLoad, setIsInitialShootsLoad ] = useState(false);

  // bio state---
  const [ bioImg, setBioImg ] = useState("");
  const [ bioName, setBioName ] = useState("");
  const [ bioText, setBioText ] = useState("");
  
  // --
  
  const navigate = useNavigate(); 

  const handleNavigateHome = (updateAllShoots, updateFilteredShoots, tagObj) => {    
    
    if(updateAllShoots && !updateFilteredShoots) {
      setSelectedTag(null);
      navigate('/work');
      setSelectValue(null);
    } else if(!updateAllShoots && updateFilteredShoots && tagObj) {
      navigate(`/work?tag=${tagObj.tag_name}`);
    }
  };

  const handleNavLinkClick = () => {
    setSelectValue(null);
    setSelectedTag(null);
  };

  const handleDeleteOrEditClick = (e, action, shoot_id = null) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteOrEditModal(true);
    setDeleteOrEditClickAction(action);
    
    if(shoot_id) {
      setSelectedShoot(shoot_id);
    }
  };

  // fetchTags
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
    
    if(shouldUpdateTags) {
      setIsLoading(true);
      setShouldUpdateTags(false);
      fetchTags();
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingInterval);
    }

    fetchTags();
  }, [BASE_URL, shouldUpdateTags]);

  // handle updating of current URL for comparison of if URL has changed elsewhere to avoid unneccessary calls
  useEffect(() => {
    setIsLoading(true);

    const pathname = location.pathname;
    const search = location.search;
    const currentURL = pathname.concat(search);
    const URLIncludesEdit = pathname.includes("edit");
    const URLIncludesAdd = pathname.includes("add");

    if(currentURL !== prevURL) {
      setPrevURL(currentURL);
    }

    if(URLIncludesEdit || URLIncludesAdd) {
      setShowFloatingButton(false);
    } else if(!URLIncludesEdit || !URLIncludesAdd) {
      setShowFloatingButton(true);
    }
    
    scrollToTop();
    
    if(location.pathname === "/work" && prevURL !== "/work") {
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingInterval);
    }
  }, [location]);

  // Update local storage when color mode state changes
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isSafariBrowser = /safari/.test(userAgent) && !/chrome/.test(userAgent) && !/android/.test(userAgent);
    const isSafariFeatureDetection = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    setIsSafari(isSafariBrowser || isSafariFeatureDetection);
  }, []);
  
  // check loggedIn on mount
  useEffect(() => {
    checkTokenExpiration(setIsLoggedIn, navigate);
  }, []);

  // check colorMode on mount
  useEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');  
    setColorMode(storedColorMode || "light");
  }, []);


  const contextValues = {
    isLoading, 
    setIsLoading,
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
    showFloatingButton, 
    setShowFloatingButton,
    prevURL, 
    setPrevURL,
    isFirefox, 
    setIsFirefox,
    isSafari, 
    setIsSafari,
    setMinLoadingInterval,
    minLoadingInterval, 
    selectedShoot, 
    setSelectedShoot,
    // ---
    showDeleteOrEditModal, 
    setShowDeleteOrEditModal,
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
    tags, 
    setTags,
    selectedTag, 
    setSelectedTag,
    selectValue, 
    setSelectValue,
    shootDetails, 
    setShootDetails,
    isInitialShootsLoad, 
    setIsInitialShootsLoad,
    bioImg, 
    setBioImg,
    bioName, 
    setBioName,
    bioText, 
    setBioText,
    // non-state functions
    handleNavLinkClick,
    handleNavigateHome,
    handleDeleteOrEditClick
   }
  
  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
