// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("client_id", import.meta.env.VITE_CLIENT_ID);
      params.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
      params.append("grant_type", "password");
      params.append("username", username);
      params.append("password", password);
      params.append("scope", "openid profile email");

      const res = await axios.post(
        `${import.meta.env.VITE_KC_URL}/realms/dev/protocol/openid-connect/token`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      // 🔐 SIMPAN TOKEN ASLI!
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);

        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Autentikasi Berhasil!",
          confirmButtonColor: "#2DD4A0",
          background: "#FFFFFF",
          color: "#0D2B22",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard");
        });
      }
    } catch (err) {
      console.error("Login Error:", err);
      Swal.fire({
        icon: "error",
        title: "Autentikasi Gagal",
        text: "Pastikan Email sudah Terdaftar.",
        confirmButtonColor: "#E53E3E",
        background: "#FFFFFF",
        color: "#0D2B22",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-10 relative z-10"
      >
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="w-16 h-16 bg-primary text-accent rounded-2xl flex items-center justify-center shadow-inner border border-primary/50 mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Setoran
          </h1>
          <p className="text-accent text-xs font-black uppercase tracking-[0.3em] mt-1">
            Hafalan
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            {/* Ubah label jadi Username karena Keycloak pakenya username */}
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
              Username / Email
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username atau email"
              className="w-full bg-slate-50 border border-slate-200 text-secondary text-sm font-bold px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-muted/60"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 text-secondary text-sm font-bold px-5 py-3.5 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-muted/60"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-forest-600 text-surface font-black px-5 py-4 rounded-xl uppercase text-xs tracking-widest transition-all shadow-soft mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-muted mt-8">
          Sistem Informasi Validasi Hafalan UIN Suska
        </p>
      </motion.div>
    </div>
  );
}
