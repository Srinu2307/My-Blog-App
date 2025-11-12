import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import AuthPage from  "./Auth.js";
import BlogModule from "./BlogModule.jsx";

export default function App() {
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<BlogModule/>} />
      <Route path="/auth" element={<AuthPage/>} />
    </Routes>
    </BrowserRouter>
  )
}

