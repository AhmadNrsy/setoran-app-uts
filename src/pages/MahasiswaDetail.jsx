// src/pages/MahasiswaDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getDetailMahasiswa,
  simpanSetoran,
  deleteSetoran,
} from "../services/setoranService";

// ==========================================
// 📌 UTILS: CLEAN UP & FORMATTING
// ==========================================
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w?.[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatKeteranganLog(text = "") {
  if (!text) return "Deskripsi tidak tersedia.";
  return text
    .replace(
      ", serta memilih tanggal muroja'ah undefined",
      " (Tanpa tanggal muroja'ah)",
    )
    .replace("undefined", "(Data tidak valid)");
}

export default function MahasiswaDetail() {
  const { nim } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSurahId, setSelectedSurahId] = useState("");
  const [tanggal, setTanggal] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const ITEMS_PER_PAGE = 8;
  const [pageSetoran, setPageSetoran] = useState(1);
  const [pageLogs, setPageLogs] = useState(1);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getDetailMahasiswa(nim);
      setData(res.data ?? res);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (nim) fetchData();
  }, [nim]);

  // ==========================================
  // 📌 API HANDLERS
  // ==========================================
  const handleTambahSetoran = async () => {
    if (!selectedSurahId || !tanggal) {
      Swal.fire({
        icon: "warning",
        title: "Tahan!",
        text: "Lengkapi surah dan tanggal dahulu.",
        confirmButtonColor: "#2DD4A0",
      });
      return;
    }
    const surahTarget = data?.setoran?.detail?.find(
      (s) => s.id === selectedSurahId,
    );
    const payload = {
      data_setoran: [
        {
          id_komponen_setoran: surahTarget.id,
          nama_komponen_setoran: surahTarget.nama,
        },
      ],
      tgl_setoran: tanggal,
    };
    try {
      await simpanSetoran(nim, payload);
      Swal.fire({
        icon: "success",
        title: "Validated!",
        showConfirmButton: false,
        timer: 1000,
      });
      setSelectedSurahId("");
      fetchData();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Oops!", text: "Gagal tambah data." });
    }
  };

  const handleDeleteSetoran = async (surah) => {
    const res = await Swal.fire({
      title: "Batal Validasi?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#E53E3E",
      confirmButtonText: "Ya, Revoke!",
    });
    if (!res.isConfirmed) return;
    const payload = {
      data_setoran: [
        {
          id: surah.info_setoran.id,
          id_komponen_setoran: surah.id,
          nama_komponen_setoran: surah.nama,
        },
      ],
    };
    try {
      await deleteSetoran(nim, payload);
      Swal.fire({
        icon: "success",
        title: "Revoked!",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchData();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Error!" });
    }
  };

  if (loading)
    return (
      <div className="h-full flex items-center justify-center text-accent font-bold italic animate-pulse">
        Syncing... ⏳
      </div>
    );
  if (!data)
    return (
      <div className="p-10 text-center font-black text-error">
        404 DATA NOT FOUND
      </div>
    );

  const info = data.info ?? {};
  const surahBelumSetor = (data.setoran?.detail ?? []).filter(
    (s) => !s.sudah_setor,
  );
  const surahSudahSetor = (data.setoran?.detail ?? []).filter(
    (s) => s.sudah_setor,
  );
  const sortedLogs = [...(data.setoran?.log ?? [])].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
  );

  // Pagination Logic
  const paginatedSetoran = surahSudahSetor.slice(
    (pageSetoran - 1) * ITEMS_PER_PAGE,
    pageSetoran * ITEMS_PER_PAGE,
  );
  const paginatedLogs = sortedLogs.slice(
    (pageLogs - 1) * ITEMS_PER_PAGE,
    pageLogs * ITEMS_PER_PAGE,
  );

  return (
    <div className="p-8 space-y-8 animate-fade-in-up">
      <button
        onClick={() => navigate(-1)}
        className="text-primary hover:text-accent font-black tracking-tight transition-colors"
      >
        ← KEMBALI
      </button>

      {/* 💳 STUDENT INFO CARD (PREMIUM UPGRADE) */}
      <div className="bg-surface p-6 md:p-8 border border-soft rounded-2xl shadow-card flex flex-col xl:flex-row gap-6 xl:items-center justify-between relative overflow-hidden group">
        {/* Accent Line Kiri */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-accent group-hover:w-2 transition-all"></div>

        {/* 🟢 BAGIAN KIRI: Avatar & Basic Info */}
        <div className="flex items-center gap-5 z-10 pl-2">
          <div className="w-16 h-16 bg-brand-50 text-brand-700 text-xl font-black flex items-center justify-center rounded-2xl border border-brand-100 shadow-inner flex-shrink-0">
            {getInitials(info.nama)}
          </div>
          <div>
            <h2
              className="text-2xl font-black text-secondary leading-tight truncate max-w-[250px] md:max-w-md"
              title={info.nama}
            >
              {info.nama}
            </h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] bg-background border border-soft px-2.5 py-1 rounded-md font-black text-muted uppercase tracking-widest shadow-sm">
                NIM: {info.nim}
              </span>
              <span className="text-[10px] bg-background border border-soft px-2.5 py-1 rounded-md font-black text-muted uppercase tracking-widest shadow-sm">
                SMT {info.semester}
              </span>
            </div>
          </div>
        </div>

        {/* 🟢 BAGIAN KANAN: Detail Info & Progress Bar */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 border-t xl:border-t-0 xl:border-l border-soft pt-5 xl:pt-0 xl:pl-10 z-10 w-full xl:w-auto">
          {/* Kolom 1: Email & Dosen PA */}
          <div className="space-y-4 flex-1 xl:flex-none justify-center flex flex-col">
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">
                Email Mahasiswa
              </p>
              <p className="text-xs font-bold text-secondary">
                {info.email || `${info.nim}@students.uin-suska.ac.id`}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-1">
                Dosen PA
              </p>
              <p className="text-xs font-bold text-secondary">
                {/* 🔥 UDAH DI-FIX: Ngambil nama dari info.dosen_pa.nama atau hardcode Pak Fikry */}
                {info.dosen_pa?.nama || "Muhammad Fikry, S.T., M.Sc."}
              </p>
            </div>
          </div>

          {/* Kolom 2: Progress Indicator (Persentase) */}
          <div className="flex flex-col justify-center min-w-[180px]">
            <p className="text-[9px] font-black text-muted uppercase tracking-widest mb-2">
              Progres Hafalan
            </p>
            <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-3.5 flex flex-col gap-2.5 shadow-sm">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black text-brand-700">
                  {surahSudahSetor.length}
                  <span className="text-xs text-brand-700/60 font-bold">
                    {" "}
                    / {(data.setoran?.detail ?? []).length} Surah
                  </span>
                </span>
                <span className="text-xs font-black text-accent">
                  {(
                    (surahSudahSetor.length /
                      ((data.setoran?.detail ?? []).length || 1)) *
                    100
                  ).toFixed(1)}
                  %
                </span>
              </div>
              {/* Progress Bar Animasi */}
              <div className="w-full bg-brand-200/40 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(45,212,160,0.5)]"
                  style={{
                    width: `${(surahSudahSetor.length / ((data.setoran?.detail ?? []).length || 1)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VALIDATION FORM */}
      <div className="bg-surface p-6 border border-soft rounded-2xl shadow-card border-t-4 border-t-accent space-y-4">
        <h3 className="font-black text-secondary uppercase text-[10px] tracking-widest">
          Validasi Baru
        </h3>
        <div className="flex flex-col md:flex-row gap-3">
          {/* 🔥 CUSTOM DROPDOWN */}
          <div className="relative flex-1">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between border border-soft bg-background px-4 py-3 rounded-xl transition-all font-bold text-sm"
            >
              <span
                className={selectedSurahId ? "text-secondary" : "text-muted"}
              >
                {selectedSurahId
                  ? `${surahBelumSetor.find((s) => s.id === selectedSurahId)?.nama} (${surahBelumSetor.find((s) => s.id === selectedSurahId)?.label})`
                  : "Pilih Surah..."}
              </span>
              <svg
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                ></div>
                <ul className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto bg-surface border border-soft rounded-xl shadow-deep py-2 custom-scrollbar animate-fade-in">
                  {surahBelumSetor.map((s) => (
                    <li
                      key={s.id}
                      onClick={() => {
                        setSelectedSurahId(s.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-2.5 cursor-pointer text-sm font-bold flex items-center justify-between transition-colors border-l-4 ${selectedSurahId === s.id ? "bg-brand-50 border-accent text-brand-700" : "hover:bg-background border-transparent text-secondary"}`}
                    >
                      <span>{s.nama}</span>
                      <span
                        className={`text-[10px] tracking-wider uppercase ${selectedSurahId === s.id ? "text-brand-500" : "text-muted"}`}
                      >
                        {s.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="border border-soft bg-background px-4 py-3 rounded-xl font-bold text-secondary"
          />
          <button
            onClick={handleTambahSetoran}
            className="bg-primary hover:bg-forest-600 text-surface font-black px-8 py-3 rounded-xl uppercase text-xs tracking-widest transition-all shadow-soft"
          >
            Submit
          </button>
        </div>
      </div>

      {/* GRID LOGS & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[750px]">
        {/* HISTORY */}
        <div className="bg-surface border border-soft rounded-2xl shadow-card flex flex-col overflow-hidden">
          <div className="p-5 border-b border-soft bg-background/50 flex justify-between items-center">
            <h3 className="font-black text-secondary uppercase text-[10px] tracking-widest">
              Riwayat Setoran
            </h3>
            <span className="text-[10px] font-black bg-brand-100 text-brand-700 px-3 py-1 rounded-full">
              {surahSudahSetor.length} SURAH
            </span>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-soft">
            {paginatedSetoran.map((s) => (
              <div
                key={s.id}
                className="p-5 flex items-center justify-between hover:bg-brand-50/30"
              >
                <div>
                  <h4 className="font-bold text-secondary text-lg">
                    {s.nama}{" "}
                    <span className="text-muted font-normal text-base">
                      {s.nama_arab}
                    </span>
                  </h4>
                  <p className="text-[10px] text-muted font-black uppercase">
                    DATE: {s.info_setoran?.tgl_validasi}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSetoran(s)}
                  className="text-error font-black text-[10px] uppercase tracking-widest hover:bg-status-cancelBg p-2 rounded-lg"
                >
                  Revoke
                </button>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="p-4 border-t border-soft bg-background/50 flex justify-between items-center">
            <button
              onClick={() => setPageSetoran((p) => p - 1)}
              disabled={pageSetoran === 1}
              className="text-[10px] font-black uppercase tracking-widest disabled:text-muted"
            >
              ← PREV
            </button>
            <span className="text-[10px] font-bold text-muted uppercase">
              Page {pageSetoran} of{" "}
              {Math.ceil(surahSudahSetor.length / ITEMS_PER_PAGE) || 1}
            </span>
            <button
              onClick={() => setPageSetoran((p) => p + 1)}
              disabled={
                pageSetoran >=
                Math.ceil(surahSudahSetor.length / ITEMS_PER_PAGE)
              }
              className="text-[10px] font-black uppercase tracking-widest disabled:text-muted"
            >
              NEXT →
            </button>
          </div>
        </div>

        {/* LOGS */}
        <div className="bg-surface border border-soft rounded-2xl shadow-card flex flex-col overflow-hidden border-t-4 border-t-secondary">
          <div className="p-5 border-b border-soft bg-background/50 flex justify-between items-center">
            <h3 className="font-black text-secondary uppercase text-[10px] tracking-widest">
              Audit Logs
            </h3>
            <span className="text-[10px] font-black bg-secondary text-surface px-3 py-1 rounded-full">
              {sortedLogs.length} EVENTS
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {paginatedLogs.map((log, i) => (
              <div key={log.id} className="relative flex gap-5">
                {/* Garis Timeline */}
                {i !== paginatedLogs.length - 1 && (
                  <div className="absolute left-[1.15rem] top-10 bottom-[-32px] w-0.5 bg-soft"></div>
                )}

                {/* Icon Check / Cross */}
                <div
                  className={`relative z-10 w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-surface border-4 border-surface shadow-soft ${
                    log.aksi === "VALIDASI" ? "bg-accent" : "bg-error"
                  }`}
                >
                  <span className="text-sm font-black">
                    {log.aksi === "VALIDASI" ? "✓" : "✕"}
                  </span>
                </div>

                {/* Detail Log */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`font-black text-[9px] uppercase tracking-widest ${
                        log.aksi === "VALIDASI"
                          ? "text-brand-600"
                          : "text-error"
                      }`}
                    >
                      {log.aksi}
                    </p>
                    <span className="text-[10px] text-muted font-bold">
                      {new Date(log.timestamp).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  <p className="text-sm text-secondary mt-2 font-medium leading-relaxed italic">
                    "{formatKeteranganLog(log.keterangan)}"
                  </p>

                  {/* DOSEN & IP ADDRESS */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] text-muted font-black uppercase tracking-widest">
                    <span className="bg-background px-2 py-1 rounded border border-soft/30">
                      👤 {log.dosen_yang_mengesahkan?.nama || "Unknown Advisor"}
                    </span>
                    <span className="bg-background px-2 py-1 rounded border border-soft/30">
                      🌐 IP: {log.ip}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls Log */}
          <div className="p-4 border-t border-soft bg-background/50 flex justify-between items-center">
            <button
              onClick={() => setPageLogs((p) => p - 1)}
              disabled={pageLogs === 1}
              className="text-[10px] font-black uppercase tracking-widest disabled:text-muted hover:text-accent transition-colors"
            >
              ← PREV
            </button>
            <span className="text-[10px] font-bold text-muted uppercase">
              Page {pageLogs} of{" "}
              {Math.ceil(sortedLogs.length / ITEMS_PER_PAGE) || 1}
            </span>
            <button
              onClick={() => setPageLogs((p) => p + 1)}
              disabled={
                pageLogs >= Math.ceil(sortedLogs.length / ITEMS_PER_PAGE)
              }
              className="text-[10px] font-black uppercase tracking-widest disabled:text-muted hover:text-accent transition-colors"
            >
              NEXT →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
