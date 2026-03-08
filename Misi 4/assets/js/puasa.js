import { clampDay, puasaStatus } from "./helpers.js";

export function setPuasaStatus(state, index, status) {
  const val = status === "done" || status === "excused" ? status : null;
  state.puasa.days[index] = val;
}

function syncPuasaInputs(state, els, index) {
  const val = state.puasa.days[index];
  els.puasaTodayEl.checked = val === "done";
  if (els.puasaStatusSelectEl) els.puasaStatusSelectEl.value = val || "none";
}

function togglePuasaDay(state, day, els, refreshAll, save) {
  const index = clampDay(day) - 1;
  const current = state.puasa.days[index];
  if (current !== null) return; // already locked
  setPuasaStatus(state, index, "done");
  if (state.puasa.currentDay === index + 1) syncPuasaInputs(state, els, index);
  refreshAll();
  save();
}

export function updatePuasaUI(state, els, refreshAll, save) {
  const currentDay = clampDay(Number(els.ramadhanDayEl.value));
  els.ramadhanDayEl.value = currentDay;
  state.puasa.currentDay = currentDay;

  syncPuasaInputs(state, els, currentDay - 1);

  const doneCount = state.puasa.days.filter((v) => v === "done").length;
  const progress = Math.round((doneCount / 30) * 100);

  els.puasaProgressEl.textContent = `${progress}%`;
  els.puasaStatEl.textContent = `${progress}%`;
  els.puasaStatusEl.textContent = puasaStatus(progress);
  els.puasaBarEl.style.width = `${progress}%`;

  if (els.puasaGridEl && els.puasaGridEl.childElementCount === 0) {
    for (let i = 1; i <= 30; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-pill";
      btn.dataset.day = i;
      btn.textContent = i;
      btn.addEventListener("click", () =>
        togglePuasaDay(state, i, els, refreshAll, save),
      );
      els.puasaGridEl.appendChild(btn);
    }
  }

  if (els.puasaGridEl) {
    [...els.puasaGridEl.children].forEach((btn) => {
      const day = Number(btn.dataset.day);
      const status = state.puasa.days[day - 1];
      const isDone = status === "done";
      const isExcused = status === "excused";
      btn.classList.toggle("day-done", isDone);
      btn.classList.toggle("day-excused", isExcused);
      btn.textContent = isDone ? "✓" : isExcused ? "–" : day;
      btn.disabled = status !== null; // lock day once marked
    });
  }

  return progress;
}

export function hydratePuasa(state, els) {
  els.ramadhanDayEl.value = state.puasa.currentDay || 1;
  const curIdx = (state.puasa.currentDay || 1) - 1;
  syncPuasaInputs(state, els, curIdx);
  if (els.puasaTodayEl.checked) els.puasaTodayEl.disabled = true;
}

export function bindPuasaEvents(state, els, refreshAll, save) {
  els.ramadhanDayEl.addEventListener("input", () => {
    state.puasa.currentDay = clampDay(Number(els.ramadhanDayEl.value));
    els.ramadhanDayEl.value = state.puasa.currentDay;
    syncPuasaInputs(state, els, state.puasa.currentDay - 1);
    refreshAll();
  });

  els.puasaTodayEl.addEventListener("change", () => {
    const index = clampDay(Number(els.ramadhanDayEl.value)) - 1;
    setPuasaStatus(state, index, els.puasaTodayEl.checked ? "done" : null);
    syncPuasaInputs(state, els, index);
    if (els.puasaTodayEl.checked) els.puasaTodayEl.disabled = true;
    refreshAll();
    save();
  });

  if (els.puasaStatusSelectEl) {
    els.puasaStatusSelectEl.addEventListener("change", () => {
      const index = clampDay(Number(els.ramadhanDayEl.value)) - 1;
      const val = els.puasaStatusSelectEl.value;
      setPuasaStatus(state, index, val);
      syncPuasaInputs(state, els, index);
      refreshAll();
      save();
    });
  }

  if (els.savePuasaBtn) {
    els.savePuasaBtn.addEventListener("click", () => {
      save("Data puasa tersimpan");
    });
  }
}
