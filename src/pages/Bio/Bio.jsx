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
  };

  // placeholder planning:
  // --hero image and caption
  // set specific heights for hero-container and hero-img relative to breakpoints
  // container around image with position relative
  // img and imgPlaceholder position absolute with z-index for placeholder higher
  // conditional class on placeholder to transition the opacity to 0 or change the z-index after image is fully loaded
  // same with hero-caption
  // --text section
  // render several fake paragraphs (3-4, with 3-6 lines each) at the top of the text container with the real paragraphs hidden with display none until hero-img loaded
  
  return (
    <>
      <div className="bio">
        <div 
          className={`bio__inner`}
        >
          <div className="bio__hero-container">
            <img
              className="bio__hero-img"
              src={bioPic}
              alt="Hero Image of Amitha Millen-Suwanta"
              onLoad={handleImageLoad}
            />
            <h3 className='bio__hero-caption'>
              Amitha Millen-Suwanta
            </h3>
          </div>
          <div className="bio__divider"></div>
          <div className="bio__text-container">
            <p className="bio__text">
              Meet Amitha, a dynamic makeup artist and fashion stylist who thrives on celebrating the unique beauty of each person. With a deep understanding that beauty knows no bounds, she rejects the notion of a one-size-fits-all approach to makeup. Instead, she crafts bespoke experiences for her clients, considering their individuality, comfort levels, and personal style. 
            </p>
            <p className="bio__text">
              Located in the heart of Toronto, Ontario, Amitha's professional journey has been a whirlwind of diverse experiences within the beauty industry. Though she revels in all aspects of her craft, her passion ignites most brightly within the realms of Fashion and Bridal makeup. 
            </p>
            <p className="bio__text">
              From esteemed corporations to celebrated singers, actors, and brands across Canada, the USA, and the UK, Amitha and her team ensure that each client embarks on a unique and unforgettable beauty journey.
            </p>
          </div>
        </div>
      </div>
    </>
  )};

export default Bio;