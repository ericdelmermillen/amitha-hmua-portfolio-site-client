import { useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/utils.js';
import './DeleteOrEditModal.scss';

const DeleteShootModal = () => {
  
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    isLoading,
    setIsLoading,
    setShouldUpdateShoots,
    selectedShoot, 
    showDeleteOrEditModal,
    setShowDeleteOrEditModal,

    deleteOrEditClickAction, 
    setDeleteOrEditClickAction,
    handleNavigateHome,
    selectedTag
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleCloseModal = () => {
    setShowDeleteOrEditModal(false);
    setDeleteOrEditClickAction('');
  };

  const handleDeleteShoot = async () => {
    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return toast.error("Unathorised. Logging you out...");
    }
    
    if(isLoggedIn) {
      try {
        const response = await fetch(`${BASE_URL}/shoots/delete/${selectedShoot}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if(response.ok) {
          setShouldUpdateShoots(true);
          
          if(selectedTag) {
            handleNavigateHome(false, true, selectedTag);
          } else if(!selectedTag) {
            handleNavigateHome(true, false, null);
          }
          
          toast.success(`Shoot ${selectedShoot} successfully deleted.`); 
        } else if(response.status === 401) {
          setIsLoading(false);
          setIsLoggedIn(false);
          handleNavigateHome(true, false, null);
          return toast.error("Please login again...");
        } else {
          toast.error(`Failed to delete Shoot ${selectedShoot}.`);
          console.error(`Failed to delete Shoot ${selectedShoot}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error deleting Shoot ${selectedShoot}: ${error}`);
        handleNavigateHome(true, false, null);
        toast.error(`Error deleting Shoot ${selectedShoot}. Loggin you out...`);
      }
    } else {
      toast.error("Sorry please login again");
    }
    setDeleteOrEditClickAction('');
  };

  const handleNavigateToEditShoot = () => {
    setShowDeleteOrEditModal(false);
    setDeleteOrEditClickAction('');
    setIsLoading(true);
    return navigate(`/shoots/edit/${selectedShoot}`);
  }
  
  const handleNavigateToEditBio = () => {
    setShowDeleteOrEditModal(false);
    setDeleteOrEditClickAction('');
    setIsLoading(true);
    // return navigate(`/shoots/edit/${selectedShoot}`);
    return navigate("/bio/edit");
  }
  
  return (
    <>
      <div 
        className="deleteOrEditShootModal"
        onClick={handleCloseModal}
      >
        <div 
          className="deleteOrEditShootModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="deleteOrEditShootModal__heading">
            {deleteOrEditClickAction === "Edit Bio" 
              ? "Edit Your Bio Page?"
              : (`${deleteOrEditClickAction} Shoot Number ${selectedShoot}?`)
            }
          </h3>
          <div className="deleteOrEditShootModal__button-container">
            <button
              className="deleteOrEditShootModal__button deleteOrEditShootModal__button--delete"
              onClick={deleteOrEditClickAction === "Delete"
                ? handleDeleteShoot
                : deleteOrEditClickAction === "Edit"
                ? handleNavigateToEditShoot
                : handleNavigateToEditBio
              }
            >
              {deleteOrEditClickAction === "Delete"
                ? "Confirm"
                : deleteOrEditClickAction === "Edit"
                ? "Edit Shoot"
                : "Edit Bio"
              }
            </button>
            <button
              className="deleteOrEditShootModal__button deleteOrEditShootModal__button--cancel"
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