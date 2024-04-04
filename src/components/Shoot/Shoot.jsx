import './Shoot.scss';
import AppContext from '../../AppContext';
import { useContext } from 'react';
import delete_icon from '../../../src/assets/icons/delete.svg';

const Shoot = ({ title, shoot_id, thumbnail_url, models, photographers, showDeleteModal, setShowDeleteModal }) => {

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showSideNav, 
    setShowSideNav,
    scrollYPos, 
    setScrollYPos,
    prevScrollYPos, 
    setPrevScrollYPos,
    shootsData, 
    setShootsData,
    selectedShoot, 
    setSelectedShoot
  } = useContext(AppContext);
  
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setSelectedShoot(shoot_id);
  }

  return (
    <>
      <div className="shoot">
        {isLoggedIn && 
          <div 
            className="shoot__delete-btn"
            onClick={handleDeleteClick}
          >
            <img 
              className='shoot__delete-icon'
              src={delete_icon}
              alt="Shoot delete icon"/> 
          </div>
        }
        <img 
          className='shoot__img'
          src={thumbnail_url} alt={`Thumbnail for "${title}" shoot`} />
        <div className="shoot__info">
          <p className='shoot__models'>
            <span className="models__label">{models.length > 1 ? "Models: " : "Model: "}</span>
            {models.length > 1 ? models.join(", ") : models}
          </p>
          <p className='shoot__photographers'>
            <span className="photographers__label"> Photos</span>
              {photographers.length > 1 ? photographers.join(", ") : photographers}
          </p>
        </div>
      </div>
    </>
  )};

export default Shoot;