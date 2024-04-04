import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppContext from '../../AppContext';
import './SideNav.scss';
import { scrollToTop } from '../../utils/utils';

const SideNav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav
   } = useContext(AppContext);

   const location = useLocation();

   const handleNavLinkHome = () => {
    if(location.pathname === "/" || location.pathname === "/home") {
      setShowSideNav(false);
      scrollToTop();
    }
  }
  
  const handleNavLinkBio = () => {
    if(location.pathname === "/bio") {
      setShowSideNav(false);
    }
  }
  
  const handleNavLinkContact = () => {
    if(location.pathname === "/contact") {
      setShowSideNav(false);
    }
  }
  
  const handleSideNavLogout = () => {
    setTimeout(() => {
      handleLogOut();
    }, 500)
    setShowSideNav(false)
  }

  return (
    <>
      <div className={`sideNav ${showSideNav ? "show" : ""}`}>
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
              <Link to={'/'}
                onClick={handleNavLinkHome}
              >
                <li className='sideNav__link'>Work</li>
              </Link>
              <Link to={'/bio'}
                onClick={handleNavLinkBio}
              >
                <li className='sideNav__link'>Bio</li>
              </Link>
              <Link to={'/contact'}
                onClick={handleNavLinkContact}
              >
                <li className='sideNav__link'>Contact</li>
              </Link>
              <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
                <li 
                  className='sideNav__link'
                  onClick={() => setShowSideNav(false)}
                  >
                    Instagram
                </li>
              </a>
              {isLoggedIn &&
              <h4 
              className='sideNav__logout'
              onClick={handleSideNavLogout}
              >
                  Logout
              </h4>
            }
            </ul>

          </div>

        </div>
      </div>
    </>
  )};

export default SideNav;