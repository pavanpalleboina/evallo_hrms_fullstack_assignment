import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url ="http://localhost:4040/login"
      const options ={
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }

      const response = await fetch(url,options);
      const data = await response.json();

      if (!response.ok) {
        // Backend sends error message in 'message' or use generic
        throw new Error(data.message || "Login failed");
      }

      // On success, save token and navigate
      localStorage.setItem("token", data.token);
      setError("");
      navigate("/dashboard",{ replace: true });
    } catch (err) {
      // Show error message
      setError(err?.message);
    }
  };

  const handleClickRegister = () => {
    navigate("/register", { replace: true });
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h1>HRM System Login!</h1>
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <div className="buttons-container">
          <button type="submit" className="button">Login</button>
          <button type="button" className="button" onClick={handleClickRegister}>Register</button>
        </div>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}

    </div>
  );
}

export default Login;
