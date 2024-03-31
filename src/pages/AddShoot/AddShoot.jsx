import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker';
import ModelChooser from '../../components/ModelChooser/ModelChooser';
import { scrollToTop } from '../../utils/utils';
import { toast } from 'react-toastify';
import './AddShoot.scss';
import PhotographerChooser from '../../components/PhotographerChooser/PhotographerChooser';

const AddShoot = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);

  const [ newShootTitle, setNewShootTitle ] = useState("");
  const [ newShootBlurb, setNewShootBlurb ] = useState("");
  const [ newShootDate, setNewShootDate ] = useState(new Date());
  
  // models
  const [ models, setModels ] = useState([]);
  const [ modelChooserIDs, setModelChooserIDs ] = useState([{ chooserIdx: 1, modelID: null}]);
  
  // photographers
  const [ photographers, setPhotographers ] = useState([]);
  const [ photographerChooserIDs, setPhotographerChooserIDs ] = useState([{ chooserIdx: 1, photographerID: null}]);


  const handleTitleChange = (event) => {
    setNewShootTitle(event.target.value);
  };

  const handleBlurbChange = (event) => {
    setNewShootBlurb(event.target.value);
  };

  const handleLogClick = () => {
    // need validation for:
    // --title
    // --blurb
    // --
    
    const selectedModelIDs = [];

    modelChooserIDs.forEach(modelChooser => {
      if(modelChooser.modelID !== null) {
        selectedModelIDs.push(modelChooser.modelID);
      }
    });

    const selectedPhotographerIDs = [];

    // selectedPhotographerIDs.forEach(photographerChooser => {
    //   if(photographerChooser.photographerID !== null) {
    //     selectedPhotographerIDs.push(photographerChooser.photographerID);
    //   }
    // });

    photographerChooserIDs.forEach(photographerChooser => {
      if (photographerChooser.photographerID !== null) {
        selectedPhotographerIDs.push(photographerChooser.photographerID);
      }
    });
    
    
    console.log(selectedPhotographerIDs)
    
    const shoot = {};
    shoot.date = newShootDate.toISOString().split('T')[0];
    shoot.shoot_title = newShootTitle;
    shoot.shoot_blurb = newShootBlurb;
    shoot.model_ids = selectedModelIDs;
    shoot.photographer_ids = selectedPhotographerIDs;

    console.log(shoot);
  };

  // model chooser handlers
  const handleAddModelChooser = (selectedModel) => {

    if(!selectedModel) {
      return toast.error('Select a model from the model chooser before adding another.')
    }
    
    const maxChooserIdx = Math.max(...modelChooserIDs.map(chooser => chooser.chooserIdx));

    const newChooser = { chooserIdx: maxChooserIdx + 1, modelID: null}
    setModelChooserIDs([...modelChooserIDs, newChooser]);
  };
  
  const handleRemoveModelChooser = (modelChooserIdx) => {
    if(modelChooserIDs.length > 1) {
      const filteredChoosers = modelChooserIDs.filter(chooser => chooser.chooserIdx !== modelChooserIdx)

      setModelChooserIDs(filteredChoosers);
    } else {
      toast.error("Can't remove this. All shoots need at least one model. ")
    }
  };


  // photographer chooser handlers
  const handleAddPhotographerChooser = (selectedPhotographer) => {

    if(!selectedPhotographer) {
      return toast.error('Select a photographer from the photographer chooser before adding another.')
    }
    
    const maxChooserIdx = Math.max(...photographerChooserIDs.map(chooser => chooser.chooserIdx));

    const newChooser = { chooserIdx: maxChooserIdx + 1, photographerID: null}
    setPhotographerChooserIDs([...photographerChooserIDs, newChooser]);
  };
  
  const handleRemovePhotographerChooser = (photographerChooserIdx) => {
    if(photographerChooserIDs.length > 1) {
      const filteredChoosers = photographerChooserIDs.filter(chooser => chooser.chooserIdx !== photographerChooserIdx)

      setPhotographerChooserIDs(filteredChoosers);
    } else {
      toast.error("Can't remove this. All shoots need at least one photographer. ")
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

    fetchPhotographers();
  }, [BASE_URL, setIsLoading]);


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
          <h1 className="addShoot__h1">Add A New Shoot</h1>

          <div className="addShoot__form">
            <div className="addShoot__date-container">
              <NewShootdatePicker
                newShootDate={newShootDate}
                setNewShootDate={setNewShootDate}
              />
            </div>

            <div className="addShoot__title-container">
              <label className="addShoot__label" htmlFor="addShootTitle">
                Title:
              </label>
              <input
                className="addShoot__title-input"
                type="text"
                id="addShootTitle"
                placeholder="Shoot Title"
                value={newShootTitle}
                onChange={handleTitleChange}
              />
            </div>

            <div className="addShoot__blurb-container">
              <label className="addShoot__label" htmlFor="newShootBlurb">
                Blurb:
              </label>
              <textarea
                className="addShoot__blurb-input"
                id="newShootBlurb"
                placeholder="Shoot Description"
                value={newShootBlurb}
                onChange={handleBlurbChange}
              ></textarea>
            </div>

            <div 
              className="addShoot__modelChoosers"
            >

              <h3 >Choose At Least One Model</h3>
              
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
          
                
            <div 
              className="addShoot__photographerChoosers"
            >
              <h3 >Choose At Least One Photographer</h3>

              {photographerChooserIDs.map((chooser) => (
                <PhotographerChooser
                  key={chooser.chooserIdx}
                  photographerChooserIdx={chooser.chooserIdx}
                  photographers={photographers}
                  setPhotographers={setPhotographers}
                  handleAddPhotographerChooser={handleAddPhotographerChooser}
                  handleRemovePhotographerChooser={handleRemovePhotographerChooser}
                  photographerChooserIDs={photographerChooserIDs}
                  setPhotographerChooserIDs={setPhotographerChooserIDs}
                  photographerID={chooser.photographerID}
                />
              ))}
            </div>

            <div className="button" onClick={handleLogClick}>
              Submit
            </div>
            
            <div className="button" onClick={handleRemoveModelChooser}>
              Remove Model Chooser
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddShoot;
