import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext'; 
import { Link } from 'react-router-dom';
import { isValidEmail, isValidPassword } from '../../utils/utils';
import { toast } from 'react-toastify';
import Hide from '../../assets/icons/Hide';
import Show from '../../assets/icons/Show';
import './LoginForm.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginForm = () => {
  const { 
    setIsLoggedIn,
    handleNavigateHome,
    isSafari
  } = useContext(AppContext);
  
  const [ email, setEmail ] = useState('');
  const [ emailIsInvalid, setEmailIsInvalid ] = useState(false);
  const [ shouldCheckEmailIsValid, setShouldCheckEmailIsValid ] = useState(false);
  
  const [ password, setPassword ] = useState('');
  const [ passwordInvalid, setPasswordInvalid ] = useState(false);
  const [ shouldCheckPasswordIsValid, setShouldCheckPasswordIsValid ] = useState(false);

  const [ showPassword, setShowPassword ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    if(shouldCheckEmailIsValid) {
      setEmailIsInvalid(!isValidEmail(email));
    }
  };

  const handleCheckEmailIsValid =() => {
    if(isValidEmail(email)) {
      setEmailIsInvalid(false)
    } else {
      setEmailIsInvalid(true);
      setShouldCheckEmailIsValid(true);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    
    if(shouldCheckPasswordIsValid) {
      handleCheckPasswordIsValid()
    }
  };

  const handleCheckPasswordIsValid = () => {
    if(isValidPassword(password)) {
      setPasswordInvalid(false);
    } else {
      setPasswordInvalid(true)
      setShouldCheckPasswordIsValid(true)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if(!isValidEmail(email)) {
      setEmailIsInvalid(true);
      return;
    }
    
    if(!isValidPassword(password)) {
      setPasswordInvalid(true);
      return;
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
        const { token, refreshToken } = data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken); 
        setIsLoggedIn(true);
        handleNavigateHome(true, false, null);
        toast.success('Successfully logged in!');
      } else if(response.status === 401) {
        toast.error('Login Failed. Check Email & Password')
      }
    } catch(error) {
      toast.error(error.message)
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setShowModal(true)
    }, 0)
  }, []);

  return (
    <>
      <div className='loginForm'>
        <div className='loginForm__modal'>
          <h1 className='loginForm__title'>
            Admin Login
          </h1>
          <form 
            className={`loginForm__form ${showModal ? "show" : ""}`} 
            onSubmit={handleSubmit}>
            <div className='loginForm__group'>
              <label 
                htmlFor='email' className='loginForm__label'>
                  Email
              </label>
              <input
                type='text'
                id='email'
                className='loginForm__input'
                value={email}
                placeholder='Email'
                onChange={handleEmailChange}
                onBlur={handleCheckEmailIsValid}
              />
              <div 
                className={`loginForm__error ${emailIsInvalid && 'email-error'}`}
              >
                Invalid Email
              </div>
            </div>
            <div className='loginForm__group'>
              <label 
                htmlFor='password' className='loginForm__label'>
                  Password
              </label>
              <div className='passwordInput'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  className='loginForm__input'
                  value={password}
                  placeholder='Password'
                  onChange={handlePasswordChange}
                  onBlur={handleCheckPasswordIsValid}
                />

                <div 
                  className={`passwordInput__icon ${!isSafari ? "show": ""}`}
                  alt='password hide/show icon'
                  onClick={() => setShowPassword(!showPassword)}
                >

                  {showPassword 
                    ? <Hide 
                        className={'passwordInput__icon--hide'}
                      />
                    : <Show 
                        className={'passwordInput__icon--show'}
                      />
                  }
                </div>
              </div>
              <div 
                className={`loginForm__error ${passwordInvalid && 'password-error'}`}
              >
                Password Incorrect
              </div>
            </div>
            <div className='loginForm__button-container'>
              <button 
                type='submit' className='loginForm__button loginForm__button--login'>
                  Login
              </button>
              <Link to={'/'}>
                <button 
                  type='button' className='loginForm__button loginForm__button--cancel'>
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
