import AppContext from '../../AppContext';
import { useContext } from 'react';
import DeleteIcon from '../../assets/icons/DeleteIcon.jsx';
import EditIcon from '../../assets/icons/EditIcon.jsx';
import './Shoot.scss';

const Shoot = ({ 
  shoot_id, 
  display_order,
  thumbnail_url, 
  models, 
  photographers, 
  isOnShootDetails,
  handleNewShootId,
  isOrderEditable, 
  handleShootDragStart,
  handleDropShootTarget
}) => {

  const { 
    isLoggedIn, 
    setSelectedShoot,
    setShowDeleteOrEditShootModal,
    isFirefox
  } = useContext(AppContext);
  
  const handleDeleteClick = (e) => {
    setSelectedShoot(shoot_id)
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteOrEditShootModal(true);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    console.log(`Edit shoot ${shoot_id}?`)
    e.stopPropagation();
  }

  return (
    <>
      <div 
        draggable={isOrderEditable}
        className={isOrderEditable ? "shoot draggable" : "shoot"}
        onDragStart={isOrderEditable && !isFirefox
          ? () => handleShootDragStart(shoot_id)
          : null}
        onMouseDown={isOrderEditable && isFirefox
          ? () => handleShootDragStart(shoot_id)
          : null}
        onDragOver={isOrderEditable
          ? handleDragOver
          : null}
        onDrop={isOrderEditable
          ? () => handleDropShootTarget(shoot_id, display_order)
          : null}
        onClick={() => handleNewShootId(shoot_id)}
      >
        <div className="shoot__overlay"></div>
        
        {isLoggedIn && !isOnShootDetails && !isOrderEditable

          ? <div 
              className="shoot__delete-btn"
              onClick={(e) => handleDeleteClick(e)}
            >
              <DeleteIcon
                onClick={(e) => handleDeleteClick(e)}
                className={"shoot__delete-btn---icon"}
              />
            </div>

          : null
          
        }

        {isLoggedIn && !isOnShootDetails && !isOrderEditable

          ? <div 
              className="shoot__edit-btn"
              onClick={(e) => handleEditClick(e)}
            >
              <EditIcon
                onClick={(e) => handleEditClick(e)}
                className={"shoot__edit-btn---icon"}
              />
            </div>

          : null
          
        }

        <img 
          draggable={isOrderEditable}
          className='shoot__img'
          src={thumbnail_url} 
          alt={`Thumbnail for "${shoot_id}" shoot`}
          onDragStart={isOrderEditable 
            ? (e) => handleShootDragStart(e, shoot_id) 
            : null}
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