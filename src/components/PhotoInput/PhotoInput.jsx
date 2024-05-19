import { useRef, useState } from 'react';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import './PhotoInput.scss';

const PhotoInput = ({ 
  isFirefox, 
  shootPhoto, 
  shootPhotos, 
  setShootPhotos, 
  handleImageChange,
  handleInputDragStart,
  handleDropInputTarget
}) => {

  const [ showImage, setShowImage ] = useState(false);

  const inputNo = shootPhoto.photoNo;
  const displayOrder = shootPhoto.displayOrder;

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setShowImage(true);
    file && handleImageChange(e, shootPhoto.photoNo);
  };

  const handleClearInput = (e) => {
    e.stopPropagation();
    setShowImage(false)
    const newShootPhotos = [...shootPhotos];

    newShootPhotos.forEach((shootPhoto) => {
      if(shootPhoto.photoNo === inputNo) {
        shootPhoto.photoPreview = null;
        shootPhoto.photoData = null;
      }
    });

    setShootPhotos(newShootPhotos);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageLoad = () => {
    setShowImage(true)
  }
  
  return (
    <>
      <div 
        className="photoInput"
        draggable={true}
        onClick={showImage 
          ? null
          : handleFileInputChange}
        onDragStart={!isFirefox 
          ? () => handleInputDragStart(inputNo)
          : null}
        onMouseDown={isFirefox
          ? () => handleInputDragStart(inputNo)
          : null}
        onDragOver={handleDragOver}
        onDrop={() => handleDropInputTarget(inputNo, displayOrder)}
      >
        <div 
          className={`photoInput__box ${showImage 
            ? "disabled" 
            : ""}`}
          draggable={true}
        >
          <img
            className={`photoInput__image ${showImage 
              ? "inFront" 
              : ""}`}
            src={shootPhoto.photoPreview}
            onLoad={handleImageLoad} 
            draggable={true}
          />
          <PhotoPlaceholder
            className={`photoInput__placeholder ${showImage 
              ? "behind" 
              : ""}`}
            strokeClassName="photoInput__placeholderStroke"
          />
          <div
            className={`photoInput__clearButton ${showImage 
              ? "show" 
              : ""}`}
            onClick={handleClearInput}
          >
            <div className="photoInput__clear">
              <div className="photoInput__close-icon"></div>
              <div className="photoInput__close-icon"></div>
            </div>
          </div>
        </div>

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
