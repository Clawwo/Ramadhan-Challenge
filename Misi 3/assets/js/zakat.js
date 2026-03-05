document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const jenisZakatEl = document.getElementById("jenisZakat");
  const hargaEmasEl = document.getElementById("hargaEmas");
  const formPenghasilanEl = document.getElementById("formPenghasilan");
  const formEmasEl = document.getElementById("formEmas");
  const gajiEl = document.getElementById("gaji");
  const penghasilanLainEl = document.getElementById("penghasilanLain");
  const totalEmasEl = document.getElementById("totalEmas");
  const btnHitungEl = document.getElementById("btnHitung");
  const hasilSectionEl = document.getElementById("hasilSection");
  const totalHartaEl = document.getElementById("totalHarta");
  const nilaiNisabEl = document.getElementById("nilaiNisab");
  const statusZakatEl = document.getElementById("statusZakat");
  const jumlahZakatEl = document.getElementById("jumlahZakat");
  const jumlahZakatContainerEl = document.getElementById("jumlahZakatContainer");

  // Constants
  const NISAB_GRAM = 85;
  const ZAKAT_PERCENTAGE = 2.5 / 100;

  // Format currency for display
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format input with Rp prefix and thousand separators
  const formatInputRupiah = (value) => {
    // Remove all non-digit characters
    const number = value.replace(/\D/g, "");
    if (number === "") return "";
    
    // Format with thousand separators (dots)
    const formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `Rp ${formatted}`;
  };

  // Parse formatted rupiah back to number
  const parseRupiah = (value) => {
    if (!value) return 0;
    // Remove "Rp", spaces, and dots
    const cleaned = value.replace(/[Rp\s.]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  // Handle input formatting
  const handleRupiahInput = (e) => {
    const input = e.target;
    const cursorPos = input.selectionStart;
    const oldValue = input.value;
    const oldLength = oldValue.length;
    
    // Format the value
    const formatted = formatInputRupiah(input.value);
    input.value = formatted;
    
    // Adjust cursor position
    const newLength = formatted.length;
    const diff = newLength - oldLength;
    const newCursorPos = Math.max(0, cursorPos + diff);
    
    // Set cursor position after formatting
    setTimeout(() => {
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Setup rupiah input formatting
  const setupRupiahInput = (input) => {
    if (!input) return;
    
    input.addEventListener("input", handleRupiahInput);
    
    // Format on blur if empty show nothing
    input.addEventListener("blur", () => {
      if (parseRupiah(input.value) === 0) {
        input.value = "";
      }
    });
  };

  // Initialize rupiah inputs
  setupRupiahInput(hargaEmasEl);
  setupRupiahInput(gajiEl);
  setupRupiahInput(penghasilanLainEl);

  // Toggle form based on zakat type
  const toggleForm = () => {
    const jenisZakat = jenisZakatEl.value;

    if (jenisZakat === "penghasilan") {
      formPenghasilanEl.classList.remove("hidden");
      formEmasEl.classList.add("hidden");
      // Reset emas form
      if (totalEmasEl) totalEmasEl.value = "";
    } else {
      formPenghasilanEl.classList.add("hidden");
      formEmasEl.classList.remove("hidden");
      // Reset penghasilan form
      if (gajiEl) gajiEl.value = "";
      if (penghasilanLainEl) penghasilanLainEl.value = "";
    }

    // Hide hasil when switching
    hasilSectionEl.classList.add("hidden");
  };

  // Validate inputs
  const validateInputs = () => {
    const hargaEmas = parseRupiah(hargaEmasEl.value);
    const jenisZakat = jenisZakatEl.value;

    if (hargaEmas <= 0) {
      alert("Mohon masukkan harga emas per gram yang valid.");
      hargaEmasEl.focus();
      return false;
    }

    if (jenisZakat === "penghasilan") {
      const gaji = parseRupiah(gajiEl.value);
      const penghasilanLain = parseRupiah(penghasilanLainEl.value);

      if (gaji <= 0 && penghasilanLain <= 0) {
        alert("Mohon masukkan minimal gaji atau penghasilan lain.");
        gajiEl.focus();
        return false;
      }
    } else {
      const totalEmas = parseFloat(totalEmasEl.value) || 0;

      if (totalEmas <= 0) {
        alert("Mohon masukkan total emas yang dimiliki.");
        totalEmasEl.focus();
        return false;
      }
    }

    return true;
  };

  // Calculate zakat
  const hitungZakat = () => {
    if (!validateInputs()) return;

    const hargaEmas = parseRupiah(hargaEmasEl.value);
    const jenisZakat = jenisZakatEl.value;
    const nisab = hargaEmas * NISAB_GRAM;

    let totalHarta = 0;

    if (jenisZakat === "penghasilan") {
      const gaji = parseRupiah(gajiEl.value);
      const penghasilanLain = parseRupiah(penghasilanLainEl.value);
      totalHarta = gaji + penghasilanLain;
    } else {
      const totalEmas = parseFloat(totalEmasEl.value) || 0;
      totalHarta = totalEmas * hargaEmas;
    }

    const isWajib = totalHarta >= nisab;
    const jumlahZakat = isWajib ? totalHarta * ZAKAT_PERCENTAGE : 0;

    // Display results
    displayResults(totalHarta, nisab, isWajib, jumlahZakat);
  };

  // Display results
  const displayResults = (totalHarta, nisab, isWajib, jumlahZakat) => {
    // Update values
    totalHartaEl.textContent = formatRupiah(totalHarta);
    nilaiNisabEl.textContent = formatRupiah(nisab);

    // Update status
    if (isWajib) {
      statusZakatEl.textContent = "Wajib Zakat";
      statusZakatEl.className =
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold status-wajib";
      jumlahZakatContainerEl.classList.remove("opacity-50");
    } else {
      statusZakatEl.textContent = "Tidak Wajib";
      statusZakatEl.className =
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold status-tidak-wajib";
      jumlahZakatContainerEl.classList.add("opacity-50");
    }

    // Update zakat amount
    jumlahZakatEl.textContent = formatRupiah(jumlahZakat);

    // Show result section with animation
    hasilSectionEl.classList.remove("hidden");
    hasilSectionEl.classList.add("fade-in");

    // Scroll to result
    setTimeout(() => {
      hasilSectionEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // Event listeners
  jenisZakatEl.addEventListener("change", toggleForm);
  btnHitungEl.addEventListener("click", hitungZakat);

  // Allow enter key to submit
  const inputs = [hargaEmasEl, gajiEl, penghasilanLainEl, totalEmasEl];
  inputs.forEach((input) => {
    if (input) {
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          hitungZakat();
        }
      });
    }
  });

  // Initialize form state
  toggleForm();
});
