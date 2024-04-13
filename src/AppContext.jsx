import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ colorMode, setColorMode ] = useState(localStorage.getItem('colorMode') || "light");
  // 
  const [ showSideNav, setShowSideNav ] = useState(false);
  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);

  const [ selectedShoot, setSelectedShoot ] = useState(null);

  // state to show selectedPhotogOrModel ---
  const [ selectedPhotogOrModel, setSelectedPhotogOrModel ] = useState();

  // const [ selectedPhotogOrModel, setSelectedPhotogOrModel ] = useState(
    // {
    //   "id": 1,
    //   "photographer_name": "Natasha Gerschon"
    // }
    // {
    //   "id": 1,
    //   "model_name": "Samira Salastname"
    // },
  // );
  // ---

  // modals start
  const [ showDeleteShootModal, setShowDeleteShootModal ] = useState(false);
  
  // for rewriting add photog and add model
  const [ showAddPhotogOrModelModal, setShowAddPhotogOrModelModal ] = useState({entryType: null});
  
  // for change to addPhotogOrModelModal
  

  const [ showDeletePhotogOrModelModal, setShowDeletePhotogOrModelModal ] = useState(false);
  // modals end
  
  
  
  const [ shouldUpdateShoots, setShouldUpdateShoots ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false); 
  const [ shouldUpdatePhotographers, setShouldUpdatePhotographers ] = useState(false);
  const [ shouldUpdateModels, setShouldUpdateModels ] = useState(false);

  const navigate = useNavigate(); 

  useEffect(() => {

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');

      if(token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000); 

          if(decodedToken.exp < currentTime) {
            setIsLoggedIn(false); 
            localStorage.removeItem('token'); 
            toast.error('Token expired. Logging you out...');
            navigate('/');
          } else {
            setIsLoggedIn(true);
          }

        } catch(error) {
          console.error('Error decoding token:', error);
          setIsLoggedIn(false);
          localStorage.removeItem('token'); 
        }
      } else {
        setIsLoggedIn(false);
      }
    }

    checkTokenExpiration();

    const intervalId = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // color mode checking on initial mount
  useEffect(() => {
    const storedColorMode = localStorage.getItem('colorMode');  

    if(storedColorMode) {
      setColorMode(storedColorMode);
    }

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

    // modals start
    showDeleteShootModal, 
    setShowDeleteShootModal,
    
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    showDeletePhotogOrModelModal, 
    setShowDeletePhotogOrModelModal,



    // change to addPhotogOrModelModal --
    showAddPhotogOrModelModal,
    setShowAddPhotogOrModelModal,
    

    // modals end
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    // should updates for model and photographer choosers
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    
    
    shouldUpdateShoots, 
    setShouldUpdateShoots,
    isLoading, 
    setIsLoading
   }
  
  return (
    <>
      <AppContext.Provider value={contextValues}>
        {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
