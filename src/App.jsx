import { useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import { scrollToTop } from './utils/utils.js';
import { useAppContext } from './AppContext.jsx'; 
import { Zoom } from "yet-another-react-lightbox/plugins"; 
import Lightbox from "yet-another-react-lightbox";
import AddIcon from './assets/icons/AddIcon.jsx';
import AddOrEditShoot from './pages/AddOrEditShoot/AddOrEditShoot.jsx';
import Bio from './pages/Bio/Bio.jsx';
import Contact from './pages/Contact/Contact.jsx';
import EditBio from './pages/EditBio/EditBio.jsx';
import Footer from './components/Footer/Footer.jsx';
import DeleteOrEditModal from './components/DeleteOrEditModal/DeleteOrEditModal.jsx';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Nav from './components/Nav/Nav.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import PhotogModelTagModal from './components/PhotogModelTagModal/PhotogModelTagModal.jsx';
import ShootDetails from './pages/ShootDetails/ShootDetails.jsx';
import SideNav from './components/SideNav/SideNav.jsx';
import UpIcon from './assets/icons/UpIcon.jsx';
import './App.scss';
import 'react-toastify/dist/ReactToastify.css';
import "yet-another-react-lightbox/styles.css";


const App = () => {
  const navigate = useNavigate();
  
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    colorMode, 
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    setPrevScrollYPos,
    showPhotogModelTagModal, 
    showDeleteOrEditModal, 
    isLoading, 
    showFloatingButton, 
    setSelectedTag, 
    selectedTag, 
    setSelectValue,
    handleNavigateHome,
    lightboxOpen, 
    setLightboxOpen,
    lightboxIndex, 
    setLightboxIndex,
    slides
  } = useAppContext();

  const handleHideSideNav = () => {
    requestAnimationFrame(() => {
      setShowSideNav(false) 
    });
  };

  const handleLogOut = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); 
    localStorage.removeItem('refreshToken'); 
    handleNavigateHome();
    toast.success("Successfully logged out!");
  }, []);

  const handleNavigateToAddShoot = useCallback(() => {
    setSelectedTag(null);
    setSelectValue(null);
    navigate('/shoots/add');
  }, [navigate]);

  // handle scroll position for show hide of menu
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
          <div 
            className={`loading ${isLoading 
              ? "isLoading" 
              : ""}`}
          >
          </div>
          <div 
            className={showSideNav 
              ? "touchOffDiv" 
              : ""}
            onClick={showSideNav 
              ? handleHideSideNav
              : null}
          >  
          </div>

          <div 
            className={`floatingButton ${isLoggedIn && showFloatingButton
              ? "toTop" 
              : !showFloatingButton
              ? "hide"
              : "add_Shoot"}`}
              onClick={isLoggedIn 
                ? handleNavigateToAddShoot
                : scrollToTop}
          >
            {isLoggedIn 
              ? <AddIcon
                  className={"floatingButton__add"}
                  classNameStroke={"floatingButton__add-stroke"}
                />
              
              : <UpIcon 
                  className={"floatingButton__up"}
                  classNameStroke={"floatingButton__up-stroke"}
                />
            }
          </div>

        <Nav handleLogOut={handleLogOut}/>
        <SideNav handleLogOut={handleLogOut}/>

        <Routes>
          <Route path="/" element={<Navigate to="/work" />} />
          <Route path="/work" element={<Home />} />
          {selectedTag 
            ? <Route path={`/work?tag=${selectedTag.tag_name}`} element={<Home />} />
            : null
          }
          <Route path="/bio" element={<Bio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shoot/:shoot_id" element={<ShootDetails />} />
          <Route path="/login" element={<Login />} />
          
          {isLoggedIn ?
            <Route path="/bio/edit" element={<EditBio />} />
          
            : null
          }

          {isLoggedIn 
            ? <Route 
                path="/shoots/add" 
                element={<AddOrEditShoot shootAction={"add"}/>} 
              />
            : null
          }
          {isLoggedIn 
            ? <Route 
                path="/shoots/edit/:shoot_id" 
                element={<AddOrEditShoot shootAction={"edit"}/>} 
              />
            : null
          }
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />

        <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            index={lightboxIndex}
            slides={slides}
            plugins={[, Zoom]}
            carousel={{ finite: slides.length === 1 }} 
            className={`yarl-lightbox ${slides.length === 1 ? "hide-arrows" : ""}`}
            on={{click: ({ index }) => setLightboxIndex(index)}}
            zoom={{ enabled: slides.length > 0 }}
        />

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
          theme="light"
        />
      </div>

      {isLoggedIn && showPhotogModelTagModal.modalType
        ? <PhotogModelTagModal />
        : null
      }

      {isLoggedIn && showDeleteOrEditModal 
        ? <DeleteOrEditModal />
        : null
      }
      
      </div>
    </>
  )};

export default App;