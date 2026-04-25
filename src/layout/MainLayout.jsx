// src/layout/MainLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-100/50 font-sans">
      <Sidebar />

      {/* ✨ UDAH DI-FIX: ml-[320px] biar kaga nabrak Sidebar ✨ */}
      <div className="flex-1 flex flex-col ml-[320px] h-[calc(100vh-2rem)] my-4 mr-4 bg-slate-50 rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden relative">
        <Topbar />

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
