import { useRef } from 'react';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import './PhotoInput.scss';

const PhotoInput = ({ shootPhoto, shootPhotos, setShootPhotos, handleImageChange }) => {

  const inputNo = shootPhoto.photoNo;

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    file && handleImageChange(e, shootPhoto.photoNo);
  };

  const handleClearInput = (e) => {
    e.stopPropagation();
    const newShootPhotos = [...shootPhotos];

    newShootPhotos.forEach((shootPhoto) => {
      if(shootPhoto.photoNo === inputNo) {
        shootPhoto.photoPreview = null;
        shootPhoto.photoData = null;
      }
    });

    setShootPhotos(newShootPhotos);
  };
  
  return (
    <>
      <div className="photoInput">
        {shootPhoto.photoPreview ? (
          <div className="photoInput__box disabled">
            <img
              src={shootPhoto.photoPreview}
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
          <div 
            className="photoInput__box" 
            onClick={handleFileInputChange}
          >
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
          onChange={(e) => handleFileChange(e)}
        />
      </div>
    </>
  )};

export default PhotoInput;
