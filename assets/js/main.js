const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector(".site-nav");
const dialog = document.querySelector("[data-reservation-dialog]");
const openReservationButtons = document.querySelectorAll("[data-open-reservation]");
const closeReservationButton = document.querySelector("[data-close-reservation]");

function updateHeader() {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    nav.classList.toggle("is-open");
  });
}

openReservationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      window.location.href = "/reservation/";
    }
  });
});

if (closeReservationButton && dialog) {
  closeReservationButton.addEventListener("click", () => dialog.close());
}

document.querySelectorAll("[data-reservation-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const endpoint = form.dataset.endpoint;
    const email = form.dataset.email;
    const subject = form.dataset.subject || "real estate Ai lab reservation";
    const payload = {
      email: formData.get("email"),
      message: formData.get("message") || "",
      source: window.location.href,
      createdAt: new Date().toISOString()
    };

    if (status) status.value = "正在提交...";

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("Request failed");
        if (status) status.value = "预约已提交，我们会通过邮箱联系你。";
        form.reset();
        return;
      } catch (error) {
        if (status) status.value = "提交接口暂不可用，正在打开邮件发送。";
      }
    }

    const body = [
      `Email: ${payload.email}`,
      `Message: ${payload.message}`,
      `Source: ${payload.source}`,
      `Time: ${payload.createdAt}`
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.value = "已打开邮件，请发送后完成预约。";
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));

