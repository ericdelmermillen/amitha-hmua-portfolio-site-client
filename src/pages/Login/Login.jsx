import { useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import LoginForm from '../../components/LoginForm/LoginForm';
import { scrollToTop } from '../../utils/utils';
import './Login.scss';

const Login = () => {
  const { 
    isLoading, 
    setIsLoading,
    showSideNav, 
    setShowSideNav,
  } = useContext(AppContext);

  // initial load useEffect
  useEffect(() => {
    setIsLoading(true);
    scrollToTop();
  }, []); 
  
  return (
    <>
      <div className="login">
        <LoginForm />
      </div>
    </>
  )};

export default Login;