// Import React and other necessary modules
import './AddPhotographerModal.scss';
import AppContext from '../../AppContext';
import { useState, useContext } from 'react';
import { toast } from "react-toastify";

// Define the component
const AddPhotographerModal = () => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showAddPhotographerModal, 
    setShowAddPhotographerModal,
    shouldUpdatePhotographers, setShouldUpdatePhotographers,
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  // State for the photographer name input
  const [ newPhotographerName, setNewPhotographerName ] = useState('');

  // Event handler for changes in the photographer name input
  const handlePhotographerNameChange = (e) => {
    setNewPhotographerName(e.target.value);
  }
  
  // Event handler for closing the modal
  const handleCloseModal = () => {
    setShowAddPhotographerModal(false)
    // setShowDeleteModal(false);
  }

  // Event handler for deleting the shoot
  const handleAddPhotographer = async () => {
    // add validation for valid newPhotographerName
    if(isLoggedIn) {

      if(newPhotographerName.length < 2) {
        return toast.error("Photographer names must be at least 2 characters long");
      }

      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/photographers/add/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            photographer_name: newPhotographerName
          }),
        });

        if(response.ok) {
          toast.success(`Photographer ${newPhotographerName} successfully added.`);
          setShowAddPhotographerModal(false);
          setNewPhotographerName('');
          setShouldUpdatePhotographers(true);
          setIsLoading(false);
        } else if(response.status === 409) {
          setIsLoading(false);
          return toast.error(`Photographer ${newPhotographerName} already exists`)
        } else {
          toast.error(`Failed to add photographer ${newPhotographerName}`);
          console.error(`Failed to add photographer ${newPhotographerName}: ${response.statusText}`);
          setShowAddPhotographerModal(false);
          setNewPhotographerName('');
          setIsLoading(false);
        }
      } catch (error) {
        console.error(`Error adding ${newPhotographerName}: ${error}`);
        toast.error(`Error adding photographer ${newPhotographerName}: ${error}`);
        setIsLoading(false);
      }
    } else {
      toast.error("Sorry please login again");
      setIsLoading(false);
    }
  };
  
  // Render the component
  return (
    <>
      <div 
        className="addPhotographerModal"
        onClick={handleCloseModal}
      >
        <div 
          className="addPhotographerModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="addPhotographerModal__heading">
            Add new photographer
          </h3>

          <input 
            className='addPhotographerModal__input'
            placeholder="Enter photographer's name"
            type="text" 
            value={newPhotographerName}
            onChange={(e) => handlePhotographerNameChange(e)}
          />
          <div 
            className="addPhotographerModal__button-container"
          >
            <button
              className="addPhotographerModal__button addPhotographerModal__button--add"
              onClick={handleAddPhotographer}>
                Confirm
            </button>
            <button
              className="addPhotographerModal__button addPhotographerModal__button--cancel"
              onClick={handleCloseModal}>
                Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// Export the component
export default AddPhotographerModal;
