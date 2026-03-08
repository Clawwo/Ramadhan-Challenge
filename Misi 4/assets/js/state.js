import { clampDay } from "./helpers.js";

export const STORAGE_KEY = "ramadhan-todo-list";

export const defaultState = {
  shalat: {
    subuh: false,
    dzuhur: false,
    ashar: false,
    maghrib: false,
    isya: false,
  },
  quran: {
    target: 0,
    read: 0,
    done: false,
  },
  dzikir: {
    pagi: false,
    petang: false,
    istighfar: false,
  },
  shalatExtras: [],
  puasa: {
    days: Array(30).fill(null), // null -> belum diisi, "done" / "excused"
    currentDay: 1,
  },
  lastResetDate: null,
};

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const normalizedDays = (() => {
        if (parsed.puasa && Array.isArray(parsed.puasa.days)) {
          return [...parsed.puasa.days, ...Array(30).fill(null)]
            .slice(0, 30)
            .map((v) => {
              if (v === true) return "done"; // backward compat
              if (v === false || v === null) return null;
              if (v === "done" || v === "excused") return v;
              return null;
            });
        }
        return [...defaultState.puasa.days];
      })();

      return {
        ...defaultState,
        ...parsed,
        shalat: { ...defaultState.shalat, ...(parsed.shalat || {}) },
        dzikir: { ...defaultState.dzikir, ...(parsed.dzikir || {}) },
        shalatExtras: Array.isArray(parsed.shalatExtras)
          ? parsed.shalatExtras.map((item, idx) => ({
              id: item.id ?? `${Date.now()}-${idx}`,
              label: (item.label || "Shalat tambahan").slice(0, 40),
              done: !!item.done,
            }))
          : [],
        quran: { ...defaultState.quran, ...(parsed.quran || {}) },
        puasa: {
          days: normalizedDays,
          currentDay: clampDay(
            (parsed.puasa && parsed.puasa.currentDay) ||
              defaultState.puasa.currentDay,
          ),
        },
      };
    }
  } catch (error) {
    console.warn("Gagal memuat data, menggunakan default", error);
  }
  return structuredClone(defaultState);
}

export function showToast(text, toastEl) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add("toast-show");
  setTimeout(() => {
    toastEl.classList.remove("toast-show");
  }, 1800);
}

export function saveState(state, message, toastEl) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (message) showToast(message, toastEl);
}
