import AppContext from '../../AppContext';
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/utils';
import { toast } from 'react-toastify';
import PhotoInput from '../../components/PhotoInput/PhotoInput';
import Compressor from 'compressorjs';
import "./EditBio.scss";

const EditBio = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const AWS_SIGNED_URL_ROUTE = import.meta.env.VITE_AWS_SIGNED_URL_ROUTE;

  const navigate = useNavigate();

  const { 
    isLoading,
    setIsLoading,
    setIsLoggedIn,
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
  const [ inputPhotos, setInputPhotos ] = useState([{
    photoNo: 1,
    photoPreview: null,
    photoData: null,
    displayOrder: 1
  }]);

  const [ newBioName, setNewBioName ] = useState("");
  const [ newBioText, setNewBioText ] = useState("");

  const handleBioCaptionChange = (e) => {
    setNewBioName(e.target.value)
  };
  
  const handleBioTextChange = (e) => {
    setNewBioText(e.target.value)
  };

  const handleCancel = () => {
    handleNavigateHome(true, false, null);
  };

  const handleInputDragStart = () => {
    // defined so the function is not undefined in the PhotoInput
  }
  
  const handleDropInputTarget = () => {
    // defined so the function is not undefined in the PhotoInput
  }

  const handleImageChange = async (e, inputNo) => {
    const file = e.target.files[0];
    
    try {
      const compressedImage = await new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          maxWidth: 1200,
          maxHeight: 900,
          mimeType: 'auto',
          convertSize: 600000,
          success(result) {
            resolve(result);
          },
          error(error) {
            reject(error);
          }
        });
      });

      const newInputPhotos = [...inputPhotos];

      const compressedImageUrl = URL.createObjectURL(compressedImage);
    
      newInputPhotos.forEach((inputPhoto) => {
        if(inputPhoto.photoNo === inputNo) {
          inputPhoto.photoPreview = compressedImageUrl;
          inputPhoto.photoData = compressedImage;
        }
      });
  
      setInputPhotos(newInputPhotos);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };

// ---
  const handleSubmitBioUpdate = async (e) => {
    e.preventDefault();

    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      handleNavigateHome(true, false, null);
      return toast.error("Token missing. Logging you out...");
    }

    if(tokenIsExpired) {
      return;
    }
    
    if(!newBioName.length) {
      toast.error("Bio name can not be left blank");
    }
    
    if(!newBioText.length) {
      toast.error("Bio text can not be left blank");
    }
    
    if(!inputPhotos[0].photoPreview) {
      toast.error("You forgot your bio photo");
    }

    try {
      // setIsLoading(true);

      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let awsURL;
      let awsObjName;

      const newBioImgPreview = inputPhotos[0].photoPreview;
      const newBioImgphotoData = inputPhotos[0].photoData;

      if(newBioImgPreview && !newBioImgphotoData) {
        const objectName = newBioImgPreview.split("/bio/")[1];
        awsObjName = objectName;
      } else if(newBioImgphotoData) {

        try {
          const { url } = await fetch(`${AWS_SIGNED_URL_ROUTE}`, {
            headers: headers
          }).then(res => res.json());
          
          awsURL = url;
          console.log(awsURL)
          const objectName = awsURL.split("/bio/")[1];
        } catch(error) {
          console.log(error);
        }

        // post image to aws s3 bucket
        try {
          await fetch(awsURL, {
            method: "PUT",
            body: newBioImgphotoData
          });

          const imageUrl = `${awsURL.split('?')[0]}`;
          const objectName = imageUrl.split("/bio/")[1];
          console.log(objectName)
          awsObjName = objectName


        } catch(error) {
          console.log(error);
        }

        
      }
      
      
      console.log(`awsURL: ${awsURL}`)
      console.log(`awsObjName: ${awsObjName}`)

    } catch(error) {
      console.log(error)
    }


  };


  // {
  //   "bio_name": "Amitha Millen-Suwanta", 
  //   "bio_img_url": "432584672_10161253506945768_7528924934946103991_n.jpg",
  //   "bio_text": "Here's my awesome bio..."
  // }
  

  // fetch bioPageData useEffect
  useEffect(() => {
    if(bioName && bioText && bioImg) {      
      setNewBioName(bioName);
      setNewBioText(bioText.replace(/\n/g, '\n\n'))
      setInputPhotos([{
        photoNo: 1,
        photoPreview: bioImg,
        photoData: null,
        displayOrder: 1
      }]);
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
                    shootPhoto={inputPhotos[0]}
                    shootPhotos={inputPhotos}
                    setShootPhotos={setInputPhotos}                  handleImageChange={handleImageChange}
                    handleInputDragStart={handleInputDragStart}
                    handleDropInputTarget={handleDropInputTarget}
                    />
                </div>

              </div>

              <input 
                type="text" 
                className="editBio__bio-caption" 
                value={newBioName}
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
            <div 
              className="editBio__button"
              onClick={(e) => handleSubmitBioUpdate(e)}
            >
              Update
            </div>
          </div>

        </div>
      </div>
    </>
  )};

export default EditBio;