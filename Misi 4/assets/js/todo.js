document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "ramadhan-todo-list";

  const shalatCheckboxes = {
    subuh: document.getElementById("shalatSubuh"),
    dzuhur: document.getElementById("shalatDzuhur"),
    ashar: document.getElementById("shalatAshar"),
    maghrib: document.getElementById("shalatMaghrib"),
    isya: document.getElementById("shalatIsya"),
  };

  const shalatProgressEl = document.getElementById("shalatProgress");
  const shalatStatusEl = document.getElementById("shalatStatus");
  const shalatBarEl = document.getElementById("shalatBar");
  const saveShalatBtn = document.getElementById("saveShalat");
  const shalatExtraInputEl = document.getElementById("shalatExtraInput");
  const addShalatExtraBtn = document.getElementById("addShalatExtra");
  const shalatExtraListEl = document.getElementById("shalatExtraList");

  const quranTargetEl = document.getElementById("quranTarget");
  const quranReadEl = document.getElementById("quranRead");
  const quranDoneEl = document.getElementById("quranDone");
  const quranProgressEl = document.getElementById("quranProgress");
  const quranStatusEl = document.getElementById("quranStatus");
  const quranBarEl = document.getElementById("quranBar");
  const saveQuranBtn = document.getElementById("saveQuran");

  const ramadhanDayEl = document.getElementById("ramadhanDay");
  const puasaTodayEl = document.getElementById("puasaToday");
  const puasaStatusSelectEl = document.getElementById("puasaStatusSelect");
  const puasaGridEl = document.getElementById("puasaGrid");
  const puasaProgressEl = document.getElementById("puasaProgress");
  const puasaStatusEl = document.getElementById("puasaStatus");
  const puasaBarEl = document.getElementById("puasaBar");
  const savePuasaBtn = document.getElementById("savePuasa");

  const overallProgressEl = document.getElementById("overallProgress");
  const overallBarEl = document.getElementById("overallBar");
  const motivationBadgeEl = document.getElementById("motivationBadge");
  const shalatStatEl = document.getElementById("shalatStat");
  const quranStatEl = document.getElementById("quranStat");
  const puasaStatEl = document.getElementById("puasaStat");

  const toastEl = document.getElementById("toast");

  const defaultState = {
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
    shalatExtras: [],
    puasa: {
      days: Array(30).fill(null), // null -> belum diisi, "done" / "excused"
      currentDay: 1,
    },
    lastResetDate: null,
  };

  let state = loadState();

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function resetDailyProgress() {
    // Reset shalat (wajib + extras check states only)
    Object.keys(state.shalat).forEach((k) => (state.shalat[k] = false));
    state.shalatExtras = state.shalatExtras.map((item) => ({
      ...item,
      done: false,
    }));
    Object.values(shalatCheckboxes).forEach((input) => {
      if (input) input.disabled = false;
    });

    // Reset Quran
    state.quran = { target: 0, read: 0, done: false };
    if (quranDoneEl) quranDoneEl.disabled = false;

    // Reset puasa status hanya untuk hari aktif
    const idx = clampDay(state.puasa.currentDay || 1) - 1;
    setPuasaStatus(idx, null);
    if (puasaTodayEl) puasaTodayEl.disabled = false;

    state.lastResetDate = todayKey();
  }

  function ensureDailyReset() {
    if (!state.lastResetDate) {
      state.lastResetDate = todayKey();
      saveState();
      return;
    }

    if (state.lastResetDate !== todayKey()) {
      resetDailyProgress();
      saveState();
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
      saveState();
      scheduleMidnightReset();
    }, timeoutMs);
  }

  function loadState() {
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

  function saveState(message) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (message) showToast(message);
  }

  function showToast(text) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("toast-show");
    setTimeout(() => {
      toastEl.classList.remove("toast-show");
    }, 1800);
  }

  const statusFromProgress = (p) =>
    p >= 100 ? "MasyaAllah lengkap!" : p >= 40 ? "Cukup baik" : "Belum optimal";
  const quranStatus = (p) =>
    p >= 100
      ? "Target tercapai"
      : p >= 50
        ? "Hampir selesai"
        : p > 0
          ? "Masih bisa ditambah"
          : "Isi target dulu";
  const puasaStatus = (p) =>
    p >= 100
      ? "Alhamdulillah tuntas"
      : p >= 80
        ? "Stabil terus"
        : p >= 40
          ? "Yuk semangat"
          : "Baru mulai, keep going";

  function clampDay(day) {
    if (!Number.isFinite(day)) return 1;
    return Math.min(30, Math.max(1, Math.round(day)));
  }

  function setPuasaStatus(index, status) {
    const val = status === "done" || status === "excused" ? status : null;
    state.puasa.days[index] = val;
  }

  function syncPuasaInputs(index) {
    const val = state.puasa.days[index];
    puasaTodayEl.checked = val === "done";
    if (puasaStatusSelectEl) puasaStatusSelectEl.value = val || "none";
  }

  function updateShalatUI() {
    const values = Object.values(state.shalat);
    const extras = state.shalatExtras;
    const total = values.length + extras.length;
    const doneBase = values.filter(Boolean).length;
    const doneExtras = extras.filter((x) => x.done).length;
    const done = doneBase + doneExtras;
    const progress = Math.round((done / total) * 100);

    shalatProgressEl.textContent = `${progress}%`;
    shalatStatEl.textContent = `${progress}%`;
    shalatStatusEl.textContent =
      progress === 100
        ? "MasyaAllah lengkap!"
        : progress >= 40
          ? "Cukup baik"
          : "Belum optimal";
    shalatBarEl.style.width = `${progress}%`;

    return progress;
  }

  function renderShalatExtras() {
    if (!shalatExtraListEl) return;
    shalatExtraListEl.innerHTML = "";
    state.shalatExtras.forEach((item) => {
      const label = document.createElement("label");
      label.className =
        "flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className =
        "h-5 w-5 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-400";
      checkbox.checked = !!item.done;
      checkbox.disabled = !!item.done;
      checkbox.addEventListener("change", () => {
        item.done = checkbox.checked;
        checkbox.disabled = checkbox.checked;
        refreshAll();
        saveState();
      });

      const span = document.createElement("span");
      span.className = "text-sm font-semibold text-slate-800";
      span.textContent = item.label;

      label.appendChild(checkbox);
      label.appendChild(span);
      shalatExtraListEl.appendChild(label);
    });
  }

  function updateQuranUI() {
    const target = Math.max(0, Number(quranTargetEl.value) || 0);
    const read = Math.max(0, Number(quranReadEl.value) || 0);
    const done = quranDoneEl.checked;

    state.quran.target = target;
    state.quran.read = read;
    state.quran.done = done;

    let progress = 0;
    if (target > 0) {
      progress = Math.min(100, Math.round((read / target) * 100));
    }
    if (done && target > 0) {
      progress = 100;
    }

    quranProgressEl.textContent = `${progress}%`;
    quranStatEl.textContent = `${progress}%`;
    quranStatusEl.textContent = quranStatus(progress);
    quranBarEl.style.width = `${progress}%`;

    return progress;
  }

  function updatePuasaUI() {
    const currentDay = clampDay(Number(ramadhanDayEl.value));
    ramadhanDayEl.value = currentDay;
    state.puasa.currentDay = currentDay;

    syncPuasaInputs(currentDay - 1);

    const doneCount = state.puasa.days.filter((v) => v === "done").length;
    const progress = Math.round((doneCount / 30) * 100);

    puasaProgressEl.textContent = `${progress}%`;
    puasaStatEl.textContent = `${progress}%`;
    puasaStatusEl.textContent = puasaStatus(progress);
    puasaBarEl.style.width = `${progress}%`;

    // Render grid
    if (puasaGridEl && puasaGridEl.childElementCount === 0) {
      for (let i = 1; i <= 30; i++) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "day-pill";
        btn.dataset.day = i;
        btn.textContent = i;
        btn.addEventListener("click", () => togglePuasaDay(i));
        puasaGridEl.appendChild(btn);
      }
    }

    if (puasaGridEl) {
      [...puasaGridEl.children].forEach((btn) => {
        const day = Number(btn.dataset.day);
        const status = state.puasa.days[day - 1];
        const isDone = status === "done";
        const isExcused = status === "excused";
        btn.classList.toggle("day-done", isDone);
        btn.classList.toggle("day-excused", isExcused);
        btn.textContent = isDone ? "OK" : isExcused ? "NP" : day;
        btn.disabled = status !== null; // lock day once marked
      });
    }

    return progress;
  }

  function togglePuasaDay(day) {
    const index = clampDay(day) - 1;
    const current = state.puasa.days[index];
    if (current !== null) return; // already locked
    setPuasaStatus(index, "done");
    if (state.puasa.currentDay === index + 1) syncPuasaInputs(index);
    refreshAll();
    saveState();
  }

  function updateOverall(shalatP, quranP, puasaP) {
    const puasaTodayStatus =
      state.puasa.days[(state.puasa.currentDay || 1) - 1];
    const puasaTodayProgress =
      puasaTodayStatus === "done" || puasaTodayStatus === "excused" ? 100 : 0;
    const overall = Math.round((shalatP + quranP + puasaTodayProgress) / 3);
    overallProgressEl.textContent = `${overall}%`;
    overallBarEl.style.width = `${overall}%`;

    const status = statusFromProgress(overall);
    motivationBadgeEl.textContent = status;
    motivationBadgeEl.className =
      "inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-all " +
      (overall >= 80
        ? "bg-emerald-50 text-emerald-800 ring-emerald-100"
        : overall >= 40
          ? "bg-amber-50 text-amber-800 ring-amber-100"
          : "bg-slate-100 text-slate-700 ring-slate-200");
  }

  function refreshAll() {
    const shalatP = updateShalatUI();
    const quranP = updateQuranUI();
    const puasaP = updatePuasaUI();
    updateOverall(shalatP, quranP, puasaP);
  }

  function hydrateUI() {
    ensureDailyReset();

    // Shalat
    Object.entries(shalatCheckboxes).forEach(([key, input]) => {
      input.checked = !!state.shalat[key];
      if (input.checked) input.disabled = true;
    });
    renderShalatExtras();

    // Qur'an
    quranTargetEl.value = state.quran.target || "";
    quranReadEl.value = state.quran.read || "";
    quranDoneEl.checked = !!state.quran.done;
    if (quranDoneEl.checked) quranDoneEl.disabled = true;

    // Puasa
    ramadhanDayEl.value = state.puasa.currentDay || 1;
    const curIdx = (state.puasa.currentDay || 1) - 1;
    syncPuasaInputs(curIdx);
    if (puasaTodayEl.checked) puasaTodayEl.disabled = true;

    refreshAll();
  }

  // Event bindings
  Object.entries(shalatCheckboxes).forEach(([key, input]) => {
    input.addEventListener("change", () => {
      state.shalat[key] = input.checked;
      if (input.checked) input.disabled = true;
      refreshAll();
    });
  });

  [quranTargetEl, quranReadEl].forEach((input) => {
    input.addEventListener("input", () => {
      state.quran.target = Math.max(0, Number(quranTargetEl.value) || 0);
      state.quran.read = Math.max(0, Number(quranReadEl.value) || 0);
      refreshAll();
    });
  });

  quranDoneEl.addEventListener("change", () => {
    state.quran.done = quranDoneEl.checked;
    if (state.quran.done && state.quran.target > 0) {
      state.quran.read = state.quran.target;
      quranReadEl.value = state.quran.target;
    }
    if (quranDoneEl.checked) quranDoneEl.disabled = true;
    refreshAll();
  });

  ramadhanDayEl.addEventListener("input", () => {
    state.puasa.currentDay = clampDay(Number(ramadhanDayEl.value));
    ramadhanDayEl.value = state.puasa.currentDay;
    syncPuasaInputs(state.puasa.currentDay - 1);
    refreshAll();
  });

  puasaTodayEl.addEventListener("change", () => {
    const index = clampDay(Number(ramadhanDayEl.value)) - 1;
    setPuasaStatus(index, puasaTodayEl.checked ? "done" : null);
    syncPuasaInputs(index);
    if (puasaTodayEl.checked) puasaTodayEl.disabled = true;
    refreshAll();
    saveState();
  });

  if (puasaStatusSelectEl) {
    puasaStatusSelectEl.addEventListener("change", () => {
      const index = clampDay(Number(ramadhanDayEl.value)) - 1;
      const val = puasaStatusSelectEl.value;
      setPuasaStatus(index, val);
      syncPuasaInputs(index);
      refreshAll();
      saveState();
    });
  }

  saveShalatBtn.addEventListener("click", () => {
    saveState("Checklist shalat tersimpan");
  });

  if (addShalatExtraBtn && shalatExtraInputEl) {
    const addExtra = () => {
      const label = shalatExtraInputEl.value.trim();
      if (!label) return;
      state.shalatExtras.push({
        id: `${Date.now()}-${Math.random()}`,
        label: label.slice(0, 40),
        done: false,
      });
      shalatExtraInputEl.value = "";
      renderShalatExtras();
      refreshAll();
      saveState("Shalat tambahan ditambah");
      shalatExtraInputEl.focus();
    };

    addShalatExtraBtn.addEventListener("click", addExtra);
    shalatExtraInputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addExtra();
      }
    });
  }

  saveQuranBtn.addEventListener("click", () => {
    saveState("Progress tilawah tersimpan");
  });

  savePuasaBtn.addEventListener("click", () => {
    saveState("Data puasa tersimpan");
  });

  // Initial render
  hydrateUI();
  scheduleMidnightReset();
});
