import { useState, useRef, useEffect } from 'react';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import EditIcon from '../../assets/icons/EditIcon.jsx';
import DeleteIcon from '../../assets/icons/DeleteIcon.jsx'
import './CustomSelect.scss';

const CustomSelect = ({ 
  chooserNo,
  chooserType, 
  selectOptions, 
  setSelectOptions,
  chooserIDs,
  setChooserIDs,
  selectEntry, 
  setSelectedOption }) => {

  const [ selectValue, setSelectValue ] = useState(null);
  const [ showOptions, setShowOptions ] = useState(false);
  const innerRef = useRef(null);

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  }
  
  const handleTouchOff = () => {
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  }

  // need to make the edit and delete buttons trigger the PhotogOrModelModal
  const handleEditOptionClick = (e, option) => {
    console.log(`Edit ${option.photographer_name || option.model_name}?`)
    e.stopPropagation();
  }

  const handleDeleteOptionClick = (e, option) => {
    console.log(`Delete ${option.photographer_name || option.model_name}?`)
    e.stopPropagation();
  }

  const handleUpdateSelectValue = (option) => {
    setSelectValue(option.photographer_name || option.model_name);

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
    }
  
    setChooserIDs(newChooserIDs)
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  }
  
  return (
    <>
      <div 
        className={`customSelect ${showOptions 
          ? "tall" 
          : "short"}`}
      >
        <div 
          ref={innerRef}
          className={`customSelect__inner 
            ${showOptions 
                ? "tall" 
                : ""
            }`
          }
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
                ${
                  (!showOptions && !selectValue) || (showOptions && !selectValue) ||
                  (showOptions && selectValue)
                    ? "show" 
                    : "hide"}
                `}
              >
                -- Select {chooserType} --
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
                className={`customSelect__option ${showOptions 
                  ? "show" 
                  : ""}`} 
                key={option.id} onClick={() => handleUpdateSelectValue(option)}>
                  {option.photographer_name || option.model_name}
                <div 
                  className="customSelect__option--edit-icon"
                  onClick={(e) => handleEditOptionClick(e, option)}
                >
                  <EditIcon 
                    className={"editSvg"}
                    classNameStroke={"editStroke"}
                  />
                </div>
                <div 
                  className="customSelect__option--delete-icon"
                  onClick={(e) => handleDeleteOptionClick(e, option)}
                >
                  <DeleteIcon 
                    className={"deleteSvg"}
                    classNameStroke={"deleteStroke"}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div 
        className={`customSelect__touchOffDiv ${showOptions 
          ? "show"
          : ""}`
        }
        onClick={handleTouchOff}
      ></div>
    </>
  )};

export default CustomSelect;