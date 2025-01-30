import { useRef, useState } from 'react';
import { checkIfIsFirefox } from '../../utils/utils';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import './PhotoInput.scss';
import { useAppContext } from '../../AppContext';

const isFirefox = checkIfIsFirefox();

const PhotoInput = ({ 
  shootPhoto, 
  setShootPhotos, 
  handleImageChange,
  handleInputDragStart = null,
  handleDropInputTarget = null
}) => {

  const { minLoadingInterval } = useAppContext();

  const [ showImage, setShowImage ] = useState(false);

  const inputNo = shootPhoto.photoNo;
  const displayOrder = shootPhoto.displayOrder;

  const fileInputRef = useRef(null);

  const handleFileInputChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if(file) {
      handleImageChange(e, shootPhoto.photoNo);
      setTimeout(() => {
        setShowImage(true);
      }, minLoadingInterval);
    };
  };

  const handleClearInput = (e) => {
    e.stopPropagation();
    setShowImage(false);
  
    setShootPhotos(prevShootPhotos => {
      return prevShootPhotos.map(shootPhoto => {
        if (shootPhoto.photoNo === inputNo) {
          return { ...shootPhoto, photoPreview: null, photoData: null };
        }
        return shootPhoto;
      });
    });
  };
  

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleImageLoad = () => {
    setShowImage(true);
  };
  
  return (
    <>
      <div 
        className="photoInput"
        draggable={true}
        onClick={showImage 
          ? null
          : handleFileInputChange}
        onDragStart={!isFirefox && handleInputDragStart
          ? () => handleInputDragStart(inputNo)
          : null}
        onMouseDown={isFirefox && handleInputDragStart
          ? () => handleInputDragStart(inputNo)
          : null}
        onDragOver={handleDragOver}
        onDrop={handleDropInputTarget
          ? () => handleDropInputTarget(inputNo, displayOrder)
          : null}
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
