import './Shoot.scss';
import AppContext from '../../AppContext';
import { useState, useContext } from 'react';

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
    setShowDeleteModal(true)
    setSelectedShoot(shoot_id)
  }

  return (
    <>
      <div className="shoot">
        {isLoggedIn && 
          <button 
            className="shoot__delete-btn"
            onClick={handleDeleteClick}
          >
            Delete
            {/* <img className="shoot__delete-icon" 
              src={} 
              alt="Shoot delete icon"/>  */}
          </button>
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
            <span className="photographers__label">{photographers.length > 1 ? "Photographers: " : "Photographer: "}</span>
              {photographers.length > 1 ? photographers.join(", ") : photographers}
          </p>
        </div>
      </div>
    </>
  )};

export default Shoot;