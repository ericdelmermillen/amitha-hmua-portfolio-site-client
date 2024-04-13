import './DeletePhotogOrModelModal.scss';
import AppContext from '../../AppContext';
import { useState, useContext } from 'react';
import { toast } from "react-toastify";

// Define the component
const DeletePhotogOrModelModal = () => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    // modals start
    showDeletePhotogOrModelModal, 
    setShowDeletePhotogOrModelModal,
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,
    // modals end
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    // will need shouldUpdateModels
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  const { photographer_name, model_name, id } = selectedPhotogOrModel;
  const entryName = photographer_name || model_name || 'not set';
  const entryType = selectedPhotogOrModel.photographer_name && 'Photographer' || selectedPhotogOrModel.model_name && 'Model';

  const handleCloseModal = () => {
    setSelectedPhotogOrModel(false);
    setShowDeletePhotogOrModelModal(false)
  }

  const handleDeleteEntry = async () => {
    if(isLoggedIn) {
      setIsLoading(true);

      // console.log(`${BASE_URL}/${entryType.toLowerCase()}s/delete/${id}`)
      
      try {
        const response = await fetch(`${BASE_URL}/${entryType.toLowerCase()}s/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.ok) {

          if(entryType === "Photographer") {
            setShouldUpdatePhotographers(true)
          }

          if(entryType === "model") {
            setShouldUpdateModels(true);
          }

          setShowDeletePhotogOrModelModal(false);
          toast.success(`${entryType} ${entryName} successfully deleted.`); 
          setIsLoading(false);
        } else if(response.status === 409) {
          const {message} = await response.json();
          toast.error(message);
          setShowDeletePhotogOrModelModal(false);
          setIsLoading(false);
        } 
      } catch(error) {
        console.error(`Error deleting ${entryType} ${entryName}: ${error}`);
        toast.error(`Error deleting ${entryType} ${entryName}: ${error}`);
      }
    }
  };
  
  return (
    <>
      <div 
        className="deletePhotogOrModelModal"
        onClick={handleCloseModal}
      >
        <div 
          className="deletePhotogOrModelModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 
            className="deletePhotogOrModelModal__heading"
          >
            Delete {entryType} {entryName} from the database?
          </h3>
          <p 
            className="deletePhotogOrModelModal__explainer"
          >
           You will have to add them back if you want to use them in a new Shoot. 
          </p>

          <div 
            className="deletePhotogOrModelModal__button-container"
          >
            <button
              className="deletePhotogOrModelModal__button deletePhotogOrModelModal__button--add"
              onClick={handleDeleteEntry}>
                Confirm
            </button>
            <button
              className="deletePhotogOrModelModal__button deletePhotogOrModelModal__button--cancel"
              onClick={handleCloseModal}>
                Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )};

export default DeletePhotogOrModelModal;
