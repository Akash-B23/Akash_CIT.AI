import React, { createContext, useContext, useState } from "react";

const DepartmentContext = createContext();

export const DepartmentProvider = ({ children }) => {
  const [department, setDepartment] = useState(null);

  return (
    <DepartmentContext.Provider value={{ department, setDepartment }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartment = () => useContext(DepartmentContext);
