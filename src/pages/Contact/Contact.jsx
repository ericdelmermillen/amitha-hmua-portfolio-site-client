import { useState, useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';
import './Contact.scss';

const Contact = () => {
  const { 
    showSideNav, 
    setShowSideNav,
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