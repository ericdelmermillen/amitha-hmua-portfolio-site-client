import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../AppContext.jsx';
import DeleteIcon from '../../assets/icons/DeleteIcon.jsx';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import EditIcon from '../../assets/icons/EditIcon.jsx';
import './CustomSelect.scss';

const CustomSelect = ({ 
  chooserNo,
  chooserName,
  chooserType, 
  chooserIDs,
  setChooserIDs,
  selectOptions, 
  entryNameType
 }) => {
  
  const {
    setShowPhotogModelTagModal,
    setSelectedPhotogModelTag,
  } = useAppContext();

  const [ selectValue, setSelectValue ] = useState(null);
  const [ showOptions, setShowOptions ] = useState(false);
  const innerRef = useRef(null);

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const alreadySelected = (chooserID) => {
    const entryID = `${chooserType.toLowerCase()}ID`;

    for(const chooser of chooserIDs) {
      if(chooser[entryID] === chooserID) {
        return true;
      }
    }
  };
  
  const handleTouchOff = () => {
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  };

  const handleOptionClick = (e, option, modalType, entryType) => {
  
    if(modalType !== "Add") {
      e.stopPropagation();
      setSelectedPhotogModelTag(option);
    } else {
      if(entryType === "photographer_name") {
        setSelectedPhotogModelTag({id: null, photographer_name: null});
      } else if(entryType === "model_name") {
        setSelectedPhotogModelTag({id: null, model_name: null});
      } else if(entryType === "tag_name") {
        setSelectedPhotogModelTag({id: null, tag_name: null});
      } 
    }
    setShowPhotogModelTagModal({modalType: modalType});
  };

  const handleUpdateSelectValue = (option) => {
    setSelectValue(option.photographer_name || option.model_name || option.tag_name);

    const newChooserIDs = [...chooserIDs];
  
    if(chooserType === "Photographer") {
      const found = chooserIDs.find(chooserID => chooserID.photographerID === option.id);
      
      if(!found) {
        newChooserIDs.forEach(chooserID => chooserID.chooserNo === chooserNo 
          ? chooserID.photographerID = option.id
          : null
        )
      }
  
    } else if(chooserType === "Model") {
      const found = chooserIDs.find(chooserID => chooserID.modelID === option.id);

      if(!found) {
        if(!found) {
          newChooserIDs.forEach(chooserID => chooserID.chooserNo === chooserNo 
            ? chooserID.modelID = option.id
            : null
          )
        }
      }
    } else if(chooserType === "Tag") {
      const found = chooserIDs.find(chooserID => chooserID.tagID === option.id);

      if(!found) {
        if(!found) {
          newChooserIDs.forEach(chooserID => chooserID.chooserNo === chooserNo 
            ? chooserID.tagID = option.id
            : null
          )
        }
      }
    }
  
    setChooserIDs(newChooserIDs);
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  };

  useEffect(() => {
    if(chooserName) {
      setSelectValue(chooserName);
    }
  }, [chooserName]);
  
  return (
    <>
      <div 
        className={`customSelect ${showOptions 
          ? "tall" 
          : "short"}`}
      >
        <div 
          ref={innerRef}
          className={`customSelect__inner ${showOptions 
            ? "tall" 
            : ""
          }`}
        >

          <div 
            className={`customSelect__select ${showOptions 
              ? "tall" 
              : ""}`} 
          >
            <div 
              className={`customSelect__selectValue ${!showOptions 
                ? "short" 
                : ""}`} 
              onClick={handleToggleShowOptions}
            >
              <span 
                className={`customSelect__default-option 
                ${(!showOptions && !selectValue) 
                  || (showOptions && !selectValue) 
                  || (showOptions && selectValue)
                    ? "show" 
                    : "hide"}`}
              >
                --Select {chooserType}--
              </span>
              <span 
                className={`customSelect__default-option 
                  ${
                    (showOptions && !selectValue) || (!showOptions && selectValue) 
                    ? "show" 
                    : "hide"}`}
              >
                {selectValue}
              </span>
              <div className="down">
                <DownIcon 
                  className={"down__icon"}
                  classNameStroke={"down__stroke"}
                />
              </div>
            </div>

            {selectOptions.map(option => 
              <div 
                className={`customSelect__option ${showOptions && alreadySelected(option.id)
                  ? "show disabled"
                  : showOptions
                  ? "show"
                  : ""}`} 
                key={option.id} onClick={() => handleUpdateSelectValue(option)}
              >
                {option.photographer_name || option.model_name || option.tag_name}
                <div 
                  className="customSelect__option--edit-icon"
                  onClick={(e) => handleOptionClick(e, option, "Edit")}
                >
                  <EditIcon 
                    className={"editSvg"}
                    classNameStroke={"editStroke"}
                  />
                </div>
                <div 
                  className="customSelect__option--delete-icon"
                  onClick={(e) => handleOptionClick(e, option, "Delete")}
                >
                  <DeleteIcon 
                    className={"deleteSvg"}
                    classNameStroke={"deleteStroke"}
                  />
                </div>
              </div>
            )}
            
            <div 
              className="customSelect__option customSelect__option--addNew"
              onClick={(e) => handleOptionClick(e, null, "Add", entryNameType)}
            >
              Add New Entry
            </div>
          </div>
        </div>
      </div>
      <div 
        className={`customSelect__touchOffDiv ${showOptions 
          ? "show"
          : ""}`}
        onClick={handleTouchOff}
      ></div>
    </>
  )};

export default CustomSelect;
