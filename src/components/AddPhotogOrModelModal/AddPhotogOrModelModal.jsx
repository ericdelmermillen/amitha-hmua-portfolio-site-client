import './AddPhotogOrModelModal.scss';
import AppContext from '../../AppContext';
import { useState, useContext } from 'react';
import { toast } from "react-toastify";

// Define the component
const AddPhotogOrModelModal = () => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showAddPhotogOrModelModal, 
    setShowAddPhotogOrModelModal,
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  const entryType = showAddPhotogOrModelModal.entryType;

  const [ newEntryName, setNewEntryName ] = useState('');

  const handleEntryNameChange = (e) => {
    setNewEntryName(e.target.value);
  }
  
  const handleCloseModal = () => {
    setShowAddPhotogOrModelModal({entryType: null});
  }

  const handleAddNewEntry = async () => {
    if(isLoggedIn) {

      if(newEntryName.length < 2) {
        return toast.error(`${entryType} names must be at least 2 characters long`);
      }

      const newEntryData = entryType === 'Photographer'
        ? {photographer_name: newEntryName}
        : {model_name: newEntryName}

      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/${entryType.toLowerCase()}s/add/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntryData),
        });

        if(response.ok) {
          toast.success(`${entryType} ${newEntryName} successfully added.`);
          setShowAddPhotogOrModelModal(false);
          setNewEntryName('');

          if(entryType === "Photographer") {
            setShouldUpdatePhotographers(true);
            console.log("from should photog");
          } 
          
          if(entryType === "Model") {
            setShouldUpdateModels(true);
            console.log("from should model");
          } 

          setIsLoading(false);
        } else if(response.status === 409) {
          setIsLoading(false);
          return toast.error(`${entryType} ${newEntryName} already exists`)
        } else {
          toast.error(`Failed to add ${entryType} ${newEntryName}`);
          console.error(`Failed to add ${entryType} ${newEntryName}: ${response.statusText}`);
          setShowAddPhotogOrModelModal(false);
          setNewEntryName('');
          setIsLoading(false);
        }
      } catch(error) {
        console.error(`Error adding ${newEntryName}: ${error}`);
        toast.error(`Error adding ${entryType} ${newEntryName}: ${error}`);
        setIsLoading(false);
      }
    } else {
      toast.error("Sorry please login again");
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <div 
        className="addPhotogOrModelModal"
        onClick={handleCloseModal}
      >
        <div 
          className="addPhotogOrModelModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="addPhotogOrModelModal__heading">
            Add new {showAddPhotogOrModelModal.entryType}
          </h3>

          <input 
            className='addPhotogOrModelModal__input'
            placeholder={`Enter ${showAddPhotogOrModelModal.entryType}'s name`}
            type="text" 
            value={newEntryName}
            onChange={(e) => handleEntryNameChange(e)}
          />
          <div 
            className="addPhotogOrModelModal__button-container"
          >
            <button
              className="addPhotogOrModelModal__button addPhotogOrModelModal__button--add"
              onClick={handleAddNewEntry}>
                Confirm
            </button>
            <button
              className="addPhotogOrModelModal__button addPhotogOrModelModal__button--cancel"
              onClick={handleCloseModal}>
                Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPhotogOrModelModal;
