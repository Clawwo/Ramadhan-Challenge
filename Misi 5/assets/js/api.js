/**
 * API module untuk fetch jadwal shalat
 */

const BASE_URL = "https://api.myquran.com/v2/sholat";

/**
 * Fetch jadwal shalat untuk kota tertentu
 * @param {string} cityId - ID kota
 * @param {number} year - Tahun
 * @param {number} month - Bulan (1-12)
 * @returns {Promise<Object>} Data jadwal shalat
 */
export async function fetchJadwal(cityId, year, month) {
  const url = `${BASE_URL}/jadwal/${cityId}/${year}/${month}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Gagal mengambil data jadwal");
  }

  return data.data;
}

/**
 * Fetch jadwal shalat untuk hari ini
 * @param {string} cityId - ID kota
 * @param {string} date - Tanggal dalam format YYYY-MM-DD
 * @returns {Promise<Object>} Data jadwal hari ini
 */
export async function fetchJadwalHariIni(cityId, date) {
  const url = `${BASE_URL}/jadwal/${cityId}/${date}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || "Gagal mengambil data jadwal");
  }

  return data.data;
}
