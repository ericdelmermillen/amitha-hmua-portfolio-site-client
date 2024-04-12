import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import { toast } from 'react-toastify';
import { scrollToTop } from '../../utils/utils.js';
import Shoot from '../Shoot/Shoot.jsx';
import PlaceholderShoot from '../PlaceholderShoot/PlaceholderShoot.jsx';
import './Shoots.scss';

const Shoots = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { shoot_id } = useParams();
  
  const { 
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    selectedShoot, 
    setSelectedShoot,
    showDeleteModal, 
    setShowDeleteModal,
    shouldUpdateShoots, 
    setShouldUpdateShoots,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  const location = useLocation();

  const [ shootsData, setShootsData ] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ shouldUpdate, setShouldUpdate ] = useState(true);
  const [ isLoadingInitial, setIsLoadingInitial ] = useState(true);
  const [ isOnShootDetails, setIsOnShootDetails ] = useState(location.pathname.includes('/shoot/'));
  const [ currentShootId, setCurrentShootId ] = useState(shoot_id);

  const itemsPerPage = 10;
  const isLoadingInterval = 250;

  const handleNewShootId = (shootId) => {
    setShootsData([]);
    setCurrentPage(1);
    setCurrentShootId(shootId);
    setShouldUpdate(true);
  }

  useEffect(() => {
    const fetchShoots = async () => {

      if(shouldUpdateShoots) {
        setShootsData([]);
        scrollToTop();
        setCurrentPage(1);
        setShouldUpdate(true);
        setShouldUpdateShoots(false);
        return;
      }

      if(shouldUpdate) {
        setIsLoading(true);
          
        try {

          const response = await fetch(`${BASE_URL}/shoots/all?page=${currentPage}&limit=${itemsPerPage}`);

          if(response.ok) {
            const data = await response.json();

            let filteredData = [...data];

            if(isOnShootDetails) {
              const currentShoot = shoot_id;
              filteredData = data.filter(shoot => shoot.shoot_id !== +currentShoot);
            }            
            
            setShootsData([...shootsData, ...filteredData]);

            setTimeout(() => {
              setIsLoading(false); 
            }, isLoadingInterval);
            
            if(isLoadingInitial) {
              setTimeout(() => {
                setIsLoadingInitial(false);
              }, isLoadingInterval);
            }

            if(data.length === 0) {
              setTimeout(() => {
                setShouldUpdate(false);
                setIsLoading(false)
              }, isLoadingInterval);
            }
          }
        } catch(error) {
          console.log(`Error fetching shoots: ${error}`)
          toast.error(`Failed to fetch shoots:, ${error}`);
          setTimeout(() => {
            setIsLoading(false);
          }, isLoadingInterval);
        }
      }
    }
    fetchShoots();
  }, [currentPage, currentShootId, shouldUpdateShoots]);
  
  useEffect(() => {
    if(shouldUpdate) {

      const handleScrollY = () => {
        const newScrollYPos = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        
        if(scrollYPos !== undefined && setPrevScrollYPos !== undefined && newScrollYPos !== scrollYPos) {
          // setShowDeleteModal(false);
          setSelectedShoot(null);
        } else if (newScrollYPos + windowHeight >= documentHeight - 100) {
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

          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <PlaceholderShoot 
              key={index} 
              placeholderClass={`placeholderShoot ${(isLoadingInitial && shouldUpdate) ? "show" : ""}`}
            />
          ))}

        </div>
      </div>
      
      <div className="shoots">
        <div className={`shoots__inner ${isOnShootDetails && "onShootDetails"}`}>
          {shootsData.map(shoot => (
            <Link 
              to={`/shoot/${shoot.shoot_id}`} 
              key={shoot.shoot_id}
            >
              <Shoot
                key={shoot.shoot_id}
                shoot_id={shoot.shoot_id}
                thumbnail_url={shoot.thumbnail_url}
                models={shoot.models}
                photographers={shoot.photographers}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
                isOnShootDetails={isOnShootDetails}
                handleNewShootId={handleNewShootId}
              />
            </Link>
          ))}
        </div>
      </div>
    </>
  )};

export default Shoots;
