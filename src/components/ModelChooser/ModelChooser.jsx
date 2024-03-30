import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import './ModelChooser.scss';
import add from '../../assets/add.svg';
import minus from '../../assets/minus.svg';

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
    console.log(`chosenModel: ${chosenModel}`)

      const updatedModelChooserCountIDs = [...modelChooserIDs]

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

  const modelIsNotNull = (chooserIdx) => {
    const targetModelChooser = modelChooserIDs.find(modelChooser => modelChooser.chooserIdx === chooserIdx);
    return !!targetModelChooser && targetModelChooser.modelID !== null;
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
        <img
          className="addModelButton" 
          src={add}
          disabled={true} 
          onClick={modelIsNotNull(modelChooserIdx) 
            ? () => handleAddModelChooser(selectedModel)
            : null
          }
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
