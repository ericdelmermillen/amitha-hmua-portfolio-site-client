import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';
import ColorModeToggle from '../ColorModeToggle/ColorModeToggle';
// import logo from '../../assets/icons/logo.svg';
import logo from '../../assets/icons/logo_small-bottom.svg';
import NavLogo from '../NavLogo/NavLogo';
import './Nav.scss';

const Nav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos
   } = useContext(AppContext);
  
  return (
    <>
      <nav className={`nav ${prevScrollYPos < scrollYPos ? "hide": ""}`}>
        <div className="nav__inner">

          <Link 
            to={'/home'}
            onClick={() => scrollToTop()}
          >
            <img 
              src={logo} 
              className="nav__logo"
              alt="navbar logo" 
            />
            {/* <NavLogo color={'purple'}/> */}
          </Link>
          <ul className="nav__links">
            <Link 
              to={'/home'}
            >
              <li className="nav__link">WORK</li>
            </Link>
            <Link 
              to={'/bio'}
            >
              <li className="nav__link">BIO</li>
            </Link>
            <Link 
              to={'/contact'}
            >
              <li className="nav__link">CONTACT</li>
            </Link>
            <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
              <li className="nav__link">
                INSTAGRAM
              </li>
            </a>
            <li className="nav__link">
              {/* INSTAGRAM */}
              <ColorModeToggle />
            </li>
          </ul>


          {
          
          isLoggedIn && 
            
            <h4 
              className={`nav__logout ${isLoggedIn && "loggedIn"}`}
              onClick={handleLogOut}
              >
                Logout
            </h4>
            
          }
          
          <div 
            className="nav__toggle-button" 
            aria-label="Toggle Menu"
            onClick={() => setShowSideNav(!showSideNav)}
          >
            <div className="nav__toggle-icon"></div>
            <div className="nav__toggle-icon"></div>
            <div className="nav__toggle-icon"></div>
          </div>
        </div>
      </nav>
    </>
  )};

export default Nav;