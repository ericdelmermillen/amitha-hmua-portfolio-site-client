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
        <p className='shoot__models'>
          {models.length > 1 ? "Models" : "Model"}
        </p>
        <ul>
          {models.map((model, index) => (
            <li key={index}>{model}</li>
          ))}
        </ul>
        <p className='shoot__photographers'>
          {photographers.length > 1 ? "Photographers" : "Photographer"}
        </p>
        <ul>
          {photographers.map(photographer => (
            <li key={photographer}>{photographer}</li>
          ))}
        </ul>
      </div>
    </>
  )};

export default Shoot;