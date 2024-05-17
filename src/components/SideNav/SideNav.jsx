import AppContext from '../../AppContext';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ColorModeToggle from '../ColorModeToggle/ColorModeToggle';
import NavSelect from '../NavSelect/NavSelect.jsx';
import './SideNav.scss';

const SideNav = ({ handleLogOut }) => {
  const { 
    isLoggedIn, 
    showSideNav, 
    setShowSideNav,
    minLoadingInterval,
    tags,
    handleNavLinkClick
   } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();
  
  const handleNavLinkBio = () => {
    handleNavLinkClick();

    if(location.pathname === "/bio") {
      setShowSideNav(false);
      toast.info("Already on Bio");
    } else {
      setShowSideNav(false);
      setTimeout(() => {
        navigate('/bio');
      }, minLoadingInterval);
    }
  };
  
  const handleNavLinkContact = () => { 
    handleNavLinkClick();
    
    if(location.pathname === "/contact") {
      setShowSideNav(false);
      toast.info("Already on Contact");
    } else {
      setShowSideNav(false);
      setTimeout(() => {
        navigate('/contact');
      }, minLoadingInterval);
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
        <div className="sideNav__inner">
          <div 
            className="sideNav__close-button"
            onClick={() => setShowSideNav(false)}
          >
            <div className="sideNav__close-icon"></div>
            <div className="sideNav__close-icon"></div>
          </div>
          
          <div className="sideNav__menu">
            <ul className='sideNav__links'>
              <li className='sideNav__link'>
                <NavSelect selectOptions={tags} />
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
                <ColorModeToggle inputId={"sideNavColorModeToggle"} />
              </li>
            </ul>

          </div>

        </div>
      </div>
    </>
  )};

export default SideNav;