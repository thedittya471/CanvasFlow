"use client";

import React, { createContext, useContext } from "react";

interface DashboardContextType {
  openCreateFormModal: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ 
  children, 
  value 
}: { 
  children: React.ReactNode; 
  value: DashboardContextType; 
}) => {
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
