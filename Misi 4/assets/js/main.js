import {
  defaultState,
  loadState,
  saveState,
  showToast,
} from "./state.js";
import {
  todayKey,
  clampDay,
  statusFromProgress,
} from "./helpers.js";
import {
  updateShalatUI,
  renderShalatExtras,
  hydrateShalat,
  bindShalatEvents,
} from "./shalat.js";
import {
  updateDzikirUI,
  hydrateDzikir,
  bindDzikirEvents,
} from "./dzikir.js";
import { updateQuranUI, hydrateQuran, bindQuranEvents } from "./quran.js";
import {
  updatePuasaUI,
  hydratePuasa,
  bindPuasaEvents,
  setPuasaStatus,
} from "./puasa.js";

const toastEl = document.getElementById("toast");

const elements = {
  shalatCheckboxes: {
    subuh: document.getElementById("shalatSubuh"),
    dzuhur: document.getElementById("shalatDzuhur"),
    ashar: document.getElementById("shalatAshar"),
    maghrib: document.getElementById("shalatMaghrib"),
    isya: document.getElementById("shalatIsya"),
  },
  shalatProgressEl: document.getElementById("shalatProgress"),
  shalatStatusEl: document.getElementById("shalatStatus"),
  shalatBarEl: document.getElementById("shalatBar"),
  saveShalatBtn: document.getElementById("saveShalat"),
  shalatExtraInputEl: document.getElementById("shalatExtraInput"),
  addShalatExtraBtn: document.getElementById("addShalatExtra"),
  shalatExtraListEl: document.getElementById("shalatExtraList"),

  dzikirCheckboxes: {
    pagi: document.getElementById("dzikirPagi"),
    petang: document.getElementById("dzikirPetang"),
    istighfar: document.getElementById("dzikirIstighfar"),
  },
  dzikirProgressEl: document.getElementById("dzikirProgress"),
  dzikirStatusEl: document.getElementById("dzikirStatus"),
  dzikirBarEl: document.getElementById("dzikirBar"),
  dzikirStatEl: document.getElementById("dzikirStat"),
  saveDzikirBtn: document.getElementById("saveDzikir"),

  quranTargetEl: document.getElementById("quranTarget"),
  quranReadEl: document.getElementById("quranRead"),
  quranDoneEl: document.getElementById("quranDone"),
  quranProgressEl: document.getElementById("quranProgress"),
  quranStatusEl: document.getElementById("quranStatus"),
  quranBarEl: document.getElementById("quranBar"),
  saveQuranBtn: document.getElementById("saveQuran"),
  quranStatEl: document.getElementById("quranStat"),

  ramadhanDayEl: document.getElementById("ramadhanDay"),
  puasaTodayEl: document.getElementById("puasaToday"),
  puasaStatusSelectEl: document.getElementById("puasaStatusSelect"),
  puasaGridEl: document.getElementById("puasaGrid"),
  puasaProgressEl: document.getElementById("puasaProgress"),
  puasaStatusEl: document.getElementById("puasaStatus"),
  puasaBarEl: document.getElementById("puasaBar"),
  savePuasaBtn: document.getElementById("savePuasa"),
  puasaStatEl: document.getElementById("puasaStat"),

  overallProgressEl: document.getElementById("overallProgress"),
  overallBarEl: document.getElementById("overallBar"),
  motivationBadgeEl: document.getElementById("motivationBadge"),
  shalatStatEl: document.getElementById("shalatStat"),
  quranStatEl: document.getElementById("quranStat"),
  puasaStatEl: document.getElementById("puasaStat"),
  dzikirStatEl: document.getElementById("dzikirStat"),
};

let state = loadState();

const persist = (message) => saveState(state, message, toastEl);

function resetDailyProgress() {
  Object.keys(state.shalat).forEach((k) => (state.shalat[k] = false));
  state.shalatExtras = state.shalatExtras.map((item) => ({ ...item, done: false }));
  Object.values(elements.shalatCheckboxes).forEach((input) => {
    if (input) input.disabled = false;
  });
  renderShalatExtras(state, elements, refreshAll, persist);

  state.quran = { target: 0, read: 0, done: false };
  if (elements.quranDoneEl) elements.quranDoneEl.disabled = false;

  Object.keys(state.dzikir).forEach((k) => (state.dzikir[k] = false));
  Object.values(elements.dzikirCheckboxes).forEach((input) => {
    if (input) input.disabled = false;
  });

  const idx = clampDay(state.puasa.currentDay || 1) - 1;
  setPuasaStatus(state, idx, null);
  if (elements.puasaTodayEl) elements.puasaTodayEl.disabled = false;

  state.lastResetDate = todayKey();
}

function ensureDailyReset() {
  if (!state.lastResetDate) {
    state.lastResetDate = todayKey();
    persist();
    return;
  }

  if (state.lastResetDate !== todayKey()) {
    resetDailyProgress();
    persist();
  }
}

function scheduleMidnightReset() {
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 0, 0);
  const timeoutMs = nextMidnight.getTime() - now.getTime();
  setTimeout(() => {
    resetDailyProgress();
    refreshAll();
    persist();
    scheduleMidnightReset();
  }, timeoutMs);
}

function updateOverall(shalatP, quranP, puasaP, dzikirP) {
  const puasaTodayStatus = state.puasa.days[(state.puasa.currentDay || 1) - 1];
  const puasaTodayProgress = puasaTodayStatus === "done" || puasaTodayStatus === "excused" ? 100 : 0;
  const metrics = [shalatP, quranP, dzikirP, puasaTodayProgress];
  const overall = Math.round(metrics.reduce((sum, v) => sum + v, 0) / metrics.length);
  elements.overallProgressEl.textContent = `${overall}%`;
  elements.overallBarEl.style.width = `${overall}%`;

  const status = statusFromProgress(overall);
  elements.motivationBadgeEl.textContent = status;
  elements.motivationBadgeEl.className =
    "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all " +
    (overall >= 80
      ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
      : overall >= 40
        ? "bg-amber-50 text-amber-800 ring-amber-100"
        : "bg-slate-100 text-slate-700 ring-slate-200");
}

function refreshAll() {
  const shalatP = updateShalatUI(state, elements);
  const quranP = updateQuranUI(state, elements);
  const dzikirP = updateDzikirUI(state, elements);
  const puasaP = updatePuasaUI(state, elements, refreshAll, persist);
  updateOverall(shalatP, quranP, puasaP, dzikirP);
}

function hydrateUI() {
  ensureDailyReset();
  hydrateShalat(state, elements, refreshAll, persist);
  hydrateDzikir(state, elements);
  hydrateQuran(state, elements);
  hydratePuasa(state, elements);
  refreshAll();
}

function bindEvents() {
  bindShalatEvents(state, elements, refreshAll, persist);
  bindDzikirEvents(state, elements, refreshAll, persist);
  bindQuranEvents(state, elements, refreshAll, persist);
  bindPuasaEvents(state, elements, refreshAll, persist);
}

hydrateUI();
bindEvents();
scheduleMidnightReset();
