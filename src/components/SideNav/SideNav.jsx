import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../AppContext';
import './SideNav.scss';

const SideNav = ({ handleLogOut, handleScrollToTopOnNavLink }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav
   } = useContext(AppContext);

   const handleNavLinkClick = () => {
    setShowSideNav(false);
  }
  
  const handleSideNavLogout = () => {
    setTimeout(() => {
      handleLogOut();
    }, 500)
    handleNavLinkClick();
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
            // onClick={() => console.log("click")}
          >
            <div className="sideNav__close-icon"></div>
            <div className="sideNav__close-icon"></div>
          </div>
          
          <div className="sideNav__menu">
            <ul className='sideNav__links'>
              <Link to={'/'}
                onClick={handleNavLinkClick}
              >
                <li className='sideNav__link'>Work</li>
              </Link>
              <Link to={'/bio'}
                onClick={handleNavLinkClick}
              >
                <li className='sideNav__link'>Bio</li>
              </Link>
              <Link to={'/contact'}
                onClick={handleNavLinkClick}
              >
                <li className='sideNav__link'>Contact</li>
              </Link>
              <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
                <li 
                  className='sideNav__link'
                  onClick={handleNavLinkClick}
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