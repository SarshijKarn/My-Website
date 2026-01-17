gsap.registerPlugin(ScrollTrigger);
// 🚀 Vercel Serverless API - Instant response, no cold starts!
const BACKEND_URL = "https://portfoli-contact.vercel.app";
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelectorAll(".nav-link");
function toggleSidebar() {
  if (sidebar && mobileMenuBtn) {
    sidebar.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");
    if (sidebarOverlay) sidebarOverlay.classList.toggle("active");
  }
}
function closeSidebar() {
  if (sidebar && mobileMenuBtn) {
    sidebar.classList.remove("active");
    mobileMenuBtn.classList.remove("active");
    if (sidebarOverlay) sidebarOverlay.classList.remove("active");
  }
}
if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleSidebar);
}
if (sidebarOverlay) {
  sidebarOverlay.addEventListener("click", closeSidebar);
}
navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});
const sections = document.querySelectorAll("section[id]");
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDark = !0;
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    body.className = isDark ? "dark" : "light";
    themeToggle.classList.toggle("active");
  });
}
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
const isMobile = window.innerWidth <= 768;
const isLowEndDevice = window.innerWidth <= 480;
const typingText = document.querySelector(".typing-text");
if (typingText && !isMobile) {
  const text = typingText.textContent;
  typingText.textContent = "";
  let i = 0;
  function typeWriter() {
    if (i < text.length) {
      typingText.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 100);
    }
  }
  setTimeout(typeWriter, 1000);
} else if (typingText && isMobile) {
  typingText.style.opacity = "1";
}
const animDuration = isMobile ? 0.5 : 1.5;
const animDelay = isMobile ? 0.1 : 0.3;
// 🚀 Optimized Hero Animations - Unified & Smooth
// Using fromTo with autoAlpha handles the FOUC (Flash of Unstyled Content) by ensuring elements start hidden and reveal smoothly
const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

tl.fromTo(".hero-content-left",
  { x: -30, autoAlpha: 0 },
  { x: 0, autoAlpha: 1, duration: 1 }
)
.fromTo(".hero-image-right",
  { x: 30, autoAlpha: 0 },
  { x: 0, autoAlpha: 1, duration: 1 },
  "<0.1" // Start 0.1s after previous
)
.fromTo(".hero-title",
  { y: 30, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, duration: 0.8 },
  "<0.2"
)
.fromTo(".typing-text",
  { y: 20, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, duration: 0.8 },
  "<0.1"
)
.fromTo(".social-icon",
  { y: 20, autoAlpha: 0 },
  { y: 0, autoAlpha: 1, stagger: 0.05, duration: 0.5 },
  "<0.2"
);
gsap.utils.toArray(".card").forEach((card) => {
  gsap.fromTo(
    card,
    { y: 30, autoAlpha: 0 }, // autoAlpha handles opacity + visibility
    {
      y: 0,
      autoAlpha: 1,
      duration: isMobile ? 0.4 : 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        toggleActions: "play none none reverse",
      },
    }
  );
});
gsap.fromTo(
  ".about-photo-enhanced",
  { scale: 0.9, autoAlpha: 0 }, // Simplified start state
  {
    scale: 1,
    autoAlpha: 1,
    duration: 0.8,
    ease: "back.out(1.2)",
    scrollTrigger: {
      trigger: ".about-photo-enhanced",
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  }
);
gsap.utils.toArray(".timeline-item").forEach((item, index) => {
  // 💡 Performance Optimization: Skip complex slide-ins on mobile for smoother scrolling
  if (isMobile) {
    gsap.fromTo(
      item,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  } else {
    gsap.fromTo(
      item,
      { x: index % 2 === 0 ? -60 : 60, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }
});
gsap.utils.toArray(".circuit-line").forEach((line) => {
  gsap.fromTo(
    line,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration: 1,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: line,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
});
document.querySelectorAll(".card-3d").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, { scale: 1.03, duration: 0.2, ease: "power2.out" });
  });
  card.addEventListener("mouseleave", () => {
    gsap.to(card, { scale: 1, duration: 0.2, ease: "power2.out" });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector(".submit-button");
  const btnText = submitBtn ? submitBtn.querySelector(".button-text") : null;

  // ⚡ Vercel serverless functions are always instant - no warming needed!
  if (submitBtn && btnText) {
    submitBtn.disabled = false;
    btnText.textContent = "TRANSMIT MESSAGE";
  }
  function createParticle() {
    // 💡 Performance Optimization: Only create particles on desktop or higher-end devices
    // This reduces DOM manipulation significantly on mobile
    if (window.innerWidth <= 768) return;

    const particle = document.createElement("div");
    particle.className = "cyber-particle";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 100 + "vh";
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(particle);
    setTimeout(() => {
      particle.remove();
      if (document.body.contains(particle))
        requestAnimationFrame(createParticle);
    }, 5000);
  }

  // 💡 Performance Optimization: Limit particles on systems that support them
  const particleCount = window.innerWidth <= 768 ? 0 : 5;
  for (let i = 0; i < particleCount; i++) {
    setTimeout(createParticle, i * 200);
  }
  gsap.from("body", { opacity: 0, duration: 0.8, ease: "power2.out" });
});
let ticking = !1;
function updateScrollEffects() {
  // 💡 Refactored: Section tracking is now handled by IntersectionObserver for much better performance
  ticking = !1;
}
function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = !0;
  }
}

