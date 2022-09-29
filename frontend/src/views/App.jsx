import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import Boards from "./Boards";
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header></Header>

        <Routes>
          <Route path="/boards" element={<Boards />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
