import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      alert("Login gagal bro");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-surface p-8 rounded-3xl shadow-card w-80"
      >
        <h2 className="text-xl font-bold text-primary mb-6">Login Dosen</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-3 rounded-xl border border-soft"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 rounded-xl border border-soft"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-primary text-white py-3 rounded-xl">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
