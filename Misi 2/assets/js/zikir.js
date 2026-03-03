document.addEventListener("DOMContentLoaded", () => {
  const counterEl = document.getElementById("counter");
  const targetDisplayEl = document.getElementById("targetDisplay");
  const targetSelectEl = document.getElementById("targetSelect");
  const customTargetEl = document.getElementById("customTarget");
  const badgeEl = document.getElementById("badge");
  const btnPlus = document.getElementById("btnPlus");
  const btnReset = document.getElementById("btnReset");
  const toastRoot = document.getElementById("toast");
  const toastInner = toastRoot?.querySelector("div");
  const toastMessage = document.getElementById("toastMessage");
  const gaugeRing = document.getElementById("gaugeRing");
  const remainingEl = document.getElementById("remaining");

  let toastTimer = null;

  let count = 0;
  const presetDefault = Number(targetSelectEl?.value) || 33;
  let target = presetDefault;

  const clearCompletionState = () => {
    if (badgeEl) {
      badgeEl.classList.add("hidden");
      badgeEl.style.display = "none";
    }
    counterEl.classList.remove("text-emerald-700");
  };

  const updateCounter = () => {
    counterEl.textContent = count;
    const reached = count >= target;
    if (badgeEl) {
      badgeEl.classList.toggle("hidden", !reached);
      badgeEl.style.display = reached ? "inline-flex" : "none";
    }
    counterEl.classList.toggle("text-emerald-700", reached);
    const pct =
      target > 0 ? Math.min(Math.round((count / target) * 100), 999) : 0;
    const remaining = Math.max(target - count, 0);
    if (gaugeRing) gaugeRing.style.setProperty("--pct", pct);
    if (remainingEl) {
      remainingEl.textContent = reached
        ? "Target tercapai"
        : `Sisa ${remaining} lagi`;
    }
    if (reached) showToast("Target tercapai! Barakallah.");
  };

  const setTarget = (value) => {
    const parsed = Number(value);
    target = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 33;
    if (targetDisplayEl) targetDisplayEl.textContent = target;
    updateCounter();
  };

  const tapAnim = (el) => {
    el.classList.add("scale-95");
    setTimeout(() => el.classList.remove("scale-95"), 120);
  };

  const showToast = (msg) => {
    if (!toastInner) return;
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    if (toastMessage) toastMessage.textContent = msg;
    toastInner.classList.remove("hidden", "opacity-0", "translate-y-2");
    toastInner.classList.add("flex");
    toastTimer = setTimeout(() => {
      toastInner.classList.add("hidden");
      toastInner.classList.remove("flex");
    }, 2200);
  };

  const hideToast = () => {
    if (!toastInner) return;
    toastInner.classList.add("hidden");
    toastInner.classList.remove("flex");
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
  };

  btnPlus.addEventListener("click", () => {
    count += 1;
    updateCounter();
    tapAnim(btnPlus);
  });

  btnReset.addEventListener("click", () => {
    count = 0;
    clearCompletionState();
    updateCounter();
    tapAnim(btnReset);
    hideToast();
  });

  targetSelectEl.addEventListener("change", (e) => {
    const value = e.target.value;
    if (value === "custom") {
      if (customTargetEl) {
        customTargetEl.classList.remove("hidden");
        customTargetEl.focus();
      }
      return;
    }
    if (customTargetEl) {
      customTargetEl.classList.add("hidden");
      customTargetEl.value = "";
    }
    setTarget(value);
  });

  if (customTargetEl) {
    const commitCustom = () => {
      const value = customTargetEl.value;
      if (!value) return;
      setTarget(value);
    };
    customTargetEl.addEventListener("change", commitCustom);
    customTargetEl.addEventListener("blur", commitCustom);
    customTargetEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        commitCustom();
        customTargetEl.blur();
      }
    });
  }

  updateCounter();
});
