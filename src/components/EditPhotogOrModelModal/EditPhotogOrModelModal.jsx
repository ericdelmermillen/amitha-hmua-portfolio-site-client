import './EditPhotogOrModelModal.scss';
import AppContext from '../../AppContext.jsx';
import { useState, useContext } from 'react';
import { toast } from "react-toastify";

const EditPhotogOrModelModal = () => {

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
    showEditPhotogOrModelModal, 
    setShowEditPhotogOrModelModal,
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  const entryType = showEditPhotogOrModelModal.entryType;

  const id = selectedPhotogOrModel.id;

  const entryName = entryType === "Photographer"
    ? selectedPhotogOrModel.photographer_name
    : selectedPhotogOrModel.model_name;


  const [ newEntryName, setNewEntryName ] = useState('');

  const handleEntryNameChange = (e) => {
    setNewEntryName(e.target.value);
  }
  
  const handleCloseModal = () => {
    setShowEditPhotogOrModelModal(false)
  }

  const handleUpdateEntry = async () => {
    if(isLoggedIn) {

      if(newEntryName.length < 2) {
        return toast.error(`${entryType} names must be at least 2 characters long`);
      }

      const newEntryData = {};

      entryType === 'Photographer'
        ? newEntryData.photographer_name = newEntryName
        : newEntryData.model_name = newEntryName;
      
      console.log(newEntryData)

      console.log(entryType)

      console.log(`${BASE_URL}/${entryType.toLowerCase()}s/edit/${id}`)

      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/${entryType.toLowerCase()}s/edit/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntryData),
        });

        if(response.ok) {
          toast.success(`${entryType} ${newEntryName} successfully added.`);
          setShowEditPhotogOrModelModal({entryType: null});
          setNewEntryName('');

          if(entryType === "Photographer") {
            setShouldUpdatePhotographers(true);
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
        className="editPhotogOrModelModal"
        onClick={handleCloseModal}
      >
        <div 
          className="editPhotogOrModelModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="editPhotogOrModelModal__heading">
            Edit {entryType} {entryName}
          </h3>

          <input 
            className='editPhotogOrModelModal__input'
            placeholder={`Enter new name`}
            type="text" 
            value={newEntryName}
            onChange={(e) => handleEntryNameChange(e)}
          />
          <div 
            className="editPhotogOrModelModal__button-container"
          >
            <button
              className="editPhotogOrModelModal__button editPhotogOrModelModal__button--add"
              onClick={handleUpdateEntry}>
                Update
            </button>
            <button
              className="editPhotogOrModelModal__button editPhotogOrModelModal__button--cancel"
              onClick={handleCloseModal}>
                Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )};

export default EditPhotogOrModelModal;
