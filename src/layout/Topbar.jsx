// src/components/Topbar.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getPaSaya } from "../services/setoranService";

// Helper buat ngambil inisial (misal: "Muhammad Fikry" -> "MF")
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w?.[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function Topbar() {
  const [dosen, setDosen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const res = await getPaSaya();
        setDosen(res?.data ?? res);
      } catch (err) {
        console.error("Gagal fetch data dosen di Topbar", err);
      }
    };
    fetchDosen();
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Yakin mau keluar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      background: "#FFFFFF",
      color: "#0D2B22",
    }).then((result) => {
      if (result.isConfirmed) {
        // 🗑️ Clear token dari browser
        localStorage.removeItem("token");

        // 🚀 Redirect ke halaman login
        navigate("/");

        Swal.fire({
          icon: "success",
          title: "Berhasil Keluar",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    });
  };

  const namaDosen = dosen?.nama || "Dosen PA";
  const inisial = dosen?.nama ? getInitials(dosen.nama) : "PA";

  return (
    <div className="h-20 bg-surface border-b border-soft px-8 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      {/* 🔍 SEARCH BAR (Mockup / Command Palette) */}
      <div className="relative w-96 hidden md:block">
        <svg
          className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full bg-background border border-soft text-secondary text-sm pl-11 pr-12 py-2.5 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all placeholder:text-muted/70 font-medium"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd className="bg-surface border border-soft text-muted px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-sm">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* 👤 PROFILE SECTION */}
      <div className="flex items-center gap-6 ml-auto">
        {/* Notification Bell */}
        <button className="relative p-2 text-muted hover:text-secondary transition-colors rounded-full hover:bg-background">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
        </button>

        {/* Profile Info */}
        <div className="flex items-center gap-4 border-l border-soft pl-6">
          <div className="text-right hidden sm:block">
            {/* 📛 NAMA DOSEN DINAMIS */}
            <p className="text-sm font-black text-secondary leading-tight">
              {namaDosen}
            </p>
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest mt-0.5">
              Dosen Pembimbing
            </p>
          </div>
          {/* 📛 INISIAL DINAMIS */}
          <div className="w-10 h-10 bg-brand-100 text-brand-700 font-black text-sm flex items-center justify-center rounded-xl border border-brand-200 shadow-sm cursor-pointer hover:scale-105 transition-transform">
            {inisial}
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-2 text-muted hover:text-error hover:bg-status-cancelBg rounded-xl transition-all ml-2"
            title="Keluar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
