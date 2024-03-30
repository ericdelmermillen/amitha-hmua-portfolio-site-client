import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { scrollToTop } from '../../utils/utils';
import './AddShoot.scss';
import NewShootdatePicker from '../../components/NewShootDatePicker/NewShootDatePicker';
import ModelChooser from '../../components/ModelChooser/ModelChooser';

const AddShoot = () => {
  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);

  const [newShootTitle, setNewShootTitle] = useState("");
  const [newShootBlurb, setNewShootBlurb] = useState("");
  const [newShootDate, setNewShootDate] = useState(new Date());
  
  const [newShootModelIds, setNewShootModelIds] = useState([]);
  const [modelChooserCount, setModelChooserCount] = useState(["model1"]);

  const [newShootPhotographerIds, setNewShootPhotographerIds] = useState([]);
  const [newShootPhotoURLS, setNewShootPhotoURLS] = useState([]);

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
    shoot.model_ids = newShootModelIds;

    console.log(shoot);
  };

  useEffect(() => {
    scrollToTop();
    setTimeout(() => {
      setIsLoading();
    }, 250);
  }, []);

  const handleAddModelChooser = () => {
    setModelChooserCount([...modelChooserCount]);
  };

  const handleRemoveModelChooser = () => {
    if(modelChooserCount > 1) {
      setModelChooserCount(modelChooserCount - 1);
    }
  };

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

            {modelChooserCount.map((_, index) => (
              <ModelChooser
                key={index}
                newShootModelIds={newShootModelIds}
                setNewShootModelIds={setNewShootModelIds}
                handleAddModelChooser={handleAddModelChooser}
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
