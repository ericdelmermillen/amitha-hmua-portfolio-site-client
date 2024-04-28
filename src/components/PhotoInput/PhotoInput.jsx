import { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AppContext from '../../AppContext';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import Compressor from 'compressorjs';
import './PhotoInput.scss';

const PhotoInput = ({ shootPhoto, shootPhotos, setShootPhotos, handleImageChange }) => {
  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);

  const inputNo = shootPhoto.photoNo

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    handleImageChange(e, shootPhoto.photoNo);
  };
  

  const handleClearInput = (e) => {
    e.stopPropagation();
    const newShootPhotos = [...shootPhotos];

    newShootPhotos.forEach((shootPhoto) => {
      if(shootPhoto.photoNo === inputNo) {
        shootPhoto.photoData = null;
      }
    });

    setShootPhotos(newShootPhotos);
  };
  
  return (
    <>
      <div className="photoInput">
        {shootPhoto.photoData ? (
          <div className="photoInput__box disabled">
            <img
              src={shootPhoto.photoData}
              alt="Uploaded"
              className="photoInput__image"
            />
            <div
              className="photoInput__clearButton"
              onClick={handleClearInput}
            >
              <div className="photoInput__close-icon"></div>
              <div className="photoInput__close-icon"></div>
            </div>
          </div>
        ) : (
          <div className="photoInput__box" onClick={handleFileInputChange}>
            <PhotoPlaceholder
              className="photoInput__placeholder"
              strokeClassName="photoInput__placeholderStroke"
            />
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          id={`fileInput_${shootPhoto.photoNo}`}
          accept="image/jpeg, image/png"
          className="photoInput__fileInput"
          // onChange={handleFileChange}
          // onChange={(e, inputNo) => handleImageChange(e, inputNo)}
          onChange={(e) => handleFileChange(e)}
        />
      </div>
    </>
  );
};

export default PhotoInput;
