"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LocationContextType {
  currentLocation: string;
  setLocation: (loc: string) => void;
  isLocationModalOpen: boolean;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}

export default function LocationProvider({ children }: { children: React.ReactNode }) {
  const [currentLocation, setCurrentLocationState] = useState("Sector 46, Gurugram");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("apnadoodh_location");
    if (savedLocation) {
      setCurrentLocationState(savedLocation);
    }
  }, []);

  const setLocation = (loc: string) => {
    setCurrentLocationState(loc);
    localStorage.setItem("apnadoodh_location", loc);
  };

  const openLocationModal = () => setIsLocationModalOpen(true);
  const closeLocationModal = () => setIsLocationModalOpen(false);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}
