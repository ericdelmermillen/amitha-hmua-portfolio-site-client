import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isValidEmail, isValidPassword } from '../../utils/utils';
import AppContext from '../../AppContext'; 
import { toast } from 'react-toastify';
import hide from '../../../src/assets/icons/hide.svg';
import show from '../../../src/assets/icons/show.svg';
import './LoginForm.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const { 
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
  } = useContext(AppContext);

  const [ emailInvalid, setEmailInvalid ] = useState(false);
  const [ passwordInvalid, setPasswordInvalid ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ showPassword, setShowPassword ] = useState(false);

  const navigate = useNavigate(); 

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(isValidEmail(email)) {
      setEmailInvalid(false)
    } else {
      return setEmailInvalid(true)
    }
  
    if(isValidPassword(password)) {
      setPasswordInvalid(false);
    } else {
     return setPasswordInvalid(true);
    }
    
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });
  
      if(response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        setIsLoading(true);
        navigate('/');
        toast.success('Successfully logged in!');
      } else {
        toast.error('Login Failed. Check Email & Password')
      }
    } catch(error) {
      toast.error(error.message)
      console.error('Error:', error);
    }
  };

  return (
    <>
      <div className="loginForm">
        <div className="loginForm__modal">
          <h2 className="loginForm__title">Admin Login</h2>
          <form 
            className="loginForm__form" 
            onSubmit={handleSubmit}>
            <div className="loginForm__group">
              <label 
                htmlFor="email" className="loginForm__label">
                  Email
              </label>
              <input
                type="text"
                id="email"
                className="loginForm__input"
                value={email}
                placeholder="Email"
                onChange={handleEmailChange}
              />
              <div 
                className={`loginForm__error ${emailInvalid && "email-error"}`}
              >
                Invalid Email
              </div>
            </div>
            <div className="loginForm__group">
              <label 
                htmlFor="password" className="loginForm__label">
                  Password
              </label>
              <div className="passwordInput">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="loginForm__input"
                  value={password}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                />
                <img 
                  className="passwordInput__icon"
                  src={showPassword ? hide : show} 
                  alt="hide password icon"
                  onClick={() => setShowPassword(!showPassword)}/>
              </div>
              <div 
                className={`loginForm__error ${passwordInvalid && "password-error"}`}
              >
                Password Incorrect
              </div>
            </div>
            <div className="loginForm__button-container">
              <button 
                type="submit" className="loginForm__button loginForm__button--login">
                  Login
              </button>
              <Link to={'/'}>
                <button 
                  type="submit" className="loginForm__button loginForm__button--cancel">
                    Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
)};

export default LoginForm;
