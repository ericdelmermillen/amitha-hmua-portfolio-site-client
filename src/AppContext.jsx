import { useState, useEffect, createContext, useContext, useCallback, } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkTokenExpiration, scrollToTop } from './utils/utils.js';
import { toast } from 'react-toastify';

const AppContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AppProvider = ({ children }) => {

  const location = useLocation();

  const [ prevURL, setPrevURL ] = useState("");

  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ colorMode, setColorMode ] = useState(localStorage.getItem('colorMode') || "light");
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ minLoadingInterval, setMinLoadingInterval ] = useState(250); 

  const [ showFloatingButton, setShowFloatingButton ] = useState(!location.pathname.includes("edit") || !location.pathname.includes("add"));

  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);
  
  const [ showSideNav, setShowSideNav ] = useState(false);

  const [ selectedShoot, setSelectedShoot ] = useState(null);
  
  const [ selectedPhotogModelTag, setSelectedPhotogModelTag ] = useState({});

  const [ showDeleteOrEditModal, setShowDeleteOrEditModal ] = useState(false);

  const [ deleteOrEditClickAction, setDeleteOrEditClickAction ] = useState('')
  const [ showPhotogModelTagModal, setShowPhotogModelTagModal ] = useState({modalType: null});
  
  const [ shouldUpdatePhotographers, setShouldUpdatePhotographers ] = useState(false);
  const [ shouldUpdateModels, setShouldUpdateModels ] = useState(false);

  const [ tags, setTags ] = useState([]);
  const [ selectedTag, setSelectedTag ] = useState(null);
  const [ shouldUpdateTags, setShouldUpdateTags ] = useState(false);
  
  const [ selectValue, setSelectValue ] = useState(null);
  
  const [ shootDetails, setShootDetails ] = useState(null);

  const [ isOrderEditable, setIsOrderEditable ] = useState(false);

  const [ bioImg, setBioImg ] = useState("");

  const [ bioName, setBioName ] = useState("");

  const [ bioText, setBioText ] = useState("");

  const [ bioImageNotSet, setBioImageNotSet ] = useState(false);

  const [ lightboxOpen, setLightboxOpen ] = useState(false);
  const [ lightboxIndex, setLightboxIndex ] = useState(0);
  const [ slides, setSlides ] = useState([]);
  
  const navigate = useNavigate(); 

  const handleNavigateHome = useCallback((tagObj) => {   

    if(!tagObj) {
      navigate('/work');
      setSelectedTag(null);
    } else if (tagObj) {
      navigate(`/work?tag=${tagObj.tag_name}`);
    };

    setIsOrderEditable(false);
  }, [navigate]);

  const handleNavLinkClick = useCallback(() => {
    setSelectValue(null);
    setSelectedTag(null);
  }, []);

  const handleSetShowSideNav = () => {
    requestAnimationFrame(() => {
      setShowSideNav(showSideNav => !showSideNav);
    });
   };

  const handleDeleteOrEditClick = useCallback((e, action, shoot_id = null) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteOrEditModal(true);
    setDeleteOrEditClickAction(action);
    
    if(shoot_id) {
      setSelectedShoot(shoot_id);
    };
  }, []);

  const handleSetLightBoxState = (images, idx = 0) => {
    setSlides(images);
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const hideNav = () => document.getElementById("nav").classList.add("hide");

  const showNav = () => document.getElementById("nav").classList.remove("hide");

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
      };
    };
    
    if(shouldUpdateTags) {
      setIsLoading(true);
      setShouldUpdateTags(false);
      fetchTags();
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingInterval);
    };

    fetchTags();
  }, [BASE_URL, shouldUpdateTags]);

  // fetch bioPage data
  useEffect(() => {
    if(location.pathname.includes("bio")) {

      if(!bioText.length || !bioName.length || !bioImg.length) {
        setIsLoading(true);
  
        const fetchBioData = async () => {
    
          try {
            const response = await fetch(`${BASE_URL}/bio`);
  
            if(response.ok) {
              const data = await response.json();
              setBioText(data.bioText);
              setBioName(data.bioName);
              setBioImg(data.bioImgURL);
              setBioImageNotSet(data.bioImageNotSet)
            } else {
              throw new Error("Error fetching bio page content")
            };
  
          } catch(error) {
            console.log(error);
            toast.error(error);
          };
        };
        fetchBioData();
      };
    };
  }, [location]);

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
    };

    if(URLIncludesEdit || URLIncludesAdd) {
      setShowFloatingButton(false);
    } else if(!URLIncludesEdit || !URLIncludesAdd) {
      setShowFloatingButton(true);
    };
    
    scrollToTop();
    
    if(location.pathname === "/work" && prevURL !== "/work") {
      setIsLoading(false);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, minLoadingInterval);
    };
    setShowPhotogModelTagModal(false);
  }, [location]);

  // Update local storage when color mode state changes
  useEffect(() => {
    localStorage.setItem('colorMode', colorMode);
  }, [colorMode]);
  
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
    setMinLoadingInterval,
    minLoadingInterval, 
    selectedShoot, 
    setSelectedShoot,
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
    isOrderEditable, 
    setIsOrderEditable,
    bioImg, 
    setBioImg,
    bioName, 
    setBioName,
    bioText, 
    setBioText,
    bioImageNotSet, 
    setBioImageNotSet,

    // YARL
    lightboxOpen, 
    setLightboxOpen,
    lightboxIndex, 
    setLightboxIndex,
    slides, 
    setSlides,
    handleSetLightBoxState,

    // non-state functions
    hideNav,
    showNav,
    handleNavLinkClick,
    handleSetShowSideNav,
    handleNavigateHome,
    handleDeleteOrEditClick
   };
  
  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  )};

// custom hook to access AppContext object in context consumers
const useAppContext = () => {
  return useContext(AppContext)
}; 

export { AppProvider, useAppContext };