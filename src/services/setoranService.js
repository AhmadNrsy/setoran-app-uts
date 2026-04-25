// src/services/setoranService.js
import apiClient from "./apiClient";

// ==========================================
// 📌 GET: DATA PA (DOSEN)
// ==========================================
export const getPaSaya = async () => {
  try {
    const res = await apiClient.get("/dosen/pa-saya");
    return res.data;
  } catch (err) {
    console.error("API ERROR getPaSaya:", err);
    throw err;
  }
};

// ==========================================
// 📌 GET: DETAIL MAHASISWA
// ==========================================
export const getDetailMahasiswa = async (nim) => {
  try {
    if (!nim) throw new Error("NIM tidak valid");
    const res = await apiClient.get(`/mahasiswa/setoran/${nim}`);
    return res.data;
  } catch (err) {
    console.error("API ERROR getDetailMahasiswa:", err.response?.data || err.message);
    throw err;
  }
};

// ==========================================
// 📌 POST: SIMPAN SETORAN (VALIDASI)
// ==========================================
export const simpanSetoran = async (nim, payload) => {
  try {
    const res = await apiClient.post(`/mahasiswa/setoran/${nim}`, payload);
    return res.data;
  } catch (err) {
    console.error("API ERROR simpanSetoran:", err);
    throw err;
  }
};

// ==========================================
// 📌 DELETE: HAPUS SETORAN (BATAL VALIDASI)
// ==========================================
export const deleteSetoran = async (nim, payload) => {
  try {
    // Wajib pakai config 'data' kalau mau ngirim body JSON di method DELETE Axios
    const res = await apiClient.delete(`/mahasiswa/setoran/${nim}`, {
      data: payload 
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR deleteSetoran:", err);
    throw err;
  }
};