// 💡 Performance Optimization: Use IntersectionObserver for section tracking instead of scroll listener where possible
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("data-section") === sectionId
          );
        });
      }
    });
  },
  { threshold: 0.5 }
);

sections.forEach((section) => sectionObserver.observe(section));
window.addEventListener("scroll", requestTick, { passive: !0 });
requestAnimationFrame(updateScrollEffects);
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);
document.querySelectorAll(".card").forEach((card) => {
  observer.observe(card);
});
// 🎭 Jumble/Decrypt Animation - Triggers when hovering/clicking on the name text only
(function () {
  const jumbleElements = document.querySelectorAll(".jumble-text");
  if (jumbleElements.length === 0) return;
  const chars = "!<>-_\\/[]{}=+*^?#";

  // Function to animate a single element
  function animateJumble(el) {
    if (el.dataset.animating === "true") return;
    el.dataset.animating = "true";
    const originalText = el.dataset.text || el.textContent.trim();
    const duration = 400;
    const start = performance.now();

    function animate(now) {
      let progress = (now - start) / duration;
      if (progress > 1) progress = 1;
      const revealCount = Math.floor(progress * originalText.length);
      let newText = "";
      for (let i = 0; i < originalText.length; i++) {
        if (i < revealCount) {
          newText += originalText[i];
        } else {
          newText += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      el.textContent = newText;
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        el.textContent = originalText.trim();
        el.dataset.animating = "false";
      }
    }
    requestAnimationFrame(animate);
  }

  // Add event listeners to each name span individually
  jumbleElements.forEach((el) => {
    // Desktop: hover on name text
    el.addEventListener("mouseenter", function () {
      animateJumble(this);
    });

    // Mobile: touch/click on name text
    el.addEventListener(
      "touchstart",
      function () {
        animateJumble(this);
      },
      { passive: !0 }
    );

    el.addEventListener("click", function () {
      animateJumble(this);
    });

    // Add cursor pointer to indicate it's interactive
    el.style.cursor = "pointer";
  });
})();
const pronounceBtn = document.getElementById("pronounce-name");
if (pronounceBtn) {
  pronounceBtn.addEventListener("click", () => {
    pronounceBtn.style.color = "#00CED1";
    setTimeout(() => {
      pronounceBtn.style.color = "#ffffff";
    }, 1000);
    const utterance = new SpeechSynthesisUtterance("Call me Sarshij");
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  });
}
document.querySelectorAll("[data-magnetic]").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});
document.querySelectorAll("[data-copy]").forEach((element) => {
  element.addEventListener("click", async () => {
    const textToCopy = element.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast();
      createParticleBurst(element);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  });
});
function showToast() {
  const toast = document.getElementById("copyToast");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}
