import { useContext } from 'react';
import AppContext from '../../AppContext';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/utils.js';
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

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowDeleteShootModal(false);
  };

  const handleDeleteShoot = async () => {
    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    // if(tokenIsExpired) {
    //   return toast.error("Unathorised. Logging you out...");
    // }
    
    if(isLoggedIn) {
      try {
        const response = await fetch(`${BASE_URL}/shoots/delete/${selectedShoot}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        console.log(response)

        if(response.ok) {
          setShouldUpdateShoots(true);
          setShowDeleteShootModal(false);
          toast.success(`Shoot ${selectedShoot} successfully deleted.`); 
        } else if(response.status === 401) {
          setIsLoading(false);
          setIsLoggedIn(false);
          navigate("/home");
          return toast.error("Please login again...");
        } else {
          toast.error(`Failed to delete Shoot ${selectedShoot}.`);
          console.error(`Failed to delete Shoot ${selectedShoot}: ${response.statusText}`);
          setShowDeleteShootModal(false);
        }
      } catch (error) {
        console.error(`Error deleting Shoot ${selectedShoot}: ${error}`);
        toast.error(`Error deleting Shoot ${selectedShoot}. Loggin you out...`);
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