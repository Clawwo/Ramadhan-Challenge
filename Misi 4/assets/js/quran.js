import { quranStatus } from "./helpers.js";

export function updateQuranUI(state, els) {
  const target = Math.max(0, Number(els.quranTargetEl.value) || 0);
  const read = Math.max(0, Number(els.quranReadEl.value) || 0);
  const done = els.quranDoneEl.checked;

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

  els.quranProgressEl.textContent = `${progress}%`;
  els.quranStatEl.textContent = `${progress}%`;
  els.quranStatusEl.textContent = quranStatus(progress);
  els.quranBarEl.style.width = `${progress}%`;

  return progress;
}

export function hydrateQuran(state, els) {
  els.quranTargetEl.value = state.quran.target || "";
  els.quranReadEl.value = state.quran.read || "";
  els.quranDoneEl.checked = !!state.quran.done;
  if (els.quranDoneEl.checked) els.quranDoneEl.disabled = true;
}

export function bindQuranEvents(state, els, refreshAll, save) {
  [els.quranTargetEl, els.quranReadEl].forEach((input) => {
    input.addEventListener("input", () => {
      state.quran.target = Math.max(0, Number(els.quranTargetEl.value) || 0);
      state.quran.read = Math.max(0, Number(els.quranReadEl.value) || 0);
      refreshAll();
      save();
    });
  });

  els.quranDoneEl.addEventListener("change", () => {
    state.quran.done = els.quranDoneEl.checked;
    if (state.quran.done && state.quran.target > 0) {
      state.quran.read = state.quran.target;
      els.quranReadEl.value = state.quran.target;
    }
    if (els.quranDoneEl.checked) els.quranDoneEl.disabled = true;
    refreshAll();
    save();
  });

  if (els.saveQuranBtn) {
    els.saveQuranBtn.addEventListener("click", () => {
      save("Progress tilawah tersimpan");
    });
  }
}
