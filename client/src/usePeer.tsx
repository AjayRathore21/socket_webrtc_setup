// usePeer.ts
import { useMemo } from "react";

const usePeer = () => {
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [
          {
            urls: ["stun:stun.l.google.com:19302"],
          },
        ],
      }),
    []
  );

  const getOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  };

  const getAnswer = async (offer: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(new RTCSessionDescription(answer));
    return answer;
  };

  const setRemoteDescription = async (desc: RTCSessionDescriptionInit) => {
    await peer.setRemoteDescription(new RTCSessionDescription(desc));
  };

  const setLocalDescription = async (desc: RTCSessionDescriptionInit) => {
    await peer.setLocalDescription(new RTCSessionDescription(desc));
  };

  return {
    getOffer,
    getAnswer,
    setRemoteDescription,
    setLocalDescription,
    peer,
  };
};

export default usePeer;
