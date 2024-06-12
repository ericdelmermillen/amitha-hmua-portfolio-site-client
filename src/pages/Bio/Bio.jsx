import AppContext from '../../AppContext';
import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import './Bio.scss';

const Bio = () => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const { 
    isLoggedIn,
    setIsLoggedIn,
    setIsLoading,
    minLoadingInterval,
    bioImg, 
    setBioImg,
    bioName, 
    setBioName,
    bioText, 
    setBioText,
    bioImageNotSet,
    setBioImageNotSet,
    handleDeleteOrEditClick
  } = useContext(AppContext);


  console.log(bioImageNotSet)

  const [ componentIsLoaded, setIsComponentLoaded ] = useState(false);

  const handleEditBioClick = (e) => {
    handleDeleteOrEditClick(e, "Edit Bio", null)
  }

  // fetch bioPageData useEffect
  useEffect(() => {
    if(bioText && bioName) {
      setTimeout(() => {
        setIsLoading(false)
      }, minLoadingInterval);
    }

    if(bioImageNotSet) {
      toast.info("No Bio Image set yet");
    }
  }, [bioText, bioName, bioImg]);
  
  return (
    <>
      <div className="bio">
        <div 
          className={"bio__inner"}
        >
          <div className="bio__hero-container">

            <div className="bio__heroImg-container">

              <div className={`bio__heroImg--placeholder ${componentIsLoaded && bioImg
                ? "hide" 
                : ""}`}
              ></div>
              <img
                className={`bio__heroImg ${componentIsLoaded && bioImg
                  ? "show" 
                  : ""}`}
                src={bioImg}
                alt={`Hero Image of ${bioName}`}
                onLoad={() => setIsComponentLoaded(true)}
              />
            </div>
            <h3 className={`bio__heroCaption ${componentIsLoaded 
              ? "" 
              : "show"}`}
            >
              {bioName}
              <span className="bio__heroCaption--placeholder"></span>
            </h3>


        {isLoggedIn 
          ? 
            <div className="bio__button-container">
              <button
                className='bio__edit-button'
                onClick={handleEditBioClick}
                >
                Edit Bio
              </button>
            </div>

          : null
        }
          </div>
          <div className="bio__divider"></div>
          <div className="bio__text-container">
            <div className={`bio__text-placeholders ${componentIsLoaded 
              ? "hide"
              : ""}`
            }>
              <div className="bio__text-placeholder">
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine bio__placeholder-textLine--50"></div>
              </div>
              <div className="bio__text-placeholder">
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine bio__placeholder-textLine--75"></div>
              </div>
              <div className="bio__text-placeholder">
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine"></div>
                <div className="bio__placeholder-textLine bio__placeholder-textLine--25"></div>
              </div>

            </div>

            {bioText.length 
              ? bioText
                  .split("\n")
                  .filter((paragraph) => paragraph.trim() !== "")
                  .map((paragraph, idx) => 

                (<p 
                  className={`bio__text ${componentIsLoaded 
                    ? "show" 
                    : ""}`}
                  key={idx}
                >
                  {paragraph}
                </p>))

              : null
            }

          </div>


        </div>

      </div>
    </>
  )};

export default Bio;