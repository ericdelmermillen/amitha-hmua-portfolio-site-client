import AppContext from '../../AppContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../utils/utils';
import ColorModeToggle from '../ColorModeToggle/ColorModeToggle';
import './SideNav.scss';

const SideNav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav
   } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  const timeOutValue = 300;

  const handleNavLinkHome = () => {
    if(location.pathname === "/" || location.pathname === "/home") {
      setShowSideNav(false);
      scrollToTop();
    }
     else {
      setShowSideNav(false);
      setTimeout(() => {
        navigate('/')
      }, timeOutValue)
    }
  };
  
  const handleNavLinkBio = () => {
    if(location.pathname === "/bio") {
      setShowSideNav(false);
    } else {
      setShowSideNav(false);
      setTimeout(() => {
        navigate('/bio')
      }, timeOutValue)
    }
  };
  
  const handleNavLinkContact = () => { 
    if(location.pathname === "/contact") {
      setShowSideNav(false);
    } else {
      setShowSideNav(false);
      setTimeout(() => {
        navigate('/contact')
      }, timeOutValue)
    }
  };
  
  const handleSideNavLogout = () => {
    setTimeout(() => {
      handleLogOut();
    }, 500);
    setShowSideNav(false);
  };

  return (
    <>
      <div 
        className={`sideNav ${showSideNav 
          ? "show" 
          : ""}`}
      >
        <div 
          className="sideNav__inner"
        >
          <div 
            className="sideNav__close-button"
            onClick={() => setShowSideNav(false)}
          >
            <div className="sideNav__close-icon"></div>
            <div className="sideNav__close-icon"></div>
          </div>
          
          <div className="sideNav__menu">
            <ul className='sideNav__links'>
              <li 
                className='sideNav__link'
                onClick={handleNavLinkHome}
              >
                Work
              </li>
              <li 
                className='sideNav__link'
                onClick={handleNavLinkBio}
              >
                Bio
              </li>
              <li 
                className='sideNav__link'
                onClick={handleNavLinkContact}
              >
                Contact
              </li>
              <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
                <li 
                  className='sideNav__link'
                  onClick={() => setShowSideNav(false)}
                  >
                    Instagram
                </li>
              </a>
              {isLoggedIn &&
                <li className="sideNav__link">
                  <h4 
                    className='sideNav__logout'
                    onClick={handleSideNavLogout}
                  >
                    Logout
                  </h4>
                </li>
              }
              <li className="sideNav__colorModeToggler">
                <ColorModeToggle 
                  inputId={"sideNavColorModeToggle"}
                />
              </li>
            </ul>

          </div>

        </div>
      </div>
    </>
  )};

export default SideNav;