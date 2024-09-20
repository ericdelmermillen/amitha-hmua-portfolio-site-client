import "./ShootPlaceHolder.scss"

const ShootPlaceHolder = ({ isOnShootDetails }) => {
  
  return (
    <>
      <div className="shootPlaceholder">
        <div className="shootPlaceholder__placeholder-img"></div>
        <div className={`shootPlaceholder__placeholder-textContainer ${isOnShootDetails 
          ? "hide" 
          : ""}`}
        >
          <div className="shootPlaceholder__placeholder-models"></div>
          <div className={"shootPlaceholder__placeholder-photographers"}></div>
        </div>
      </div>
      
    </>
  )};

export default ShootPlaceHolder;