import AppContext from '../../AppContext.jsx';
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // console.log(location.pathname === '/shoots/add')
  // console.log(location.pathname)

  const { 
    isLoading,
    setIsLoading,
    isLoggedIn, 
    setIsLoggedIn,
    shouldUpdatePhotographers,
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    shouldUpdateTags, 
    setShouldUpdateTags,
    shouldUpdateShoots, 
    setShouldUpdateShoots,
    showFloatingButton, 
    setShowfloatingButton
  } = useContext(AppContext);

  const [ isInitialLoad, setIsInitialLoad ] = useState(true);
  const [ newShootDate, setNewShootDate ] = useState(new Date());
  const [ photographers, setPhotographers ] = useState([]);
  const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([{ chooserNo: 1, photographerID: null, photographerName: null }]);
  const [ models, setModels ] = useState([]);
  const [ modelChooserIDs, setModelChooserIDs ] = useState([{ chooserNo: 1, modelID: null, modelName: null}]);

  // tags --
  const [ tags, setTags ] = useState([]);

  const [ tagChooserIDs, setTagChooserIDs ] = useState([{ chooserNo: 1, tagID: null, tagName: null}]);

  // 

  const [ shootDetails, setShootDetails ] = useState(null);
  const [ photos, setPhotos ] = useState([]);
  const [ formattedDate, setFormattedDate ] = useState('');
  const [ rawDate, setRawDate ] = useState('');

  const numberOfPhotoUploads = 10;

  const [ shootPhotos, setShootPhotos ] = useState(
    Array.from({ length: numberOfPhotoUploads }, (_, idx) => ({
      photoNo: idx + 1,
      photoPreview: null,
      photoData: null,
      displayOrder: idx + 1
    }))
  );

  const [ activeDragInput, setActiveDragInput ] = useState(null); 
  
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

  const handleInputDragStart = (photoNo) => {
    const draggedInput = shootPhotos.find(photo => photo.photoNo === photoNo);
    setActiveDragInput(draggedInput);
  }

  const handleDropInputTarget = (dropTargetInputNo, dropTargetInputDisplayOrder) => {
    const activeDraggedInputNo = activeDragInput.photoNo;
    const activeDraggedInputOldDisplayOrder = activeDragInput.displayOrder;
  
    const highestDisplayOrder = shootPhotos.reduce((maxDisplayOrder, photo) => {
      return Math.max(maxDisplayOrder, photo.displayOrder);
    }, 0);
  
    const updatedShootPhotos = [...shootPhotos];
  
    for(const photo of updatedShootPhotos) {
  
      if(dropTargetInputNo !== activeDraggedInputNo) {

        if(dropTargetInputDisplayOrder === highestDisplayOrder) {
          if(photo.photoNo === dropTargetInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder - 1;
          } else if(photo.photoNo === activeDraggedInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder;
          } else if(photo.displayOrder < dropTargetInputDisplayOrder && photo.displayOrder >= activeDraggedInputOldDisplayOrder) {
            photo.displayOrder--;
          }

        } else if(activeDraggedInputOldDisplayOrder > dropTargetInputDisplayOrder) {      
          
          if(photo.photoNo === dropTargetInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder + 1;
          } else if(photo.photoNo === activeDraggedInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder;
          } else if(photo.displayOrder > dropTargetInputDisplayOrder && photo.displayOrder <= activeDraggedInputOldDisplayOrder) {
            photo.displayOrder++;
          }
        
        } else if(dropTargetInputDisplayOrder > activeDraggedInputOldDisplayOrder) {
          
          if(photo.photoNo === dropTargetInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder - 1;
          } else if(photo.photoNo === activeDraggedInputNo) {
            photo.displayOrder = dropTargetInputDisplayOrder;
          } else if(photo.displayOrder <= dropTargetInputDisplayOrder && photo.displayOrder > activeDraggedInputOldDisplayOrder) {
            photo.displayOrder--;
          }
        } 
      }
    }

    updatedShootPhotos.sort((a, b) => a.displayOrder - b.displayOrder);
  
    setShootPhotos(updatedShootPhotos);
    setActiveDragInput(null);
  }
  
  const handleAddCustomSelect = (selectedEntry) => {
    const selectedEntryType = selectedEntry === "photographer_name"
      ? "photographer"
      : selectedEntry === "model_name"
      ? "model"
      : "tag"

    // console.log(selectedEntryType)
    // console.log(tagChooserIDs)

    const hasNullPhotographerChooser = photographerChooserIDs.some(chooser => chooser.photographerID === null);

    const hasNullModelChooser = modelChooserIDs.some(chooser => chooser.modelID === null);

    const hasNullTagChooser = tagChooserIDs.some(chooser => chooser.tagID === null);
      
    if(selectedEntryType === "photographer" && !hasNullPhotographerChooser) {

      const maxChooserNo = Math.max(...photographerChooserIDs.map(chooser => chooser.chooserNo));

      const newChooser = { chooserNo: maxChooserNo + 1, photographerID: null, photographerName: null};

      setPhotographerChooserIDs([...photographerChooserIDs, newChooser]);
      
      return;
      
    } else if(selectedEntryType === "model" && !hasNullModelChooser) {

      const maxChooserNo = Math.max(...modelChooserIDs.map(chooser => chooser.chooserNo));

      const newChooser = { chooserNo: maxChooserNo + 1, modelID: null, modelName: null};

      setModelChooserIDs([...modelChooserIDs, newChooser]);

      return;

    } else if(selectedEntryType === "tag" && !hasNullTagChooser) {
      // console.log("no null")

      const maxChooserNo = Math.max(...tagChooserIDs.map(chooser => chooser.chooserNo));

      const newChooser = { chooserNo: maxChooserNo + 1, tagID: null, tagName: null};

      setTagChooserIDs([...tagChooserIDs, newChooser]);

      return;
    }

    return toast.error(`Please select a ${selectedEntryType} before adding a new one`);
  }

  const handleRemoveCustomSelector = (chooser) => {
    let chooserType;

    if(chooser.hasOwnProperty('photographerID')) {
      chooserType = "Photographer"
    } else if(chooser.hasOwnProperty('modelID')) {
      chooserType = "Model"
    } else if(chooser.hasOwnProperty('tagID')) {
      chooserType = "Tag"
    }

    const { chooserNo } = chooser;
    
    if(chooserType === "Photographer") {
      const filteredChoosers = photographerChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);

      setPhotographerChooserIDs(filteredChoosers);

    } else if(chooserType === "Model") {
      const filteredChoosers = modelChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);
      
      setModelChooserIDs(filteredChoosers);
    } else if(chooserType === "Tag") {
      const filteredChoosers = tagChooserIDs.filter(chooser => chooser.chooserNo !== chooserNo);
      
      setTagChooserIDs(filteredChoosers);
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

        const selectedTagIDs = tagChooserIDs
        .filter(chooser => chooser.tagID !== null)
        .map(chooser => chooser.tagID);

        if(selectedTagIDs.length === 0) {
          setIsLoading(false);
          return toast.error("Select at least one tag");
        }

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

        const tag_ids = selectedTagIDs.join(", "); 
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
        formData.append("tag_ids", tag_ids);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(`Update Ad ${shoot_id}`)
  }

  const handleCancel = () => {
    navigate('/home');
  }
  
  // fetch photographers
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
    
    if(isInitialLoad || shouldUpdatePhotographers) {
      setShouldUpdatePhotographers(false);
      fetchPhotographers();
    } 

    setIsLoading(false);

  }, [BASE_URL, shouldUpdatePhotographers])

  // fetch models
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
    
    if(isInitialLoad || shouldUpdateModels) {
      setShouldUpdateModels(false);
      fetchModels();
    }

    setIsLoading(false);

  }, [BASE_URL, shouldUpdateModels])

  // fetch tags
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

    const fetchTags = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tags/all`, { headers });
        
        if(!response.ok) {
          throw new Error(`Failed to fetch tags: ${response.statusText}`);
        }

        const data = await response.json();
        setTags(data.tags);
      } catch (error) {
        console.log(error);
      } 
    };
    
    if(isInitialLoad || shouldUpdateTags) {
      setShouldUpdateTags(false);
      fetchTags();
    }

    setIsLoading(false);
  }, [BASE_URL, shouldUpdateTags])


  // useEffect to call shoots/shoot/:id for data to load editShoot
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
            setRawDate(date)
            const formattedDate = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            setFormattedDate(formattedDate);

            const fetchedShootPhotographers = data.photographers;
            const fetchedShootModels = data.models;
            const fetchedShootTags = data.tags;
            
            const fetchedPhotogIDs = data.photographer_ids;
            const fetchedModelIDs = data.model_ids;
            const fetchedTagIDs = data.tag_ids;

            const fetchedPhotographerChooserIDs = [];
            for(let idx = 0; idx < fetchedPhotogIDs.length; idx++) {
              const chooser = {};
              chooser.chooserNo =idx + 1;
              chooser.photographerID = +fetchedPhotogIDs[idx];
              chooser.photographerName = fetchedShootPhotographers[idx];
              fetchedPhotographerChooserIDs.push(chooser);
            }

            const fetchedModelChooserIDs = [];
            for(let idx = 0; idx < fetchedModelIDs.length; idx++) {
              const chooser = {}
              chooser.chooserNo = idx + 1;
              chooser.modelID = +fetchedModelIDs[idx]
              chooser.modelName = fetchedShootModels[idx]
              fetchedModelChooserIDs.push(chooser);
            }

            const fetchedTagChooserIDs = [];
            for(let idx = 0; idx < fetchedTagIDs.length; idx++) {
              const chooser = {}
              chooser.chooserNo = idx + 1;
              chooser.tagID = +fetchedTagIDs[idx]
              chooser.tagName = fetchedShootTags[idx]
              fetchedTagChooserIDs.push(chooser);
            }

            setPhotographerChooserIDs(fetchedPhotographerChooserIDs);
            setModelChooserIDs(fetchedModelChooserIDs);
            setTagChooserIDs(fetchedTagChooserIDs);
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
  }, [shoot_id]);
  

  // initial load useEffect
  useEffect(() => {
    const isEditing = location.pathname.includes("edit");
    const isAdding = location.pathname.includes("add");

    if(isAdding || isEditing) {
      setShowfloatingButton(false)
    }
    scrollToTop();
    setIsLoading();
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
                  rawDate={rawDate}
                />
            </div>

            <div className="addOrEditShoot__tagChoosers">
              <h3 className='addOrEditShoot__label'>
                Choose At Least One Tag
              </h3>

              <h4 
                className="addOrEditShoot__textButton"
                onClick={() => handleAddCustomSelect("tag_name")}
              >
                Add Tag 
                  <span className='addOrEditShoot__textButton-icon'>
                    <AddIcon 
                      className={"addOrEditShoot__add-icon"}
                      classNameStroke={"addOrEditShoot__add-stroke"}
                    />
                  </span>
              </h4>
            
              {tagChooserIDs.map((chooser) => (
                <div 
                  className="addOrEditShoot__selector addOrEditShoot__selector--photographer"
                  key={chooser.chooserNo}
                >

                  <CustomSelect 
                    chooser={chooser}
                    chooserNo={chooser.chooserNo}
                    chooserName={chooser.tagName}
                    chooserType={"Tag"}
                    chooserIDs={tagChooserIDs}
                    setChooserIDs={setTagChooserIDs}
                    selectOptions={tags}
                    entryNameType={"tag_name"}
                  />

                    <span 
                      className={`addOrEditShoot__selector-removeIcon ${tagChooserIDs.length > 1
                        ? "show" 
                        : ""}`}
                      onClick={tagChooserIDs.length > 1
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
                      key={shootPhoto.photoNo}
                      shootPhoto={shootPhoto}
                      shootPhotos={shootPhotos}
                      setShootPhotos={setShootPhotos}
                      handleImageChange={handleImageChange}

                      handleInputDragStart={handleInputDragStart}
                      handleDropInputTarget={handleDropInputTarget}
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
                    chooser={chooser}
                      chooserNo={chooser.chooserNo}
                      chooserName={chooser.photographerName}
                      chooserType={"Photographer"}
                      chooserIDs={photographerChooserIDs}
                      setChooserIDs={setPhotographerChooserIDs}
                      selectOptions={photographers}
                      entryNameType={"photographer_name"}
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
                      chooserName={chooser.modelName}
                      chooserType={"Model"}
                      chooserIDs={modelChooserIDs}
                      setChooserIDs={setModelChooserIDs}
                      selectOptions={models}
                      entryNameType={"model_name"}
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

              {shoot_id

                ? <div 
                    className="addOrEditShoot__button addOrEditShoot__button--submit" 
                    onClick={(e) => handleUpdate(e)}
                  >
                    Update
                  </div>

                : <div 
                    className="addOrEditShoot__button addOrEditShoot__button--submit" 
                    onClick={(e) => handleSubmit(e)}
                  >
                    Submit
                  </div>
              }

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
