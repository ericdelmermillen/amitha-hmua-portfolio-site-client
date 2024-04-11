import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AppContext from './AppContext'; 
import { useEffect, useContext } from 'react';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Bio from './pages/Bio/Bio';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import Nav from './components/Nav/Nav';
import Footer from './components/Footer/Footer';
import SideNav from './components/SideNav/SideNav';
import ShootDetails from './pages/ShootDetails/ShootDetails';
import AddShoot from './pages/AddShoot/AddShoot';
import UpIcon from './assets/icons/UpIcon';
import AddIcon from './assets/icons/AddIcon';
import { scrollToTop } from './utils/utils';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import AddPhotographerModal from './components/AddPhotographerModal/AddPhotographerModal';
import DeleteShootModal from './components/DeleteShootModal/DeleteShootModal';

const App = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    selectedShoot, 
    setSelectedShoot,
    showDeleteModal, 
    setShowDeleteModal,
    showAddPhotographerModal, 
    setShowAddPhotographerModal,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);
  
  const handleLogOut = () => {
    setIsLoading(true)
    setIsLoggedIn(false)
    localStorage.removeItem('token'); 
    setTimeout(() => {
      setIsLoading(false);
    }, 250)
    navigate('/home')
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
          {isLoggedIn && <Route path="/shoots/add" element={<AddShoot />} />}
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

      {isLoggedIn && showDeleteModal
      
        ? <DeleteShootModal 
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          />
        : null
      }
      </div>
    </>
  )};

export default App;
