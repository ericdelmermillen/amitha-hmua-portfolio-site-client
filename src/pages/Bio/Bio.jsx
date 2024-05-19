import AppContext from '../../AppContext';
import { useState, useContext } from 'react';
import bioPic from '../../assets/images/bio-pic.jpg';
import './Bio.scss';

const Bio = () => {
  const { 
    setIsLoading,
    minLoadingInterval
  } = useContext(AppContext);

  const [ componentIsLoaded, setIsComponentLoaded ] = useState(false);

  const handleImageLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsComponentLoaded(true);
    }, minLoadingInterval);
    // }, 2000);
    // }, 5000);
  };
  
  return (
    <>
      <div className="bio">
        <div 
          className={`bio__inner`}
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
                src={bioPic}
                alt="Hero Image of Amitha Millen-Suwanta"
                onLoad={handleImageLoad}
              />
            </div>
            <h3 className={`bio__heroCaption ${componentIsLoaded 
              ? "" 
              : "show"}`}
            >
              Amitha Millen-Suwanta
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
            <p className={`bio__text ${componentIsLoaded 
              ? "show" 
              : ""}`}
            >
              Meet Amitha, a dynamic makeup artist and fashion stylist who thrives on celebrating the unique beauty of each person. With a deep understanding that beauty knows no bounds, she rejects the notion of a one-size-fits-all approach to makeup. Instead, she crafts bespoke experiences for her clients, considering their individuality, comfort levels, and personal style. 
            </p>
            <p className={`bio__text ${componentIsLoaded 
              ? "show" 
              : ""}`}
            >
              Located in the heart of Toronto, Ontario, Amitha's professional journey has been a whirlwind of diverse experiences within the beauty industry. Though she revels in all aspects of her craft, her passion ignites most brightly within the realms of Fashion and Bridal makeup. 
            </p>
            <p className={`bio__text ${componentIsLoaded 
              ? "show" 
              : ""}`}
            >
              From esteemed corporations to celebrated singers, actors, and brands across Canada, the USA, and the UK, Amitha and her team ensure that each client embarks on a unique and unforgettable beauty journey.
            </p>
          </div>
        </div>
      </div>
    </>
  )};

export default Bio;