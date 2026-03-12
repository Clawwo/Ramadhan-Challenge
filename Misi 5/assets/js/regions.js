/**
 * Data wilayah Indonesia untuk filter dropdown
 * Pulau/Region → Provinsi → Kota
 */

/**
 * Daftar region/pulau di Indonesia
 */
export const REGIONS = [
  'SUMATERA',
  'JAWA',
  'BALI & NUSA TENGGARA',
  'KALIMANTAN',
  'SULAWESI',
  'MALUKU & PAPUA'
];

/**
 * Mapping provinsi ke region/pulau
 */
export const PROVINCE_TO_REGION = {
  // Sumatera
  'ACEH': 'SUMATERA',
  'SUMATERA UTARA': 'SUMATERA',
  'SUMATERA BARAT': 'SUMATERA',
  'RIAU': 'SUMATERA',
  'KEPULAUAN RIAU': 'SUMATERA',
  'JAMBI': 'SUMATERA',
  'BENGKULU': 'SUMATERA',
  'SUMATERA SELATAN': 'SUMATERA',
  'BANGKA BELITUNG': 'SUMATERA',
  'LAMPUNG': 'SUMATERA',
  
  // Jawa
  'BANTEN': 'JAWA',
  'DKI JAKARTA': 'JAWA',
  'JAWA BARAT': 'JAWA',
  'JAWA TENGAH': 'JAWA',
  'DI YOGYAKARTA': 'JAWA',
  'JAWA TIMUR': 'JAWA',
  
  // Bali & Nusa Tenggara
  'BALI': 'BALI & NUSA TENGGARA',
  'NUSA TENGGARA BARAT': 'BALI & NUSA TENGGARA',
  'NUSA TENGGARA TIMUR': 'BALI & NUSA TENGGARA',
  
  // Kalimantan
  'KALIMANTAN BARAT': 'KALIMANTAN',
  'KALIMANTAN SELATAN': 'KALIMANTAN',
  'KALIMANTAN TENGAH': 'KALIMANTAN',
  'KALIMANTAN TIMUR': 'KALIMANTAN',
  'KALIMANTAN UTARA': 'KALIMANTAN',
  
  // Sulawesi
  'GORONTALO': 'SULAWESI',
  'SULAWESI SELATAN': 'SULAWESI',
  'SULAWESI TENGGARA': 'SULAWESI',
  'SULAWESI TENGAH': 'SULAWESI',
  'SULAWESI UTARA': 'SULAWESI',
  'SULAWESI BARAT': 'SULAWESI',
  
  // Maluku & Papua
  'MALUKU': 'MALUKU & PAPUA',
  'MALUKU UTARA': 'MALUKU & PAPUA',
  'PAPUA': 'MALUKU & PAPUA',
  'PAPUA BARAT': 'MALUKU & PAPUA',
};

/**
 * Mapping ID prefix ke nama provinsi
 * Berdasarkan data API MyQuran
 */
const PROVINCE_MAP = {
  '01': 'ACEH',
  '02': 'SUMATERA UTARA',
  '03': 'SUMATERA BARAT',
  '04': 'RIAU',
  '05': 'KEPULAUAN RIAU',
  '06': 'JAMBI',
  '07': 'BENGKULU',
  '08': 'SUMATERA SELATAN',
  '09': 'BANGKA BELITUNG',
  '10': 'LAMPUNG',
  '11': 'BANTEN',
  '12': 'JAWA BARAT',
  '13': 'DKI JAKARTA',
  '14': 'JAWA TENGAH',
  '15': 'DI YOGYAKARTA',
  '16': 'JAWA TIMUR',
  '17': 'BALI',
  '18': 'NUSA TENGGARA BARAT',
  '19': 'NUSA TENGGARA TIMUR',
  '20': 'KALIMANTAN BARAT',
  '21': 'KALIMANTAN SELATAN',
  '22': 'KALIMANTAN TENGAH',
  '23': 'KALIMANTAN TIMUR',
  '24': 'KALIMANTAN UTARA',
  '25': 'GORONTALO',
  '26': 'SULAWESI SELATAN',
  '27': 'SULAWESI TENGGARA',
  '28': 'SULAWESI TENGAH',
  '29': 'SULAWESI UTARA',
  '30': 'SULAWESI BARAT',
  '31': 'MALUKU',
  '32': 'MALUKU UTARA',
  '33': 'PAPUA',
  '34': 'PAPUA BARAT',
};

/**
 * Get province name by city ID prefix
 * @param {string|number} cityId - City ID from API
 * @returns {string} Province name
 */
export function getProvinceById(cityId) {
  const prefix = String(cityId).substring(0, 2);
  return PROVINCE_MAP[prefix] || 'LAINNYA';
}
