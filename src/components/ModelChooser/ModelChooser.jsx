import { useState, useContext } from 'react';
import AddIcon from '../../assets/icons/AddIcon';
import AppContext from '../../AppContext';
import MinusIcon from '../../assets/icons/MinusIcon';
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

    if(!chosenModel) {
      return;
    }


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
          <div
            className="modelChooser__button modelChooser__button--add"
            disabled={true}
            onClick={() => handleAddModelChooser(selectedModel)}
          >
            <AddIcon 
              className={"modelChooser__button--add"}
              classNameStroke={"modelChooser__button--add-stroke"}
            />
          </div>
          <div
            className="modelChooser__button modelChooser__button--remove"
            onClick={() => handleRemoveModelChooser(modelChooserIdx)}
          >
            <MinusIcon 
              className= {"modelChooser__button--remove-icon"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelChooser;
