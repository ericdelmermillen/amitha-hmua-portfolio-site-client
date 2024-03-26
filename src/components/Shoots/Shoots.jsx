import { useState, useEffect, useContext } from 'react';
import './Shoots.scss';
import Shoot from '../Shoot/Shoot';
import AppContext from '../../AppContext';
import DeleteShootModal from '../DeleteShootModal/DeleteShootModal.jsx'

const Shoots = () => {
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

  const [ shootsData, setShootsData ] = useState([]);
  const [ showDeleteModal, setShowDeleteModal ] = useState(false)

  useEffect(() => {
    const fetchShoots = async () => {
      try {
        const response = await fetch(`${BASE_URL}/shoots/all`);

        if(response.ok) {
          const data = await response.json()
          setShootsData(data);
        } else {
          console.error('Failed to fetch shoots:', response.statusText);
        }
        
      } catch(error) {
        console.log(`Error fetching shoots: ${error}`)
      }
    }
    fetchShoots();
    console.log("shootsData fetched")
  }, []);

  
  useEffect(() => {
    const handleScrollY = () => {
      const newScrollYPos = window.scrollY;

      if(scrollYPos !== undefined && setPrevScrollYPos !== undefined && newScrollYPos !== scrollYPos) {
        setShowDeleteModal(false);
        setSelectedShoot(null)
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
      <div className="shoots">
        <div className="shoots__inner">
        {shootsData.map(shoot => (
          <Shoot 
            key={shoot.shoot_id} 
            shoot_id={shoot.shoot_id}
            title={shoot.shoot_title}
            thumbnail_url={shoot.thumbnail_url}
            models={shoot.models}
            photographers={shoot.photographers}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
          /> 
          )
        )}
          
        </div>
      </div>
      {showDeleteModal && 
        
        <DeleteShootModal 
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          shootsData={shootsData}
          setShootsData={setShootsData}
          />
      }
    </>
  )};

export default Shoots;