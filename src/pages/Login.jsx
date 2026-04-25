// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (
        email === "muhammad.fikri@uin-suska.ac.id" &&
        password === "muhammad.fikri"
      ) {
        localStorage.setItem("token", "token-sakti-uts-123");
        Swal.fire({
          icon: "success",
          title: "Login Berhasil",
          text: "Selamat datang kembali, Muhammad Fikry, S.T., M.Sc.",
          confirmButtonColor: "#2DD4A0",
          background: "#FFFFFF",
          color: "#0D2B22",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/dashboard");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Autentikasi Gagal",
          text: "Kredensial SSO tidak valid atau tidak terdaftar di sistem.",
          confirmButtonColor: "#E53E3E",
          background: "#FFFFFF",
          color: "#0D2B22",
        });
        setIsLoading(false);
      }
    }, 1200); // Delay dikit 1.2 detik
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Ornamen Background Estetik */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent/20 rounded-full blur-[100px]"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-10 relative z-10"
      >
        {/* Logo & Branding */}
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

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">
              Email / NIP
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email kampus dosen..."
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
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-surface"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-center text-[10px] font-bold text-muted mt-8">
          Sistem Informasi Validasi Hafalan UIN Suska
        </p>
      </motion.div>
    </div>
  );
}
