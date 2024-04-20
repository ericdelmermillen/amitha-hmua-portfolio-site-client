import { useState, useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import AppContext from '../../AppContext';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import './PhotoInput.scss';

const PhotoUpload = ({ shootPhoto, shootPhotos, setShootPhotos }) => {
  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);

  const [ inputIsLoading, setInputIsLoading ] = useState(false);

  const inputNo = shootPhoto.photoNo;

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setInputIsLoading(true)
    const file = e.target.files[0];

    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const selectedFile = URL.createObjectURL(file);

      const newShootPhotos = [...shootPhotos];

      newShootPhotos.forEach((shootPhoto) => {
        if (shootPhoto.photoNo === inputNo) {
          shootPhoto.photoData = selectedFile;
        }
      });
      
      setShootPhotos(newShootPhotos);
    } else {
      toast.error('Please select a valid JPEG or PNG file.');
    }
    setIsLoading(false);
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
