import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ showSideNav, setShowSideNav ] = useState(false);
  const [ scrollYPos, setScrollYPos ] = useState(window.scrollY);
  const [ prevScrollYPos, setPrevScrollYPos ] = useState(window.scrollY);
  const [ selectedShoot, setSelectedShoot ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(true); 

  const navigate = useNavigate(); 

  useEffect(() => {

    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');

      if(token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Math.floor(Date.now() / 1000); 

          if (decodedToken.exp < currentTime) {
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


  const contextValues = {
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    selectedShoot, 
    setSelectedShoot,
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
