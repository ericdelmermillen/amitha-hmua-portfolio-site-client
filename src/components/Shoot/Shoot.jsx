import AppContext from '../../AppContext';
import { useContext } from 'react';
import Delete from '../../assets/icons/Delete';
import './Shoot.scss';

const Shoot = ({ 
  shoot_id, 
  thumbnail_url, 
  models, 
  photographers, 
  showDeleteModal, 
  setShowDeleteModal, 
  isOnShootDetails,
  handleNewShootId}) => {

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    selectedShoot, 
    setSelectedShoot
  } = useContext(AppContext);
  
  const handleDeleteClick = (e) => {
    e.preventDefault();
    setShowDeleteModal(true);
    setSelectedShoot(shoot_id);
  }

  return (
    <>
      <div 
        className="shoot"
        onClick={() => handleNewShootId(shoot_id)}
      >
        {isLoggedIn && !isOnShootDetails 

          ?
            <div 
              className="shoot__delete-btn"
              onClick={(e) => handleDeleteClick(e)}
              >
              <Delete 
                onClick={handleDeleteClick}
                className={"shoot__delete-btn---icon"}
              />
            </div>

          : null
          
        }
        <img 
          className='shoot__img'
          src={thumbnail_url} 
          alt={`Thumbnail for "${shoot_id}" shoot`} 
        />
        <div 
          className={`shoot__info ${isOnShootDetails && "smallText"}`}
        >
          <p className='shoot__models'>
            <span className="models__label">
              {models.length > 1 
                ? "Models: " 
                : "Model: "}
            </span>
            {models.length > 1 ? models.join(", ") : models}
          </p>
          <p className='shoot__photographers'>
            <span className="photographers__label">   
              Photos
            </span>
              {photographers.length > 1 
                ? photographers.join(", ") 
                : photographers}
          </p>
        </div>
      </div>
    </>
  )};

export default Shoot;