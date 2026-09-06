import React, { createContext, useContext, useState, useEffect } from "react";
import { subscribeServerStatus, getServerStatus } from "../services/api";

const ServerStatusContext = createContext(null);

export const ServerStatusProvider = ({ children }) => {
  const [serverStatus, setServerStatus] = useState(getServerStatus);

  useEffect(() => {
    const unsubscribe = subscribeServerStatus((status) => {
      setServerStatus({ ...status });
    });
    return () => unsubscribe();
  }, []);

  return (
    <ServerStatusContext.Provider value={serverStatus}>
      {children}
    </ServerStatusContext.Provider>
  );
};

export const useServerStatus = () => {
  const context = useContext(ServerStatusContext);
  if (!context) {
    // Return a safe fallback if used outside provider
    return {
      isWakingUp: false,
      isRetrying: false,
      retryAttempt: 0,
      maxRetries: 3,
      status: "idle",
      message: ""
    };
  }
  return context;
};
