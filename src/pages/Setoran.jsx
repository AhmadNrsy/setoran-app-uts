// src/pages/Setoran.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// 🔥 Import motion & AnimatePresence buat handling transisi ganti state
import { motion, AnimatePresence } from "framer-motion";
import { getPaSaya } from "../services/setoranService";

// ==========================================
// 📌 UTILS: GENERATE INITIALS
// ==========================================
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w?.[0] ?? "")
    .join("")
    .toUpperCase();
}

// ==========================================
// 🦴 SKELETON LOADER (PERCEIVED PERFORMANCE)
// ==========================================
const SkeletonCard = () => {
  return (
    <div className="bg-surface p-6 border border-soft rounded-2xl shadow-card animate-pulse flex flex-col h-full">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-soft/60 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-soft/60 rounded-md w-3/4"></div>
          <div className="h-3 bg-soft/60 rounded-md w-1/2"></div>
        </div>
      </div>
      <div className="mt-8 pt-5 border-t border-soft/50 flex justify-between items-center">
        <div className="h-3 bg-soft/60 rounded-md w-1/3"></div>
        <div className="h-6 bg-soft/60 rounded-full w-16"></div>
      </div>
    </div>
  );
};

// ==========================================
// 📌 MOTION VARIANTS (Premium Transition)
// ==========================================
// Variants buat container utama (nge-handling stagger children)
const stageVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  },
  exit: {

    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const groupVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function Setoran() {
  const navigate = useNavigate();

  const [mahasiswa, setMahasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ==========================================
  // 📌 FETCH DATA API DENGAN ARTIFICIAL DELAY
  // ==========================================
  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        setLoading(true);
        const res = await getPaSaya();
        const daftarMhs =
          res?.data?.info_mahasiswa_pa?.daftar_mahasiswa ??
          res?.info_mahasiswa_pa?.daftar_mahasiswa ??
          [];
        setMahasiswa(daftarMhs);
      } catch (err) {
        console.error("ERROR FETCH MAHASISWA:", err);
      } finally {
        // Skeleton delay.
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchMahasiswa();
  }, []);

  // ==========================================
  // 📌 FILTER & GROUPING LOGIC (AMAN KAGA DISENTUH)
  // ==========================================
  const filteredMahasiswa = mahasiswa.filter((mhs) => {
    const keyword = searchQuery.toLowerCase();
    return (
      mhs.nama?.toLowerCase().includes(keyword) ||
      mhs.nim?.toLowerCase().includes(keyword)
    );
  });

  const groupedMahasiswa = filteredMahasiswa.reduce((acc, mhs) => {
    const yearCode = mhs.nim?.length >= 3 ? mhs.nim.substring(1, 3) : "XX";
    const angkatan = `Angkatan 20${yearCode}`;
    if (!acc[angkatan]) acc[angkatan] = [];
    acc[angkatan].push(mhs);
    return acc;
  }, {});

  const sortedAngkatanKeys = Object.keys(groupedMahasiswa).sort().reverse();

  return (
    // Utama tetep pake Tailwind animation biar header muncul cepet
    <div className="p-8 space-y-10 animate-fade-in-up">
      {/* 🧭 HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 bg-surface p-6 rounded-2xl border border-soft shadow-card relative z-10">
        <div>
          <h1 className="text-3xl font-black text-secondary tracking-tight">
            Daftar Mahasiswa
          </h1>
          <p className="text-muted font-medium mt-1">
            Pantau progres setoran mahasiswa bimbingan kamu di sini.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <svg
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted"
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
            placeholder="Cari nama atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-soft text-secondary text-sm font-bold pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-accent outline-none transition-all shadow-sm placeholder:text-muted placeholder:font-medium"
          />
        </div>
      </div>

      {/* 📇 CONTENT AREA WITH MOTION */}
      <div>
        {/* 🔥 AnimatePresence mode="wait" bikin skeleton ngilang dulu, baru konten muncul */}
        <AnimatePresence mode="wait">
          {loading ? (
            // 🦴 RENDER SKELETON Block (motion.div)
            <motion.div
              key="skeleton-stage" // Unique key buat AnimatePresence tracker
              variants={stageVariants}
              initial="hidden"
              animate="show"
              exit="exit" // Efek ngilang pelan ke atas
              className="space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-6 w-32 bg-soft/60 rounded-md animate-pulse"></div>
                <div className="h-px bg-soft flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            </motion.div>
          ) : sortedAngkatanKeys.length === 0 ? (
            // 🛑 KONDISI KOSONG (motion.div)
            <motion.div
              key="empty-stage"
              variants={stageVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="col-span-full py-16 text-center bg-surface border border-dashed border-soft rounded-2xl"
            >
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-lg font-black text-secondary">
                Data Tidak Ditemukan
              </h3>
              <p className="text-muted font-medium text-sm mt-1">
                Coba ketik nama atau NIM yang lain bro.
              </p>
            </motion.div>
          ) : (
            // ✅ RENDER DATA BERDASARKAN GRUP ANGKATAN (motion.div)
            <motion.div
              key="content-stage"
              variants={stageVariants} // Stagger Children (grup muncul bergantian)
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-10"
            >
              {sortedAngkatanKeys.map((angkatan) => (
                <motion.div
                  key={angkatan}
                  variants={groupVariants}
                  className="space-y-5"
                >
                  {/* 🏷️ Group Header */}
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black text-secondary tracking-tight">
                      {angkatan}
                    </h2>
                    <div className="h-px bg-soft flex-1"></div>
                    <span className="text-[10px] font-black text-brand-700 bg-brand-50 border border-brand-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {groupedMahasiswa[angkatan].length} Mahasiswa
                    </span>
                  </div>

                  {/* 📇 Grid Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groupedMahasiswa[angkatan].map((mhs) => {
                      const totalSetor =
                        mhs.info_setoran?.total_sudah_setor ?? 0;
                      const progressStatus =
                        totalSetor > 0 ? "AKTIF" : "STAGNAN";

                      return (
                        <div
                          key={mhs.nim}
                          onClick={() => navigate(`/setoran/${mhs.nim}`)}
                          className="group bg-surface p-6 border border-soft rounded-2xl shadow-card hover:shadow-card-hover cursor-pointer transition-all hover:-translate-y-1 flex flex-col h-full"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-brand-50 text-brand-700 text-lg font-black flex items-center justify-center rounded-full shadow-inner border border-brand-100 group-hover:scale-105 transition-transform flex-shrink-0">
                              {getInitials(mhs.nama)}
                            </div>
                            <div className="overflow-hidden">
                              <h3
                                className="font-bold text-secondary text-base truncate"
                                title={mhs.nama}
                              >
                                {mhs.nama}
                              </h3>
                              <p className="text-[10px] font-black text-muted uppercase tracking-widest mt-0.5">
                                {mhs.nim}
                              </p>
                            </div>
                          </div>

                          <div className="mt-8 pt-5 border-t border-soft/50 flex justify-between items-center">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-secondary">
                                {totalSetor}
                              </span>
                              <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                Surah
                              </span>
                            </div>

                            <span
                              className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${
                                progressStatus === "AKTIF"
                                  ? "bg-brand-50 text-brand-600 border-brand-100"
                                  : "bg-status-cancelBg text-error border-status-cancelBorder"
                              }`}
                            >
                              {progressStatus}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
