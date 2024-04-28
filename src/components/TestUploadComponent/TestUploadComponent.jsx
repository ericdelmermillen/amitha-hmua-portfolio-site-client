import { useState } from 'react';
import FormData from 'form-data';
import PhotoInput from '../PhotoInput/PhotoInput';
import Compressor from 'compressorjs';

function TestUploadComponent() {
  const BASE_URL = "http://localhost:4000/upload";
  const [ selectedImages, setSelectedImages ] = useState([]);
  const numberOfPhotoUploads = 10;
  const [ shootPhotos, setShootPhotos ] = useState(
    Array.from({ length: numberOfPhotoUploads }, (_, idx) => ({
      photoNo: idx + 1,
      photoData: null
    }))
  );

  const handleImageChange = async (e, inputNo) => {
    console.log(`inputNo: ${inputNo}`)
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
          },
        });
      });

      const currentImages = [...selectedImages];
  
      setSelectedImages([...currentImages, compressedImage]);
      const newShootPhotos = [...shootPhotos];

      const compressedImageUrl = URL.createObjectURL(compressedImage);
    
      newShootPhotos.forEach((shootPhoto) => {
        if(shootPhoto.photoNo === inputNo) {
          shootPhoto.photoData = compressedImageUrl;
        }
      });

      console.log(compressedImage)
  
      setShootPhotos(newShootPhotos);
    } catch (error) {
      console.error('Error compressing image:', error);
    }
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    const photoInputImages = [];

    shootPhotos.forEach(photo => {
      if(photo.photoData !== null) {
        photoInputImages.push(photo.photoData)
      }
    })

    if (!selectedImages.length) {
      alert('Please select some images to upload!');
      return;
    }

    const formData = new FormData();
    for (const image of selectedImages) {
      formData.append('file', image);
    }

    formData.append('shoot_date', new Date().toISOString().split('T')[0]);
    formData.append("photographer_ids", "3, 4");
    formData.append("model_ids", "1, 2");

    try {
      const response = await fetch("http://localhost:8080/api/shoots/add", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setSelectedImages([]);
      console.log(shootPhotos)
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <h2>Image Upload Form</h2>

        <div className="addShoot_photoInputs">              

          {shootPhotos.map(shootPhoto => 
            <div 
              className="addShoot__photoInput"
              key={shootPhoto.photoNo}
            >                  
              <PhotoInput 
                shootPhoto={shootPhoto}
                shootPhotos={shootPhotos}
                setShootPhotos={setShootPhotos}
                handleImageChange={handleImageChange}
              />
            </div>
          )}

        </div>


        

        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default TestUploadComponent;
