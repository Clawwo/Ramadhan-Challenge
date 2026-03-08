import { statusFromProgress } from "./helpers.js";

export function updateDzikirUI(state, els) {
  const values = Object.values(state.dzikir);
  const total = values.length || 1;
  const done = values.filter(Boolean).length;
  const progress = Math.round((done / total) * 100);

  els.dzikirProgressEl.textContent = `${progress}%`;
  if (els.dzikirStatEl) els.dzikirStatEl.textContent = `${progress}%`;
  els.dzikirStatusEl.textContent = statusFromProgress(progress);
  els.dzikirBarEl.style.width = `${progress}%`;

  return progress;
}

export function hydrateDzikir(state, els) {
  Object.entries(els.dzikirCheckboxes).forEach(([key, input]) => {
    if (!input) return;
    input.checked = !!state.dzikir[key];
    if (input.checked) input.disabled = true;
  });
}

export function bindDzikirEvents(state, els, refreshAll, save) {
  Object.entries(els.dzikirCheckboxes).forEach(([key, input]) => {
    if (!input) return;
    input.addEventListener("change", () => {
      state.dzikir[key] = input.checked;
      if (input.checked) input.disabled = true;
      refreshAll();
      save();
    });
  });

  if (els.saveDzikirBtn) {
    els.saveDzikirBtn.addEventListener("click", () => {
      save("Checklist dzikir tersimpan");
    });
  }
}
