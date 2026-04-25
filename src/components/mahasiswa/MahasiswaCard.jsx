import { useNavigate } from "react-router-dom";

const AVATAR_PALETTE = [
  { bg: "bg-emerald-100", text: "text-emerald-700" },
  { bg: "bg-teal-100", text: "text-teal-700" },
  { bg: "bg-cyan-100", text: "text-cyan-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-rose-100", text: "text-rose-700" },
  { bg: "bg-indigo-100", text: "text-indigo-700" },
  { bg: "bg-lime-100", text: "text-lime-700" },
  { bg: "bg-orange-100", text: "text-orange-700" },
];

export default function MahasiswaCard({ mahasiswa }) {
  const navigate = useNavigate();

  // 🔹 SAFE destructuring (biar gak undefined)
  const { nama = "", nim = "", angkatan, info_setoran = {} } = mahasiswa || {};

  // 🔹 Ambil data setoran (fallback 0)
  const progres = info_setoran?.persentase_progres_setor ?? 0;
  const sudahSetor = info_setoran?.total_sudah_setor ?? 0;
  const totalWajib = info_setoran?.total_wajib_setor ?? 0;
  const terakhir = info_setoran?.terakhir_setor ?? null;

  // 🔹 Avatar initials (SAFE)
  const initials = (nama || "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w?.[0] ?? "")
    .join("")
    .toUpperCase();

  // 🔹 Warna avatar berdasarkan nim (SAFE)
  const lastDigit = parseInt((nim || "0").slice(-1)) || 0;
  const pal = AVATAR_PALETTE[lastDigit % AVATAR_PALETTE.length];

  // 🔹 Warna progress
  const progressColor =
    progres >= 80
      ? "bg-emerald-400"
      : progres >= 40
        ? "bg-accent"
        : "bg-amber-400";

  return (
    <button
      onClick={() => navigate(`/setoran/${nim}`)}
      className="
        w-full text-left group
        flex items-center gap-4
        px-5 py-4
        bg-surface rounded-2xl
        border border-soft/70
        shadow-card
        hover:shadow-card-hover
        hover:border-accent/30
        hover:-translate-y-0.5
        transition-all duration-200
      "
    >
      {/* 🔹 Avatar */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-[13px] font-bold flex-shrink-0 ${pal.bg} ${pal.text}`}
      >
        {initials || "?"}
      </div>

      {/* 🔹 Info utama */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-secondary truncate group-hover:text-primary transition-colors">
            {nama || "Nama tidak tersedia"}
          </p>

          {angkatan && (
            <span className="hidden sm:inline-flex text-[10px] font-semibold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full flex-shrink-0">
              {angkatan}
            </span>
          )}
        </div>

        {/* 🔹 NIM */}
        <p className="text-[11px] text-muted mt-0.5 font-mono tracking-wider">
          {nim || "-"}
        </p>

        {/* 🔹 Progress */}
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex-1 h-1 bg-soft rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{ width: `${progres}%` }}
            />
          </div>

          <span className="text-[10px] font-semibold text-muted flex-shrink-0">
            {totalWajib > 0 ? `${sudahSetor}/${totalWajib}` : "-"}
          </span>
        </div>

        {/* 🔹 Last setoran */}
        {terakhir && terakhir !== "Belum ada" && (
          <p className="text-[10px] text-muted/70 mt-1 truncate">
            Terakhir: {terakhir}
          </p>
        )}
      </div>

      {/* 🔹 Arrow */}
      <svg
        className="w-4 h-4 text-soft group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
