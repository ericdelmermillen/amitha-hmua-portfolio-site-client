import { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AppContext from '../../AppContext';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import Compressor from 'compressorjs';
import './PhotoInput.scss';

const PhotoUpload = ({ shootPhoto, shootPhotos, setShootPhotos }) => {
  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);

  const inputNo = shootPhoto.photoNo;

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if(file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      try {
        const compressedFile = await new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 8,
            maxWidth: 1200,
            maxHeight: 900,
            mimeType: 'auto',
            convertSize: 600000,
            success(result) {
              resolve(result);
            },
            error(error) {
              reject(error);
            },
          });
        });

        const selectedFile = URL.createObjectURL(compressedFile);

        const newShootPhotos = [...shootPhotos];

        newShootPhotos.forEach((shootPhoto) => {
          if(shootPhoto.photoNo === inputNo) {
            shootPhoto.photoData = selectedFile;
          }
        });
        
        setShootPhotos(newShootPhotos);
      } catch (error) {
        console.error('Compression error:', error);
        toast.error('Failed to compress image.');
      }
    } else {
      toast.error('Please select a valid JPEG or PNG file.');
    }
  };
  

  const handleClearInput = (e) => {
    e.stopPropagation();
    const newShootPhotos = [...shootPhotos];

    newShootPhotos.forEach((shootPhoto) => {
      if (shootPhoto.photoNo === inputNo) {
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
          id="fileInput"
          accept="image/jpeg, image/png"
          className="photoInput__fileInput"
          onChange={handleFileChange}
        />
      </div>
    </>
  );
};

export default PhotoUpload;
