import AppContext from '../../AppContext.jsx';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scrollToTop } from '../../utils/utils.js';
import { toast } from 'react-toastify';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker.jsx';
import { checkTokenExpiration } from '../../utils/utils.js';
import AddIcon from '../../assets/icons/AddIcon.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import MinusIcon from '../../assets/icons/MinusIcon.jsx';
import PhotoInput from '../../components/PhotoInput/PhotoInput.jsx';
import FormData from 'form-data';
import Compressor from 'compressorjs';
import './AddOrEditShoot.scss';

const AddOrEditShoot = ({ shootAction }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { shoot_id } = useParams();
  
  const navigate = useNavigate();

  const { 
    isLoading,
    setIsLoading,
    isLoggedIn, 
    setIsLoggedIn,
    shouldUpdatePhotographers,
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    shouldUpdateShoots, 
    setShouldUpdateShoots
  } = useContext(AppContext);

  const [ isInitialLoad, setIsInitialLoad ] = useState(true);
  const [ newShootDate, setNewShootDate ] = useState(new Date());
  const [ photographers, setPhotographers ] = useState([]);
  const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([{ chooserNo: 1, photographerID: null }]);
  const [ models, setModels ] = useState([]);
  const [ modelChooserIDs, setModelChooserIDs ] = useState([{ chooserNo: 1, modelID: null}]);

  // edit shoot data
  const [ shootDetails, setShootDetails ] = useState(null);
  const [ photos, setPhotos ] = useState([]);
  const [ formattedDate, setFormattedDate ] = useState('');

  const numberOfPhotoUploads = 10;

  const [ shootPhotos, setShootPhotos ] = useState(
    Array.from({ length: numberOfPhotoUploads }, (_, idx) => ({
      photoNo: idx + 1,
      photoPreview: null,
      photoData: null
    }))
  );
  
  const handleImageChange = async (e, inputNo) => {
    const file = e.target.files[0];
    
    try {
      const compressedImage = await new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 900,
          mimeType: 'auto',
          convertSize: 600000,
          success(result) {
            resolve(result);
          },
          error(error) {
            reject(error);
          }
        });
      });

      const newShootPhotos = [...shootPhotos];

      const compressedImageUrl = URL.createObjectURL(compressedImage);
    
      newShootPhotos.forEach((shootPhoto) => {
        if(shootPhoto.photoNo === inputNo) {
          shootPhoto.photoPreview = compressedImageUrl;
          shootPhoto.photoData = compressedImage;
        }
      });
  
      setShootPhotos(newShootPhotos);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

  const handleAddCustomSelect = (selectedEntry) => {
    const selectedEntryType = selectedEntry === "photographer_name"
      ? "photographer"
      : "model";

    const hasNullPhotographerChooser = photographerChooserIDs.some(chooser => chooser.photographerID === null);

    const hasNullModelChooser = modelChooserIDs.some(chooser => chooser.modelID === null);
      
    if(selectedEntryType === "photographer" && !hasNullPhotographerChooser) {

      const maxChooserNo = Math.max(...photographerChooserIDs.map(chooser => chooser.chooserNo));

      const newChooser = { chooserNo: maxChooserNo + 1, photographerID: null};
      
      setPhotographerChooserIDs([...photographerChooserIDs, newChooser]);
      
      return;
      
    } else if(selectedEntryType === "model" && !hasNullModelChooser) {

      const maxChooserNo = Math.max(...modelChooserIDs.map(chooser => chooser.chooserNo));

      const newChooser = { chooserNo: maxChooserNo + 1, modelID: null};

      setModelChooserIDs([...modelChooserIDs, newChooser]);

      return;
    }

    return toast.error(`Please select a ${selectedEntryType} before adding a new one`);
  }

  const handleRemoveCustomSelector = (chooser) => {
    const chooserType = chooser.hasOwnProperty('photographerID')
      ? "Photographer"
      : "Model"

    const { chooserNo } = chooser;
    
    if(chooserType === "Photographer") {
      const filteredChoosers = photographerChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);

      setPhotographerChooserIDs(filteredChoosers);

    } else if(chooserType === "Model") {
      const filteredChoosers = modelChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);
      
      setModelChooserIDs(filteredChoosers);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return;
    }

    if(isLoggedIn) {
      try {
        setIsLoading(true);

        const selectedPhotographerIDs = photographerChooserIDs
          .filter(chooser => chooser.photographerID !== null)
          .map(chooser => chooser.photographerID);

        if(selectedPhotographerIDs.length === 0) {
          setIsLoading(false);
          return toast.error("Select at least one photographer");
        }

        const selectedModelIDs = modelChooserIDs
          .filter(chooser => chooser.modelID !== null)
          .map(chooser => chooser.modelID);

        if(selectedModelIDs.length === 0) {
          setIsLoading(false);
          return toast.error("Select at least one model");
        }

        const photographer_ids = selectedPhotographerIDs.join(", "); 
        const model_ids = selectedModelIDs.join(", "); 

        const photoInputImages = [];
      
        shootPhotos.forEach(photo => {
          if(photo.photoData !== null) {
            photoInputImages.push(photo.photoData)
          }
        });
      
        if(!photoInputImages.length) {
          setIsLoading(false);
          return toast.error('Select at least one image')
        }
      
        const formData = new FormData();
      
        for(const photo of photoInputImages) {
          formData.append('file', photo);
        }
      
        formData.append('shoot_date', newShootDate.toISOString().split('T')[0]);
        
        formData.append("photographer_ids", photographer_ids);
        formData.append("model_ids", model_ids);

        const token = localStorage.getItem('token');
        
        const headers = {
          'Authorization': `Bearer ${token}`,
        };

        const response = await fetch(`${BASE_URL}/shoots/add`, {
          method: 'POST',
          headers: headers,
          body: formData,
        });
      
        if(!response.ok) {
          setIsLoggedIn(false)
          throw new Error("Error creating shoot. Logging you out...");
        } else {
          toast.success("Shoot added Successfully");
          setShouldUpdateShoots(true);
          setTimeout(() => {
            navigate('/home');
          }, 500)
        }
      } catch(error) {
        console.log(error)
        toast.error('Error creating shoot. Logging you out...');
        setIsLoading(false);
        navigate('/home');
      } 
    } else if(!isLoggedIn) {
      toast.error("Not logged in...");
      navigate('/home');
    }
  };

  const handleCancel = () => {
    navigate('/home');
  }
  
  // fetch phtographers & models
  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem('token');
    const headers = {};

    if(token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      setIsLoggedIn(false);
      return toast.error("Not logged in")
    }

    const fetchPhotographers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/photographers/all`, { headers });

        if(!response.ok) {
          throw new Error(`Failed to fetch photographers: ${response.statusText}`);
        }

        const data = await response.json();
        setPhotographers(data.photographers);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchModels = async () => {
      try {
        const response = await fetch(`${BASE_URL}/models/all`, { headers });

        if(!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`);
        }

        const data = await response.json();
        setModels(data.models);
      } catch (error) {
        console.log(error);
      } 
    };
    
    if(isInitialLoad || shouldUpdatePhotographers) {
      setShouldUpdatePhotographers(false);
      fetchPhotographers();
    } 
    
    if(isInitialLoad || shouldUpdateModels) {
      setShouldUpdateModels(false);
      fetchModels();
    }

    setIsLoading(false);

  }, [BASE_URL, shouldUpdatePhotographers, shouldUpdateModels])


  // edit fetch
  useEffect(() => {
    if(shoot_id) {
      setIsLoading(true);
      
      const fetchShootDetails = async () => {
        try {
          const response = await fetch(`${BASE_URL}/shoots/shoot/${shoot_id}`);
          if(response.ok) {
            const data = await response.json();
            setShootDetails(data);
            setPhotos(data.photo_urls);
            const fetchedShootPhotos = [...shootPhotos];
          
            for(const [idx, photoUrl] of data.photo_urls.entries()) {
              fetchedShootPhotos[idx].photoPreview = photoUrl.photo_url;
            }

            setShootPhotos(fetchedShootPhotos)
          
            const date = new Date(data.shoot_date);
            const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            setFormattedDate(formattedDate);

            const photogIDs = data.photographer_ids.split(',')
            const modelIDs = data.model_ids.split(',')

            const fetchedPhotographerIDs = photogIDs.map((id, idx) => ({"chooserNo": idx + 1, "photographerID": id}));
            const fetchedModelIDs = modelIDs.map((id, idx) => ({"chooserNo": idx + 1, "modelID": id}));

            setPhotographerChooserIDs(fetchedPhotographerIDs);
            setModelChooserIDs(fetchedModelIDs);
            setIsLoading(false);
          } else {
            toast.error(response.statusText);
            throw new Error(`Failed to fetch shoot details: ${response.statusText}`);
          }
          
        } catch(error) {
          console.log(error)
          setIsLoading(false);
          navigate('/notfound')
        }
      }
      fetchShootDetails();
    }

    setIsLoading(false);
  }, [shoot_id, photographers, models]);
  

  // useEffect to call shoots/shoot/:id for data to load editShoot

  // initial load useEffect
  useEffect(() => {
    scrollToTop();

    // setTimeout(() => {
      setIsLoading();
    // }, 250);

    setIsInitialLoad(false);
  }, [isInitialLoad]);
  
  return (
    <>
      <div className="addOrEditShoot">
        <div className="addOrEditShoot__inner">

          {shootAction === "add"

            ? <h1 className="addOrEditShoot__heading">
                Add New Shoot
              </h1>

            : <h1 className="addOrEditShoot__heading">
                Edit Shoot {shoot_id}
              </h1>
          }
          
          <form className="addOrEditShoot__form">
            <div className="addOrEditShoot__date-container">

              {shootAction === "add"

                ? <label className='addOrEditShoot__label addOrEditShoot__label--datePicker'>
                    Enter Shoot Date
                  </label>

                : <label className='addOrEditShoot__label addOrEditShoot__label--datePicker'>
                    Edit Shoot Date
                  </label>
              }

                <NewShootdatePicker
                  newShootDate={newShootDate}
                  setNewShootDate={setNewShootDate}
                  className={"addOrEditShoot__calendarIcon"}
                  formattedDate={formattedDate}
                />
            </div>

            <div className="addOrEditShoot__photoUploads">
              <h3 className="addOrEditShoot_photos-heading">
                Select up to 10 Photos
              </h3>

              <div className="addOrEditShoot__photoInputs">              

                {shootPhotos.map(shootPhoto => 
                  <div 
                    className="addOrEditShoot__photoInput"
                    key={shootPhoto.photoNo}
                  >                  
                    <PhotoInput 
                      shootPhoto={shootPhoto}
                      shootPhotos={shootPhotos}
                      setShootPhotos={setShootPhotos}
                      handleImageChange={handleImageChange}
                    />
                  </div>
                )}

              </div>

              <p className="addOrEditShoot__photos-explainer">
                *All shoots need at least one photo
              </p>
            </div>

            <div className="addOrEditShoot__photographersAndModels-container">

              <div className="addOrEditShoot__photographerChoosers">
                <h3 className='addOrEditShoot__label'>
                  Choose At Least One Photographer
                </h3>

                <h4 
                  className="addOrEditShoot__textButton"
                  onClick={() => handleAddCustomSelect("photographer_name")}
                >
                  Add Photographer 
                    <span className='addOrEditShoot__textButton-icon'>
                      <AddIcon 
                        className={"addOrEditShoot__add-icon"}
                        classNameStroke={"addOrEditShoot__add-stroke"}
                      />
                    </span>
                </h4>

                {photographerChooserIDs.map((chooser) => (
                  <div 
                    className="addOrEditShoot__selector addOrEditShoot__selector--photographer"
                    key={chooser.chooserNo}
                  >

                    <CustomSelect 
                      chooserNo={chooser.chooserNo}
                      chooserType={"Photographer"}
                      chooserIDs={photographerChooserIDs}
                      setChooserIDs={setPhotographerChooserIDs}
                      selectOptions={photographers}
                      selectEntry={photographerChooserIDs}
                      setSelectedOption={setPhotographerChooserIDs}
                      photographerIDchooserId={chooser.photographerID}
                      entryNameType={"photographer_name"}
                      currentValue={chooser.photographerID}
                    />

                      <span 
                        className={`addOrEditShoot__selector-removeIcon ${photographerChooserIDs.length > 1
                          ? "show" 
                          : ""}`}
                        onClick={photographerChooserIDs.length > 1
                          ? () => handleRemoveCustomSelector(chooser)
                          : null
                        }
                      >
                        <MinusIcon 
                          className={"addOrEditShoot__minus-icon"}
                        />
                      </span>
                      
                  </div>
                ))}
              </div>

              <div 
                className="addOrEditShoot__modelChoosers"
              >
                <h3 className='addOrEditShoot__label'>
                  Choose At Least One Model
                </h3>

                <h4 
                  className="addOrEditShoot__textButton"
                  onClick={() => handleAddCustomSelect("model_name")}
                >
                  Add Model 
                  <span className='addOrEditShoot__textButton-icon'>
                    <AddIcon 
                      className={"addOrEditShoot__add-icon"}
                      classNameStroke={"addOrEditShoot__add-stroke"}
                    />
                  </span>
                </h4>
                
                {modelChooserIDs.map((chooser) => (
                  <div 
                    className="addOrEditShoot__selector addOrEditShoot__selector--model"
                    key={chooser.chooserNo}
                  >

                    <CustomSelect
                      chooserNo={chooser.chooserNo}
                      chooserType={"Model"}
                      chooserIDs={modelChooserIDs}
                      setChooserIDs={setModelChooserIDs}
                      selectOptions={models}
                      selectEntry={modelChooserIDs}
                      setSelectedOption={setModelChooserIDs}
                      modelIDchooserId={chooser.modelID}
                      entryNameType={"model_name"}
                      currentValue={chooser.modelID}
                    />

                      <span 
                        className={`addOrEditShoot__selector-removeIcon ${modelChooserIDs.length > 1 
                          ? "show" 
                          : ""}`}
                        onClick={modelChooserIDs.length > 1
                          ? () => handleRemoveCustomSelector(chooser)
                          : null
                        }
                      >
                        <MinusIcon 
                          className={"addOrEditShoot__minus-icon"}
                        />
                      </span>

                    </div>
                ))}
                
              </div>
            
            </div>
          
            <div className="addOrEditShoot__button-container">

              <div 
                className="addOrEditShoot__button addOrEditShoot__button--submit" 
                onClick={(e) => handleSubmit(e)}
              >
                Submit
              </div>

              <div 
                className="addOrEditShoot__button addOrEditShoot__button--cancel" 
                onClick={handleCancel}
              >
                Cancel
              </div>
            </div>
      
          </form>
        </div>
      </div>
    </>
  )};

export default AddOrEditShoot;
