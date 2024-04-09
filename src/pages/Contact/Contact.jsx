import { useState, useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';
import ContactForm from '../../components/ContactForm/ContactForm';
import './Contact.scss';

const Contact = () => {
  const { 
    showSideNav, 
    setShowSideNav,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  useEffect(() => {
    setIsLoading(true);
    setShowSideNav(false);
    scrollToTop();
    setTimeout(() => {
      setIsLoading(false);
    })
  }, [500]); 

  return (
    <>
      <div className="contact">
        <ContactForm />
      </div>
    </>
  )};

export default Contact;