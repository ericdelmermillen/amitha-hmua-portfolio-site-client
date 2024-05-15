import { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import './NavSelect.scss';

const NavSelect = ({ 
  selectOptions, 
 }) => {
  
  const {
    setIsLoading,
    setSelectedTag,
    minLoadingInterval, 
    handleNavigateHome,
    scrollYPos, 
    prevScrollYPos,
    setShowSideNav,
    selectValue, 
    setSelectValue
  } = useContext(AppContext);

  const [ showOptions, setShowOptions ] = useState(false);
  const innerRef = useRef(null);

  const handleDownArrowClick = (e) => {
    e.stopPropagation();
    showOptions ? setShowOptions(false) : setShowOptions(true);
  }

  const handleUpdateSelectValue = (option) => {
    setSelectValue(option.tag_name);
    setShowOptions(false);
    setShowSideNav(false);

    setTimeout(() => {
      setSelectedTag(option);
      handleNavigateHome(false, true, option);
    }, minLoadingInterval);

    // Reset scroll position to top
    if(innerRef.current) {
      innerRef.current.scrollTop = 0;
    }
  };

  const handleTopOptionClick = () => {
    setShowSideNav(false);
    setShowOptions(false);

    if(showOptions) {
      setSelectValue(null);
      setTimeout(() => {
        handleNavigateHome(true, false, null);
      }, minLoadingInterval);
    } else if(!showOptions) {
      if(selectValue) {
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
        }, minLoadingInterval);
      } else if(!selectValue) {
        setTimeout(() => {
          handleNavigateHome(true, false, null);
        }, minLoadingInterval);
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

  useEffect(() => {
    if(scrollYPos > prevScrollYPos) {
      setShowOptions(false);
    }
  }, [scrollYPos, prevScrollYPos]);
  
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
                onClick={handleTopOptionClick}
            >
              <span 
                className={`navSelect__default-option 
                ${(!showOptions && !selectValue) 
                  || (showOptions && !selectValue) 
                  || (showOptions && selectValue)
                  ? "show" 
                  : "hide"}`}
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
                {selectValue ? `# ${selectValue}` : null}
              </span>
              <div 
                className="navSelect__down"
                onClick={(e) => handleDownArrowClick(e)}
              >
                <DownIcon 
                  className={"navSelect__down-icon"}
                  classNameStroke={"navSelect__down-stroke"}
                />
              </div>
            </div>

            {selectOptions.map(option => 
              <div 
                className={`navSelect__option`} 
                key={option.id} 
                onClick={() => handleUpdateSelectValue(option)}
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
