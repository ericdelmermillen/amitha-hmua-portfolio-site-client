import AppContext from '../../AppContext';
import { useState, useEffect, useContext } from 'react';
import './Bio.scss';

const Bio = () => {
  const { 
    isLoading, 
    setIsLoading
  } = useContext(AppContext);

  const [ componentIsLoaded, setIsComponentLoaded ] = useState(false)

  const handleImageLoad = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsComponentLoaded(true)
    }, 1000)
  }

  useEffect(() => {
    setIsLoading(true);
  }, []); 
  
  
  return (
    <>
      <div className="bio">
        <div className={`bio__inner ${componentIsLoaded ? "show": ""}`}>
          <img 
            src="https://scontent-ord5-1.xx.fbcdn.net/v/t39.30808-6/432584672_10161253506945768_7528924934946103991_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=pbCwTwumOBMAX-bI_Cd&_nc_ht=scontent-ord5-1.xx&oh=00_AfBIUwxmOy6nX2CUFV1mQ5f2EYyMwcyBGsnCjSLu4-CEnA&oe=66099017" 
            alt="" 
            className="bio__hero-img" 
            onLoad={handleImageLoad}
          />
          <div className="bio__text-container">
            <p className="bio__text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia totam ab doloribus sunt error! Nihil esse officia quae quisquam temporibus quasi aspernatur earum aliquid, commodi corrupti minus saepe maiores iste, doloremque praesentium laboriosam illo fugiat cupiditate.
            </p>
            <p className="bio__text">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta ullam doloremque temporibus, fuga deleniti laborum! Praesentium distinctio commodi obcaecati! Consectetur ducimus a assumenda perspiciatis ut.
            </p>
            <p className="bio__text">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta eaque non optio omnis molestiae ullam saepe voluptate repudiandae doloremque recusandae eligendi, provident cum natus neque cumque facilis perspiciatis facere eos repellat tempore quod ratione commodi similique. Facilis odit voluptate explicabo.
            </p>
          </div>
        </div>

        <div className={`placeholder__inner ${componentIsLoaded && "hide"}`}>
          <div src="" alt="" className="placeholder__hero-img"></div>
          <div className="placeholder__text-container">
            <div className="placeholder__text placeholder__text--1"></div>
            <div className="placeholder__text placeholder__text--2"></div>
            <div className="placeholder__text placeholder__text--3"></div>
          </div>
        </div>
      </div>
    </>
  )};

export default Bio;