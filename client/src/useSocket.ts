import React from "react";
import { SocketContext } from "./SocketContext";

export const useSocket = () => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a ContextProvider");
  }
  return context;
};
