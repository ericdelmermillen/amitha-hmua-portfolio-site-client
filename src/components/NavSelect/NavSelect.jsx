import { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import './NavSelect.scss';

const NavSelect = ({ 
  // chooserType, 
  selectOptions, 


  chooserName

 }) => {

  
  const {
    // showPhotogModelTagModal, 
    // setShowPhotogModelTagModal,
    // setSelectedPhotogOrModel,
    // selectedPhotogModelTag, 
    // setSelectedPhotogModelTag,
  } = useContext(AppContext);

  const [ selectValue, setSelectValue ] = useState(null);
  const [ showOptions, setShowOptions ] = useState(false);
  const innerRef = useRef(null);

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleHomeClick = () => {
    setSelectValue(null);
  }
  
  const handleTouchOff = () => {
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  }

  const handleUpdateSelectValue = (option) => {
    setSelectValue(option.tag_name);
    setShowOptions(false);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  }

  useEffect(() => {
    if(chooserName) {
      setSelectValue(chooserName)
    }
  }, [chooserName])
  
  return (
    <>
      <div 
        className={`navSelect ${showOptions 
          ? "tall" 
          : "short"}`}
          >
        <div 
          ref={innerRef}
          className={`navSelect__inner ${showOptions 
            ? "tall" 
            : ""
          }`}
        >

          <div 
            className={`navSelect__select ${showOptions 
              ? "tall" 
              : ""}`} 
              >
            <div 
              className={`navSelect__selectValue ${!showOptions 
                ? "short" 
                : ""}`} 
                onClick={handleToggleShowOptions}
            >
              <span 
                className={`navSelect__default-option 
                ${(!showOptions && !selectValue) 
                  || (showOptions && !selectValue) 
                  || (showOptions && selectValue)
                  ? "show" 
                  : "hide"}`}
                  onClick={handleHomeClick}
                  >
                WORK
              </span>
              <span 
                className={`navSelect__default-option 
                ${
                  (showOptions && !selectValue) || (!showOptions && selectValue) 
                  ? "show" 
                  : "hide"}`}
                  >
                {selectValue && `# ${selectValue.toUpperCase()}`}
              </span>
              <div className="navSelect__down">

                <DownIcon 
                  // className={"down__icon"}
                  // classNameStroke={"down__stroke"}
                  className={"navSelect__down-icon"}
                  classNameStroke={"navSelect__down-stroke"}
                  />
              </div>
            </div>

            {selectOptions.map(option => 
              <div 
                className={`navSelect__option`} 
                key={option.id} onClick={() => handleUpdateSelectValue(option)}
              >
                {`# ${option.tag_name.toUpperCase()}`}
              </div>
            )}
          </div>
        </div>
      </div>
      <div 
        className={`navSelect__touchOffDiv ${showOptions 
          ? "show"
          : ""}`}
        onClick={handleTouchOff}
      ></div> 
    </>
  )};

export default NavSelect;
