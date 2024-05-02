import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';


const checkTokenExpiration = async (setIsLoggedIn, navigate) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem('token');

  if(token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      const tokenExpTime = new Date(decodedToken.exp * 1000).toLocaleString('en-US');
      const currentDateTime = new Date(currentTime * 1000).toLocaleString('en-US');

      // console.log(`tokenExpTime: ${tokenExpTime}`)
      // console.log(`currentDateTime: ${currentDateTime}`)

      // console.log(tokenExpTime < currentDateTime)
      
      

      // console.log(decodedToken.exp)
      // console.log(decodedToken.exp)

      if(decodedToken.exp > currentTime) {
        return setIsLoggedIn(true);
      } else if(decodedToken.exp < currentTime) {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if(refreshToken) {
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken
            })
          });

          // console.log("Token expired: attempting refresh");

          if(refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            localStorage.setItem('token', accessToken);
            setIsLoggedIn(true);
            return false;
          } else {
            setIsLoggedIn(false);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            return true;
          }
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          navigate('/');
          toast.error('Token expired. Logging you out...');
          return true;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      navigate('/');
      toast.error('Token expired. Logging you out...');
      return true;
    }
  } else {
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    return true; 
  }
};


const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password) =>{
  return password.trim().length >= 8;
}

export { 
  checkTokenExpiration,
  scrollToTop,
  isValidEmail, 
  isValidPassword
};
