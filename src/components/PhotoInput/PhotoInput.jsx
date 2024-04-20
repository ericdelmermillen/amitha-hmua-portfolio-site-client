import { useState, useContext } from 'react';
import AppContext from '../../AppContext';
import PhotoPlaceholder from '../../assets/icons/PhotoPlaceholder';
import './PhotoInput.scss';

const PhotoUpload = () => {
  const { 
    isLoading,
    setIsLoading
  } = useContext(AppContext);
  
  const [ selectedFile, setSelectedFile ] = useState(null);

  // const handleInputLoading = () => {
  //   setIsLoading(true);
  // }

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if(file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      alert('Please select a valid JPEG or PNG file.');
    }
    setIsLoading(false);
  }
  
  return (
    <>
      <div className="photoInput">
        {selectedFile 
          ? <img 
              src={selectedFile} 
              alt="Uploaded"
              className="photoInput__image" 
            />
          : <label 
              htmlFor="fileInput"  className="photoInput__placeholderLabel"
              // onClick={handleInputLoading}
            >
              <PhotoPlaceholder
                className="photoInput__placeholder"
                strokeClassName="photoInput__placeholderStroke"
              />
            </label>
        }
        <input
          type="file"
          id="fileInput"
          accept="image/jpeg, image/png"
          className="photoInput__fileInput"
          onChange={handleFileChange}
        />
      </div>
    </>
  )};

export default PhotoUpload;