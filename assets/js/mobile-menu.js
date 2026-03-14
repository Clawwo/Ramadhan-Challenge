document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!mobileMenuBtn || !mobileMenu) return;

  const closeMenu = () => {
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    mobileMenu.classList.toggle("hidden", isExpanded);
    mobileMenuBtn.setAttribute("aria-expanded", String(!isExpanded));
  };

  mobileMenuBtn.addEventListener("click", toggleMenu);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      !mobileMenu.classList.contains("hidden") &&
      !mobileMenu.contains(event.target) &&
      !mobileMenuBtn.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) closeMenu();
  });
});
