import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import { toast } from 'react-toastify';
import { checkTokenExpiration } from '../../utils/utils.js';
import Shoot from '../Shoot/Shoot.jsx';
import './Shoots.scss';

const Shoots = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { shoot_id } = useParams();
  
  const { 
    isLoggedIn,
    setIsLoggedIn,
    scrollYPos, 
    prevScrollYPos,
    setIsLoading,
    minLoadingInterval, 
    selectedTag, 
    prevURL, 
    showDeleteOrEditModal,
    setShowDeleteOrEditModal,
    setShootDetails,
    isInitialShootsLoad,
    setIsInitialShootsLoad
  } = useContext(AppContext);

  const [ shouldUpdateAllShoots, setShouldUpdateAllShoots ] = useState(false);
  const [ shouldUpdateFilteredShoots, setShouldUpdateFilteredShoots ] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [ shootsData, setShootsData ] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ isOnShootDetails, setIsOnShootDetails ] = useState(location.pathname.includes('/shoot/'));
  const [ currentShootId, setCurrentShootId ] = useState(shoot_id);
  const [ isOrderEditable, setIsOrderEditable ] = useState(false);

  const [ activeDragShoot, setActiveDragShoot ] = useState(null); 

  // const itemsPerPage = 1;
  // const itemsPerPage = 2;
  // const itemsPerPage = 4;
  // const itemsPerPage = 6;
  // const itemsPerPage = 10;
  const itemsPerPage = 12;

  const [ finalPageLoaded, setFinalPageLoaded ] = useState(false);

  const handleOverScroll = () => {
    if(!finalPageLoaded) {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      const distanceToBottom = fullHeight - windowHeight - window.scrollY;
      
      if(distanceToBottom <= (itemsPerPage * 600)) {
        if(!selectedTag) {
          setShouldUpdateAllShoots(true);
        } else if(selectedTag) {
          setShouldUpdateFilteredShoots(true);
        }
      }
    }
  };
    
  const handleNewShootId = (shootId) => {
    setShootDetails(null);
    setCurrentShootId(shootId);
  };

  const makeOrderEditable = () => {
    setIsOrderEditable(true);
    setActiveDragShoot(null);
    toast.info("Drag shoots into desired order then Save to update");
  };

  const saveNewOrder = async () => {
    setIsOrderEditable(false);
    setIsLoading(true);

    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return;
    }
    
    if(isLoggedIn) {      
      toast.info("Updating database. One sec...");

      const new_shoot_order = [];
  
      for(const shoot of shootsData) {
        const updateObj = {};
        updateObj.shoot_id = shoot.shoot_id;
        updateObj.display_order = shoot.display_order;
        new_shoot_order.push(updateObj);
      }

      try {
        const response = await fetch(`${BASE_URL}/shoots/updateorder`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ new_shoot_order})
        });

        if(response.ok) {
          toast.success("Database updated.");
          setIsLoading(false);
        }
        
      } catch(error) {
        console.log(error);
        toast.error("Error updating database...");
        setIsLoading(false);
      }
    }

    setIsOrderEditable(false);
    setActiveDragShoot(null);
  };

  const handleShootDragStart = (shoot_id) => {
    const draggedShoot = shootsData.find(shoot => shoot.shoot_id === shoot_id);
    setActiveDragShoot(draggedShoot);
  };

  const handleDropShootTarget = (dropTargetShootId, dropTargetShootDisplayOrder) => {
    const activeDraggedShootId = activeDragShoot.shoot_id;
    const activeDraggedShootOldDisplayOrder = activeDragShoot.display_order;
  
    const highestDisplayOrder = shootsData.reduce((maxDisplayOrder, shoot) => {
      return Math.max(maxDisplayOrder, shoot.display_order);
    }, 0);
  
    const updatedShootsData = [...shootsData];
  
    for(const shoot of updatedShootsData) {
  
      if(dropTargetShootId !== activeDraggedShootId) {
  
        if(dropTargetShootDisplayOrder === highestDisplayOrder) {
  
          if(shoot.shoot_id === dropTargetShootId) {
            shoot.display_order = dropTargetShootDisplayOrder - 1;
          } else if(shoot.shoot_id === activeDraggedShootId) {
            shoot.display_order = dropTargetShootDisplayOrder;
          } else if(shoot.display_order < dropTargetShootDisplayOrder && shoot.display_order >= activeDraggedShootOldDisplayOrder) {
            shoot.display_order--;
          }
  
        } else if(activeDraggedShootOldDisplayOrder > dropTargetShootDisplayOrder) {
          
          if(shoot.shoot_id === dropTargetShootId) {
            shoot.display_order = dropTargetShootDisplayOrder + 1;
          } else if(shoot.shoot_id === activeDraggedShootId) {
            shoot.display_order = dropTargetShootDisplayOrder;
          } else if(shoot.display_order > dropTargetShootDisplayOrder && shoot.display_order <= activeDraggedShootOldDisplayOrder) {
            shoot.display_order++;
          }
          
        } else if(dropTargetShootDisplayOrder > activeDraggedShootOldDisplayOrder) { 
    
          if(shoot.shoot_id === dropTargetShootId) {
            shoot.display_order = dropTargetShootDisplayOrder - 1;
          } else if(shoot.shoot_id === activeDraggedShootId) {
            shoot.display_order = dropTargetShootDisplayOrder;
          } else if(shoot.display_order <= dropTargetShootDisplayOrder && shoot.display_order > activeDraggedShootOldDisplayOrder) {
            shoot.display_order--;
          }
        } 
      }
    }
    
    updatedShootsData.sort((a, b) => a.display_order - b.display_order);
  
    setShootsData(updatedShootsData);
    setActiveDragShoot(null);
  };

  // fetchAllShoots useEffect
  useEffect(() => {
    if((!finalPageLoaded && !selectedTag && !location.search.includes("tag"))) {
      setIsLoading(true);
      
      const fetchShoots = async () => {
      
        try {
          const response = await fetch(`${BASE_URL}/shoots/all?page=${currentPage}&limit=${itemsPerPage}`);

          if(response.ok) {
            const { shootSummaries, isFinalPage } = await response.json();
            setCurrentPage(currentPage + 1);
            
            const data = shootSummaries;
            
            let filteredData = [...data];
            
            if(isOnShootDetails) {
              const currentShoot = shoot_id;
              filteredData = data.filter(shoot => shoot.shoot_id !== +currentShoot);
            }    
            
            const updatedShootsData = [...shootsData, ...filteredData];

            // setTimeout(() => {
              setIsInitialShootsLoad(false);
            // }, minLoadingInterval);
            
            if(isFinalPage) {
              setTimeout(() => {
                setFinalPageLoaded(true);
              }, minLoadingInterval);
            } else {
              setShootsData(updatedShootsData);
            }
          }
        } catch(error) {
          console.log(`Error fetching shoots: ${error}`);
          toast.error(`Failed to fetch shoots: ${error}`);
        } finally {
          setTimeout(() => {
          setIsLoading(false); 
          setShouldUpdateAllShoots(false);
          }, minLoadingInterval);
        }
      }
      fetchShoots();
    }

  }, [shouldUpdateAllShoots, shoot_id]);

  // fetchFilteredShoots useEffect
  useEffect(() => {    
    if(!finalPageLoaded && selectedTag) {
      setIsLoading(true);

      const fetchFilteredShoot = async () => {

        try {
          const response = await fetch(`${BASE_URL}/shoots/all?tag_id=${selectedTag.id}&page=${currentPage}&limit=${itemsPerPage}`);

          if(response.ok) {
            const { shootSummaries, isFinalPage } = await response.json();
            const data = shootSummaries;
            let filteredData = [...data];
            setCurrentPage(currentPage + 1);

            if(isOnShootDetails) {
              const currentShoot = shoot_id;
              filteredData = data.filter(shoot => shoot.shoot_id !== +currentShoot);
            }

            const updatedShootsData = [...shootsData, ...filteredData];

            setTimeout(() => {
              setIsInitialShootsLoad(false);
            }, minLoadingInterval);

            if(isFinalPage) {
              setFinalPageLoaded(true);
            } else {
              setShootsData(updatedShootsData);
            }
          }
        } catch(error) {
          console.log(`Error fetching ${selectedTag.tag_name} shoots: ${error}`);
          toast.error(`Failed to fetch ${selectedTag.tag_name} shoots:, ${error}`);
        } finally {
          setTimeout(() => {
            setIsLoading(false); 
            setShouldUpdateFilteredShoots(false);
          }, minLoadingInterval);
        }
      }
      fetchFilteredShoot();
    }
  }, [selectedTag, shouldUpdateFilteredShoots])

  // handleOverScroll useEffect
  useEffect(() => {
    if(!finalPageLoaded) {
      handleOverScroll();
    }
  }, [scrollYPos, prevScrollYPos]);

  // useEffect to clear shoots state when navigating to page
  useEffect(() => {
    const { pathname, search } = location;
    const currentURL = pathname.concat(search);
      if(currentURL !== prevURL || showDeleteOrEditModal) {

        if(location.pathname.includes("shoot")) {
          setTimeout(() => {
            setIsInitialShootsLoad(true);
          }, minLoadingInterval);
        } else {
          setIsInitialShootsLoad(true);
        }
        
        setShootsData([]);
        setShowDeleteOrEditModal(false);
        setCurrentPage(1);
        setFinalPageLoaded(false);
    
        const searchByTag = search.includes("tag");
      
        if((pathname === "/work" && !searchByTag) || (pathname === "/work/" && !searchByTag)) {
          setShouldUpdateAllShoots(true);
          setShouldUpdateFilteredShoots(false);
          setShootsData([]);
        }
        
        if(pathname === "/work" && searchByTag) {
          setShouldUpdateAllShoots(false);
          setShouldUpdateFilteredShoots(true);
          setShootsData([]);
        }
      }
    }, [location]);

  return (
    <>
      <div className="shoots">

        <div 
          className={`shoots__placeholders ${isInitialShootsLoad && isOnShootDetails
          ? "show onShootDetails"
          : isInitialShootsLoad && !isOnShootDetails
          ? "show"
          : ""}`}
        >

          {Array.from({ length: itemsPerPage }, (_, idx) => 

            <div 
              className="shoots__placeholder"
              key={idx + 1}
            >
              <div className="shoots__placeholder-img"></div>
              <div className="shoots__placeholder-textContainer">
                <div className="shoots__placeholder-models"></div>
                <div className="shoots__placeholder-photographers"></div>
              </div>
            </div>
            )
          }

        </div>
        <div className={`shoots__inner ${isOnShootDetails 
          ? "onShootDetails" 
          : ""}`}
        >

          {shootsData.map(shoot => (
            <Link 
              to={`/shoot/${shoot.shoot_id}`} 
              key={shoot.shoot_id}
            >
              <Shoot
                key={shoot.shoot_id}
                shoot_id={shoot.shoot_id}
                display_order={shoot.display_order}
                thumbnail_url={shoot.thumbnail_url}
                models={shoot.models}
                photographers={shoot.photographers}
                isOnShootDetails={isOnShootDetails}
                handleNewShootId={handleNewShootId}
                isOrderEditable={isOrderEditable}
                handleShootDragStart={handleShootDragStart}
                handleDropShootTarget={handleDropShootTarget}
                tags={shoot.tags}
              />
            </Link>
          ))}

          {!isInitialShootsLoad && !finalPageLoaded 
          
            ?

              (Array.from({ length: itemsPerPage }, (_, idx) => 

                <div 
                  className="shoots__placeholder"
                  key={idx + 1}
                >
                  <div className="shoots__placeholder-img"></div>
                  <div className="shoots__placeholder-textContainer">
                    <div className="shoots__placeholder-models"></div>
                    <div className="shoots__placeholder-photographers"></div>
                  </div>
                </div>)
              )

            : null

          }

        </div>

        {isLoggedIn && !isOnShootDetails && finalPageLoaded && !selectedTag && !isOrderEditable

        ? <div className="shoots__button-container">
            <button
              className="shoots__editShootOrder"
              onClick={makeOrderEditable}
            >
              Edit Order
            </button>
          </div>

        : isLoggedIn && !isOnShootDetails && finalPageLoaded && !selectedTag && isOrderEditable
        
        ? <div className="shoots__button-container">
            <button
              className="shoots__editShootOrder"
              onClick={saveNewOrder}
            >
              Save Order
            </button>
          </div>
        
        : null}

      </div>
    </>
  )};

export default Shoots;