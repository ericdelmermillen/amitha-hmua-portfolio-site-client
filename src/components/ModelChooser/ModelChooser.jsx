import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import './ModelChooser.scss';
import add from '../../assets/add.svg';
import minus from '../../assets/minus.svg';

const ModelChooser = ({ 
  modelChooserIdx,
  setModelChooserIdx,
  handleAddModelChooser,
  handleRemoveModelChooser,
  models,
  setModels,
  // for setting modelChooserCountID objects
  modelChooserCountIDs, 
  setModelChooserCountIDs
}) => {

  const { 
    isLoading, 
    setIsLoading 
  } = useContext(AppContext);

  const [ selectedModel, setSelectedModel ] = useState('');
  const [ isOptionSet, setIsOptionSet ] = useState(false)

  const handleSetModel = (event) => {
    const chosenModel = +event.target.value;

      const updatedModelChooserCountIDs = [...modelChooserCountIDs]

      for(let modelChooser of modelChooserCountIDs) {
        if(modelChooser.chooserIdx === modelChooserIdx) {
          modelChooser.modelID = chosenModel
        }
      }

    setSelectedModel(chosenModel);
    setIsOptionSet(true)
  };

  console.log(modelChooserCountIDs)

  return (
    <div className="modelChooser">
      <div className="modelChooser__inner">
        <select
          className={`modelChooser__select ${isOptionSet ? "userDisabled" : ""}`}
          value={selectedModel}
          tabIndex={isOptionSet ? "-1" : "0"}
          onChange={handleSetModel}
          onBlur={handleSetModel}
        >
          <option 
            value=""
          >
            Select Model
          </option>

          {models.map((model) => (
            <option 
              key={model.id} 
              value={model.id}
              // need to adjust this so that modelIDs in the modelChooserCountIDs are disabled for new pickers
              // disabled={newShootModelIds.includes(model.id)}
            >
              {model.model_name}
            </option>
          ))}
        </select>
        <img
          className="addModelButton" 
          src={add}
          onClick={() => handleAddModelChooser(selectedModel)}
        />
        <img
          className="removeModelButton" 
          src={minus}
          onClick={handleRemoveModelChooser}
        />
      </div>
    </div>
  );
};

export default ModelChooser;
