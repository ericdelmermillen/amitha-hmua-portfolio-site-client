import { useContext } from 'react';
import AppContext from '../../AppContext';
import { toast } from "react-toastify";
import './DeleteShootModal.scss';

const DeleteShootModal = () => {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    shouldUpdateShoots,
    setShouldUpdateShoots,
    selectedShoot, 
    setSelectedShoot,
    showDeleteShootModal, 
    setShowDeleteShootModal
  } = useContext(AppContext);

  const handleCloseModal = () => {
    setShowDeleteShootModal(false);
  }

  const handleDeleteShoot = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`${BASE_URL}/shoots/delete/${selectedShoot}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.ok) {
          setShouldUpdateShoots(true);
          setShowDeleteShootModal(false);
          toast.success(`Shoot ${selectedShoot} successfully deleted.`); 
        } else {
          toast.error(`Failed to delete Shoot ${selectedShoot}`);
          console.error(`Failed to delete Shoot ${selectedShoot}: ${response.statusText}`);
          setShowDeleteShootModal(false);
        }
      } catch (error) {
        console.error(`Error deleting Shoot ${selectedShoot}: ${error}`);
        toast.error(`Error deleting Shoot ${selectedShoot}: ${error}`);
      }
    } else {
      toast.error("Sorry please login again");
    }
  };
  
  return (
    <>
      <div 
        className="deleteShootModal"
        onClick={handleCloseModal}
      >
        <div 
          className="deleteShootModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="deleteShootModal__heading">
            Delete Shoot Number {selectedShoot}?
          </h3>
          <div className="deleteShootModal__button-container">
            <button
              className="deleteShootModal__button deleteShootModal__button--delete"
              onClick={handleDeleteShoot}
            >
              Confirm
            </button>
            <button
              className="deleteShootModal__button deleteShootModal__button--cancel"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </>
  )};

export default DeleteShootModal;