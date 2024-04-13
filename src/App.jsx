import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useContext } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { scrollToTop } from './utils/utils.js';
import AppContext from './AppContext.jsx'; 
import Home from './pages/Home/Home.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import Bio from './pages/Bio/Bio.jsx';
import Contact from './pages/Contact/Contact.jsx';
import Login from './pages/Login/Login.jsx';
import Nav from './components/Nav/Nav.jsx';
import Footer from './components/Footer/Footer.jsx';
import SideNav from './components/SideNav/SideNav.jsx';
import ShootDetails from './pages/ShootDetails/ShootDetails.jsx';
import AddShoot from './pages/AddShoot/AddShoot.jsx';
import UpIcon from './assets/icons/UpIcon.jsx';
import AddIcon from './assets/icons/AddIcon.jsx';
// make AddPhotogOrModelModal
import AddPhotographerModal from './components/AddPhotographerModal/AddPhotographerModal.jsx';
// 
import DeleteShootModal from './components/DeleteShootModal/DeleteShootModal.jsx';
import './App.scss';
import DeletePhotogOrModelModal from './components/DeletePhotogOrModelModal/DeletePhotogOrModelModal.jsx';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    colorMode, 
    setColorMode,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    
    // modals start
    showAddPhotographerModal, 
    setShowAddPhotographerModal,
    showDeleteShootModal, 
    setShowDeleteShootModal,
    
    // delete photog or model modal and state
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    
    showDeletePhotogOrModelModal, 
    setShowDeletePhotogOrModelModal,
    // modals end
    isLoading, 
    setIsLoading
  } = useContext(AppContext);
  
  const handleLogOut = () => {
    setIsLoading(true);
    setIsLoggedIn(false);
    localStorage.removeItem('token'); 
    setTimeout(() => {
      setIsLoading(false);
    }, 250)
    navigate('/home');
    toast.success("Successfully logged out!");
  };

  const handleNavigateToAddShoot = () => {
    navigate('/shoots/add');
    setIsLoading(true);

    if(location.pathname === '/shoots/add') {
      setTimeout(() => {
        setIsLoading(false);
      }, 250)
    }
  }

  useEffect(() => {
    const handleScrollY = () => {
      const newScrollYPos = window.scrollY;

      if(scrollYPos !== undefined && setPrevScrollYPos !== undefined && newScrollYPos !== scrollYPos) {
        setPrevScrollYPos(scrollYPos);
        setScrollYPos(newScrollYPos);
      }
    };

    handleScrollY();

    window.addEventListener("scroll", handleScrollY);

    return () => {
      window.removeEventListener("scroll", handleScrollY);
    };
  }, [scrollYPos]);

  return (
    <>
      <div className="app" data-color-mode={colorMode}>
        <div className="app__inner">
          <h3 
            className={`loading ${isLoading && "isLoading"}`}>  
          </h3>
          <div 
            className={showSideNav ? "touchOffDiv" : ""}
            onClick={showSideNav 
              ? () => setShowSideNav(false) 
              : null}
          >  
          </div>

            <div 
              className={`floatingButton ${isLoggedIn 
                ? "toTop" : "add_Shoot"}`}
                onClick={isLoggedIn 
                  ? handleNavigateToAddShoot
                  : scrollToTop }
            >
              {isLoggedIn 
                ? <AddIcon
                    className={"floatingButton__add"}
                    classNameStroke={"floatingButton__add-stroke"}
                  />
                
                :  <UpIcon 
                    className={"floatingButton__up"}
                    classNameStroke={"floatingButton__up-stroke"}
                  />
              }
            </div>

        <Nav handleLogOut={handleLogOut}/>
        <SideNav handleLogOut={handleLogOut}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shoot/:shoot_id" element={<ShootDetails />} />
          <Route path="/login" element={<Login />} />
          {isLoggedIn 
            ? <Route path="/shoots/add" element={<AddShoot />} />
            : null
          }
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />

        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="light"/>
      </div>

      {showAddPhotographerModal 

        ? <AddPhotographerModal />
        : null
      }

      {isLoggedIn && showDeleteShootModal
      
        ? <DeleteShootModal />
        : null
      }

      {isLoggedIn && showDeletePhotogOrModelModal
      
        ? <DeletePhotogOrModelModal />
        : null
      }
      </div>
    </>
  )};

export default App;
