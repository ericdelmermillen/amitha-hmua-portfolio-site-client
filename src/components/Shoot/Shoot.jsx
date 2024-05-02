import AppContext from '../../AppContext';
import { useContext } from 'react';
import DeleteIcon from '../../assets/icons/DeleteIcon.jsx';
import './Shoot.scss';

const Shoot = ({ 
  shoot_id, 
  thumbnail_url, 
  models, 
  photographers, 
  isOnShootDetails,
  handleNewShootId,
  isOrderEditable, 
  setIsOrderEditable,
  handleShootDragStart,
  handleDropShootTarget
}) => {

  const { 
    isLoggedIn, 
    setSelectedShoot,
    setShowDeleteShootModal
  } = useContext(AppContext);
  
  const handleDeleteClick = (e) => {
    setSelectedShoot(shoot_id)
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteShootModal(true);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };


  return (
    <>
      <div 
        draggable={isOrderEditable}
        className={isOrderEditable ? "shoot draggable" : "shoot"}
        onDragStart={isOrderEditable
          ? () => handleShootDragStart(shoot_id)
          : null}
        onDragOver={isOrderEditable
          ? handleDragOver
          : null}
        onDrop={isOrderEditable
          ? () => handleDropShootTarget(shoot_id)
          : null}
        onClick={() => handleNewShootId(shoot_id)}
      >
        {isLoggedIn && !isOnShootDetails 

          ? <div 
              className="shoot__delete-btn"
              onClick={(e) => handleDeleteClick(e)}
            >
              <DeleteIcon
                onClick={handleDeleteClick}
                className={"shoot__delete-btn---icon"}
              />
            </div>

          : null
          
        }

        {isLoggedIn && !isOnShootDetails 

          ? <div className="shoot__shoot_id">
              {shoot_id}
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