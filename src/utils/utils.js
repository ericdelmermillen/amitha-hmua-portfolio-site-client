import { jwtDecode } from 'jwt-decode';

const checkTokenExpiration = async (setIsLoggedIn, navigate) => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              refreshToken
            })
          });

          console.log("token expired: attempting refresh")

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            localStorage.setItem('token', accessToken);
            setIsLoggedIn(true);
          } else {
            // Refresh token failed, log user out
            setIsLoggedIn(false);
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            toast.error('Token expired. Logging you out...');
            navigate('/');
          }
        } else {
          // No refresh token available, log user out
          setIsLoggedIn(false);
          localStorage.removeItem('token');
          toast.error('Token expired. Logging you out...');
          navigate('/');
        }
      } else {
        // Token is still valid
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      setIsLoggedIn(false);
      localStorage.removeItem('token');
    }
  } else {
    setIsLoggedIn(false);
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
