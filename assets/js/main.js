const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector(".site-nav");
const dialog = document.querySelector("[data-reservation-dialog]");
const openReservationButtons = document.querySelectorAll("[data-open-reservation]");
const closeReservationButton = document.querySelector("[data-close-reservation]");

function isGoogleAppsScriptEndpoint(endpoint) {
  return endpoint && endpoint.includes("script.google.com");
}

function submitToGoogleAppsScript(endpoint, payload) {
  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      endpoint,
      new Blob([body], { type: "text/plain;charset=UTF-8" })
    );
    if (queued) return;
  }

  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    keepalive: true,
    body
  }).catch(() => {});
}

async function submitToWorker(endpoint, payload) {
  submitWithHiddenForm(endpoint, payload);
  return { ok: true, queued: true };
}

function submitWithHiddenForm(endpoint, payload) {
  const frameName = `contact-submit-${Date.now()}`;
  const iframe = document.createElement("iframe");
  const relayForm = document.createElement("form");

  iframe.name = frameName;
  iframe.hidden = true;
  iframe.setAttribute("aria-hidden", "true");
  relayForm.hidden = true;
  relayForm.method = "POST";
  relayForm.action = endpoint;
  relayForm.target = frameName;

  Object.entries(payload).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value || "";
    relayForm.appendChild(input);
  });

  document.body.appendChild(iframe);
  document.body.appendChild(relayForm);
  relayForm.submit();

  window.setTimeout(() => {
    relayForm.remove();
    iframe.remove();
  }, 15000);
}

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
      try {
        if (isGoogleAppsScriptEndpoint(endpoint)) {
          submitToGoogleAppsScript(endpoint, payload);
          window.setTimeout(() => {
            if (status) status.value = "已提交，我们会通过邮箱联系你。";
            if (submitButton) {
              submitButton.textContent = "已提交";
              submitButton.disabled = true;
            }
            form.reset();
          }, 800);
        } else {
          await submitToWorker(endpoint, payload);
          if (status) status.value = "已提交，我们会通过邮箱联系你。";
          if (submitButton) {
            submitButton.textContent = "已提交";
            submitButton.disabled = true;
          }
          form.reset();
        }
      } catch (error) {
        if (status) status.value = `提交暂不可用，请发送邮件至 ${email}`;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
      }

      return;
    }

    if (status) status.value = `提交暂不可用，请发送邮件至 ${email}`;
    if (submitButton) submitButton.textContent = defaultButtonText;
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
