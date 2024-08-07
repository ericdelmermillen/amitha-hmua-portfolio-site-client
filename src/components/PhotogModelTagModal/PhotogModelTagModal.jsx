import { useAppContext } from '../../AppContext.jsx';
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/utils.js';
import './PhotogModelTagModal.scss';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PhotogOrModelModal = () => {
  const { 
    setIsLoading,
    minLoadingInterval, 
    isLoggedIn, 
    setIsLoggedIn,
    setShouldUpdatePhotographers,
    setShouldUpdateModels,
    setShouldUpdateTags,
    selectedPhotogModelTag, 
    setSelectedPhotogModelTag,
    showPhotogModelTagModal,
    setShowPhotogModelTagModal,
    handleNavigateHome
  } = useAppContext();
  

  const navigate = useNavigate();

  const { modalType } = showPhotogModelTagModal;


  let entryType;

  if(selectedPhotogModelTag.hasOwnProperty("photographer_name")) {
    entryType = "Photographer";
  } else if(selectedPhotogModelTag.hasOwnProperty("model_name")) {
    entryType = "Model";
  } else if(selectedPhotogModelTag.hasOwnProperty("tag_name")) {
    entryType = "Tag";
  }
  
  // selectedPhotogModelTag values
  const { photographer_name, model_name, tag_name, id } = selectedPhotogModelTag;

  let entryName;
  
  if(selectedPhotogModelTag.photographer_name) {
    entryName = selectedPhotogModelTag.photographer_name;
  } else if(selectedPhotogModelTag.model_name) {
    entryName = selectedPhotogModelTag.model_name;
  } else if(selectedPhotogModelTag.tag_name) {
    entryName = selectedPhotogModelTag.tag_name;
  }

  const [ newEntryName, setNewEntryName ] = useState(modalType === "Edit" 
    ? entryName
    : ''
  );
  
  const handleEntryNameChange = (e) => {
    setNewEntryName(e.target.value);
  };
  
  const handleCloseModal = () => {
    setShowPhotogModelTagModal(false);
  };

  const handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      handleEntry();
    }
  };
  
  const handleEntry = async () => {
    const tokenIsExpired = await checkTokenExpiration(setIsLoggedIn, navigate);

    if(tokenIsExpired) {
      return;
    }
  
    if(isLoggedIn) {

      if(modalType !== "Delete" && newEntryName.length < 2) {
        return toast.error(`${entryType} names must be at least 2 characters long`);
      }

      if(modalType !== "Delete" && entryType === "Tag") {
        
        for(const letter of newEntryName) {
          if(letter === " ")  {
            return toast.error("Tag names can not contain spaces")
          }
        }
      }

      let newEntryData;

      if(modalType !== "Delete") {
        newEntryData = {};
        entryType === 'Photographer'
          ? newEntryData.photographer_name = newEntryName.trim()
          : entryType === 'Model'
          ? newEntryData.model_name = newEntryName.trim()
          : newEntryData.tag_name = newEntryName.trim()
      }
      
      const endPoint = `${BASE_URL}/${entryType.toLowerCase()}s/${modalType.toLowerCase()}${modalType !== "Add" ? `/${id}` : ""}`

      const method = modalType === "Add"
        ? "POST"
        : modalType === "Delete"
        ? "DELETE"
        : "PUT"

      try {
        setIsLoading(true);

        const requestOptions = {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        };

        if(method !== "DELETE") {
          requestOptions.body = JSON.stringify(newEntryData);
        }

        const response = await fetch(endPoint, requestOptions);

        if(response.ok) {
          if(method === "DELETE") {
            toast.success(`${entryName} successfully deleted`);
            setTimeout(() => {
              setIsLoading(false);
            }, minLoadingInterval);
          } else {
            toast.success(`${newEntryName} successfully ${modalType.toLowerCase()}ed`);
          }

          if(entryType === "Photographer") {
            setShouldUpdatePhotographers(true);
          } else if (entryType === "Model") {
            setShouldUpdateModels(true);
          } else if (entryType === "Tag") {
            setShouldUpdateTags(true);
          }

        } else {
          const errorData = await response.json();
          console.error("Error:", errorData);
          if(response.status === 409) {
            setIsLoading(false);
            return toast.error(errorData.message);
          } else if(response.status === 401) {
            setTimeout(() => {
              setIsLoading(false);
            }, minLoadingInterval);
            setIsLoggedIn(false);
            handleNavigateHome()
            return toast.error("Please login again...");
          } else {
            setTimeout(() => {
              setIsLoading(false);
            }, minLoadingInterval)
            return toast.error(`Failed to ${modalType.toLowerCase()} ${entryType} ${newEntryName}`);
          }
        }
      } catch(error) {
        console.error("Error:", error);
        return toast.error(`Error ${modalType.toLowerCase()}ing ${entryType} ${entryName}: ${error}`);
      } finally {
        setSelectedPhotogModelTag({});
        setShowPhotogModelTagModal({modalType: null});
        setIsLoading(false);
      }
    }
};
  
  return (
    <>
      <div 
        className="photogOrModelModal"
        onClick={handleCloseModal}
      >
        <div 
          className="photogOrModelModal__modal"
          onClick={(e) => e.stopPropagation()}
        >
          <h4 className="photogOrModelModal__modalType">
            {modalType} {entryType}
          </h4>
          <h3 className="photogOrModelModal__heading">

            {modalType === "Delete"
              ? `${modalType} `
              : modalType === "Add"
              ? `Enter name below:`
              : `Update entry below:`
            }
            {modalType === "Delete" 
              ? 
                <span 
                  className='photogOrModelModal__entryName'
                >
                  "{entryName}"?
                </span>
              :  null
            }
          </h3>

          {modalType === "Delete"
            ? <p 
                className="photogOrModelModal__explainer"
              >
                You will have to add {entryType === "Tag" ? "it" : "them"} back if you want to use {entryType === "Tag" ? "it" : "them"} in a new Shoot. 
              </p>
            : null
          }

          {modalType !== "Delete"
            ? <input 
                className='photogOrModelModal__input'
                placeholder={`Enter new name`}
                type="text" 
                value={newEntryName}
                onChange={(e) => handleEntryNameChange(e)}
                onKeyDown={handleKeyPress}
                autoFocus
              />
            : null
          }
          
          <div 
            className="photogOrModelModal__button-container"
          >
            <button
              className="photogOrModelModal__button photogOrModelModal__button--add"
              onClick={handleEntry}>
                {modalType === "Delete"
                  ? "Delete"
                  : modalType === "Add"
                  ? "Create"
                  : "Update"
                }
            </button>
            <button
              className="photogOrModelModal__button photogOrModelModal__button--cancel"
              onClick={handleCloseModal}>
                Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  )};

export default PhotogOrModelModal;
