// Room.tsx
import { useCallback, useEffect, useState } from "react";
import { useSocket } from "./useSocket";
import usePeer from "./usePeer";

const Room = () => {
  console.log("Room component rendered");
  const { getOffer, getAnswer, setRemoteDescription, peer } = usePeer();
  const { socket } = useSocket();

  const [remoteUser, setRemoteUser] = useState("");
  const [remoteSocketId, setRemoteSocketId] = useState("");
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const handleUserJoin = useCallback((data: any) => {
    console.log("User joined room:", data);
    setRemoteUser(data.name);
    setRemoteSocketId(data.socketId);
  }, []);

  const handleIncomingCall = useCallback(
    async (data: any) => {
      console.log("Incoming call with data:", data);
      const { offer, from } = data;
      setRemoteSocketId(from);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);

      // add my tracks to peer
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));

      const answer = await getAnswer(offer);
      console.log("Generated answer:", answer);
      socket?.emit("call-accepted", { answer, to: from });
    },
    [socket, peer, getAnswer]
  );

  const handleCallAccepted = useCallback(
    async (data: any) => {
      console.log("Call accepted with data:", data);
      const { answer,from } = data;
      await setRemoteDescription(answer);

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit("ice-candidate", {
            candidate: event.candidate,
            to: from,
          });
        }
      };
    },
    [setRemoteDescription]
  );

  const handleNegotiationNeeded = useCallback(
    async (data: any) => {
      const { offer, from } = data;
      console.log("Negotiation needed with data:", data);
      const ans = await getAnswer(offer);
      socket?.emit("peer-negotiation-done", { answer: ans, to: from });
    },
    [socket, getAnswer]
  );

  const handleNegotiationDone = useCallback(
    async (data: any) => {
      const { answer } = data;
      console.log("Final negotiation with data:", data);
      await setRemoteDescription(answer);
    },
    [setRemoteDescription]
  );

  useEffect(() => {
    peer.addEventListener("track", async (event) => {
      const remoteStream = event.streams[0];
      setRemoteStream(remoteStream);
    });
  }, [peer]);

  const handleIceCandidate = useCallback(
    async (data: any) => {
      const { candidate } = data;
      console.log("Received ICE candidate:", candidate);
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added successfully");
      } catch (error) {
        console.error("Error adding received ICE candidate", error);
      }
    },
    [peer]
  );

  useEffect(() => {
    console.log("Room component mounted");

    socket?.on("user-connected", handleUserJoin);
    socket?.on("incoming-call", handleIncomingCall);
    socket?.on("call-accepted", handleCallAccepted);
    socket?.on("peer-negotiation", handleNegotiationNeeded);
    socket?.on("peer-negotiation-done", handleNegotiationDone);
    socket?.on("ice-candidate", handleIceCandidate);

    return () => {
      console.log("Room component unmounted");
      socket?.off("user-connected", handleUserJoin);
      socket?.off("incoming-call", handleIncomingCall);
      socket?.off("call-accepted", handleCallAccepted);
      socket?.off("peer-negotiation", handleNegotiationNeeded);
      socket?.off("peer-negotiation-done", handleNegotiationDone);
    };
  }, [
    socket,
    handleUserJoin,
    handleIncomingCall,
    handleCallAccepted,
    handleNegotiationNeeded,
    handleNegotiationDone,
    handleIceCandidate,
  ]);

  const handleUserCall = useCallback(async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setMyStream(mediaStream);

    // add my tracks to peer
    mediaStream
      .getTracks()
      .forEach((track) => peer.addTrack(track, mediaStream));

    const offer = await getOffer();
    console.log("Generated offer:", offer);
    socket?.emit("call-user", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket, peer, getOffer]);

  return (
    <div>
      <h1>Room</h1>
      <p>This is the room page.</p>
      <p>You are connected to: {remoteUser}</p>
      {remoteSocketId && <button onClick={handleUserCall}>Call</button>}

      <div>
        {myStream && (
          <video
            autoPlay
            muted
            playsInline
            ref={(video) => {
              if (video) video.srcObject = myStream;
            }}
          />
        )}
        {remoteStream && (
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = remoteStream;
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Room;
