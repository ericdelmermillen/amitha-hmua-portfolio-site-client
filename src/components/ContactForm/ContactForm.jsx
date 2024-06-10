import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import { Link } from 'react-router-dom';
import { isValidEmail } from '../../utils/utils';
import { toast } from 'react-toastify';
import './ContactForm.scss';

// need background image for behind the form
// email sending can be very slow: add a: "Working on it..." toast and a "Message sent successfully"


const ContactForm = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    setIsLoading,
    minLoadingInterval,
    handleNavigateHome
  } = useContext(AppContext);
  
  const [ firstName, setFirstName ] = useState('');
  const [ firstNameIsInvalid, setFirstNameIsInvalid ] = useState(false);
  const [ shouldCheckFirstName, setShouldCheckFirstName ] = useState(false);
  
  const [ lastName, setLastName ] = useState('');
  const [ lastNameIsInvalid, setLastNameIsInvalid ] = useState(false);
  
  const [ email, setEmail ] = useState('');
  const [ emailIsInvalid, setEmailIsInvalid ] = useState(false);
  
  const [ subject, setSubject ] = useState('');
  const [ subjectIsInvalid, setSubjectIsInvalid ] = useState(false);
  
  const [ message, setMessage ] = useState('');
  const [ messageIsInvalid, setMessageIsInvalid ] = useState(false);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value); 

    if(shouldCheckFirstName) {
      setFirstNameIsInvalid(firstName.length >= 2);
    }
  };

  const handleShouldCheckFirstName = () => {
    setFirstNameIsInvalid(firstName.length < 2)
    setShouldCheckFirstName(true);
  }
  
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handleShouldCheckLastName = () => {
    setLastNameIsInvalid(lastName.length < 2)
  }
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleShouldCheckEmail = () => {
    setEmailIsInvalid(!isValidEmail(email));
  }
  
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleShouldCheckSubject = () => {
    setSubjectIsInvalid(subject.length <= 10)
  }
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleShouldCheckMessage = () => {
    setMessageIsInvalid(message.length <= 25);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(firstName.length < 2) {
      toast.error("Invalid First Name");
      return setFirstNameIsInvalid(true);
    } else {
      setFirstNameIsInvalid(false);
    }

    if(lastName.length < 2) {
      toast.error("Invalid Last Name");
      return setLastNameIsInvalid(true);
    } else {
      setLastNameIsInvalid(false);
    }

    if(isValidEmail(email)) {
      setEmailIsInvalid(false);
    } else {
      toast.error("Invalid Email");
      return setEmailIsInvalid(true);
    }

    if(subject.length <= 10) {
      toast.error("Invalid Subject");
      return setSubjectIsInvalid(true);
    } else {
      setSubjectIsInvalid(false);
    }

    if(message.length < 25) {
      toast.error("Invalid Message");
      return setMessageIsInvalid(true);
    } else {
      setMessageIsInvalid(false);
    }
    
    const formData = {
      firstName,
      lastName,
      email,
      subject,
      message
    };
  
    try {
      setIsLoading(true)
      const response = await fetch(`${BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
  
      if(!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const responseData = await response.json(); 
  
      toast.success(`${responseData.message} Redirecting...`);
      handleNavigateHome(true, false, null);
      
    } catch(error) {
      toast.error(error.message);
      console.error('Error sending message:', error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="contactForm">
        <div className="contactForm__modal">
          <h1 className="contactForm__title">
            Contact Amitha
          </h1>
          <form 
            className="contactForm__form">
            <div className="contactForm__name-container">
              <div className="contactForm__firstName">
                <label 
                  htmlFor="firstName"
                  className='contactForm__label'
                >
                  First Name
                </label>
                <input 
                  type="text" 
                  className="contactForm__firstName-input" 
                  id='firstName'
                  value={firstName}
                  placeholder='First Name'
                  onChange={(e) => handleFirstNameChange(e)}
                  onBlur={handleShouldCheckFirstName}
                />
                <p 
                  className={`contactForm__firstName-error ${firstNameIsInvalid ? "error" : ""}`}
                >
                  First Name is invalid
                </p>
              </div>
              <div className="contactForm__lastName">
                <label 
                  htmlFor="lastName"
                  className='contactForm__label'
                >
                  Last Name
                </label>
                <input 
                  type="text" 
                  className="contactForm__firstName-input" 
                  id='lastName'
                  value={lastName}
                  placeholder='Last Name'
                  onChange={(e) => handleLastNameChange(e)}
                  onBlur={handleShouldCheckLastName}
                />
                <p 
                  className={`contactForm__lastName-error ${lastNameIsInvalid ? "error" : ""}`}
                >
                  Last Name is invalid
                </p>
              </div>

            </div>

            <div className="contactForm__email">
              <label 
                htmlFor="email"
                className='contactForm__label'
              >
                Email Address
              </label>
              <input 
                type="text" 
                className="contactForm__email-input" 
                id='email'
                value={email}
                placeholder='Email Address'
                onChange={(e) => handleEmailChange(e)}
                onBlur={handleShouldCheckEmail}
              />
              <p 
                className={`contactForm__email-error ${emailIsInvalid ? "error" : ""}`}
              >
                  Invalid Email
              </p>
            </div>

            <div className="contactForm__subject">
              <label 
                htmlFor="subject"
                className='contactForm__label'
              >
                Subject
              </label>
              <input 
                type="text" 
                className="contactForm__subject-input" 
                id='subject'
                value={subject}
                placeholder='Subject'
                onChange={(e) => handleSubjectChange(e)}
                onBlur={handleShouldCheckSubject}
              />
              <p 
                className={`contactForm__subject-error ${subjectIsInvalid ? "error" : ""}`}
              >
                  Subject must be at least 10 characters long
              </p>
            </div>

            <div className="contactForm__message">
              <label 
                htmlFor="message"
                className='contactForm__label'
              >
                Message
              </label>
              <textarea 
                type="text" 
                className="contactForm__message-input" 
                id='message'
                value={message}
                placeholder='Message'
                onChange={(e) => handleMessageChange(e)}
                onBlur={handleShouldCheckMessage}
              ></textarea>
              <p 
                className={`contactForm__message-error ${messageIsInvalid 
                  ? "error" 
                  : ""}`}
                >
                  Message must be at least 25 characters long
              </p>
            </div>
            <div className="contactForm__button-container">
              
              <Link to={'/'}>
                <button 
                  type="button" className="contactForm__button contactForm__button--cancel"
                >
                    Cancel
                </button>
              </Link>
              <button 
                type="submit" 
                className="contactForm__button contactForm__button--send"
                onClick={handleSubmit}
              >
                  Send
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )};

export default ContactForm;