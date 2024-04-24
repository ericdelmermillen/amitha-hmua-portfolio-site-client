import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker.jsx';
import { scrollToTop } from '../../utils/utils.js';
import { toast } from 'react-toastify';
import { checkTokenExpiration } from '../../utils/utils.js';
import AddIcon from '../../assets/icons/AddIcon.jsx';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';
import MinusIcon from '../../assets/icons/MinusIcon.jsx';
import './AddShoot.scss';
import PhotoInput from '../../components/PhotoInput/PhotoInput.jsx';

const AddShoot = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { 
    isLoading,
    setIsLoading,
    isLoggedIn, 
    setIsLoggedIn,
    shouldUpdatePhotographers,
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels
  } = useContext(AppContext);

  const [ isInitialLoad, setIsInitialLoad ] = useState(true);
  const [ newShootDate, setNewShootDate ] = useState(new Date());
  const [ models, setModels ] = useState([]);
  const [ modelChooserIDs, setModelChooserIDs ] = useState([{ chooserNo: 1, modelID: null}]);
  const [ photographers, setPhotographers ] = useState([]);
  const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([{ chooserNo: 1, photographerID: null }]);

  const numberOfPhotoUploads = 10;

  const [shootPhotos, setShootPhotos] = useState(
    Array.from({ length: numberOfPhotoUploads }, (_, idx) => ({
      photoNo: idx + 1,
      photoData: null
    }))
  );
  
  // const [ shootPhotos, setShootPhotos ] = useState(
  //   [
  //     {photoNo: 1, photoData: "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601727660-BDMJVSOP3C6JUCVRUOQA/IMG_8389.JPG?format=1000w"},
  //     {photoNo: 2, photoData: "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601764606-ATC169LN5RT0QP8C424N/IMG_8280.JPG?format=1000w"},
  //     {photoNo: 3, photoData: "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601806737-L9CI06R5M8ELWDASOC0W/IMG_8281.JPG?format=1000w"},
  //     {photoNo: 4, photoData: "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627602367230-LB8ZNUQ5EMF6P9J4WCKW/IMG_8390.JPG?format=1000w"},
  //     {photoNo: 5, photoData: "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627602409500-KSPOFX7TCQ3PTM5V3SWJ/IMG_8282.JPG?format=1000w"},
  //     {photoNo: 6, photoData: null},
  //     {photoNo: 7, photoData: null},
  //     {photoNo: 8, photoData: null},
  //     {photoNo: 9, photoData: null},
  //     {photoNo: 10, photoData: null},
  //   ]
  // );

  const handleCancel = () => {
    navigate('/home');
  }

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

    return toast.error(`Please select a ${selectedEntryType} before adding a new one`)
  }

  const handleRemoveCustomSelector = (chooser) => {
    const chooserType = chooser.hasOwnProperty('photographerID')
      ? "Photographer"
      : "Model"

    const { chooserNo } = chooser;
    
    if(chooserType === "Photographer") {
      const filteredChoosers = photographerChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);

      setPhotographerChooserIDs(filteredChoosers);

    } else if(chooserType === "Model" && modelChooserIDs.length > 1) {
      const filteredChoosers = modelChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);
      
      setModelChooserIDs(filteredChoosers);
    }
  }

  const handleSubmit = async () => {
    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return
    }

    if(isLoggedIn) {

      try {
        setIsLoading(true);

        const selectedPhotographerIDs = [];

        photographerChooserIDs.forEach(photographerChooser => {
          if(photographerChooser.photographerID !== null) {
            selectedPhotographerIDs.push(photographerChooser.photographerID);
          }
        });

        if(!selectedPhotographerIDs.length) {
          setIsLoading(false);
          return toast.error("Select at least one photographer");
        }

        const selectedModelIDs = [];

        modelChooserIDs.forEach(modelChooser => {
          if(modelChooser.modelID !== null) {
            selectedModelIDs.push(modelChooser.modelID);
          }
        });

        if(!selectedModelIDs.length) {
          setIsLoading(false);
          return toast.error("Select at least one model");
        }
        
        const shoot = {};
        shoot.shoot_date = newShootDate.toISOString().split('T')[0];
        shoot.model_ids = selectedModelIDs;
        shoot.photographer_ids = selectedPhotographerIDs;
        shoot.photo_urls = [];

        shootPhotos.forEach(shootPhoto => {
          if(shootPhoto.photoData) {
            shoot.photo_urls.push(shootPhoto.photoData);
          }
        })

        const token = localStorage.getItem('token');

        if(!token) {
          navigate('/home');
          return toast.error("Sorry please login again");
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const response = await fetch(`${BASE_URL}/shoots/add`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(shoot)
        });

        if(!response.ok) {
          throw new Error("Error creating shoot");
        } else {
          toast.success("Shoot added Successfully");
          setTimeout(() => {
            navigate('/home');
          }, 500)
        }
      
      } catch(error) {
        console.log(error)
        toast.error('Error creating shoot');
        setIsLoading(false);
      }
    }
  };
  
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
        toast.error(`Error fetching photographers: ${error.message}`);
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
        toast.error(`Error fetching models: ${error.message}`);
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

    setTimeout(() => {
      setIsLoading(false);
    }, 250);

  }, [BASE_URL, shouldUpdatePhotographers, shouldUpdateModels])


  // initial load useEffect
  useEffect(() => {
    scrollToTop();

    setTimeout(() => {
      setIsLoading();
    }, 250);

    setIsInitialLoad(false);
  }, [isInitialLoad]);
  
  return (
    <>
      <div className="addShoot">
        <div className="addShoot__inner">
          <h1 className="addShoot__heading">
            Add New Shoot
          </h1>

          <div className="addShoot__form">
            <div className="addShoot__date-container">

              <label className='addShoot__label addShoot__label--datePicker'>
                Enter Shoot Date
              </label>
                <NewShootdatePicker
                  newShootDate={newShootDate}
                  setNewShootDate={setNewShootDate}
                  className={"addShoot__calendarIcon"}
                />
            </div>

            <div className="addShoot__photoUploads">
              <h3 className="addShoot_photos-heading">
                Select up to 10 Photos
              </h3>

              <div className="addShoot_photoInputs">              

                {shootPhotos.map(shootPhoto => 
                  <div 
                    className="addShoot__photoInput"
                    key={shootPhoto.photoNo}
                  >                  
                    <PhotoInput 
                      shootPhoto={shootPhoto}
                      shootPhotos={shootPhotos}
                      setShootPhotos={setShootPhotos}
                    />
                  </div>
                )}

              </div>

              <p className="addShoot__photos-explainer">
                *All shoots need at least one photo
              </p>
            </div>

            <div className="addShoot__photographersAndModels-container">

              <div className="addShoot__photographerChoosers">
                <h3 className='addShoot__label'>
                  Choose At Least One Photographer
                </h3>

                <h4 
                  className="addShoot__textButton"
                  onClick={() => handleAddCustomSelect("photographer_name")}
                >
                  Add Photographer 
                    <span className='addShoot__textButton-icon'>
                      <AddIcon 
                        className={"addShoot__add-icon"}
                        classNameStroke={"addShoot__add-stroke"}
                      />
                    </span>
                </h4>

                {photographerChooserIDs.map((chooser) => (
                  <div 
                    className="addShoot__selector addShoot__selector--photographer"
                    key={chooser.chooserNo}
                  >

                    <CustomSelect 
                      chooserNo={chooser.chooserNo}
                      chooserType={"Photographer"}
                      chooserIDs={photographerChooserIDs}
                      setChooserIDs={setPhotographerChooserIDs}
                      selectOptions={photographers}
                      setSelectOptions={setPhotographers}
                      selectEntry={photographerChooserIDs}
                      setSelectedOption={setPhotographerChooserIDs}
                      photographerIDchooserId={chooser.photographerID}
                      entryNameType={"photographer_name"}
                    />

                      <span 
                        className={`addShoot__selector-removeIcon ${photographerChooserIDs.length > 1
                          ? "show" 
                          : ""}`}
                        onClick={photographerChooserIDs.length > 1
                          ? () => handleRemoveCustomSelector(chooser)
                          : null
                        }
                      >
                        <MinusIcon 
                          className={"addShoot__minus-icon"}
                        />
                      </span>
                      
                  </div>
                ))}
              </div>

              <div 
                className="addShoot__modelChoosers"
              >
                <h3 className='addShoot__label'>
                  Choose At Least One Model
                </h3>

                <h4 
                  className="addShoot__textButton"
                  onClick={() => handleAddCustomSelect("model_name")}
                >
                  Add Model 
                  <span className='addShoot__textButton-icon'>
                    <AddIcon 
                      className={"addShoot__add-icon"}
                      classNameStroke={"addShoot__add-stroke"}
                    />
                  </span>
                </h4>
                
                {modelChooserIDs.map((chooser) => (
                  <div 
                    className="addShoot__selector addShoot__selector--model"
                    key={chooser.chooserNo}
                  >

                    <CustomSelect
                      chooserNo={chooser.chooserNo}
                      chooserType={"Model"}
                      chooserIDs={modelChooserIDs}
                      setChooserIDs={setModelChooserIDs}
                      selectOptions={models}
                      setSelectOptions={setModels}
                      selectEntry={modelChooserIDs}
                      setSelectedOption={setModelChooserIDs}
                      modelIDchooserId={chooser.modelID}
                      entryNameType={"model_name"}
                    />

                      <span 
                        className={`addShoot__selector-removeIcon ${modelChooserIDs.length > 1 
                          ? "show" 
                          : ""}`}
                        onClick={modelChooserIDs.length > 1
                          ? () => handleRemoveCustomSelector(chooser)
                          : null
                        }
                      >
                        <MinusIcon 
                          className={"addShoot__minus-icon"}
                        />
                      </span>

                    </div>
                ))}
                
              </div>
            
            </div>
          
            <div className="addShoot__button-container">

              <div 
                className="addShoot__button addShoot__button--submit" 
                onClick={handleSubmit}
              >
                Submit
              </div>

              <div 
                className="addShoot__button addShoot__button--cancel" 
                onClick={handleCancel}
              >
                Cancel
              </div>
            </div>
      
          </div>
        </div>
      </div>
    </>
  )};

export default AddShoot;
