import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../AppContext.jsx';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker.jsx';
// make this customer chooser component that can take either models or photographers --
import ModelChooser from '../../components/ModelChooser/ModelChooser.jsx';
import PhotographerChooser from '../../components/PhotographerChooser/PhotographerChooser.jsx';
// --
import { scrollToTop } from '../../utils/utils.js';
import { toast } from 'react-toastify';
import './AddShoot.scss';
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx';


// each option for chooser needs to have a delete/x icon and an edit icon
// chooser needs to accept an entryType prop
// chooser needs to accept an editEntry function which uses the id of the option, the name value and the entryType to set the showEditPhotogOrModelModal's entryType and the id and entryName to set the selectedPhotogOrModel state
// chooser needs to accept a deleteEntry function which uses the id of the option, the name value and the entryType to set the showEditPhotogOrModelModal's entryType and the id and entryName to set the selectedPhotogOrModel state

const AddShoot = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { 
    isLoading,
    setIsLoading,
    isLoggedIn, 
    setIsLoggedIn,
    showPhotogOrModelModal, 
    setShowPhotogOrModelModal,
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    shouldUpdatePhotographers,
    setShouldUpdatePhotographers
  } = useContext(AppContext);

  const [ newShootDate, setNewShootDate ] = useState(new Date());
  
  // models
  const [ models, setModels ] = useState([]);
  const [ modelChooserIDs, setModelChooserIDs ] = useState([{ chooserIdx: 1, modelID: null}]);
  
  // photographers
  const [ photographers, setPhotographers ] = useState([]);
  // const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([{ chooserIdx: 1, photographerID: null }]);
  const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([
    { chooserNo: 1, photographerID: null },
    { chooserNo: 2, photographerID: null },
  ]);

  const handleShowAddPhotogOrModelModal = (modalType, entryType) => {
    if(entryType === "photographer_name") {
      setSelectedPhotogOrModel({id: null, photographer_name: null});
    } else if(entryType === "model_name") {
      setSelectedPhotogOrModel({id: null, model_name: null});
    }
    setShowPhotogOrModelModal({modalType: modalType});
    console.log("handle")
    console.log(showPhotogOrModelModal)
  }

  const handleCancel = () => {
    navigate('/home');
  }

  const handleSubmit = async () => {
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
      shoot.photo_urls = [
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601727660-BDMJVSOP3C6JUCVRUOQA/IMG_8389.JPG?format=1000w",
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601764606-ATC169LN5RT0QP8C424N/IMG_8280.JPG?format=1000w",
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627601806737-L9CI06R5M8ELWDASOC0W/IMG_8281.JPG?format=1000w",
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627602367230-LB8ZNUQ5EMF6P9J4WCKW/IMG_8390.JPG?format=1000w",
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627602409500-KSPOFX7TCQ3PTM5V3SWJ/IMG_8282.JPG?format=1000w",
        "https://images.squarespace-cdn.com/content/v1/5c2b8497620b859e3110e2e9/1627602423146-1HOO5NJ6RHHOYXQC4JAY/IMG_8283.jpg?format=1000w"
      ]

      const token = localStorage.getItem('token');

      if(!token) {
        navigate('/home');
        return toast.error("Sorry please login again");
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

       // Make POST request
      const response = await fetch(`${BASE_URL}/shoots/add`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(shoot)
      });

      // Check if response is ok
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
  };

  // model chooser handlers
  const handleAddModelChooser = (selectedModel) => {

    if(!selectedModel) {
      return toast.error('Select a model from the model chooser before adding another.');
    }
    
    const maxChooserIdx = Math.max(...modelChooserIDs.map(chooser => chooser.chooserIdx));

    const newChooser = { chooserIdx: maxChooserIdx + 1, modelID: null};
    setModelChooserIDs([...modelChooserIDs, newChooser]);
  };
  
  const handleRemoveModelChooser = (modelChooserIdx) => {
    if(modelChooserIDs.length > 1) {
      const filteredChoosers = modelChooserIDs.filter(chooser => chooser.chooserIdx !== modelChooserIdx);

      setModelChooserIDs(filteredChoosers);
    } else {
      toast.error("Can't remove this. All shoots need at least one model. ");
    }
  };

  // photographer chooser handlers
  const handleAddPhotographerChooser = (selectedPhotographer) => {

    if(!selectedPhotographer) {
      return toast.error('Select a photographer from the photographer chooser before adding another.');
    }
    
    const maxChooserIdx = Math.max(...photographerChooserIDs.map(chooser => chooser.chooserIdx));

    const newChooser = { chooserIdx: maxChooserIdx + 1, photographerID: null};
    setPhotographerChooserIDs([...photographerChooserIDs, newChooser]);
  };
  
  const handleRemovePhotographerChooser = (photographerChooserIdx) => {
    if(photographerChooserIDs.length > 1) {
      const filteredChoosers = photographerChooserIDs.filter(chooser => chooser.chooserIdx !== photographerChooserIdx);

      setPhotographerChooserIDs(filteredChoosers);
    } else {
      toast.error("Can't remove this. All shoots need at least one photographer. ");
    }
  };
  

  // fetch models
  useEffect(() => {
    setIsLoading(true);

    const fetchModels = async () => {
      const token = localStorage.getItem('token');
      const headers = {};

      if(token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

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
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      }
    };

    fetchModels();
  }, [BASE_URL, setIsLoading]);
  
  
  // fetch photographers
  useEffect(() => {
    setIsLoading(true);

    const fetchPhotographers = async () => {
      const token = localStorage.getItem('token');
      const headers = {};

      if(token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

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
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      }
    };
    setShouldUpdatePhotographers(false);

    fetchPhotographers();
  }, [BASE_URL, setIsLoading, shouldUpdatePhotographers]);


  // initial load useEffect
  useEffect(() => {
    scrollToTop();
    setTimeout(() => {
      setIsLoading();
    }, 250);
  }, []);
  
  return (
    <>
      <div className="addShoot">
        <div className="addShoot__inner">
          <h1 className="addShoot__heading">
            Add A New Shoot
          </h1>

          <div className="addShoot__form">
            <div className="addShoot__date-container">

              <label className='addShoot__label'>
                Enter Shoot Date
              </label>
                <NewShootdatePicker
                  newShootDate={newShootDate}
                  setNewShootDate={setNewShootDate}
                  className={"addShoot__calendarIcon"}
                />
            </div>

            <div  
              className="addShoot__photographersAndModels-container">

              <div 
                className="addShoot__photographerChoosers"
              >
                <h3 className='addShoot__label'>
                  Choose At Least One Photographer
                </h3>

                <h4 
                  className="addShoot__textButton"
                  onClick={() => handleShowAddPhotogOrModelModal("Add", "photographer_name")}
                >
                  Add New Photographer
                </h4>

                {photographerChooserIDs.map((chooser, idx) => (
                    // <PhotographerChooser
                    //   key={chooser.chooserIdx}
                    //   photographerChooserIdx={chooser.chooserIdx}
                    //   photographers={photographers}
                    //   setPhotographers={setPhotographers}
                    //   handleAddPhotographerChooser={handleAddPhotographerChooser}
                    //   handleRemovePhotographerChooser={handleRemovePhotographerChooser}
                    //   photographerChooserIDs={photographerChooserIDs}
                    //   setPhotographerChooserIDs={setPhotographerChooserIDs}
                    //   photographerID={chooser.photographerID}
                    // />

                  <CustomSelect 
                    key={chooser.chooserNo}
                    chooserNo={chooser.chooserNo}
                    chooserType={"Photographer"}
                    chooserIDs={photographerChooserIDs}
                    setChooserIDs={setPhotographerChooserIDs}
                    modalType={"Edit"}

                    // for number of options --
                    selectOptions={photographers}
                    setSelectOptions={setPhotographers}
                    // for number of choosers --
                    handleAddPhotographerChooser={handleAddPhotographerChooser}

                    handleRemovePhotographerChooser={handleRemovePhotographerChooser}
                    // --


                    selectEntry={photographerChooserIDs}
                    setSelectedOption={setPhotographerChooserIDs}

                    photographerIDchooserId={chooser.photographerID}
                  />
                  
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
                  onClick={() => handleShowAddPhotogOrModelModal("Add", "model_name")}
                >
                  Add New Model
                </h4>
                
                {modelChooserIDs.map((chooser) => (
                  <ModelChooser
                    key={chooser.chooserIdx}
                    modelChooserIdx={chooser.chooserIdx}
                    models={models}
                    setModels={setModels}
                    handleAddModelChooser={handleAddModelChooser}
                    handleRemoveModelChooser={handleRemoveModelChooser}
                    modelChooserIDs={modelChooserIDs}
                    setModelChooserIDs={setModelChooserIDs}
                    modelID={chooser.modelID}
                  />
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
