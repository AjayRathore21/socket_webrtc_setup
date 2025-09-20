import { BrowserRouter, Route, Routes } from "react-router-dom";
import Lobby from "./Lobby";
import Room from "./Room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
