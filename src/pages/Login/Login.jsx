import LoginForm from '../../components/LoginForm/LoginForm';
import { useEffect } from 'react';
import { scrollToTop } from '../../utils/utils';
import './Login.scss';

const Login = () => {

  useEffect(() => {
    scrollToTop();
  })
  
  return (
    <>
      <div className="login">
        <LoginForm />
      </div>
    </>
  )};

export default Login;