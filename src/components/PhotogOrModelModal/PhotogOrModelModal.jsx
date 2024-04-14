import './PhotogOrModelModal.scss';
import AppContext from '../../AppContext.jsx';
import { useState, useContext } from 'react';
import { toast } from "react-toastify";

const PhotogOrModelModal = () => {

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn, 
    setIsLoggedIn,
    showAddPhotogOrModelModal, 
    setShowAddPhotogOrModelModal,
    shouldUpdatePhotographers, 
    setShouldUpdatePhotographers,
    shouldUpdateModels, 
    setShouldUpdateModels,
    showEditPhotogOrModelModal, 
    setShowEditPhotogOrModelModal,
    selectedPhotogOrModel, 
    setSelectedPhotogOrModel,

    // 
    showPhotogOrModelModal, 
    setShowPhotogOrModelModal,
    // 
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  // modalType & entryType for UI as well as endpoint and request type
  const { modalType } = showPhotogOrModelModal;

  const entryType = selectedPhotogOrModel.photographer_name
    ? "Photographer"
    : "Model"

  // selectedPhotogOrModel values
  const { photographer_name, model_name, id } = selectedPhotogOrModel;

  // console.log(`photographer: ${photographer_name || "undefined"}, model: ${model_name || "undefined"}, id: ${id}`)
  // 

  // const entryType = showPhotogOrModelModal.entryType;
  // console.log(`modalType: ${modalType}, entryType: ${entryType}`)

  // const id = selectedPhotogOrModel.id;

  const entryName = entryType === "Photographer"
    ? selectedPhotogOrModel.photographer_name
    : selectedPhotogOrModel.model_name;


  const [ newEntryName, setNewEntryName ] = useState('');

  const handleEntryNameChange = (e) => {
    setNewEntryName(e.target.value);
  }
  
  const handleCloseModal = () => {
    setShowPhotogOrModelModal(false);
  }

  const handleEntry = async () => {
    if(isLoggedIn) {
      
      if(modalType !== "Delete" && newEntryName.length < 2) {
        return toast.error(`${entryType} names must be at least 2 characters long`);
      }

      let newEntryData;
      if(modalType !== "Delete") {
        newEntryData = {};
        entryType === 'Photographer'
          ? newEntryData.photographer_name = newEntryName
          : newEntryData.model_name = newEntryName;
          console.log(newEntryData)
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
          } else {
            toast.success(`${newEntryName} successfully ${modalType.toLowerCase()}ed`);
          }

          if(entryType === "Photographer") {
            setShouldUpdatePhotographers(true);
          } else if (entryType === "Models") {
            setShouldUpdateModels(true);
          }
          
          setShowPhotogOrModelModal({entryType: null});
          setIsLoading(false);
        } else {
          // Handle error responses here
          // For example:
          // const errorData = await response.json();
          // console.error("Error:", errorData);
          toast.error(`Failed to ${modalType.toLowerCase()} ${entryType} ${entryName}`);
          setIsLoading(false);
        }
      } catch(error) {
        console.error("Error:", error);
        toast.error(`Error ${modalType.toLowerCase()}ing ${entryType} ${entryName}: ${error}`);
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
          <h3 className="photogOrModelModal__heading">

            {modalType === "Delete"

              ? `${modalType} ${entryType} ${entryName} from the database?"`
              : `Enter new ${entryType} name below`

            }
            {/* *{modalType} {entryType} {entryName}{modalType === "Delete" && " from the database?"} */}
          </h3>

          {modalType === "Delete"
            ? <p 
                className="photogOrModelModal__explainer"
              >
                You will have to add them back if you want to use them in a new Shoot. 
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
