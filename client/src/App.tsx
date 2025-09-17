import React from "react";
import ReactPlayer from "react-player";

function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const videoRef = React.useRef<HTMLVideoElement>(null);

  // useEffect(() => {
  //   if (videoRef.current) {
  //     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //       .then((stream) => {
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           videoRef.current.play();
  //         }
  //       })
  //       .catch((error) => {
  //         console.error('Error accessing media devices.', error);
  //       });
  //   }
  // }, []);

  return (
    <>
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
          style={{ width: "400px", height: "300px", border: "1px solid black" }}
        />
        <ReactPlayer
          ref={videoRef}
          style={{ width: "400px", height: "300px", border: "1px solid black" }}
        />

        <form
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
          action={`${apiUrl}/join-call`}
          method="POST"
        >
          <input type="text" />
          <input type="number" />
          <button type="submit">Join Call</button>
        </form>
      </div>
    </>
  );
}

export default App;
