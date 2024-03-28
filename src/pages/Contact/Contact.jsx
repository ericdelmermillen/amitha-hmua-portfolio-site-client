import './Contact.scss';
import { useState, useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';



const Contact = () => {
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

  useEffect(() => {
    setShowSideNav(false);
    scrollToTop();
  }, [])

  return (
    <>
      <div className="contact">
        <h1 className="contact__h1">From Contact</h1>
      </div>
    </>
  )};

export default Contact;