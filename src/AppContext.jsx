import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const [ showSideNav, setShowSideNav ] = useState(false);

  // do I need state for os?

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
  

  return (
    <>
      <AppContext.Provider 
        value={{ 
          isLoggedIn, setIsLoggedIn,
          showSideNav, setShowSideNav}}>
            {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
