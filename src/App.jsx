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
import ColorModeToggle from './components/ColorModeToggle/ColorModeToggle';
import AddShoot from './pages/AddShoot/AddShoot';
import { ToastContainer, toast } from "react-toastify";
import up from '../src/assets/up.svg';
import add from '../src/assets/add.svg'
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';
import { scrollToTop } from './utils/utils';

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


  const handleDeleteShoot = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`${BASE_URL}/shoots/delete/${selectedShoot}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if(response.ok) {
          setShowDeleteModal(false);
          toast.success(`Shoot ${selectedShoot} successfully  deleted.`); 
          setSelectedShoot(null);
        } else {
          toast.error(`Failed to delete Shoot ${selectedShoot}`)
          console.error(`Failed to delete Shoot ${selectedShoot}: ${response.statusText}`);
          setShowDeleteModal(false);
          setSelectedShoot(null);
        }
      } catch (error) {
        console.error(`Error deleting Shoot ${selectedShoot}: ${error}`);
      }
    } else {
      console.log("Sorry please login again");
    }
  };
  
  return (
    <>
      <div className="app" data-color-mode={colorMode}>

        <div className={`colorModeToggle__container ${scrollYPos < 60 ? "show" : "hide"}`}>
          <ColorModeToggle />
        </div>
        <h3 className={`loading ${isLoading && "isLoading"}`}></h3>
          <div 
            className={showSideNav ? "touchOffDiv" : ""}
            onClick={showSideNav ? () => setShowSideNav(false) : null}
          >  
          </div>

            <div 
              className={`floating-button ${isLoggedIn 
                ? "toTop" : "add_Shoot"}`}
            >
              <img 
                src={isLoggedIn ? add : up}
                onClick={isLoggedIn 
                  ? handleNavigateToAddShoot
                  : scrollToTop }
              />
            </div>

        <Nav 
          handleLogOut={handleLogOut}
        />
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
    </>
  )};

export default App;
