import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import { Landing } from "./Screens/Landing";
import { Game } from "./Screens/Game";
function App() {
  

  return (
    <div className="h-screen w-screen max-h-screen max-w-screen bg-darkPurple">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>} /> 
        <Route path="/game" element={<Game/>} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
