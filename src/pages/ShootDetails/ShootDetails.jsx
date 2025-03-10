import { useAppContext} from '../../AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Shoots from '../../components/Shoots/Shoots.jsx';
import './ShootDetails.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ShootDetails = () => {

  const navigate = useNavigate();
  
  const { shoot_id } = useParams();

  const { 
    setIsLoading,
    selectedTag,
    minLoadingInterval,
    shootDetails, 
    setShootDetails,
    isLoggedIn,
    lightboxOpen, 
    handleSetLightBoxState,
    hideNav,
    showNav
  } = useAppContext();

  const [ photos, setPhotos ] = useState([]);
  const [ photographers, setPhotographers ] = useState([]);
  const [ models, setModels ] = useState([]);
  const [ formattedDate, setFormattedDate ] = useState('');
  
  // state for when to render placeholders
  const [ componentIsLoaded, setComponentIsLoaded ] = useState(false);

  const handleSetLightBoxImages = (idx) => {
    const images = photos.map((photo, idx) => ({
      src: photo.photo_url,
      alt: `Photo number ${idx + 1} from shoot number ${shoot_id}`
    }));

    hideNav();
    handleSetLightBoxState(images, idx);
  };

  const handlePhotosLoaded = () => {
    setTimeout(() => {
      setComponentIsLoaded(true);
    }, minLoadingInterval);
  };

  // useEffect for when shoot_id changes
  useEffect(() => {
    setIsLoading(true);
    setComponentIsLoaded(false);
    
    const fetchShootDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/shoots/shoot/${shoot_id}`);
        if(response.ok) {
          const data = await response.json();
          setShootDetails(data);
          setTimeout(() => {
            setIsLoading(false);
          }, 250);
          setPhotos(data.photo_urls);
          const date = new Date(data.shoot_date);
          const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          setFormattedDate(formattedDate);
          setPhotographers(data.photographers);
          setModels(data.models);
        } else {
          toast.error(response.statusText);
          throw new Error(`Failed to fetch shoot details: ${response.statusText}`);
        };

      } catch(error) {
        console.log(error);
        setIsLoading(false);
        navigate('/notfound');
      };
    };

    fetchShootDetails();
  }, [shoot_id]);

  useEffect(() => {
    if(!lightboxOpen) {
      showNav();
    };
  }, [lightboxOpen]);
  
  return (
    <>
      <div className="shootDetails">
        <div className="shootDetails__inner">

          <div className="shootDetails__photos">   

            <div className={`shootDetails__photo-placeholders ${componentIsLoaded 
              ? "hide"
              : ""}`}
            >
              <div className="shootDetails__date-placeholder"></div>
              <div className="shootDetails__photo-placeholder shootDetails__photo-placeholder--1"></div>
              <div className="shootDetails__detail-placeholders">
                <div className="shootDetails__detail-placeholder"></div>
                <div className="shootDetails__detail-placeholder"></div>
              </div>
              <div className="shootDetails__photo-placeholder"></div>
              <div className="shootDetails__photo-placeholder"></div>
              <div className="shootDetails__photo-placeholder"></div>
              <div className="shootDetails__photo-placeholder"></div>
            </div>
            
            {photos && photos.map((photo, idx) => 
              <div 
                className={`shootDetails__photo-container ${componentIsLoaded 
                  ? "show"
                : ""}`}
                key={idx}
              >
                
                {idx === 0 && 

                  <h4 
                    className={`shootDetails__date ${shootDetails 
                      ? "show"
                      : ""}`}
                  >
                    {formattedDate && formattedDate}
                  </h4>
                }
                
                <img 
                  className='shootDetails__photo'
                  src={photo.photo_url} 
                  alt={`Photo from photo shoot ${shoot_id}`} 
                  onClick={() => handleSetLightBoxImages(idx)}
                  onLoad={idx === photos.length - 1 
                    ? handlePhotosLoaded 
                    : null} 
                />

                {idx === 0 && 
                  (
                    <>
                      <div className="shootDetails__info">
                        
                        <h3   
                          className={`shootDetails__models ${shootDetails && "show"}`}
                        >
                          {shootDetails 
                            ? (
                              <span 
                                className={"shootDetails__models-label"}>
                                  {models.length > 1 
                                  ? "Models: " 
                                  : "Model: "}
                              </span>
                              )
                            : null
                          }
                        
                          {shootDetails && models.length > 1 
                              ? models.join(", ") 
                              : models
                          }
                        </h3>

                        <h3   
                          className={`shootDetails__photographers ${shootDetails 
                            ? "show"
                            : ""}`}
                        >
                          {photographers 
                            ? 
                              <span className="shootDetails__photographers-label">
                                {"Photos: "}
                              </span>              

                            : null
                          }

                          {shootDetails && photographers.length > 1 
                            ? photographers.join(", ") 
                            : photographers}
                        </h3>

                        <h3   
                          className={`shootDetails__photographers ${shootDetails 
                            ? "show"
                            : ""}`}
                        >
                          {/* showing shoot tags if logged in to help with debugging */}
                          {isLoggedIn && shootDetails && shootDetails.tags.length < 1
                            ? `Tags: ${shootDetails.tags}`
                            : isLoggedIn && shootDetails && shootDetails.tags.length >= 1  && !shootDetails.tags !== null
                            ? `Tags: ${shootDetails.tags.join(", ")}`
                            : null}
                        </h3>
                      </div>
                    </>

                  )}
              </div>
            )}

          </div>

        </div>
        <div className="shootDetails__divider"></div>
        <div className="shootDetails__bottom">
          <h3 className='shootDetails__bottom-text'>
            Other {selectedTag ? selectedTag.tag_name : null} Shoots
          </h3>
          <Shoots />
        </div>
      </div>
    </>
  )};

export default ShootDetails;