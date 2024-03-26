import './DeleteShootModal.scss';
import AppContext from '../../AppContext';
import { useContext } from 'react';

const DeleteShootModal = ({ handleDeleteShoot }) => {
  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    showDeleteModal, 
    setShowDeleteModal,
    selectedShoot, 
    setSelectedShoot
  } = useContext(AppContext);

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setSelectedShoot(null);
  }
  
  return (
    <>
      <div 
        className="deleteShootModal"
        onClick={handleCloseModal}
      >
        <div className="deleteShootModal__modal">
          <h3 className="deleteShootModal__heading">
            Delete Shoot Number {selectedShoot}?</h3>
            <div className="deleteShootModal__button-container">

              <button
                className="deleteShootModal__button deleteShootModal__button--cancel"
                onClick={handleCloseModal}>
                  Cancel
              </button>
              <button
                className="deleteShootModal__button deleteShootModal__button--delete"
                onClick={handleDeleteShoot}>
                  Confirm
              </button>
            </div>

        </div>
      </div>
    </>
  )};

export default DeleteShootModal;