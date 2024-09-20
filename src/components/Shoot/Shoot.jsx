import { useState } from 'react';
import { useAppContext } from '../../AppContext';
import { checkIfIsFirefox } from '../../utils/utils.js';
import DeleteIcon from '../../assets/icons/DeleteIcon.jsx';
import EditIcon from '../../assets/icons/EditIcon.jsx';
import ShootPlaceHolder from '../ShootPlaceholder/ShootPlaceHolder.jsx';
import './Shoot.scss';

const isFirefox = checkIfIsFirefox();

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
    handleDeleteOrEditClick
  } = useAppContext();

  const [ imageIsLoaded, setIsImagedLoaded ] = useState(false);

  const handleUpdateImageIsLoaded = () => {
    setIsImagedLoaded(true);
  }

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div 
        draggable={isOrderEditable}
        className={isOrderEditable 
          ? "shoot draggable" 
          : "shoot"}
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
        <div className={`shoot__placeholder ${imageIsLoaded ? "hide" : ""}`}>
          <ShootPlaceHolder 
            isOnShootDetails={isOnShootDetails}
          />
        </div>
        
        <div className="shoot__overlay"></div>
        
        {isLoggedIn && !isOnShootDetails && !isOrderEditable

          ? <div 
              className="shoot__delete-btn"
              onClick={(e) => handleDeleteOrEditClick(e, "Delete", shoot_id)}
            >
              <DeleteIcon
                onClick={(e) => handleDeleteOrEditClick(e, "Delete", shoot_id)}
                className={"shoot__delete-btn--icon"}
              />
            </div>

          : null
          
        }

        {isLoggedIn && !isOnShootDetails && !isOrderEditable

          ? <div 
              className="shoot__edit-btn"
              onClick={(e) => handleDeleteOrEditClick(e, "Edit", shoot_id)}
            >
              <EditIcon
                onClick={(e) => handleDeleteOrEditClick(e, "Edit", shoot_id)}
                className={"shoot__edit-btn--icon"}
              />
            </div>

          : null
          
        }

        <img 
          draggable={isOrderEditable}
          className={`shoot__img ${imageIsLoaded ? "show" : ""}`}
          src={thumbnail_url} 
          alt={`Thumbnail for "${shoot_id}" shoot`}
          onLoad={handleUpdateImageIsLoaded}
          onDragStart={isOrderEditable 
            ? (e) => handleShootDragStart(e, shoot_id) 
            : null}
        />

        <div 
          className={`shoot__info ${!isOnShootDetails 
            ? "show" 
            : ""}`}
        >
          <p className="shoot__models">
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