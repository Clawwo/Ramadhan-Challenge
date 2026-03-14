/**
 * Main module - Entry point
 */

import { fetchAllCities } from "./cities.js";
import { fetchJadwal } from "./api.js";
import { REGIONS, PROVINCE_TO_REGION, getProvinceById } from "./regions.js";
import {
  renderRegionDropdown,
  renderProvinceDropdown,
  renderCityDropdown,
  renderScheduleTable,
  showLoading,
  hideLoading,
  showError,
  showEmpty,
  showSchedule,
  updateLocationInfo,
  hideLocationInfo,
} from "./render.js";

// DOM Elements
const regionSelect = document.getElementById("regionSelect");
const provinceSelect = document.getElementById("provinceSelect");
const citySelect = document.getElementById("citySelect");
const scheduleBody = document.getElementById("scheduleBody");
const retryBtn = document.getElementById("retryBtn");

// State
let cities = [];
let regionData = {}; // { regionName: { provinceName: [cities] } }
let currentCityId = "";

// Ramadhan 2026 - Fixed month and year
const RAMADHAN_MONTH = 3;
const RAMADHAN_YEAR = 2026;

/**
 * Initialize the application
 */
async function init() {
  // Load cities
  await loadCities();

  // Setup event listeners
  setupEventListeners();
}

/**
 * Load cities from API and group by region > province
 */
async function loadCities() {
  try {
    cities = await fetchAllCities();

    // Group cities by region > province
    regionData = {};
    REGIONS.forEach(region => {
      regionData[region] = {};
    });

    cities.forEach((city) => {
      const provinceName = getProvinceById(city.id);
      const regionName = PROVINCE_TO_REGION[provinceName] || 'LAINNYA';
      
      if (!regionData[regionName]) {
        regionData[regionName] = {};
      }
      if (!regionData[regionName][provinceName]) {
        regionData[regionName][provinceName] = [];
      }
      regionData[regionName][provinceName].push(city);
    });

    // Render region dropdown
    renderRegionDropdown(regionSelect, REGIONS);
  } catch (error) {
    console.error("Failed to load cities:", error);
    showError("Gagal memuat daftar kota. Silakan refresh halaman.");
  }
}

/**
 * Handle region change - filter provinces
 */
function onRegionChange() {
  const selectedRegion = regionSelect.value;

  // Reset province and city
  provinceSelect.value = "";
  citySelect.value = "";
  citySelect.disabled = true;
  citySelect.innerHTML = '<option value="">-- Pilih Provinsi Dulu --</option>';

  if (!selectedRegion) {
    provinceSelect.disabled = true;
    provinceSelect.innerHTML = '<option value="">-- Pilih Pulau Dulu --</option>';
    showEmpty();
    hideLocationInfo();
    return;
  }

  const provincesInRegion = Object.keys(regionData[selectedRegion] || {});
  renderProvinceDropdown(provinceSelect, provincesInRegion);
  showEmpty();
  hideLocationInfo();
}

/**
 * Handle province change - filter cities
 */
function onProvinceChange() {
  const selectedRegion = regionSelect.value;
  const selectedProvince = provinceSelect.value;

  // Reset city
  citySelect.value = "";

  if (!selectedProvince) {
    citySelect.disabled = true;
    citySelect.innerHTML = '<option value="">-- Pilih Provinsi Dulu --</option>';
    showEmpty();
    hideLocationInfo();
    return;
  }

  const filteredCities = regionData[selectedRegion]?.[selectedProvince] || [];
  renderCityDropdown(citySelect, filteredCities);
  showEmpty();
  hideLocationInfo();
}

/**
 * Load schedule based on selected city (Ramadhan 2026)
 */
async function loadSchedule() {
  const cityId = citySelect.value;

  if (!cityId) {
    showEmpty();
    hideLocationInfo();
    return;
  }

  currentCityId = cityId;

  showLoading();

  try {
    const data = await fetchJadwal(cityId, RAMADHAN_YEAR, RAMADHAN_MONTH);

    if (!data || !data.jadwal || data.jadwal.length === 0) {
      showError("Tidak ada data jadwal untuk bulan ini.");
      return;
    }

    // Update location info
    updateLocationInfo(data.lokasi, data.daerah);

    // Render schedule table
    renderScheduleTable(scheduleBody, data.jadwal);

    // Show schedule section
    showSchedule(data.jadwal.length);
  } catch (error) {
    console.error("Failed to load schedule:", error);
    showError(error.message || "Gagal memuat jadwal. Silakan coba lagi.");
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Region change
  regionSelect.addEventListener("change", onRegionChange);

  // Province change
  provinceSelect.addEventListener("change", onProvinceChange);

  // City change
  citySelect.addEventListener("change", loadSchedule);

  // Retry button
  retryBtn.addEventListener("click", loadSchedule);

  // Handle scroll indicator for table on mobile
  const tableContainer = document.querySelector(".overflow-x-auto");
  if (tableContainer) {
    let ticking = false;

    const updateScrollIndicator = () => {
      const hasScroll = tableContainer.scrollWidth > tableContainer.clientWidth;
      const isAtEnd =
        tableContainer.scrollLeft + tableContainer.clientWidth >=
        tableContainer.scrollWidth - 10;

      if (hasScroll && !isAtEnd) {
        tableContainer.classList.add("has-scroll");
      } else {
        tableContainer.classList.remove("has-scroll");
      }

      ticking = false;
    };

    tableContainer.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateScrollIndicator);
          ticking = true;
        }
      },
      { passive: true },
    );

    window.addEventListener("resize", updateScrollIndicator, { passive: true });
    updateScrollIndicator();
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", init);
