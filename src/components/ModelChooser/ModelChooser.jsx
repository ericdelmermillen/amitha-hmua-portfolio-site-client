import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import add from '../../assets/add.svg';
import minus from '../../assets/minus.svg';
import './ModelChooser.scss';

const ModelChooser = ({ 
  modelChooserIdx,
  handleAddModelChooser,
  handleRemoveModelChooser,
  models,
  setModels,
  modelChooserIDs, 
  setModelChooserIDs,
  modelID
}) => {

  const { 
    isLoading, 
    setIsLoading 
  } = useContext(AppContext);

  const [ selectedModel, setSelectedModel ] = useState(modelID || '');
  // modelChooser.modelID = chosenModel || modelID
  const [ isOptionSet, setIsOptionSet ] = useState(false)

  const handleSetModel = (event) => {
    const chosenModel = +event.target.value;

    for(let modelChooser of modelChooserIDs) {
      if(modelChooser.chooserIdx === modelChooserIdx) {
        modelChooser.modelID = chosenModel
      }
    }

    setSelectedModel(chosenModel);
    setIsOptionSet(true)
  };

  const includesModel = (model_id) => {
    return modelChooserIDs.some(({ modelID }) => modelID === model_id);
  };

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
              disabled={includesModel(model.id)}
            >
              {model.model_name}
            </option>
          ))}
        </select>
        <div className="modelChooser__button-container">
          <img
            className="modelChooser__button modelChooser__button--add"
            src={add}
            disabled={true}
            onClick={() => handleAddModelChooser(selectedModel)}
          />
          <img
            className="modelChooser__button modelChooser__button--remove"
            src={minus}
            onClick={() => handleRemoveModelChooser(modelChooserIdx)}
          />
        </div>
      </div>
    </div>
  );
};

export default ModelChooser;
