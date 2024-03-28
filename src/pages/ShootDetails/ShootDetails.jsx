import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { scrollToTop } from '../../utils/utils.js';
import { toast } from 'react-toastify';
import './ShootDetails.scss';

const ShootDetails = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();
  
  const { shoot_id } = useParams();

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

  const [ shootDetails, setShootDetails ] = useState(null);
  const [ photos, setPhotos ] = useState([]);
  const [ photographers, setPhotographers ] = useState([]);
  const [ models, setModels ] = useState([]);
  const [ shootIsLoaded, setShootIsLoaded ] = useState(false);
  
  // text content
  const [ formattedDate, setFormattedDate ] = useState('');
  const [ shootText, setShootText ] = useState("");

  const handlePhotosLoaded = () => {
    setShootIsLoaded(true)
  }

  // Placeholder array
  const placeholderPhotos = Array.from({ length: 1 }).map((_, idx) => ({
    key: idx,
    src: 'placeholder_url_here', // Placeholder URL
    alt: `Placeholder photo ${idx + 1}`,
  }));
  

  useEffect(() => {
    scrollToTop();
    setIsLoading(true)
    
    const fetchShootDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/shoots/shoot/${shoot_id}`);
        if(response.ok) {
          const data = await response.json();
          setShootDetails(data);
          setTimeout(() => {
            setIsLoading(false);
          }, 250)
          setPhotos(data.photo_urls);
          const date = new Date(data.shoot_date);
          const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          setFormattedDate(formattedDate);
          scrollToTop();
          setPhotographers(data.photographers);
          setModels(data.models);
          console.log(data.shoot_date)
        } else {
          throw new Error(`Failed to fetch shoot details: ${response.statusText}`);
        }

      } catch(error) {
        console.log(error)
        setIsLoading(false);
        navigate('/notfound')
      }
    }

    fetchShootDetails();
  }, []);
  

  return (
    <>
      <div className="shootDetails">
        <div className="shootDetails__inner">
          <div className={"shootDetails__info"}>
            <h4 className={`shootDetails__date ${shootDetails && "show"}`}>
              {formattedDate && formattedDate}
            </h4>

            <h3   
              className={`shootDetails__photographers ${shootDetails && "show"}`}
            >
              {photographers && 

                <span   
                  className="shootDetails__label">
                    {"Photos: "}
                </span>              

              }

              {shootDetails &&              

                photographers.length > 1 
                ? photographers.join(", ") 
                : photographers
              
              }
            </h3>
            <h3   
              className={`shootDetails__models ${shootDetails && "show"}`}
            >
              {shootDetails && 
                
                <span 
                  className={"models__label"}>
                    {models.length > 1 
                    ? "Models: " 
                    : "Model: "}
                </span>

              }
            
              {shootDetails &&
              
                models.length > 1 
                  ? models.join(", ") 
                  : models
              
              }
            </h3>
          </div>


          <div className="shootDetails__photos">          
            {/* photos placeholder */}

              {placeholderPhotos.map((photo, idx) =>
                <div 
                  className={`photoPlaceholder ${!isLoading && shootIsLoaded ? "hide": ""}`}
                  key={idx}
                  
                ></div>)}
              
            {/*  */}


            {photos && photos.map((photo, idx) => 
              <img 
                className='shootDetails__photo'
                key={idx}
                src={photo.photo_url} 
                alt={`Photo from photo shoot ${shoot_id}`} 
                onLoad={idx === photos.length - 1 ? handlePhotosLoaded : null} 
              />
            )}

          </div>

        </div>
      </div>
    </>
  )};

export default ShootDetails;