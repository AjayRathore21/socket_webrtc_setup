import React, { useMemo } from "react";
import { io } from "socket.io-client";
import { SocketContext } from "./SocketContext";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = (props: SocketProviderProps) => {
  const socket = useMemo(() => io("http://localhost:3001"), []);
  const { children } = props;

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
