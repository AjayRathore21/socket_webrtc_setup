import React, { useCallback, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import { useSocket } from "./useSocket";

import { useNavigate } from "react-router-dom";
const Lobby = () => {
  const { socket } = useSocket();
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  // const [hasSomeOneJoined, setHasSomeOneJoined] = React.useState('');

  const handleJoinRoom = useCallback(
    (data: any) => {
      console.log("User joined room:", data);

      // setHasSomeOneJoined(data.name);
      navigate(`/room/${data.roomId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket?.on("room-join", handleJoinRoom);

    return () => {
      socket?.off("room-join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const name = formData.get("name") as string;
      const roomId = formData.get("roomId") as string;

      console.log("Joining room:", { name, roomId }, socket);

      const data = { name, roomId };

      socket?.emit("room-join", data);
    },
    [socket]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <ReactPlayer
        ref={videoRef}
        playing
        muted
        width="400px"
        height="300px"
        style={{ border: "1px solid black" }}
      />
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <input name="name" type="text" placeholder="Your name" required />
        <input name="roomId" type="number" placeholder="Room ID" required />
        <button type="submit">Join Call</button>
      </form>
    </div>
  );
};

export default Lobby;
