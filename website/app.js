(function () {
  function showToast(msg) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    window.setTimeout(() => el.classList.remove("show"), 2200);
  }

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const text = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard");
      } catch (err) {
        showToast("Copy failed: " + (err && err.message ? err.message : "clipboard unavailable"));
      }
    });
  });

  const jurisdictionEl = document.getElementById("studio-jurisdiction");
  const allergyEl = document.getElementById("studio-allergy");
  const medEl = document.getElementById("studio-med");
  const runBtn = document.getElementById("studio-run");

  function evaluateClinicalGuard() {
    if (!jurisdictionEl || !allergyEl || !medEl) return;
    const jur = jurisdictionEl.value;
    const allergy = allergyEl.value;
    const med = medEl.value;
    const conflict = (allergy === "penicillin" && med === "amoxicillin") || (allergy === "sulfa" && med === "cotrimoxazole");

    const outEl = document.getElementById("studio-output");
    if (outEl) {
      outEl.textContent = JSON.stringify({
        jurisdiction_profile: jur,
        residency_enforced: jur === "NG" ? "Nigeria NDPA 2023 (af-south)" : "UK GDPR / DPA 2018 (eu-west-2)",
        patient_allergy: allergy,
        proposed_prescription: med,
        allergy_guard_status: conflict ? "BLOCKED_CONTRAINDICATION" : "CLEARED_FOR_CLINICIAN_SIGNOFF",
        ai_scribe_signoff_required: true,
        audit_ledger_hash: "sha256:9f84c2...verified"
      }, null, 2);
    }
  }

  if (runBtn) {
    runBtn.addEventListener("click", evaluateClinicalGuard);
    [jurisdictionEl, allergyEl, medEl].forEach((el) => {
      if (el) el.addEventListener("change", evaluateClinicalGuard);
    });
    evaluateClinicalGuard();
  }
})();
