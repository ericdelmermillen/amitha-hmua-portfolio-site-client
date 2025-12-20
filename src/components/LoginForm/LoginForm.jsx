import { useState, useRef, useEffect } from "react";
import { useAppContext } from '../../AppContext'; 
import { Link } from 'react-router-dom';
import { isValidEmail, isValidPassword } from '../../utils/utils';
import { toast } from 'react-toastify';
import Hide from '../../assets/icons/Hide';
import Show from '../../assets/icons/Show';
import './LoginForm.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const isSafari = navigator.userAgent.toLowerCase().includes("safari") && 
  (!navigator.userAgent.toLowerCase().includes("chrome") || !navigator.userAgent.toLowerCase().includes("mozilla"));

const LoginForm = () => {
  const { 
    setIsLoggedIn,
    handleNavigateHome
  } = useAppContext();
  
  const [ email, setEmail ] = useState('');
  const [ emailIsInvalid, setEmailIsInvalid ] = useState(false);
  
  const [ password, setPassword ] = useState('');
  const [ passwordInvalid, setPasswordInvalid ] = useState(false);
  const [ initialFormCheck, setInitialFormCheck ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const [ showModal, setShowModal ] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleEmailChange = (e) => {
    const emailValue =
      e?.target.value ?? emailRef.current?.value ?? "";

    setEmail(emailValue);

    if(initialFormCheck) {
      handleCheckEmailIsValid(emailValue);
    };
  };

    const handleCheckEmailIsValid = (emailValue) => {
    setEmailIsInvalid(!isValidEmail(emailValue));
  };
  
  const handlePasswordChange = (e) => {
    const passwordValue =
      e?.target.value ?? passwordRef.current?.value ?? "";

    setPassword(passwordValue);

    if(initialFormCheck) {
      handleCheckPasswordIsValid(passwordValue);
    };
  };

  const handleCheckPasswordIsValid = (passwordValue) => {
  setPasswordInvalid(!isValidPassword(passwordValue));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    setInitialFormCheck(true);

    let invalidInputs = 0;
  
    if(!isValidEmail(email)) {
      setEmailIsInvalid(true);
      toast.error("Invalid email");
      invalidInputs += 1;
    };
    
    if(!isValidPassword(password)) {
      setPasswordInvalid(true);
      toast.error("Invalid password");
      invalidInputs += 1;
    };

    if(invalidInputs) {
      return;
    };
  
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
        handleNavigateHome();
        toast.success('Successfully logged in!');
      } else if(response.status === 401) {
        console.log("401");
        toast.error('Login Failed. Check Email & Password')
      } else if(response.status === 404) {
        console.log(`response.status: ${response.status}`)
        toast.error("User not found");
      };
    } catch(error) {
      toast.error(error.message)
      console.error('Error:', error);
    };
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
                ref={emailRef}
                placeholder='Email'
                onChange={handleEmailChange}
              />
              <div 
                className={`loginForm__error ${emailIsInvalid && initialFormCheck && 'email-error'}`}
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
                  ref={passwordRef}
                  placeholder='Password'
                  onChange={handlePasswordChange}
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
                className={`loginForm__error ${passwordInvalid && initialFormCheck && 'password-error'}`}
              >
                Invalid Password
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