import React, { createContext, useContext, useState } from "react";

const RegulationContext = createContext();

export const RegulationProvider = ({ children }) => {
  const [regulation, setRegulation] = useState("");

  return (
    <RegulationContext.Provider value={{ regulation, setRegulation }}>
      {children}
    </RegulationContext.Provider>
  );
};

export const useRegulation = () => {
  return useContext(RegulationContext);
};
