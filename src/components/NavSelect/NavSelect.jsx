import { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import { useNavigate } from 'react-router-dom';
import './NavSelect.scss';

const NavSelect = ({ 
  selectOptions, 
  // chooserName,
  handleHomeClick
 }) => {

  
  const {
    selectedTag,
    setSelectedTag,
    minLoadingInterval, 
    setMinLoadingInterval,
    shouldUpdateShoots,
    setShouldUpdateShoots
  } = useContext(AppContext);

  const [ selectValue, setSelectValue ] = useState(null);
  const [ showOptions, setShowOptions ] = useState(false);
  const innerRef = useRef(null);

  const navigate = useNavigate();

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  const handleHomeLinkClick = () => {
    if(selectValue) {
      handleHomeClick()
    }

    setSelectValue(null);
    setSelectedTag(null);
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

    setTimeout(() => {
      setSelectedTag(option);
      navigate(`/work?tag=${option.tag_name}`);
    }, minLoadingInterval);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  }

  // useEffect(() => {
  //   if(chooserName) {
  //     setSelectValue(chooserName)
  //   }
  // }, [chooserName])
  
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
                  onClick={handleHomeLinkClick}
                  >
                Work
              </span>
              <span 
                className={`navSelect__default-option 
                ${
                  (showOptions && !selectValue) || (!showOptions && selectValue) 
                  ? "show" 
                  : "hide"}`}
                  >
                {selectValue && `# ${selectValue}`}
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
                {`# ${option.tag_name}`}
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
