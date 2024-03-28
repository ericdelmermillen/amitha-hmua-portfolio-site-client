import { Routes, Route } from 'react-router-dom';
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
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const App = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  const { 
    isLoggedIn, 
    setIsLoggedIn,
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
    setIsLoggedIn(false);
    localStorage.removeItem('token'); 
    toast.success("Successfully logged out!");
  };

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
          console.log(`Delete Shoot ${selectedShoot}`);
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

      <div className="app">
        <h3 className={`loading ${isLoading && "isLoading"}`}></h3>
          <div 
            className={showSideNav ? "touchOffDiv" : ""}
            onClick={showSideNav ? () => setShowSideNav(false) : null}
          >  
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ToastContainer
          position="top-right"
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
