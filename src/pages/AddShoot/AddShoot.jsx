import { useState, useEffect, useContext } from 'react';
import AppContext from '../../AppContext';
import { scrollToTop } from '../../utils/utils';
import './AddShoot.scss';


const AddShoot = () => {
  const { 
    isLoading,
    setIsLoading
   } = useContext(AppContext);


  useEffect(() => {
    scrollToTop();
    setTimeout(() => {
      setIsLoading();
    }, 250)
  }, []);
  
  return (
    <>
      <div className="addShoot">
        <div className="addShoot__inner">
          <h1 className="addShoot__h1">
            From AddShoot
          </h1>
        </div>
      </div>
    </>
  )};

export default AddShoot;