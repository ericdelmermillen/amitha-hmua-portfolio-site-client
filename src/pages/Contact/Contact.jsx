import { useEffect, useContext } from 'react';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';
import ContactForm from '../../components/ContactForm/ContactForm';
import './Contact.scss';

const Contact = () => {
  const { 
    setIsLoading,
    setShowSideNav
  } = useContext(AppContext);

  // initial load useEffect
  useEffect(() => {
    setIsLoading(true);
    setShowSideNav(false);
    scrollToTop();
  }, []); 

  return (
    <>
      <div className="contact">
        <ContactForm />
      </div>
    </>
  )};

export default Contact;