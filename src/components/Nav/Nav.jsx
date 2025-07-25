import { Link } from 'react-router-dom';
import { useAppContext } from '../../AppContext';
import ColorModeToggle from '../ColorModeToggle/ColorModeToggle';
import Instagram from '../../assets/icons/Instagram';
import Logo from '../../assets/icons/Logo';
import NavSelect from '../NavSelect/NavSelect.jsx'
import './Nav.scss';

const Nav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    setShowSideNav,
    scrollYPos, 
    prevScrollYPos, 
    tags, 
    handleNavigateHome,
    handleSetShowSideNav,
    handleNavLinkClick
   } = useAppContext();

   const handleHomeClick = () => {
    handleNavigateHome();
    handleNavLinkClick()
  };
  
  
  return (
    <>
      <nav 
        id="nav"
        className={`nav ${prevScrollYPos < scrollYPos && scrollYPos > 50 
          ? "hide"
          : ""}`
      }>
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
              onClick={handleNavLinkClick}
            >
              <li className="nav__link nav__link--bio">
                Bio
              </li>
            </Link>
            <Link 
              to={'/contact'}
              onClick={handleNavLinkClick}
            >
              <li className="nav__link">
                Contact
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
            onClick={handleSetShowSideNav}
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