function createParticleBurst(element) {
  const container = element
    .closest(".magnetic-card")
    .querySelector(".card-particles");
  const colors = ["#8A2BE2", "#00CED1", "#FFD600"];
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.style.position = "absolute";
    particle.style.width = "6px";
    particle.style.height = "6px";
    particle.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    particle.style.borderRadius = "50%";
    particle.style.left = "50%";
    particle.style.top = "50%";
    particle.style.pointerEvents = "none";
    const angle = (Math.PI * 2 * i) / 12;
    const velocity = 50 + Math.random() * 50;
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;
    container.appendChild(particle);
    particle.animate(
      [
        {
          transform: "translate(-50%, -50%) translate(0, 0) scale(1)",
          opacity: 1,
        },
        {
          transform: `translate(-50 %, -50 %) translate(${tx}px, ${ty}px) scale(0)`,
          opacity: 0,
        },
      ],
      { duration: 800, easing: "cubic-bezier(0, .9, .57, 1)" }
    ).onfinish = () => particle.remove();
  }
}
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formInputs = contactForm.querySelectorAll(".form-input");
  const formProgress = document.getElementById("formProgress");
  const formProgressText = document.getElementById("formProgressText");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");
  function updateProgress() {
    let filledFields = 0;
    formInputs.forEach((input) => {
      if (input.value.trim() !== "") {
        filledFields++;
      }
    });
    const progress = (filledFields / formInputs.length) * 100;
    formProgress.style.width = progress + "%";
    formProgressText.textContent = Math.round(progress) + "% Complete";
    if (progress === 100) {
      formProgressText.style.color = "#00ff88";
    } else {
      formProgressText.style.color = "#8A2BE2";
    }
  }
  if (messageInput && charCount) {
    messageInput.addEventListener("input", () => {
      const count = messageInput.value.length;
      const max = messageInput.getAttribute("maxlength");
      charCount.textContent = count;
      const counter = messageInput
        .closest(".form-group")
        .querySelector(".character-counter");
      counter.classList.remove("warning", "danger");
      if (count > max * 0.9) {
        counter.classList.add("danger");
      } else if (count > max * 0.7) {
        counter.classList.add("warning");
      }
      updateProgress();
    });
  }
  formInputs.forEach((input) => {
    input.addEventListener("input", updateProgress);
    input.addEventListener("blur", updateProgress);
  });
  function validateForm() {
    const nameInput = contactForm.querySelector("#name");
    const emailInput = contactForm.querySelector("#email");
    const messageInput = contactForm.querySelector("#message");
    const errors = [];
    const name = nameInput?.value.trim() || "";
    if (!name) {
      errors.push("Name is required");
      nameInput?.classList.add("error");
    } else if (name.length < 2) {
      errors.push("Name must be at least 2 characters");
      nameInput?.classList.add("error");
    } else if (name.length > 100) {
      errors.push("Name must be less than 100 characters");
      nameInput?.classList.add("error");
    } else {
      nameInput?.classList.remove("error");
    }
    const email = emailInput?.value.trim() || "";
    // Strict Email Regex (W3C standard + TLD enforcement)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // Blocklist for common temp mails or generic placeholders
    const blockedDomains = ["test.com", "example.com", "tempmail.com", "mailinator.com"];
    const domain = email.split('@')[1];

    if (!email) {
      errors.push("Email is required");
      emailInput?.classList.add("error");
    } else if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
      emailInput?.classList.add("error");
    } else if (blockedDomains.includes(domain)) {
      errors.push("Please use a legitimate email address");
      emailInput?.classList.add("error");
    } else if (email.length > 255) {
      errors.push("Email must be less than 255 characters");
      emailInput?.classList.add("error");
    } else {
      emailInput?.classList.remove("error");
    }
    const message = messageInput?.value.trim() || "";
    if (!message) {
      errors.push("Message is required");
      messageInput?.classList.add("error");
    } else if (message.length < 10) {
      errors.push("Message must be at least 10 characters");
      messageInput?.classList.add("error");
    } else if (message.length > 500) {
      errors.push("Message must be less than 500 characters");
      messageInput?.classList.add("error");
    } else {
      messageInput?.classList.remove("error");
    }
    const turnstileResponse = contactForm.querySelector('[name="cf-turnstile-response"]')?.value;
    if (!turnstileResponse) {
       errors.push("Please complete the Security Check (CAPTCHA)");
    }

    // Honeypot check (reject if filled - bots auto-fill hidden fields)
    const honeypot = contactForm.querySelector('#website')?.value;
    if (honeypot) {
      console.warn('🤖 Bot detected via honeypot field');
      errors.push("Validation failed");
    }

    return { isValid: errors.length === 0, errors };
  }
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector(".submit-button");
    if (!submitButton) {
      console.error("Submit button not found!");
      return;
    }
    const buttonText = submitButton.querySelector(".button-text");
    if (!buttonText) {
      console.error("Button text element not found!");
      return;
    }
    const originalText = buttonText.textContent;
    const validation = validateForm();
    if (!validation.isValid) {
      buttonText.textContent = validation.errors[0];
      submitButton.classList.add("error");
      setTimeout(() => {
        submitButton.classList.remove("error");
        buttonText.textContent = originalText;
      }, 3000);
      return;
    }
    submitButton.classList.add("loading");
    submitButton.disabled = !0;
    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      data.name = data.name.trim();
      data.email = data.email.trim();
      data.message = data.message.trim();
      // Add Turnstile Token to payload
      data['cf-turnstile-response'] = formData.get('cf-turnstile-response');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      let response;
      try {
        response = await fetch(`${BACKEND_URL}/api/contact`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError;
      }
      try {
        if (response.ok) {
          const result = await response.json();
          if (!result || typeof result !== "object") {
            throw new Error("Invalid response from server");
          }
          submitButton.classList.remove("loading");
          submitButton.classList.add("success");
          buttonText.textContent = "Message Sent!";
          createFormSuccessEffect(submitButton);
          contactForm.reset();
          formInputs.forEach((input) => {
            input.classList.remove("has-value", "error");
          });
          updateProgress();
          setTimeout(() => {
            submitButton.classList.remove("success");
            buttonText.textContent = originalText;
            submitButton.disabled = !1;
          }, 3000);
        } else {
          let errorMessage = "Form submission failed";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            if (response && response.status) {
              errorMessage =
                response.statusText || `Server error (${response.status})`;
            }
          }
          throw new Error(errorMessage);
        }
      } catch (responseError) {
        throw responseError;
      }
    } catch (error) {
      console.error("Form submission error:", error);
      submitButton.classList.remove("loading");
      submitButton.classList.add("error");
      let errorMessage = "Error! Try Again";
      if (error.name === "AbortError" || error.message.includes("timeout")) {
        errorMessage = "Request Timeout! Try Again";
      } else if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("ERR_")
      ) {
        errorMessage = "Network Error! Check Connection";
      } else if (
        error.message.includes("Rate limit") ||
        error.message.includes("Too many requests")
      ) {
        errorMessage = "Too Many Requests! Please wait a minute";
      } else if (error.message.includes("All fields are required")) {
        errorMessage = "Please fill all fields";
      } else if (error.message) {
        errorMessage =
          error.message.length > 50 ? "Error! Try Again" : error.message;
      }
      buttonText.textContent = errorMessage;
      setTimeout(() => {
        submitButton.classList.remove("error");
        buttonText.textContent = originalText;
        submitButton.disabled = !1;
      }, 3000);
    }
  });
  updateProgress();
}
function createFormSuccessEffect(button) {
  const container = button.querySelector(".button-particles");
  const colors = ["#8A2BE2", "#00CED1", "#FFD600"];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "8px";
      particle.style.height = "8px";
      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = "50%";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = "50%";
      particle.style.pointerEvents = "none";
      particle.style.boxShadow = `0 0 10px ${
        colors[Math.floor(Math.random() * colors.length)]
      } `;
      container.appendChild(particle);
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      particle.animate(
        [
          { transform: "translate(0, 0) scale(1)", opacity: 1 },
          { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: "cubic-bezier(0, .9, .57, 1)",
        }
      ).onfinish = () => particle.remove();
    }, i * 30);
  }
}
const backToTopButton = document.getElementById("backToTop");
if (backToTopButton) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
const mobileNotice = document.getElementById("mobileNotice");
const closeMobileNotice = document.getElementById("closeMobileNotice");
if (closeMobileNotice && mobileNotice) {
  const closePopup = () => {
    mobileNotice.style.opacity = "0";
    setTimeout(() => {
      mobileNotice.style.display = "none";
    }, 300);
  };
  closeMobileNotice.addEventListener("click", (e) => {
    e.stopPropagation();
    closePopup();
  });
  window.addEventListener("click", (e) => {
    if (
      mobileNotice.style.display !== "none" &&
      !mobileNotice.contains(e.target)
    ) {
      closePopup();
    }
  });
}



