import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { scrollToTop } from '../../utils/utils';
import AppContext from '../../AppContext';
import ColorModeToggle from '../ColorModeToggle/ColorModeToggle';
import Logo from '../../assets/icons/Logo';
import Instagram from '../../assets/icons/Instagram';
import NavSelect from '../NavSelect/NavSelect.jsx'
import './Nav.scss';

const Nav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    prevScrollYPos, 
    setShowFloatingButton,
    tags, 
    handleNavigateHome,
    handleNavLinkClick
   } = useContext(AppContext);

   const handleHomeClick = () => {
    handleNavigateHome(true);
    handleNavClick();
   };

   const handleNavClick = () => {
    scrollToTop()
    setShowFloatingButton(true)
    handleNavLinkClick()
   };
  
  return (
    <>
      <nav className={`nav ${prevScrollYPos < scrollYPos ? "hide": ""}`}>
        <div className="nav__inner">
          <Link 
            to={'/work'}
            onClick={handleHomeClick}
          >
            <div 
              className="nav__logo"
              alt="navbar logo" 
            >
              <Logo className={"nav__logo--icon"}/>
            </div> 
          </Link>
          <ul className="nav__links">
            <li className="nav__link nav__link--work">
              <NavSelect selectOptions={tags} />
            </li>
            <Link 
              to={'/bio'}
              onClick={handleNavClick}
            >
              <li className="nav__link nav__link--bio">
                BIO
              </li>
            </Link>
            <Link 
              to={'/contact'}
              onClick={handleNavClick}
            >
              <li className="nav__link">
                CONTACT
              </li>
            </Link>
            <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
              <li className="nav__link nav__link--instagram">
                <Instagram className="nav__link--instagram" />
              </li>
            </a>
            <li className="nav__link nav__link--colorMode">
              <ColorModeToggle inputId={"navColorModeToggle"}/>
            </li>
          </ul>

          {isLoggedIn 

            ? <h4 
                className="nav__logout"
                onClick={handleLogOut}
              >
                Logout
              </h4>

            : null
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