import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { scrollToTop } from '../../utils/utils';
import './AddShoot.scss';
import { toast } from 'react-toastify';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker';
import ModelChooser from '../../components/ModelChooser/ModelChooser';

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
  const [ modelChooserIdx, setModelChooserIdx ] = useState(1);
  const [ modelChooserCountIDs, setModelChooserCountIDs ] = useState([{ chooserIdx: modelChooserIdx, modelID: null}]);

  const [ newShootPhotographerIds, setNewShootPhotographerIds ] = useState([]);
  const [ newShootPhotoURLS, setNewShootPhotoURLS ] = useState([]);

  const handleTitleChange = (event) => {
    setNewShootTitle(event.target.value);
  };

  const handleBlurbChange = (event) => {
    setNewShootBlurb(event.target.value);
  };

  const handleLogClick = () => {
    const shoot = {};
    shoot.date = newShootDate.toISOString().split('T')[0];
    shoot.shoot_title = newShootTitle;
    shoot.shoot_blurb = newShootBlurb;
    // adjust this to get the model ids from the modelChooserCountIDS array
    // shoot.model_ids = newShootModelIds;

    console.log(shoot);
    console.log(modelChooserIdx)
  };

  const handleAddModelChooser = (selectedModel) => {
    setModelChooserIdx(modelChooserIdx + 1)
    setModelChooserCountIDs([...modelChooserCountIDs]);
    console.log(modelChooserCountIDs)
    console.log(selectedModel)
  };
  
  
  const handleRemoveModelChooser = () => {
    if(modelChooserCountIDs.length > 1) {
      console.log("remove")
      // const filteredChoosers = modelChooserCountIDs.filter()
      setModelChooserCountIDs([]);
    }

  };

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

            {modelChooserCountIDs.map((chooser) => (
              <ModelChooser
                key={modelChooserIdx}
                modelChooserIdx={modelChooserIdx}
                setModelChooserIdx={setModelChooserIdx}
                models={models}
                setModels={setModels}
                handleAddModelChooser={handleAddModelChooser}
                handleRemoveModelChooser={handleRemoveModelChooser}
                modelChooserCountIDs={modelChooserCountIDs}
                setModelChooserCountIDs={setModelChooserCountIDs}
              />
            ))}

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
