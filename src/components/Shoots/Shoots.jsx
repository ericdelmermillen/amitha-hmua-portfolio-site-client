import { useState, useEffect, useContext } from 'react';
import './Shoots.scss';
import Shoot from '../Shoot/Shoot.jsx';
import AppContext from '../../AppContext.jsx';
import DeleteShootModal from '../DeleteShootModal/DeleteShootModal.jsx'
import PlaceholderShoot from '../PlaceholderShoot/PlaceholderShoot.jsx';

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
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ shouldUpdate, setShouldUpdate ] = useState(true);
  const [ isLoadingInitial, setIsLoadingInitial ] = useState(true);

  const itemsPerPage = 6;
  const isLoadingInterval = 100;

  useEffect(() => {
    const fetchShoots = async () => {
      if(shouldUpdate) {

        setIsLoading(true);
          
        try {
          const response = await fetch(`${BASE_URL}/shoots/all?page=${currentPage}&limit=${itemsPerPage}`);

          if(response.ok) {
            const data = await response.json()
            setShootsData([...shootsData, ...data]);
            setTimeout(() => {
              setIsLoading(false); 
            }, isLoadingInterval);
            
            if(isLoadingInitial) {
              setTimeout(() => {
                setIsLoadingInitial(false)
              }, isLoadingInterval)
            }

            if(data.length === 0) {
              setTimeout(() => {
                setShouldUpdate(false)
              }, setIsLoading(false))
            }
          } else {
            console.error('Failed to fetch shoots:', response.statusText);
            toast.error(`Failed to fetch shoots:, ${response.statusText}`)
          }
          
        } catch(error) {
          console.log(`Error fetching shoots: ${error}`)
        }
      }
    }
    fetchShoots();
  }, [currentPage]);
  
  useEffect(() => {
    if(shouldUpdate) {

      const handleScrollY = () => {
        const newScrollYPos = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        if(scrollYPos !== undefined && setPrevScrollYPos !== undefined && newScrollYPos !== scrollYPos) {
          setShowDeleteModal(false);
          setSelectedShoot(null);
        } else if (newScrollYPos + windowHeight >= documentHeight - 200) {
          if(!isLoading) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        }
      };
      
      handleScrollY();
      
      window.addEventListener('scroll', handleScrollY);
      
      return () => {
        window.removeEventListener('scroll', handleScrollY);
      };
    } 
  }, [scrollYPos, isLoading]);

  return (
    <>
      <div className="placeholderShoots">
        <div className="placeholderShoots__inner">

          {isLoadingInitial && shouldUpdate && Array.from({ length: itemsPerPage }).map((_, index) => (
            <PlaceholderShoot key={index} />
          ))}

        </div>
      </div>
      
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
          
          {!isLoadingInitial && isLoading && shouldUpdate && Array.from({ length: itemsPerPage }).map((_, index) => (
            <PlaceholderShoot key={index} />
          ))}
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
