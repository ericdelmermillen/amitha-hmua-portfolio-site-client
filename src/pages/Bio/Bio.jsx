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
  } = useContext(AppContext);

  const [ componentIsLoaded, setIsComponentLoaded ] = useState(false);

  // fetch bioPageData useEffect
  useEffect(() => {
    if(!bioText.length || !bioName.length || !bioImg.length) {
      console.log("calling for bio data")
      setIsLoading(true);

      const fetchBioData = async () => {
  
        try {
          const response = await fetch(`${BASE_URL}/bio`);

          if(response.ok) {
            const data = await response.json();
            setBioText(data.bioText);
            setBioName(data.bioName);
            setBioImg(data.bioImgURL);
          } else {
            throw new Error("Error fetching bio page content")
          }

        } catch(error) {
          console.log(error);
          toast.error(error);
        }
      }

      fetchBioData();
    }

    setTimeout(() => {
      setIsLoading(false)
      setIsComponentLoaded(true);
    }, minLoadingInterval);
  }, []);
  
  return (
    <>
      <div className="bio">
        <div 
          className={"bio__inner"}
        >
          <div className="bio__hero-container">

            <div className="bio__heroImg-container">

              <div className={`bio__heroImg--placeholder ${componentIsLoaded 
                ? "hide" 
                : ""}`}
              ></div>
              <img
                className={`bio__heroImg ${componentIsLoaded 
                  ? "show" 
                  : ""}`}
                src={bioImg}
                alt="Hero Image of Amitha Millen-Suwanta"
              />
            </div>
            <h3 className={`bio__heroCaption ${componentIsLoaded 
              ? "" 
              : "show"}`}
            >
              {bioName}
              <span className="bio__heroCaption--placeholder"></span>
            </h3>
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

        {isLoggedIn 
          ? 
            <div className="bio__button-container">
              <button
                className='bio__edit-button'
                >
                Update Bio
              </button>
            </div>

          : null
        }

      </div>
    </>
  )};

export default Bio;