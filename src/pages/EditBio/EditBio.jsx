import { useAppContext } from '../../AppContext';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/utils';
import { toast } from 'react-toastify';
import PhotoInput from '../../components/PhotoInput/PhotoInput';
import Compressor from 'compressorjs';
import "./EditBio.scss";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const AWS_SIGNED_URL_ROUTE = import.meta.env.VITE_AWS_SIGNED_URL_ROUTE;
const AWS_BIO_DIRNAME = import.meta.env.VITE_AWS_BIO_DIRNAME;

const EditBio = () => {
  
  const navigate = useNavigate();

  const { 
    setIsLoading,
    setIsLoggedIn,
    minLoadingInterval,
    bioImg, 
    setBioImg,
    bioName, 
    setBioName,
    bioText, 
    setBioText,
    handleNavigateHome
  } = useAppContext();

  const [ inputPhotos, setInputPhotos ] = useState([{
    photoNo: 1,
    photoPreview: null,
    photoData: null,
    displayOrder: 1
  }]);

  const [ newBioName, setNewBioName ] = useState("");
  const [ newBioText, setNewBioText ] = useState("");

  const handleBioCaptionChange = (e) => {
    setNewBioName(e.target.value);
  };
  
  const handleBioTextChange = (e) => {
    setNewBioText(e.target.value);
  };

  const handleCancel = () => {
    handleNavigateHome(true, false, null);
  };

  const handleInputDragStart = () => {
    // defined so the function is not undefined in the PhotoInput
  };
  
  const handleDropInputTarget = () => {
    // defined so the function is not undefined in the PhotoInput
  };
  
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

  const handleSubmitBioUpdate = async (e) => {
    e.preventDefault();

    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      handleNavigateHome(true, false, null);
      return toast.error("Token missing. Logging you out...");
    }

    if(!newBioName.length) {
      return toast.error("Bio name cannot be left blank");
    }

    if(!newBioText.length) {
      return toast.error("Bio text cannot be left blank");
    }

    if(!inputPhotos[0].photoPreview) {
      return toast.error("You forgot your bio photo");
    }

    try {
      setIsLoading(true);
      
      const token = localStorage.getItem('token');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const newBioImgPreview = inputPhotos[0].photoPreview;
      const newBioImgphotoData = inputPhotos[0].photoData;
      
      let awsObjName;
      let awsURL;

      if(newBioImgPreview && !newBioImgphotoData) {
        awsObjName = newBioImgPreview.split(`/${AWS_BIO_DIRNAME}/`)[1];
      } else if(newBioImgphotoData) {

        // Generate AWS signed upload URL
        try {
          const response = await fetch(`${AWS_SIGNED_URL_ROUTE}?dirname=${AWS_BIO_DIRNAME}`, { headers });
          const { url } = await response.json();
          awsURL = url;
        } catch (error) {
          console.error('Error generating AWS signed URL:', error);
          return;
        }

        // Post image to AWS S3 bucket
        try {
          await fetch(awsURL, {
            method: "PUT",
            body: newBioImgphotoData
          });

          const imageUrl = awsURL.split('?')[0];
          awsObjName = imageUrl.split(`/${AWS_BIO_DIRNAME}/`)[1];
        } catch (error) {
          console.error('Error posting image to AWS S3:', error);
          return;
        }
      }

      const updatedBioData = {
        bio_name: newBioName,
        bio_img_url: awsObjName,
        bio_text: newBioText,
        updated_Photo: !newBioImgPreview.includes("aws")
          ? true
          : false
      }

      try {
        const response = await fetch(`${BASE_URL}/bio/update`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(updatedBioData)
        });

        const data = await response.json();
        
        if(response.ok) {
          setBioImg(data.bioImgURL);
          setBioName(data.bioName);
          setBioText(data.bioText);
          toast.success("Bio page updated");
        }
        
      } catch(error) {
        console.log(error);
        setIsLoggedIn(false);
        toast.error("Error updating Bio Page. Logging you out...");
      }
    } catch (error) {
      console.error('Error updating bio:', error);
    }
    setTimeout(() => {
      navigate("/bio");
    }, minLoadingInterval);
  };
  
  // fetch bioPageData useEffect
  useEffect(() => {
    if(bioName && bioText) {      
      setNewBioName(bioName);
      setNewBioText(bioText);
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