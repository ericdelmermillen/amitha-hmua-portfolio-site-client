import { useState, useEffect, useRef, useContext } from 'react';
import AppContext from '../../AppContext.jsx';
import DownIcon from '../../assets/icons/DownIcon.jsx';
import './NavSelect.scss';

const NavSelect = ({ 
  selectOptions, 
 }) => {
  
  const {
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

  const handleToggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  // --

  const handleDownArrowClicked = (e) => {
    e.stopPropagation();

    if(showOptions) {
      setShowOptions(false);
    } else if(!showOptions) {
      setShowOptions(true);
    }
    console.log("downArrow clicked")
  }

  const handleHomeLinkClick = () => {
    setSelectValue(null);
    setSelectedTag(null);
    setShowSideNav(false);
    handleNavigateHome(true, false, null);
  };

  // --
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

  // --


  const handleTopOptionClicked = () => {
    setShowSideNav(false);
    if(showOptions) {
      setShowOptions(false);
      console.log("work clicked with menu open");
      setSelectValue(null);

      setTimeout(() => {
        handleNavigateHome(true, false, null);
      }, minLoadingInterval);

    } else if(!showOptions) {
      setShowOptions(false);

      if(selectValue) {
        const foundOption = selectOptions.find(option => option.tag_name.toLowerCase() === selectValue.toLowerCase());
        handleUpdateSelectValue(foundOption);  



        setTimeout(() => {
        }, minLoadingInterval);

          console.log(foundOption)
        }

      if(!selectValue) {
        setTimeout(() => {
          handleNavigateHome(true, false, null);
        }, minLoadingInterval);
      }

      console.log(selectValue)

      console.log("work clicked with menu closed")
    }
  }

  // --
  
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
                // onClick={handleToggleShowOptions}
                onClick={handleTopOptionClicked}
            >
              <span 
                className={`navSelect__default-option 
                ${(!showOptions && !selectValue) 
                  || (showOptions && !selectValue) 
                  || (showOptions && selectValue)
                  ? "show" 
                  : "hide"}`}
                  // onClick={showOptions 
                  //   ? handleHomeLinkClick
                  //   : null}
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
              <div 
                className="navSelect__down"
                // onClick={handleToggleShowOptions}
                onClick={(e) => handleDownArrowClicked(e)}
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