// Cache clearing logic removed to improve load stability and UX
function initTerminalMode() {
  const toggleBtn = document.getElementById("toggleTerminal");
  const terminal = document.getElementById("contactTerminal");
  const normalForm = document.getElementById("contactForm");
  const input = document.getElementById("terminalInput");
  const output = document.getElementById("terminalOutput");
  const helpBtn = document.getElementById("terminalHelp");
  if (!toggleBtn || !terminal) return;

  // Helper to prevent XSS
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  let step = 0;
  let mathChallenge = { a: 0, b: 0, answer: 0 };
  const userData = { name: "", email: "", message: "", isTerminal: true };
  if (helpBtn) {
    helpBtn.addEventListener("click", () => {
      printToTerminal("---| TERMINAL USER GUIDE |---");
      printToTerminal("1. Type 'contact' and press ENTER to start.");
      printToTerminal("2. Follow prompts to enter Name, Email, and Message.");
      printToTerminal("3. Your data will be sent automatically at the end.");
      printToTerminal("4. Commands: 'clear' to reset, 'exit' to close.");
    });
  }
  toggleBtn.addEventListener("click", () => {
    terminal.classList.toggle("active");
    if (terminal.classList.contains("active")) {
      normalForm.style.display = "none";
      toggleBtn.innerHTML = '<i class="fas fa-times"></i> EXIT TERMINAL';
      printToTerminal("SYSTEM: Establishing secure uplink...");
      setTimeout(
        () =>
          printToTerminal(
            "SYSTEM: Connection stabilized. Type 'help' for commands."
          ),
        1000
      );
      input.focus();
    } else {
      normalForm.style.display = "block";
      toggleBtn.innerHTML =
        '<i class="fas fa-terminal"></i> USE CYBER TERMINAL';
    }
  });
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim().toLowerCase();
      printToTerminal(
        `<span class="terminal-prompt">root@sarshij:~$</span> ${escapeHtml(input.value)}`
      );
      input.value = "";
      processCommand(cmd);
    }
  });
  function printToTerminal(text, isTypewriter = !1) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    output.appendChild(line);
    if (isTypewriter) {
      let i = 0;
      const speed = 20;
      function type() {
        if (i < text.length) {
          if (text.charAt(i) === "<") {
            const tagEnd = text.indexOf(">", i);
            line.innerHTML += text.substring(i, tagEnd + 1);
            i = tagEnd + 1;
          } else {
            line.innerHTML += text.charAt(i);
            i++;
          }
          setTimeout(type, speed);
          terminal.scrollTop = terminal.scrollHeight;
        }
      }
      type();
    } else {
      line.innerHTML = text;
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
  async function processCommand(cmd) {
    if (cmd === "help") {
      printToTerminal("---| TERMINAL USER GUIDE |---");
      printToTerminal("1. Type 'contact' and press ENTER to start.");
      printToTerminal("2. Commands: 'clear', 'status', 'exit'", !0);
      return;
    }
    if (cmd === "clear") {
      output.innerHTML = "SYSTEM: Memory cleared...";
      setTimeout(() => (output.innerHTML = ""), 1000);
      return;
    }
    if (cmd === "status") {
      printToTerminal("SYSTEM: Pinging uplink server...", !0);
      try {
        const res = await fetch(`${BACKEND_URL}/api/wake-up`);
        if (res.ok)
          printToTerminal(
            "SYSTEM: <span style='color: #00ff88'>UPLINK ONLINE</span> (v3.0.4)",
            !0
          );
        else
          printToTerminal(
            "SYSTEM: <span style='color: #ff3e3e'>UPLINK DEGRADED</span>",
            !0
          );
      } catch (e) {
        printToTerminal(
          "SYSTEM: <span style='color: #ff3e3e'>UPLINK OFFLINE</span>",
          !0
        );
      }
      return;
    }
    if (cmd === "exit") {
      toggleBtn.click();
      return;
    }
    if (step === 0 && cmd === "contact") {
      step = 0.5; // Math Challenge Step
      mathChallenge.a = Math.floor(Math.random() * 10) + 1;
      mathChallenge.b = Math.floor(Math.random() * 10) + 1;
      mathChallenge.answer = mathChallenge.a + mathChallenge.b;
      printToTerminal(
        `SECURITY CHECK: What is ${mathChallenge.a} + ${mathChallenge.b}?`,
        !0
      );
    } else if (step === 0.5) {
      if (parseInt(cmd) === mathChallenge.answer) {
        step = 1;
        printToTerminal(
         "ACCESS GRANTED. Initiation sequence started. Enter your name:",
         !0
        );
      } else {
        step = 0;
         printToTerminal(
         "ACCESS DENIED. Incorrect security code. Session reset.",
         !0
        );
      }
    } else if (step === 1) {
      userData.name = escapeHtml(cmd);
      step = 2;
      printToTerminal(
        `SUCCESS: ID confirmed as '${escapeHtml(cmd)}'. Enter neural-mail:`,
        !0
      );
    } else if (step === 2) {
      userData.email = escapeHtml(cmd); // Basic check could go here
      step = 3;
      printToTerminal(
        "SUCCESS: Uplink address verified. Enter your transmission data:",
        !0
      );
    } else if (step === 3) {
      userData.message = escapeHtml(cmd);
      printToTerminal("SYSTEM: Encrypting and transmitting data packet...", !0);
      sendData();
      step = 0;
    } else {
      printToTerminal(`ERROR: Unknown command '${escapeHtml(cmd)}'. Try 'help'.`);
    }
  }
  async function sendData() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        printToTerminal(
          "SYSTEM: <span style='color: #00ff88'>TRANSMISSION SUCCESSFUL.</span> Uplink terminated.",
          !0
        );
      } else {
        printToTerminal(
          "ERROR: <span style='color: #ff3e3e'>TRANSMISSION REJECTED by server.</span>",
          !0
        );
      }
    } catch (err) {
      printToTerminal(
        "ERROR: <span style='color: #ff3e3e'>CONNECTION TIMEOUT.</span> Packet lost in transit.",
        !0
      );
    }
  }
}
document.addEventListener("DOMContentLoaded", () => {
  initTerminalMode();
});
// --- 🕵️‍♂️ EASTER EGG: ULTIMATE HACKER MODE ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Glitch Text Initialization
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
        heroTitle.classList.add("glitch-hover");
        heroTitle.setAttribute("data-text", heroTitle.innerText);
    }

    // 2. Matrix Rain Canvas Setup
    let canvas, ctx;
    let matrixInterval;
    // Dynamic check is better than static const

    function startMatrixRain() {
        if (window.innerWidth <= 768) return; // Dynamic check: strictly no mobile

        // Create Canvas if not exists
        if (!document.getElementById("matrixCanvas")) {
            canvas = document.createElement("canvas");
            canvas.id = "matrixCanvas";
            canvas.className = "matrix-canvas";
            document.body.appendChild(canvas);
            ctx = canvas.getContext("2d");

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            // Handle Resize: Stop if too small, Update size if okay
            window.addEventListener("resize", () => {
                if (window.innerWidth <= 768) {
                    stopMatrixRain();
                } else {
                    // Only restart/resize if we are in Hacker Mode and it was stopped
                    if (document.body.classList.contains("hacker-mode") && !matrixInterval) {
                         startMatrixRain();
                    }
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }
            });
        }

        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        function draw() {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0"; // Green text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            matrixInterval = requestAnimationFrame(draw);
        }
        draw();
    }

    function stopMatrixRain() {
        if (matrixInterval) cancelAnimationFrame(matrixInterval);
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // 3. Hacker Mode Trigger Logic
    let arrowKeys = [];
    const neededKeys = 4;
    const mobiletriggerEl = document.querySelector(".hero-title");
    let touchCount = 0;

    function toggleHackerMode() {
        document.body.classList.toggle("hacker-mode");
        const isHacked = document.body.classList.contains("hacker-mode");

        // Toggle Matrix Rain
        if (isHacked) {
            startMatrixRain();
        } else {
            stopMatrixRain();
        }

        // Show Toast
        const toast = document.createElement("div");
        toast.className = "hack-toast";
        toast.innerText = isHacked ? "⚠️ SYSTEM BREACHED: ROOT ACCESS GRANTED" : "🔒 SYSTEM RESTORED";
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 500);
        }, 3000);

        if (navigator.vibrate) navigator.vibrate(isHacked ? [100, 50, 100] : 200);
    }

    // Desktop Trigger
    window.addEventListener("keydown", (e) => {
        if (e.key.includes("Arrow")) {
            arrowKeys.push(e.key);
            if (arrowKeys.length > neededKeys) arrowKeys.shift();
            if (arrowKeys.length === neededKeys) {
                toggleHackerMode();
                arrowKeys = [];
            }
        } else {
            arrowKeys = [];
        }
    });

    // Universal Trigger: Triple Click/Tap Anywhere
    document.addEventListener("click", (e) => {
        // Optional: Avoid triggering when clicking interactive elements if needed,
        // but for now, we want it "screen-wide" as requested.
        touchCount++;
        if (touchCount === 1) setTimeout(() => touchCount = 0, 800);
        if (touchCount === 3) {
            toggleHackerMode();
            touchCount = 0;
        }
    });

    // 4. UI Hint: Update the existing Server Status Text
    const statusText = document.querySelector("#serverStatus .status-text");
    const statusDot = document.querySelector("#serverStatus .status-dot");

    if (statusText) {
        // Instruction Text Logic
        // Force "Press 4 Arrow Keys" for Desktop (width > 768)
        // Force "Triple Tap Screen 3 Times" for Mobile (width <= 768)
        const instruction = window.innerWidth <= 768 ? "Triple Tap Screen 3 Times" : "Press 4 Arrow Keys";

        statusText.innerText = instruction;
        // Optional: Green dot to show system ready
        if (statusDot) statusDot.style.backgroundColor = "#27c93f";

        // Ensure text updates on resize
        window.addEventListener("resize", () => {
             const newInst = window.innerWidth <= 768 ? "Triple Tap Screen 3 Times" : "Press 4 Arrow Keys";
             statusText.innerText = newInst;
        });
    }

    // 5. Tab Visibility Logic (Signal Lost)
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            document.title = "⚠️ Signal Lost... | Sarshij Karn";
        } else {
            document.title = "Signal Restored";
            setTimeout(() => {
                document.title = "Sarshij Karn | Electronics Engineer · AI · Cybersecurity";
            }, 2000);
        }
    });
});
