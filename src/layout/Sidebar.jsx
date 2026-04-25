import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPaSaya } from "../services/setoranService";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: "Setoran",
    path: "/setoran",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { user } = useAuth();

  const [dosen, setDosen] = useState(null);

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const res = await getPaSaya();
        setDosen(res?.data ?? res);
      } catch (err) {
        console.error("Gagal fetch data dosen di Sidebar", err);
      }
    };
    fetchDosen();
  }, []);

  const displayName = dosen?.nama ?? user?.name ?? user?.nama ?? "Dosen PA";
  const displayEmail = user?.email ?? "Dosen Pembimbing";

  const initials =
    displayName
      .split(" ")
      .slice(0, 2)
      .map((w) => w?.[0] ?? "")
      .join("")
      .toUpperCase() || "PA";

  return (
    // 🔥 CUMA GANTI BAGIAN INI DOANG (w-64 -> w-72) 🔥
    <aside className="fixed left-0 top-0 h-screen w-72 z-30">
      <div className="h-[calc(100vh-2rem)] m-4 flex flex-col bg-secondary rounded-3xl shadow-deep overflow-hidden">
        {/* ── Brand ── */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2DD4A0"
                strokeWidth="2"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm tracking-wide leading-tight">
                Setoran
              </p>
              <p className="text-accent text-[11px] font-semibold tracking-widest uppercase mt-0.5">
                Hafalan
              </p>
            </div>
          </div>
        </div>

        {/* ── Semester Aktif card ── */}
        <div className="px-4 pt-5">
          <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3.5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white/40 text-[10px] font-semibold tracking-widest uppercase">
                Semester Aktif
              </p>
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            </div>
            <p className="text-white text-sm font-bold">Ganjil 2025/2026</p>
            <div className="mt-2.5 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[68%] bg-gradient-to-r from-accent to-brand-300 rounded-full" />
            </div>
            <p className="text-white/30 text-[10px] mt-1">68% selesai</p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-4 py-5 flex flex-col gap-1">
          <p className="text-muted text-[10px] font-semibold uppercase tracking-[0.12em] px-3 mb-3">
            Navigasi
          </p>

          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-white/[0.10] text-white border border-white/[0.08]"
                    : "text-white/45 hover:text-white/80 hover:bg-white/[0.05]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors duration-200 ${isActive ? "text-accent" : "text-white/30 group-hover:text-accent/70"}`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-5 rounded-full bg-accent" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User profile ── */}
        <div className="px-4 pb-5 pt-3 border-t border-white/[0.07]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="w-9 h-9 rounded-xl bg-accent/25 border border-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-accent">
                {initials}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-white/85 text-xs font-semibold truncate leading-tight"
                title={displayName}
              >
                {displayName}
              </p>
              <p
                className="text-white/30 text-[10px] truncate leading-tight mt-0.5"
                title={displayEmail}
              >
                {displayEmail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
