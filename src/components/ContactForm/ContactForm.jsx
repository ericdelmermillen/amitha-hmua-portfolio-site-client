import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ContactForm.scss';

const ContactForm = () => {
  const [ firstName, setFirstName ] = useState('');
  const [ firstNameIsInvalid, setFirstNameIsInvalid ] = useState(false);
  
  const [ lastName, setLastName ] = useState('');
  const [ lastNameIsInvalid, setLastNameIsInvalid ] = useState(false);
  
  const [ email, setEmail ] = useState('');
  const [ emailIsInvalid, setEmailIsInvalid ] = useState(false);
  
  const [ subject, setSubject ] = useState('');
  const [ subjectIsInvalid, setSubjectIsInvalid ] = useState(!false);
  
  const [ message, setMessage ] = useState('');
  const [ messageIsInvalid, setMessageIsInvalid ] = useState(!false);

  const navigate = useNavigate(); 

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    // console.log(firstName)
  };
  
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    // console.log(lastName)
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(email)
  };
  
  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    console.log(subject)
  };
  
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  }


  return (
    <>
      <div className="contactForm">
        <div className="contactForm__modal">
          <h1 className="contactForm__title">
            Contact Amitha
          </h1>
          {/* <h2 className="contactForm__instructions">
            Please complete the form below
          </h2> */}
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
                />
                <p 
                  className={`contactForm__firstName-error ${firstNameIsInvalid ? "error" : ""}`}>
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
                />
                <p 
                  className={`contactForm__lastName-error ${lastNameIsInvalid ? "error" : ""}`}>
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
              />
              <p 
                className={`contactForm__email-error ${emailIsInvalid ? "error" : ""}`}>
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
              />
              <p 
                className={`contactForm__subject-error ${subjectIsInvalid ? "error" : ""}`}>
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
              ></textarea>
              <p 
                className={`contactForm__message-error ${messageIsInvalid ? "error" : ""}`}>
                  Message must be at least 25 characters long
              </p>
            </div>
            <div className="contactForm__button-container">
              <button 
                type="submit" className="contactForm__button contactForm__button--send">
                  Send
              </button>
              <Link to={'/'}>
                <button 
                  type="button" className="contactForm__button contactForm__button--cancel">
                    Cancel
                </button>
              </Link>
            </div>



            


          </form>
        </div>
      </div>
    </>
  )};

export default ContactForm;