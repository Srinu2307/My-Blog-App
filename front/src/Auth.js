import React, { useState } from "react";
import {useNavigate} from 'react-router-dom'
import "./AuthPage.css";

export default function AuthPage() {
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleRegister = async(e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (err) {
      setMessage("An error occurred at registration");
    }
  };

  const handleLogin = async(e) =>{
    e.preventDefault();
    try{
          const response = await fetch('http://localhost:3001/api/auth/login',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: loginEmail, password: loginPassword}) 
          })

          const result = await response.json();
          if(result.token){
            localStorage.setItem('token',result.token);
            navigate('/')
          }
          else{
            setMessage(result.message);
          }
    }
    catch(error){
      setMessage("An error occurred at login");
    }
  }

  

  return (
    <div className="auth-body">
      
      <div className="auth-container">
       
        <div className="form-section authform">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Your Name"
              onChange={(e) => setRegisterName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Your Password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
        </div>

        <div className="form-section authform">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Your Email"
              onChange={(e) => setLoginEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Your Password"
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>

        <p>{message}</p>
      </div>
    </div>
  );
}
