import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { toast } from 'react-toastify';
import './ModelChooser.scss';
import add from '../../assets/add.svg';

const ModelChooser = ({ newShootModelIds, setNewShootModelIds, handleAddModelChooser }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoading, 
    setIsLoading 
  } = useContext(AppContext);

  const [ models, setModels ] = useState([]);
  const [ selectedModel, setSelectedModel ] = useState('');
  const [ isOptionSet, setIsOptionSet ] = useState(false)

  const handleModelChange = (event) => {
    const chosenModel = +event.target.value;
    setSelectedModel(chosenModel);
  };
  
  const handleModelBlur = () => {
    setNewShootModelIds([...newShootModelIds, selectedModel]);
    setIsOptionSet(true)
  }
  
  // move to AddShoot
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
  //

  return (
    <div className="modelChooser">
      <div className="modelChooser__inner">
        <select
          className={`modelChooser__select ${isOptionSet ? "userDisabled" : ""}`}
          value={selectedModel}
          tabIndex={isOptionSet ? "-1" : "0"}
          onChange={handleModelChange}
          onBlur={handleModelBlur}
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
              disabled={newShootModelIds.includes(model.id)}
            >
              {model.model_name}
            </option>
          ))}
        </select>
        <img
          className="addModelButton" 
          src={add}
          onClick={handleAddModelChooser}
        />
      </div>
    </div>
  );
};

export default ModelChooser;
