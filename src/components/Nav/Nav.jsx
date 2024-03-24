import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../AppContext';
import './Nav.scss';

const Nav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav
   } = useContext(AppContext);

  
  return (
    <>
      <nav className="nav">
        <div className="nav__inner">

          <Link to={'/home'}>
            <h1 className="nav__logo">Logo</h1>
          </Link>
          <ul className="nav__links">
            <Link to={'/home'}>
              <li className="nav__link">Work</li>
            </Link>
            <Link to={'/bio'}>
              <li className="nav__link">Bio</li>
            </Link>
            <Link to={'/contact'}>
              <li className="nav__link">Contact</li>
            </Link>
            <a href="https://www.instagram.com/amitha_hmua/" target="_blank">
              <li className="nav__link">Instagram</li>
            </a>
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