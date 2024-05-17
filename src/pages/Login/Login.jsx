import { useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import LoginForm from '../../components/LoginForm/LoginForm';
import './Login.scss';

// need background images for this page

const Login = () => {
  const { 
    setIsLoading,
    minLoadingInterval, 
    setMinLoadingInterval,
  } = useContext(AppContext);

  // initial load useEffect
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, minLoadingInterval)
  }, []); 
  
  return (
    <>
      <div className="login">
        <LoginForm />
      </div>
    </>
  )};

export default Login;