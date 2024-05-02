import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import { toast } from 'react-toastify';
import { scrollToTop } from '../../utils/utils.js';
import Shoot from '../Shoot/Shoot.jsx';
// import PlaceholderShoot from '../PlaceholderShoot/PlaceholderShoot.jsx';
import './Shoots.scss';

const Shoots = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { shoot_id } = useParams();
  
  const { 
    isLoggedIn,
    setIsLoggedIn,
    scrollYPos, 
    setPrevScrollYPos,
    setSelectedShoot,
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
  const [ isOrderEditable, setIsOrderEditable ] = useState(false);

  const [ activeDragShoot, setActiveDragShoot ] = useState(null);
  const [ dropTargetShoot, setDropTargetShoot ] = useState(null);

  const itemsPerPage = 6;
  const isLoadingInterval = 250;

  const handleNewShootId = (shootId) => {
    setShootsData([]);
    setCurrentPage(1);
    setCurrentShootId(shootId);
    setShouldUpdate(true);
  }

  const makeOrderEditable = () => {
    setIsOrderEditable(true);
    setActiveDragShoot(null);
    toast.success("Drag shoots into desired order then Save to update")
  }

  const saveNewOrder = () => {
    // add server call to update shoots order
    setIsOrderEditable(false);
    setActiveDragShoot(null);
  }

  const handleShootDragStart = (e, shoot_id) => {
    const draggedShoot = shootsData.find(shoot => shoot.shoot_id === shoot_id);
    setActiveDragShoot(draggedShoot);
  }

  const handleDropShootTarget = (shoot_id) => {
    const droppedOntoShoot = shootsData.find(shoot => shoot.shoot_id === shoot_id);
    setDropTargetShoot(droppedOntoShoot);

    const droppedOntoShootID = shoot_id;
    const droppedOntoShootOldDisplayOrder = droppedOntoShoot.display_order;

    const activeDraggedShootID = activeDragShoot.shoot_id;
    const activeDraggedShootOldDisplayOrder = activeDragShoot.display_order;

    const highestDisplayOrder = shootsData.reduce((maxDisplayOrder, shoot) => {
      return Math.max(maxDisplayOrder, shoot.display_order);
  }, 0);

  console.log(activeDraggedShootOldDisplayOrder)
  console.log(droppedOntoShootOldDisplayOrder)
  console.log(highestDisplayOrder)
  

  const newShootsData = [...shootsData];

  for(const shoot of newShootsData) {

    if(activeDraggedShootOldDisplayOrder > droppedOntoShootOldDisplayOrder) {
      
      if(shoot.shoot_id === droppedOntoShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder + 1;
      } else if(shoot.shoot_id === activeDraggedShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder;
      } else if(shoot.display_order > droppedOntoShootOldDisplayOrder && shoot.display_order <= activeDraggedShootOldDisplayOrder) {
        shoot.display_order++
      }
      
    } else if(droppedOntoShootOldDisplayOrder > activeDraggedShootOldDisplayOrder && droppedOntoShootOldDisplayOrder !== highestDisplayOrder) {

      console.log("lower to higher")

      if(shoot.shoot_id === droppedOntoShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder - 1;
      } else if(shoot.shoot_id === activeDraggedShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder;
      } 

      console.log("lower onto higher")

    } else if(droppedOntoShootOldDisplayOrder === highestDisplayOrder) {

      if(shoot.shoot_id === droppedOntoShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder - 1;
      } else if(shoot.shoot_id === activeDraggedShootID) {
        shoot.display_order = droppedOntoShootOldDisplayOrder;
      } else if(shoot.display_order > droppedOntoShootOldDisplayOrder && shoot.display_order <= activeDraggedShootOldDisplayOrder) {
        shoot.display_order--;
      }
    }

  }


    console.log(newShootsData)
    
    newShootsData.sort((a, b) => a.display_order - b.display_order);

    setShootsData(newShootsData)
    setActiveDragShoot(null);
    setDropTargetShoot(null);
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
      {/* <div className="placeholderShoots">
        <div className="placeholderShoots__inner">

          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <PlaceholderShoot 
              key={index} 
              placeholderClass={`placeholderShoot ${(isLoadingInitial && shouldUpdate) ? "show" : ""}`}
            />
          ))}

        </div>
      </div> */}
      
      <div className="shoots">
        <div className={`shoots__inner ${isOnShootDetails ? "onShootDetails" : ""}`}>
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
                isOnShootDetails={isOnShootDetails}
                handleNewShootId={handleNewShootId}
                isOrderEditable={isOrderEditable}
                setIsOrderEditable={setIsOrderEditable}
                handleShootDragStart={handleShootDragStart}
                handleDropShootTarget={handleDropShootTarget}
              />
            </Link>
          ))}
        </div>

        {!isOnShootDetails && isLoggedIn && !isOrderEditable ?

            <div className="shoots__button-container">
              <button
                className="shoots__editShootOrder"
                onClick={makeOrderEditable}
              >
                Edit Order
              </button>
            </div>

          : !isOnShootDetails && isLoggedIn && isOrderEditable ? 

            <div className="shoots__button-container">
              <button
                className="shoots__editShootOrder"
                onClick={saveNewOrder}
              >
                Save Order
              </button>
            </div>

          : null
        }

      </div>
    </>
  )};

export default Shoots;
