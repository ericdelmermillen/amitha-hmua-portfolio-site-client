import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../AppContext';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker';
import ModelChooser from '../../components/ModelChooser/ModelChooser';
import { scrollToTop } from '../../utils/utils';
import { toast } from 'react-toastify';
import './AddShoot.scss';
import PhotographerChooser from '../../components/PhotographerChooser/PhotographerChooser';

const AddShoot = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const { 
    isLoading,
    setIsLoading,
    isLoggedIn, 
    setIsLoggedIn,
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

  const handleCancel = () => {
    navigate('/home')
  }

  const handleSubmit = async () => {
    try {

    
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

      photographerChooserIDs.forEach(photographerChooser => {
        if(photographerChooser.photographerID !== null) {
          selectedPhotographerIDs.push(photographerChooser.photographerID);
        }
      });
      
      const shoot = {};
      shoot.shoot_date = newShootDate.toISOString().split('T')[0];
      shoot.shoot_title = newShootTitle;
      shoot.shoot_blurb = newShootBlurb;
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
          setIsLoading(true);
          setIsLoggedIn(false);
          navigate('/home');
        return toast.error("Sorry please login again");
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      setIsLoading(true);

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
        navigate('/home')
      }
    
    } catch(error) {
      console.log(error)
      toast.error(error);
      setIsLoading(false);
      // navigate('/home')
    }
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

              <h3 className='addShoot__label'>
                Enter Shoot Date
              </h3>
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

              <h3 className='addShoot__label'>
                Choose At Least One Model
              </h3>
              
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
              <h3 className='addShoot__label'>
                Choose At Least One Photographer
                </h3>

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

            <div className="addShoot__button-container">

              <div 
                className="addShoot__button addShoot__button--cancel" 
                onClick={handleCancel}
                >
                Cancel
              </div>

              <div 
                className="addShoot__button addShoot__button--submit" 
                onClick={handleSubmit}
                >
                Submit
              </div>
            </div>
      
          </div>
        </div>
      </div>
    </>
  );
};

export default AddShoot;
