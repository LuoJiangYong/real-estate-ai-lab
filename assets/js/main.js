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
    const subject = form.dataset.subject || "real estate Ai lab 项目联系";
    const payload = {
      name: formData.get("name") || "",
      email: formData.get("email"),
      message: formData.get("message") || "",
      website: formData.get("website") || "",
      source: window.location.href,
      createdAt: new Date().toISOString()
    };

    if (payload.website) return;

    if (status) status.value = "正在提交...";

    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload)
        });
        if (status) status.value = "已提交，我们会通过邮箱联系你。";
        form.reset();
        return;
      } catch (error) {
        if (status) status.value = "在线提交暂不可用，正在打开邮件发送。";
      }
    }

    const body = [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Message: ${payload.message}`,
      `Source: ${payload.source}`,
      `Time: ${payload.createdAt}`
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) status.value = "已打开邮件，请发送后完成联系。";
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
