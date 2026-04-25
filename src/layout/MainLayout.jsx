// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = () => {
  return (
    // Outer layer: Gw set bg-slate-100/50 biar efek "ngambang" dan rounded-nya kelihatan kontras.
    // Kalau pake bg-white, lengkungannya bakal nyaru sama background.
    <div className="flex min-h-screen bg-slate-100/50 font-sans">
      {/* Sidebar — fixed width, punya margin m-4 dan rounded-3xl bawaan */}
      <Sidebar />

      {/* ✨ THE MAGIC WRAPPER ✨
        - ml-[272px] = w-64 (256px) + margin kiri (16px) -> Biar presisi di sebelah sidebar
        - my-4 mr-4 = Kasih jarak atas, bawah, dan kanan persis 16px
        - h-[calc(100vh-2rem)] = Tinggi 100% layar dikurangin margin atas-bawah (2rem / 32px)
        - rounded-3xl = Samain radius lengkungannya sama Sidebar
        - overflow-hidden = Wajib! Biar ujung Topbar gak tajem dan nurut sama lengkungan wrapper
      */}
      <div className="flex-1 flex flex-col ml-[272px] h-[calc(100vh-2rem)] my-4 mr-4 bg-slate-50 rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative">
        <Topbar />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
