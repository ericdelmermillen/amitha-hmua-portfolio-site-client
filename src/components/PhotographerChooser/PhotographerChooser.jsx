import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import add from '../../assets/add.svg';
import minus from '../../assets/minus.svg';
import './PhotographerChooser.scss';

const PhotographerChooser = ({ 
  photographerChooserIdx,
  handleAddPhotographerChooser,
  handleRemovePhotographerChooser,
  photographers,
  setPhotographers,
  photographerChooserIDs, 
  setPhotographerChooserIDs,
  photographerID
}) => {

  const { 
    isLoading, 
    setIsLoading 
  } = useContext(AppContext);

  const [ selectedPhotographer, setSelectedPhotographer ] = useState(photographerID || '');
  const [ isOptionSet, setIsOptionSet ] = useState(false)

  const handleSetPhotographer = (event) => {
    const chosenPhotographer = +event.target.value;

    for(let photographerChooser of photographerChooserIDs) {
      if(photographerChooser.chooserIdx === photographerChooserIdx) {
        photographerChooser.photographerID = chosenPhotographer
      }
    }

    setSelectedPhotographer(chosenPhotographer);
    setIsOptionSet(true)
  };

  const includesPhotographer = (photographer_id) => {
    return photographerChooserIDs.some(({ photographerID }) => photographerID === photographer_id);
  };

  return (
    <div className="photographerChooser">
      <div className="photographerChooser__inner">
        <select
          className={`photographerChooser__select ${isOptionSet ? "userDisabled" : ""}`}
          value={selectedPhotographer}
          tabIndex={isOptionSet ? "-1" : "0"}
          onChange={handleSetPhotographer}
          onBlur={handleSetPhotographer}
        >
          <option 
            value=""
          >
            Select Photographer
          </option>

          {photographers.map((photographer) => (
            <option 
              key={photographer.id} 
              value={photographer.id}
              disabled={includesPhotographer(photographer.id)}
            >
              {photographer.photographer_name}
            </option>
          ))}
        </select>
        <img
          className="addPhotographerButton" 
          src={add}
          disabled={true} 
          onClick={() => handleAddPhotographerChooser(selectedPhotographer)}
        />
        <img
          className="removePhotographerButton" 
          src={minus}
          onClick={() => handleRemovePhotographerChooser(photographerChooserIdx)}
        />
      </div>
    </div>
  );
};

export default PhotographerChooser;
