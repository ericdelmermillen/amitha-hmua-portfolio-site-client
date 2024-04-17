import { useState, useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import AddIcon from '../../assets/icons/AddIcon.jsx';
import MinusIcon from '../../assets/icons/MinusIcon.jsx';
import './PhotographerChooser.scss';


// each option for chooser needs to have a delete/x icon and an edit icon
// chooser needs to accept an entryType prop
// chooser needs to accept an editEntry function which uses the id of the option, the name value and the entryType to set the showEditPhotogOrModelModal's entryType and the id and entryName to set the selectedPhotogOrModel state
// chooser needs to accept a deleteEntry function which uses the id of the option, the name value and the entryType to set the showEditPhotogOrModelModal's entryType and the id and entryName to set the selectedPhotogOrModel state

const PhotographerChooser = ({ 
  photographerChooserIdx,
  handleAddPhotographerChooser,
  handleRemovePhotographerChooser,
  photographers,
  setPhotographers,
  photographerChooserIDs, 
  setPhotographerChooserIDs,
  photographerID,
  // for making useEffect fire to update options
  shouldUpdatePhotographers, 
  setShouldUpdatePhotographers,
  shouldUpdateModels, 
  setShouldUpdateModels,
}) => {

  const { 
    isLoading, 
    setIsLoading 
  } = useContext(AppContext);

  const [ selectedPhotographer, setSelectedPhotographer ] = useState(photographerID || '');
  const [ isOptionSet, setIsOptionSet ] = useState(false);

  const handleSetPhotographer = (event) => {
    const chosenPhotographer = +event.target.value;

    if(!chosenPhotographer) {}

    // console.log(chosenPhotographer)

    for(let photographerChooser of photographerChooserIDs) {
      if(photographerChooser.chooserIdx === photographerChooserIdx) {
        photographerChooser.photographerID = chosenPhotographer
      }
    }

    setSelectedPhotographer(chosenPhotographer);
    setIsOptionSet(true);
  };

  const includesPhotographer = (photographer_id) => {
    return photographerChooserIDs.some(({ photographerID }) => photographerID === photographer_id);
  };

  return (
    <div className="photographerChooser">
      <div className="photographerChooser__inner">
        <select
          className={`photographerChooser__select ${isOptionSet 
            ? "userDisabled" 
            : ""}`}
          value={selectedPhotographer}
          tabIndex={isOptionSet ? "-1" : "0"}
          onChange={handleSetPhotographer}
          onBlur={handleSetPhotographer}
        >
          <option 
            value=""
            className='photographerChooser__option'
          >
            Select Photographer
          </option>

          {photographers.map((photographer) => (
            <option 
              className="photographerChooser__option"
              key={photographer.id} 
              value={photographer.id}
              disabled={includesPhotographer(photographer.id)}
            >
              {photographer.photographer_name}
            </option>
          ))}
        </select>
        <div className="photographerChooser__button-container">

          <div
            className="photographerChooser__button photographerChooser__button--add" 
            disabled={true} 
            onClick={() => handleAddPhotographerChooser(selectedPhotographer)}
          >
            <AddIcon 
              className={"photographerChooser__button--add"}
              classNameStroke={"photographerChooser__button--add-stroke"}
            />
          </div>
          <div
            className="photographerChooser__button photographerChooser__button--remove" 
            onClick={() => handleRemovePhotographerChooser(photographerChooserIdx)}
          >
            <MinusIcon 
              className= {"photographerChooser__button--remove-icon"}
            />
          </div>
        </div>
      </div>
    </div>
  )};

export default PhotographerChooser;
