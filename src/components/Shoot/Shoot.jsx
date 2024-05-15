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
  handleDropShootTarget,
  tags
}) => {

  const { 
    isLoggedIn, 
    setSelectedShoot,
    setShowDeleteOrEditShootModal,
    deleteOrEditClickAction,
    setDeleteOrEditClickAction,
    isFirefox
  } = useContext(AppContext);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDeleteOrEditClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedShoot(shoot_id)
    setShowDeleteOrEditShootModal(true);
    setDeleteOrEditClickAction(action)
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
              onClick={(e) => handleDeleteOrEditClick(e, "Delete")}
            >
              <DeleteIcon
                onClick={(e) => handleDeleteOrEditClick(e, "Delete")}
                className={"shoot__delete-btn---icon"}
              />
            </div>

          : null
          
        }

        {isLoggedIn && !isOnShootDetails && !isOrderEditable

          ? <div 
              className="shoot__edit-btn"
              onClick={(e) => handleDeleteOrEditClick(e, "Edit")}
            >
              <EditIcon
                onClick={(e) => handleDeleteOrEditClick(e, "Edit")}
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
        <div className="shoot__tags">
          {tags.map(tag => (
            <span 
              className='shoot__tag'
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </>
  )};

export default Shoot;