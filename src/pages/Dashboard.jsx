// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from "framer-motion"; // 👈 Import Motion di sini!
import { getPaSaya } from "../services/setoranService";

// ==========================================
// 📌 MOTION VARIANTS (Buat Animasi Premium)
// ==========================================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Efek muncul bergantian tiap 0.15 detik
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [dosenData, setDosenData] = useState(null);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPaSaya();
        setDosenData(res?.data ?? res);
      } catch (err) {
        console.error("ERROR FETCH DASHBOARD:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // HANDLERS
  const handleExportReport = () => {
    Swal.fire({
      icon: "info",
      title: "Fitur Segera Hadir! 🚀",
      text: "Fitur Export Report (PDF/Excel) sedang dalam tahap sinkronisasi data untuk pembaruan sistem mendatang.",
      confirmButtonColor: "#2DD4A0",
      background: "#FFFFFF",
      color: "#0D2B22",
    });
  };

  const daftarMahasiswa = dosenData?.info_mahasiswa_pa?.daftar_mahasiswa ?? [];
  const totalMahasiswa = daftarMahasiswa.length;
  const sudahSetor = daftarMahasiswa.filter(
    (m) => (m.info_setoran?.total_sudah_setor ?? 0) > 0,
  ).length;
  const belumSetor = totalMahasiswa - sudahSetor;
  const persenSudah =
    totalMahasiswa > 0 ? Math.round((sudahSetor / totalMahasiswa) * 100) : 0;

  if (loading)
    return (
      <div className="h-full flex items-center justify-center text-accent font-bold italic animate-pulse">
        Menyiapkan Dashboard... ⏳
      </div>
    );

  // 💥 Perhatikan tag <motion.div> di bawah ini!
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-8 space-y-8"
    >
      {/* 🎓 HEADER SECTION */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted font-medium mt-1">
            Welcome back,{" "}
            <span className="text-secondary font-bold">
              {dosenData?.nama || "Dosen PA"}
            </span>{" "}
            👋
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="bg-primary hover:bg-forest-600 text-surface px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-soft flex items-center gap-2"
        >
          <span>⬇️ Export Report</span>
        </button>
      </motion.div>

      {/* 📊 STAT CARDS */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-surface p-6 rounded-2xl border border-soft shadow-card hover:shadow-card-hover transition-all">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">
            Total Mahasiswa
          </p>
          <div className="flex items-center gap-3 mt-2">
            <h3 className="text-4xl font-black text-secondary">
              {totalMahasiswa}
            </h3>
            <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-2 py-1 rounded-md tracking-tighter">
              ↑ 100%
            </span>
          </div>
          <p className="text-[10px] text-muted font-bold mt-4 pt-4 border-t border-soft/50 uppercase tracking-tight">
            Total Bimbingan Aktif
          </p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-soft shadow-card hover:shadow-card-hover transition-all">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">
            Aktif Muroja'ah
          </p>
          <div className="flex items-center gap-3 mt-2">
            <h3 className="text-4xl font-black text-secondary">{sudahSetor}</h3>
            <span className="bg-brand-50 text-brand-600 text-[10px] font-bold px-2 py-1 rounded-md tracking-tighter">
              ↑ {persenSudah}%
            </span>
          </div>
          <p className="text-[10px] text-muted font-bold mt-4 pt-4 border-t border-soft/50 uppercase tracking-tight">
            Mahasiswa Berprogres
          </p>
        </div>

        <div className="bg-surface p-6 rounded-2xl border border-soft shadow-card hover:shadow-card-hover transition-all">
          <p className="text-[10px] font-black text-muted uppercase tracking-widest">
            Belum Setor
          </p>
          <div className="flex items-center gap-3 mt-2">
            <h3 className="text-4xl font-black text-secondary">{belumSetor}</h3>
            <span className="bg-status-cancelBg text-error text-[10px] font-bold px-2 py-1 rounded-md tracking-tighter">
              ↓ Perlu Push
            </span>
          </div>
          <p className="text-[10px] text-muted font-bold mt-4 pt-4 border-t border-soft/50 uppercase tracking-tight">
            Status Stagnan (0 Progres)
          </p>
        </div>
      </motion.div>

      {/* 🛠️ BOTTOM SECTION */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-soft shadow-card p-10 flex items-center justify-center">
          <p className="text-muted font-medium border-2 border-dashed border-soft p-12 rounded-2xl w-full text-center">
            <span className="block mb-3 text-3xl">📊</span>
            Visualisasi grafik tren progres setoran mahasiswa bimbingan akan
            ditampilkan pada area ini untuk pembaruan sistem mendatang.
          </p>
        </div>

        <div className="bg-surface rounded-2xl border border-soft shadow-card p-6 border-t-4 border-t-secondary">
          <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.2em] mb-5">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/setoran")}
              className="w-full bg-background hover:bg-soft/30 border border-soft text-secondary text-xs font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-sm"
            >
              Lihat Daftar Mahasiswa
            </button>
            <button
              onClick={() => navigate("/setoran")}
              className="w-full bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-sm"
            >
              Validasi Setoran Baru
            </button>
          </div>
        </div>
        {/* 🌟 WATERMARK / SIGNATURE FOOTER */}
        <motion.div
          variants={itemVariants}
          className="pt-10 pb-4 flex justify-center w-full"
        >
          <p className="text-[9px] font-black text-muted/60 uppercase tracking-[0.3em] flex items-center gap-2">
            <span>Engineered for Teknik Informatika</span>
            <span className="w-1 h-1 rounded-full bg-accent"></span>
            <span className="text-secondary/70">
              Powered by Ahmad Nurdiansyah
            </span>
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
