import { statusFromProgress } from "./helpers.js";

export function updateShalatUI(state, els) {
  const values = Object.values(state.shalat);
  const extras = state.shalatExtras;
  const total = values.length + extras.length;
  const doneBase = values.filter(Boolean).length;
  const doneExtras = extras.filter((x) => x.done).length;
  const done = doneBase + doneExtras;
  const progress = Math.round((done / total) * 100);

  els.shalatProgressEl.textContent = `${progress}%`;
  els.shalatStatEl.textContent = `${progress}%`;
  els.shalatStatusEl.textContent = statusFromProgress(progress);
  els.shalatBarEl.style.width = `${progress}%`;

  return progress;
}

export function renderShalatExtras(state, els, refreshAll, save) {
  if (!els.shalatExtraListEl) return;
  els.shalatExtraListEl.innerHTML = "";
  state.shalatExtras.forEach((item) => {
    const label = document.createElement("label");
    label.className = "flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-sm";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "h-5 w-5 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-400";
    checkbox.checked = !!item.done;
    checkbox.disabled = !!item.done;
    checkbox.addEventListener("change", () => {
      item.done = checkbox.checked;
      checkbox.disabled = checkbox.checked;
      refreshAll();
      save();
    });

    const span = document.createElement("span");
    span.className = "text-sm font-semibold text-slate-800";
    span.textContent = item.label;

    label.appendChild(checkbox);
    label.appendChild(span);
    els.shalatExtraListEl.appendChild(label);
  });
}

export function hydrateShalat(state, els, refreshAll, save) {
  Object.entries(els.shalatCheckboxes).forEach(([key, input]) => {
    input.checked = !!state.shalat[key];
    if (input.checked) input.disabled = true;
  });
  renderShalatExtras(state, els, refreshAll, save);
}

export function bindShalatEvents(state, els, refreshAll, save) {
  Object.entries(els.shalatCheckboxes).forEach(([key, input]) => {
    input.addEventListener("change", () => {
      state.shalat[key] = input.checked;
      if (input.checked) input.disabled = true;
      refreshAll();
      save();
    });
  });

  if (els.addShalatExtraBtn && els.shalatExtraInputEl) {
    const addExtra = () => {
      const label = els.shalatExtraInputEl.value.trim();
      if (!label) return;
      state.shalatExtras.push({
        id: `${Date.now()}-${Math.random()}`,
        label: label.slice(0, 40),
        done: false,
      });
      els.shalatExtraInputEl.value = "";
      renderShalatExtras(state, els, refreshAll, save);
      refreshAll();
      save("Shalat tambahan ditambah");
      els.shalatExtraInputEl.focus();
    };

    els.addShalatExtraBtn.addEventListener("click", addExtra);
    els.shalatExtraInputEl.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addExtra();
      }
    });
  }

  if (els.saveShalatBtn) {
    els.saveShalatBtn.addEventListener("click", () => {
      save("Checklist shalat tersimpan");
    });
  }
}
