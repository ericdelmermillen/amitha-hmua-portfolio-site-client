import './Shoot.scss';
import AppContext from '../../AppContext';
import { useState, useContext } from 'react';

const Shoot = (
  { title,
    shoot_id,
    thumbnail_url,
    models, 
    photographers }) => {

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
    setShootsData
    } = useContext(AppContext);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  `${BASE_URL}/shoots/delete/${shoot_id}`

  const handleDeleteShoot = async () => {
    if(isLoggedIn) {
      try {
        const response = await fetch(`${BASE_URL}/shoots/delete/${shoot_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if(response.ok) {
          const newShootData = shootsData.filter(shoot => shoot.shoot_id !== shoot_id);
          setShootsData(newShootData); 
          console.log(`Delete Shoot ${shoot_id}`)
        } else {
          console.error(`Failed to delete Shoot ${shoot_id}: ${response.statusText}`);
        }
      } catch(error) {
      }
    } else {
      console.log("Sorry please login again")
    }
  }

  return (
    <>
      <div className="shoot">
        {isLoggedIn && 
          <button 
            className="shoot__delete-btn"
            onClick={handleDeleteShoot}
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