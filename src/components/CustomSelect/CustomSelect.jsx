import React, { useState, useRef } from 'react';
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

  // console.log(chooserNo)

  const [ selectValue, setSelectValue ] = useState(null);
  const [ showOptions, setShowOptions ] = useState(false);
  const selectRef = useRef(null);

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
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
    if(selectRef.current) {
      selectRef.current.scrollTop = 0;
    }
  }
  
  // console.log(selectEntry)


  // addChooser function: needs to push a new chooserId onto the photographerChooserIDs || modelChooserIDs with the chooserIdx of the next entry incremented and the photographerID || modeID as null
  return (
    <div 
      className={`customSelect ${showOptions 
        ? "tall" 
        : ""}`}
    >
      <div 
        className={`customSelect__select ${showOptions 
          ? "tall" 
          : ""}`} 
        ref={selectRef}
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
              (!showOptions && !selectValue) || (showOptions && !selectValue) 
              ||(showOptions && selectValue)
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
        </div>
        {selectOptions.map(option => 
          <div 
            className={`customSelect__option ${showOptions 
              ? "show" 
              : ""}`} 
            key={option.id} onClick={() => handleUpdateSelectValue(option)}>
              {option.photographer_name || option.model_name}
          </div>
        )}
      </div>
    </div>
  )};

export default CustomSelect;
