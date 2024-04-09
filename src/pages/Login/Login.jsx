import { useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import LoginForm from '../../components/LoginForm/LoginForm';
import { scrollToTop } from '../../utils/utils';
import './Login.scss';

const Login = () => {
  const { 
    showSideNav, 
    setShowSideNav,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

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