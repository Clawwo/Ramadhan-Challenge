/**
 * API module untuk fetch data kota
 */

/**
 * Fetch semua kota dari API
 * @returns {Promise<Array>} Array of city objects
 */
export async function fetchAllCities() {
  const response = await fetch("https://api.myquran.com/v2/sholat/kota/semua");

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.status || !data.data) {
    throw new Error("Invalid API response");
  }

  return data.data;
}

/**
 * Cari kota berdasarkan nama
 * @param {string} keyword - Kata kunci pencarian
 * @returns {Promise<Array>} Array of matching cities
 */
export async function searchCity(keyword) {
  const response = await fetch(
    `https://api.myquran.com/v2/sholat/kota/cari/${encodeURIComponent(keyword)}`,
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (!data.status) {
    return [];
  }

  return data.data || [];
}
