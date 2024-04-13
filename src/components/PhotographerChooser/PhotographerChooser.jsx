import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import AddIcon from '../../assets/icons/AddIcon';
import MinusIcon from '../../assets/icons/MinusIcon';
import './PhotographerChooser.scss';

const PhotographerChooser = ({ 
  photographerChooserIdx,
  handleAddPhotographerChooser,
  handleRemovePhotographerChooser,
  photographers,
  setPhotographers,
  photographerChooserIDs, 
  setPhotographerChooserIDs,
  photographerID,
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

  // console.log(photographers)

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
