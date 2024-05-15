import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import { toast } from 'react-toastify';
import { checkTokenExpiration, scrollToTop } from '../../utils/utils.js';
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
    setIsLoading,
    minLoadingInterval, 
    setMinLoadingInterval,
    selectedTag, 
    setSelectedTag,
    tags,
    setTags,

    shouldUpdateAllShoots, 
    setShouldUpdateAllShoots, 
    shouldUpdateFilteredShoots, 
    setShouldUpdateFilteredShoots
  } = useContext(AppContext);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [ shootsData, setShootsData ] = useState([]);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ shouldUpdate, setShouldUpdate ] = useState(true);
  const [ isLoadingInitial, setIsLoadingInitial ] = useState(true);
  const [ isOnShootDetails, setIsOnShootDetails ] = useState(location.pathname.includes('/shoot/'));
  const [ currentShootId, setCurrentShootId ] = useState(shoot_id);
  const [ isOrderEditable, setIsOrderEditable ] = useState(false);

  const [ activeDragShoot, setActiveDragShoot ] = useState(null); 

  const itemsPerPage = 2;
  // const itemsPerPage = 4;
  // const itemsPerPage = 6;
  // const itemsPerPage = 12;

  const [ searchTerm, setSearchTerm ] = useState(location.search.split("=")[1] || null);
    
  const handleNewShootId = (shootId) => {
    setShootsData([]);
    setCurrentPage(1);
    setCurrentShootId(shootId);
    setShouldUpdate(true);
  }

  const makeOrderEditable = () => {
    setIsOrderEditable(true);
    setActiveDragShoot(null);
    toast.info("Drag shoots into desired order then Save to update")
  }

  const saveNewOrder = async () => {
    setIsOrderEditable(false);
    setIsLoading(true);

    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return;
    }
    
    if(isLoggedIn) {      
      toast.info("Updating database. One sec...");

      const new_shoot_order = []
  
      for(const shoot of shootsData) {
        const updateObj = {}
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
          setIsLoading(false)
        }
        
      } catch(error) {
        console.log(error)
        toast.error("Error updating database...")
        setIsLoading(false);
      }
    }

    setIsOrderEditable(false);
    setActiveDragShoot(null);
  }

  const handleShootDragStart = (shoot_id) => {
    const draggedShoot = shootsData.find(shoot => shoot.shoot_id === shoot_id);
    setActiveDragShoot(draggedShoot);
  }

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
  }

    // fetch shoots
    useEffect(() => {
      const fetchShoots = async () => {
        
        // console.log("fetchShoots ")
        if(!location.search.includes('tag')) {
          
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
                  }, minLoadingInterval);
                  
                if(isLoadingInitial) {
                  setIsLoadingInitial(false);
                }
                
                if(data.length === 0) {
                  setShouldUpdate(false);
                  setTimeout(() => {
                    setIsLoading(false)
                  }, minLoadingInterval);
                }
              }
            } catch(error) {
              console.log(`Error fetching shoots: ${error}`)
              toast.error(`Failed to fetch shoots:, ${error}`);
              setTimeout(() => {
                setIsLoading(false);
              }, minLoadingInterval);
                      
            }
          }
        } 
      }
      fetchShoots();
    }, [currentPage, currentShootId, selectedTag, shouldUpdateShoots, shootsData]);


  // fetch shoots by tag
  useEffect(() => {
    if(selectedTag) {
      setIsLoading(true);
      
      const fetchShootsByTag = async () => {
        
        try {

          const response = await fetch(`${BASE_URL}/shoots/all?tag_id=${selectedTag.id}`);

          if(response.ok) {
            const data = await response.json();

            setShootsData(data)
            
            let filteredData = [...data];
            
              if(isOnShootDetails) {
                console.log("is on shoot details")
                const currentShoot = shoot_id;
                filteredData = data.filter(shoot => shoot.shoot_id !== +currentShoot);
              }            
            }      

            setTimeout(() => {
              setIsLoading(false);
            }, minLoadingInterval);

        } catch(error) {
          console.log(error);
          toast.error(`Error fetching shoots...`)
        }
      }
      fetchShootsByTag()
    }

  }, [selectedTag])
  
  // pagination useEffect
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


  // initial load useEffect
  useEffect(() => {
    let searchedTerm;

    if(tags && searchTerm) {
      searchedTerm = tags.find(tag => tag.tag_name.toLowerCase() === searchTerm);
    }

    if(searchedTerm) {
      // console.log(searchedTerm)
      setSelectedTag(searchedTerm)
      setShouldUpdateShoots(true)
    }

    scrollToTop();
  }, [searchTerm, tags])

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
        </div>

        {!isOnShootDetails && isLoggedIn && !isOrderEditable && !shouldUpdate?

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
