import React from "react";
import { Socket } from "socket.io-client";

export interface SocketContextType {
  socket: Socket | null;
}

export const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined
);
