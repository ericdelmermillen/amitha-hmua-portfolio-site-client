import { useState } from 'react'
import './TestCustomSelect.scss'

const TestCustomSelect = () => {
  const [ showOptions, setShowOptions ] = useState(false);

  const handleShowOptions = () => {
    setShowOptions(!showOptions)
    console.log(showOptions)
  }

  return (
    <>
      <div 
        className={`testCustomSelect ${showOptions 
          ? "tall"
          : ""}`}
      >
        <div className={`testCustomSelect__inner 
          ${showOptions 
            ? "tall"
            : ""}`}
        >

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            Show Options: {showOptions ? "true" : "false"}        
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

          <div 
            className="testCustomSelect__option"
            onClick={handleShowOptions}
          >
            From Test Select
          </div>

        </div>
      </div>
    </>
  );
};

export default TestCustomSelect;