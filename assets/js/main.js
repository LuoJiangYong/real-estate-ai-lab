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
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const endpoint = form.dataset.endpoint;
    const email = form.dataset.email;
    const subject = form.dataset.subject || "real estate Ai lab 项目联系";
    const defaultButtonText = submitButton ? submitButton.textContent : "";
    const payload = {
      name: formData.get("name") || "",
      email: formData.get("email"),
      message: formData.get("message") || "",
      source: window.location.href,
      createdAt: new Date().toISOString()
    };

    if (status) status.value = "正在提交...";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "提交中...";
    }

    if (endpoint) {
      let timeout;

      try {
        await Promise.race([
          fetch(endpoint, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify(payload)
          }),
          new Promise((_, reject) => {
            timeout = window.setTimeout(() => reject(new Error("timeout")), 10000);
          })
        ]);
        window.clearTimeout(timeout);
        if (status) status.value = "已提交，我们会通过邮箱联系你。";
        if (submitButton) {
          submitButton.textContent = "已提交";
          submitButton.disabled = true;
        }
        form.reset();
        return;
      } catch (error) {
        window.clearTimeout(timeout);
        if (status) status.value = "提交未完成，请重试或直接邮件联系。";
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
        return;
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
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonText;
    }
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
