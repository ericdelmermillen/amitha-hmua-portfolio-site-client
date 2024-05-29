import AppContext from '../../AppContext';
import { useState, useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import PhotoInput from '../../components/PhotoInput/PhotoInput';
import "./EditBio.scss";

const EditBio = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoading,
    setIsLoading,
    selectedTag,
    minLoadingInterval,
    shootDetails, 
    setShootDetails,
    bioImg, 
    setBioImg,
    bioName, 
    setBioName,
    bioText, 
    setBioText,
    handleNavigateHome
  } = useContext(AppContext);

  // shootPhoto state: bioImg(?)
  const [ inputPhoto, setInputPhoto  ] = useState({
    photoNo: 1,
    photoPreview: null,
    photoData: null,
    displayOrder: 1
  });

  const [ newBioCaption, setNewBioCaption ] = useState("");
  const [ newBioText, setNewBioText ] = useState("");

  const handleBioCaptionChange = (e) => {
    setNewBioCaption(e.target.value)
  };
  
  const handleBioTextChange = (e) => {
    setNewBioText(e.target.value)
  };

  const handleCancel = () => {
    handleNavigateHome(true, false, null);
  };

  // fetch bioPageData useEffect
  useEffect(() => {
    if(bioName && bioText && bioImg) {      
      setNewBioCaption(bioName);
      setNewBioText(bioText.replace(/\n/g, '\n\n'))
      setInputPhoto({
        photoNo: 1,
        photoPreview: bioImg,
        photoData: null,
        displayOrder: 1
      });
    }
  }, [bioName, bioText, bioImg]);

  return (
    <>
      <div className="editBio">
        <div className="editBio__inner">
          <h1 className="editBio__heading">
            Edit Your Bio
          </h1>

          <form className="editBio__form">

            <div className="editBio__hero-section">

              <div className="editBio__photoUpload">

                <div className="editBio__photoInput">
                  <PhotoInput 
                    shootPhoto={inputPhoto}
                    shootPhotos={null}
                    setShootPhotos={null}                  handleImageChange={null}
                    handleInputDragStart={null}
                    handleDropInputTarget={null}
                    />
                </div>

              </div>

              <input 
                type="text" 
                className="editBio__bio-caption" 
                value={newBioCaption}
                onChange={(e) => handleBioCaptionChange(e)}
              />
            </div>

            <div className="editBio__text-section">
              
              <textarea 
                className='editBio__bio-text'
                name="" 
                id=""
                onChange={(e) => handleBioTextChange(e)}
                value={newBioText}
              ></textarea>

            </div>

            
          </form>
          <div className="editBio__button-container">
            <div 
              className="editBio__button"
              onClick={handleCancel}
            >
              Cancel
            </div>
            <div className="editBio__button">Update</div>
          </div>

        </div>
      </div>
    </>
  )};

export default EditBio;