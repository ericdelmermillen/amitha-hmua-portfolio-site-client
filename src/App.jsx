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
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './App.scss';

const App = () => {
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
  
  
  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); 
  };

  const handleScrollToTopOnNavLink = () => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0
    });
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
      <div className="app">
    
          <div 
            className={showSideNav 
              ? "touchOffDiv"
              : ""
            }
            onClick={showSideNav 
              ? () => setShowSideNav(false)
              : null
            }
          ></div>


        <Nav 
          handleLogOut={handleLogOut}
          handleScrollToTopOnNavLink={handleScrollToTopOnNavLink}
          />
        {/* {isiPhone && <h1 className='isiPhone'>isiPhone</h1>} */}
        <SideNav handleLogOut={handleLogOut}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/bio" element={<Bio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact" element={<Contact />} />
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
