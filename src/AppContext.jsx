import React, { createContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <>
      <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
        {children}
      </AppContext.Provider>
    </>
  )};

export default AppContext;
