import React, { useState, useRef } from 'react';
import './CustomSelect.scss';

const CustomSelect = ({ selectOptions, updateSelectedOption }) => {
  const [ selectValue, setSelectValue ] = useState("Initial Value");
  const [ showOptions, setShowOptions ] = useState(false);
  const selectRef = useRef(null);

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  }

  const handleUpdateSelectValue = (option) => {
    setSelectValue(option.model_name);
    setShowOptions(false);
    // Reset scroll position to top
    if(selectRef.current) {
      selectRef.current.scrollTop = 0;
    }

  }
  
  return (
    <div className={`customSelect ${showOptions ? "tall" : ""}`}>
      <div className={`customSelect__select ${showOptions ? "tall" : ""}`} ref={selectRef}>
        <div className={`customSelect__selectValue ${!showOptions ? "short" : ""}`} onClick={handleToggleShowOptions}>
          {selectValue}
        </div>
        {selectOptions.map(option => 
          <div className={`customSelect__option ${showOptions ? "show" : ""}`} key={option.id} onClick={() => handleUpdateSelectValue(option)}>
            {option.model_name}
          </div>
        )}
      </div>
    </div>
  )};

export default CustomSelect;
