/**
 * Render module untuk UI components
 */

/**
 * Render dropdown region/pulau
 * @param {HTMLSelectElement} selectElement - Element select
 * @param {Array} regions - Array of region names
 */
export function renderRegionDropdown(selectElement, regions) {
  selectElement.innerHTML =
    '<option value="">-- Pilih Pulau/Wilayah --</option>';

  regions.forEach((region) => {
    const option = document.createElement("option");
    option.value = region;
    option.textContent = region;
    selectElement.appendChild(option);
  });
}

/**
 * Render dropdown provinsi berdasarkan region
 * @param {HTMLSelectElement} selectElement - Element select
 * @param {Array} provinces - Array of province names
 */
export function renderProvinceDropdown(selectElement, provinces) {
  selectElement.innerHTML = '<option value="">-- Pilih Provinsi --</option>';

  if (provinces.length === 0) {
    selectElement.disabled = true;
    selectElement.innerHTML =
      '<option value="">-- Pilih Pulau Dulu --</option>';
    return;
  }

  selectElement.disabled = false;

  // Sort provinces alphabetically
  const sortedProvinces = [...provinces].sort((a, b) => a.localeCompare(b));

  // Add province options
  sortedProvinces.forEach((province) => {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    selectElement.appendChild(option);
  });
}

/**
 * Render dropdown kota berdasarkan provinsi
 * @param {HTMLSelectElement} selectElement - Element select
 * @param {Array} cities - Array of city objects
 */
export function renderCityDropdown(selectElement, cities) {
  selectElement.innerHTML =
    '<option value="">-- Pilih Kota/Kabupaten --</option>';

  if (cities.length === 0) {
    selectElement.disabled = true;
    selectElement.innerHTML =
      '<option value="">-- Pilih Provinsi Dulu --</option>';
    return;
  }

  selectElement.disabled = false;

  // Sort cities alphabetically
  const sortedCities = [...cities].sort((a, b) =>
    a.lokasi.localeCompare(b.lokasi),
  );

  // Add city options
  sortedCities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city.id;
    option.textContent = city.lokasi;
    selectElement.appendChild(option);
  });
}

/**
 * Render tabel jadwal shalat
 * @param {HTMLTableSectionElement} tbody - Element tbody
 * @param {Array} jadwal - Array of jadwal objects
 */
export function renderScheduleTable(tbody, jadwal) {
  tbody.innerHTML = "";

  const today = getTodayDate();

  jadwal.forEach((item) => {
    const tr = document.createElement("tr");
    const isToday = item.date === today;

    if (isToday) {
      tr.classList.add("row-today");
    }

    tr.innerHTML = `
      <td class="px-3 py-4 text-[15px] font-medium text-slate-700">
        ${formatTanggal(item.tanggal)}
        ${isToday ? '<span class="badge-today">Hari Ini</span>' : ""}
      </td>
      <td class="px-3 py-4 text-center time-cell">${item.imsak}</td>
      <td class="px-3 py-4 text-center time-cell">${item.subuh}</td>
      <td class="px-3 py-4 text-center time-cell">${item.dzuhur}</td>
      <td class="px-3 py-4 text-center time-cell">${item.ashar}</td>
      <td class="px-3 py-4 text-center time-cell">${item.maghrib}</td>
      <td class="px-3 py-4 text-center time-cell">${item.isya}</td>
    `;

    tbody.appendChild(tr);
  });

  // Scroll to today's row if exists
  const todayRow = tbody.querySelector(".row-today");
  if (todayRow) {
    setTimeout(() => {
      todayRow.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  }
}

/**
 * Format tanggal dari "Minggu, 01/03/2026" menjadi "Min, 1 Mar"
 * @param {string} tanggal - Tanggal dari API
 * @returns {string} Tanggal yang diformat
 */
function formatTanggal(tanggal) {
  const days = {
    Minggu: "Min",
    Senin: "Sen",
    Selasa: "Sel",
    Rabu: "Rab",
    Kamis: "Kam",
    Jumat: "Jum",
    Sabtu: "Sab",
  };

  const months = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "Mei",
    "06": "Jun",
    "07": "Jul",
    "08": "Agt",
    "09": "Sep",
    10: "Okt",
    11: "Nov",
    12: "Des",
  };

  try {
    const [dayName, dateStr] = tanggal.split(", ");
    const [day, month] = dateStr.split("/");

    const shortDay = days[dayName] || dayName;
    const shortMonth = months[month] || month;

    return `${shortDay}, ${parseInt(day)} ${shortMonth}`;
  } catch {
    return tanggal;
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
function getTodayDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Show loading state
 */
export function showLoading() {
  document.getElementById("loadingState").classList.remove("hidden");
  document.getElementById("errorState").classList.add("hidden");
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("scheduleSection").classList.add("hidden");
}

/**
 * Hide loading state
 */
export function hideLoading() {
  document.getElementById("loadingState").classList.add("hidden");
}

/**
 * Show error state
 * @param {string} message - Error message
 */
export function showError(message = "Terjadi kesalahan saat mengambil data.") {
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("scheduleSection").classList.add("hidden");
  document.getElementById("errorState").classList.remove("hidden");
  document.getElementById("errorMessage").textContent = message;
}

/**
 * Show empty state
 */
export function showEmpty() {
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("errorState").classList.add("hidden");
  document.getElementById("scheduleSection").classList.add("hidden");
  document.getElementById("emptyState").classList.remove("hidden");
}

/**
 * Show schedule section
 * @param {number} count - Number of days
 */
export function showSchedule(count) {
  document.getElementById("loadingState").classList.add("hidden");
  document.getElementById("errorState").classList.add("hidden");
  document.getElementById("emptyState").classList.add("hidden");
  document.getElementById("scheduleSection").classList.remove("hidden");
  document.getElementById("scheduleCount").textContent = `${count} hari`;
}

/**
 * Update location info
 * @param {string} lokasi - Nama lokasi
 * @param {string} daerah - Nama daerah
 */
export function updateLocationInfo(lokasi, daerah) {
  const locationInfo = document.getElementById("locationInfo");
  const locationName = document.getElementById("locationName");
  const locationRegion = document.getElementById("locationRegion");

  locationInfo.classList.remove("hidden");
  locationName.textContent = lokasi;
  locationRegion.textContent = daerah ? ` • ${daerah}` : "";
}

/**
 * Hide location info
 */
export function hideLocationInfo() {
  document.getElementById("locationInfo").classList.add("hidden");
}
