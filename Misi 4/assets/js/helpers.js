export function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function clampDay(day) {
  if (!Number.isFinite(day)) return 1;
  return Math.min(30, Math.max(1, Math.round(day)));
}

export const statusFromProgress = (p) =>
  p >= 100 ? "MasyaAllah lengkap!" : p >= 40 ? "Cukup baik" : "Belum optimal";

export const quranStatus = (p) =>
  p >= 100
    ? "Target tercapai"
    : p >= 50
      ? "Hampir selesai"
      : p > 0
        ? "Masih bisa ditambah"
        : "Isi target dulu";

export const puasaStatus = (p) =>
  p >= 100
    ? "Alhamdulillah tuntas"
    : p >= 80
      ? "Stabil terus"
      : p >= 40
        ? "Yuk semangat"
        : "Baru mulai, keep going";
