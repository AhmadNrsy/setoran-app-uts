import MahasiswaCard from "./MahasiswaCard";

export default function MahasiswaGroup({ angkatan, mahasiswaList }) {
  // 🔹 Hitung total setoran (SAFE: kalau field gak ada → 0)
  const totalSudah = mahasiswaList.reduce(
    (sum, m) => sum + (m.info_setoran?.total_sudah_setor ?? 0),
    0,
  );

  const totalWajib = mahasiswaList.reduce(
    (sum, m) => sum + (m.info_setoran?.total_wajib_setor ?? 0),
    0,
  );

  const avgProgres =
    totalWajib > 0 ? Math.round((totalSudah / totalWajib) * 100) : 0;

  const progressColor =
    avgProgres >= 80
      ? "bg-emerald-400"
      : avgProgres >= 40
        ? "bg-accent"
        : "bg-amber-400";

  return (
    <div className="mb-8 animate-fade-in-up">
      {/* 🔥 HEADER GROUP */}
      <div className="flex items-center gap-3 mb-3 px-1">
        {/* 🔹 Label Angkatan */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-1 h-5 bg-accent rounded-full" />
          <span className="text-[11px] font-bold text-secondary/60 tracking-[0.12em] uppercase">
            Angkatan {angkatan}
          </span>
        </div>

        {/* 🔹 Jumlah mahasiswa */}
        <span className="inline-flex items-center gap-1.5 bg-background text-muted text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-soft">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          {mahasiswaList.length} mahasiswa
        </span>

        {/* 🔹 Avg progress (kalau data belum ada → tetap 0%) */}
        <span className="inline-flex items-center gap-1.5 bg-background text-muted text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-soft">
          <svg
            className="w-3 h-3 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          Avg {avgProgres}%
        </span>

        {/* 🔹 Divider */}
        <div className="flex-1 h-px bg-soft" />
      </div>

      {/* 🔥 LIST MAHASISWA */}
      <div className="flex flex-col gap-2">
        {mahasiswaList.map((mhs, i) => (
          <div
            key={mhs.nim || i}
            style={{ animationDelay: `${i * 35}ms` }}
            className="animate-[fadeInUp_0.3s_ease_both]"
          >
            <MahasiswaCard mahasiswa={mhs} />
          </div>
        ))}
      </div>
    </div>
  );
}
