// GSAP Animations and Interactions
gsap.registerPlugin(ScrollTrigger);

// 🔧 CONFIGURATION: CHANGE THIS URL WHEN DEPLOYING
const BACKEND_URL = "https://backend-contact-form-hvqf.onrender.com";
// Example: const BACKEND_URL = 'https://my-backend.onrender.com';

// Safety check: Ensure BACKEND_URL is defined
if (typeof BACKEND_URL === 'undefined' || !BACKEND_URL) {
  console.error('BACKEND_URL is not defined! Please check script.js configuration.');
}

// 0.1 Text Scramble (Decryption) Effect
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 10); // Very fast start
      const end = start + Math.floor(Math.random() * 15); // Very fast duration
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
            complete++;
            output += to;
        } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
                char = this.chars[Math.floor(Math.random() * this.chars.length)];
                this.queue[i].char = char;
            }
            output += char;
        } else {
            output += from;
        }
    }
    
    this.el.textContent = output;
    
    if (complete === this.queue.length) {
        this.resolve();
    } else {
        this.frameRequest = requestAnimationFrame(this.update);
        this.frame++;
    }
  }
}

// ========================================
// ENHANCED NAVBAR
// ========================================

// ========================================
// SIDEBAR & MOBILE NAVIGATION
// ========================================

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

// Close sidebar when clicking on links
navLinks.forEach((link) => {
  link.addEventListener("click", closeSidebar);
});

// Consolidated Scroll Tracking
let lastScroll = 0;
// Note: Scroll execution is throttled via requestTick at the bottom of the file

// Active Section Tracking
const sections = document.querySelectorAll("section[id]");

// Active Section Tracking Logic (Moved to updateScrollEffects for performance)

// Theme Management
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDark = true;

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    body.className = isDark ? "dark" : "light";
    themeToggle.classList.toggle("active");

    // Theme logic handled by CSS variables for videos/backgrounds
  });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// ========================================
// MOBILE PERFORMANCE OPTIMIZATIONS
// ========================================

// Detect if device is mobile
const isMobile = window.innerWidth <= 768;
const isLowEndDevice = window.innerWidth <= 480;

// Typing effect for hero tagline - disabled on mobile for performance
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
  // On mobile, just show the text immediately without animation
  typingText.style.opacity = "1";
}

// GSAP Scroll Animations - optimized for performance
// Reduce animation complexity on mobile
const animDuration = isMobile ? 0.5 : 1.5;
const animDelay = isMobile ? 0.1 : 0.3;

// ========================================
// HOMEPAGE ANIMATIONS (GSAP)
// ========================================
// These functions control how the elements "fly in" when the page loads.

// Animate the LEFT text block
gsap.from(".hero-content-left", {
  duration: 1,       // Animation takes 1 second
  x: -50,            // Starts 50px to the LEFT (slide-in effect)
  opacity: 0,        // Starts invisible
  ease: "power2.out",// Smooth easing function
  delay: 0.2         // Waits 0.2s before starting
});

// Animate the RIGHT image block
gsap.from(".hero-image-right", {
  duration: 1.2,     // Slightly slower than text
  x: isMobile ? 20 : 50, // Slides in from right (20px mobile, 50px desktop)
  opacity: 0,        // Starts invisible
  ease: "power2.out",
  delay: 0           // Starts immediately (no wait)
});

// Old Photo Animation Removed
/* 
gsap.from(".hero-photo-wrapper", {
  duration: animDuration,
  scale: isMobile ? 0.8 : 0,
  rotation: 0, 
  opacity: 0,
  ease: "back.out(1.7)",
});
*/

gsap.from(".hero-title", {
  duration: isMobile ? 0.5 : 1.2,
  y: isMobile ? 30 : 80,
  opacity: 0,
  ease: "power2.out",
  delay: animDelay,
});

gsap.from(".typing-text", {
  duration: isMobile ? 0.3 : 0.8,
  y: isMobile ? 20 : 40,
  opacity: 0,
  delay: animDelay,
  ease: "power2.out",
});

gsap.from(".social-icon", {
  duration: isMobile ? 0.3 : 0.6,
  y: isMobile ? 10 : 20,
  opacity: 0,
  stagger: 0.08,
  delay: 0.8,
  ease: "power2.out",
});

// Scroll-triggered animations - optimized for performance
gsap.utils.toArray(".card").forEach((card) => {
  gsap.fromTo(
    card,
    { y: isMobile ? 15 : 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: isMobile ? 0.3 : 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// About photo animation
gsap.fromTo(
  ".about-photo-wrapper",
  { scale: isMobile ? 0.9 : 0, rotation: isMobile ? 0 : -180, opacity: 0 },
  {
    scale: 1,
    rotation: 0,
    opacity: 1,
    duration: isMobile ? 0.5 : 1,
    ease: "back.out(1.7)",
    scrollTrigger: {
      trigger: ".about-photo-wrapper",
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  }
);

// Timeline animation - optimized for performance
gsap.utils.toArray(".timeline-item").forEach((item, index) => {
  gsap.fromTo(
    item,
    { x: isMobile ? 0 : index % 2 === 0 ? -60 : 60, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    }
  );
});

// Circuit line animations - optimized for performance
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

// Navbar scroll effect handled in optimized scroll listener at bottom

// Add hover effects to project cards - optimized for performance
document.querySelectorAll(".card-3d").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    gsap.to(card, {
      scale: 1.03,
      duration: 0.2,
      ease: "power2.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  });
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // ⚡ WAKE UP CALL (Mitigate Render Cold Starts) & UPDATE UI
  const statusEl = document.getElementById("serverStatus");
  const submitBtn = document.querySelector(".submit-button");
  const btnText = submitBtn ? submitBtn.querySelector(".button-text") : null;
  const originalBtnText = btnText ? "Send Message" : "Send";

  // Lock the button initially (Cyber Security Protocol)
  if (submitBtn && btnText) {
    submitBtn.disabled = true;
    submitBtn.classList.add("initializing");
    btnText.textContent = "📡 INITIALIZING UPLINK...";
  }

  fetch(`${BACKEND_URL}/api/wake-up`)
    .then((res) => {
      if (res.ok) {
        console.log("Server Status: Online");
        if (statusEl) {
          statusEl.classList.add("online");
          statusEl.querySelector(".status-text").textContent = "System Online";
        }
        // Unlock Button
        if (submitBtn && btnText) {
          submitBtn.disabled = false;
          submitBtn.classList.remove("initializing");
          submitBtn.classList.add("system-ready");
          btnText.textContent = "TRANSMIT MESSAGE"; // Cooler text

          // Remove flash effect after animation
          setTimeout(() => submitBtn.classList.remove("system-ready"), 1000);
        }
      }
    })
    .catch((err) => {
      console.log("Server waking up...");
      if (statusEl) {
        statusEl.classList.add("offline");
        statusEl.querySelector(".status-text").textContent =
          "Server Offline (Waking up...)";
      }
      // Unlock anyway (fallback) so they can try click
      if (submitBtn && btnText) {
        submitBtn.disabled = false;
        submitBtn.classList.remove("initializing");
        btnText.textContent = originalBtnText;
      }
    });

  // Create initial particles - reduced count for better performance
  function createParticle() {
    const particle = document.createElement("div");
    particle.className = "cyber-particle";
    particle.style.left = Math.random() * 100 + "vw";
    particle.style.top = Math.random() * 100 + "vh";
    particle.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(particle);

    // Cleanup
    setTimeout(() => {
      particle.remove();
      if (document.body.contains(particle))
        requestAnimationFrame(createParticle); // Keep generating
    }, 5000);
  }

  for (let i = 0; i < 5; i++) {
    setTimeout(createParticle, i * 200);
  }

  // Add loading animation
  gsap.from("body", {
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
  });
});

// Performance optimization: Throttle scroll events
let ticking = false;

function updateScrollEffects() {
  const scrollY = window.pageYOffset;
  
  // 1. Navbar Effects
  if (navbar) {
    if (scrollY > 100) {
      navbar.classList.add("scrolled");
      navbar.style.backdropFilter = "blur(20px)";
    } else {
      navbar.classList.remove("scrolled");
      navbar.style.backdropFilter = "blur(10px)";
    }
  }

  // 2. Active Section Tracking
  sections.forEach((section) => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute("id");

    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      // Update desktop nav
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        }
      });

      // Update mobile nav
      mobileLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-section") === sectionId) {
          link.classList.add("active");
        }
      });
    }
  });

  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick, { passive: true });
// Initial call to set state
requestAnimationFrame(updateScrollEffects);

// Add intersection observer for better performance
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
    }
  });
}, observerOptions);

// Observe all cards for animation
document.querySelectorAll(".card").forEach((card) => {
  observer.observe(card);
});
// Name Jumble Effect for SARSHIJ KARN - optimized for performance
(function () {
  const heroName = document.getElementById("hero-name");
  if (!heroName) return;

  const originalText = heroName.textContent;
  const chars = "!<>-_\\/[]{}=+*^?#";
  let animating = false;

  function triggerJumble() {
    if (animating) return;
    animating = true;

    const duration = 350; // total animation time in ms
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

      heroName.textContent = newText;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        heroName.textContent = originalText;
        animating = false;
      }
    }

    requestAnimationFrame(animate);
  }

  heroName.addEventListener("mouseenter", triggerJumble);
  heroName.addEventListener("touchstart", triggerJumble, { passive: true });
})();

// Pronunciation Feature
const pronounceBtn = document.getElementById("pronounce-name");
if (pronounceBtn) {
  pronounceBtn.addEventListener("click", () => {
    // Visual feedback
    pronounceBtn.style.color = "#00CED1"; // Cyan color when active
    setTimeout(() => {
      pronounceBtn.style.color = "#ffffff"; // Revert to white
    }, 1000);

    // Speech synthesis
    const utterance = new SpeechSynthesisUtterance("Call me Sarshij");
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  });
}

// ========================================
// MAGNETIC CONTACT SECTION
// ========================================

// Magnetic Tilt Effect
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

// Click to Copy Functionality
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

// Show Toast Notification
function showToast() {
  const toast = document.getElementById("copyToast");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// Create Particle Burst Effect
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
      {
        duration: 800,
        easing: "cubic-bezier(0, .9, .57, 1)",
      }
    ).onfinish = () => particle.remove();
  }
}

// Enhanced Form Handling
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const formInputs = contactForm.querySelectorAll(".form-input");
  const formProgress = document.getElementById("formProgress");
  const formProgressText = document.getElementById("formProgressText");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("charCount");

  // Update Progress Bar
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

  // Character Counter
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

  // Update progress on input
  formInputs.forEach((input) => {
    input.addEventListener("input", updateProgress);
    input.addEventListener("blur", updateProgress);
  });

  // Form validation function
  function validateForm() {
    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const messageInput = contactForm.querySelector('#message');
    
    const errors = [];
    
    // Validate name
    const name = nameInput?.value.trim() || '';
    if (!name) {
      errors.push('Name is required');
      nameInput?.classList.add('error');
    } else if (name.length < 2) {
      errors.push('Name must be at least 2 characters');
      nameInput?.classList.add('error');
    } else if (name.length > 100) {
      errors.push('Name must be less than 100 characters');
      nameInput?.classList.add('error');
    } else {
      nameInput?.classList.remove('error');
    }
    
    // Validate email
    const email = emailInput?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errors.push('Email is required');
      emailInput?.classList.add('error');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
      emailInput?.classList.add('error');
    } else if (email.length > 255) {
      errors.push('Email must be less than 255 characters');
      emailInput?.classList.add('error');
    } else {
      emailInput?.classList.remove('error');
    }
    
    // Validate message
    const message = messageInput?.value.trim() || '';
    if (!message) {
      errors.push('Message is required');
      messageInput?.classList.add('error');
    } else if (message.length < 10) {
      errors.push('Message must be at least 10 characters');
      messageInput?.classList.add('error');
    } else if (message.length > 500) {
      errors.push('Message must be less than 500 characters');
      messageInput?.classList.add('error');
    } else {
      messageInput?.classList.remove('error');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Safety check: Ensure BACKEND_URL is defined
    if (typeof BACKEND_URL === 'undefined' || !BACKEND_URL) {
      console.error('BACKEND_URL is not defined! Cannot submit form.');
      alert('Configuration error: Backend URL is not set. Please contact the site administrator.');
      return;
    }

    const submitButton = contactForm.querySelector(".submit-button");
    if (!submitButton) {
      console.error('Submit button not found!');
      return;
    }
    
    const buttonText = submitButton.querySelector(".button-text");
    if (!buttonText) {
      console.error('Button text element not found!');
      return;
    }
    
    const originalText = buttonText.textContent;

    // Frontend validation
    const validation = validateForm();
    if (!validation.isValid) {
      // Show first error
      buttonText.textContent = validation.errors[0];
      submitButton.classList.add("error");
      setTimeout(() => {
        submitButton.classList.remove("error");
        buttonText.textContent = originalText;
      }, 3000);
      return;
    }

    // Add loading state
    submitButton.classList.add("loading");
    submitButton.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      // Sanitize data (trim whitespace)
      data.name = data.name.trim();
      data.email = data.email.trim();
      data.message = data.message.trim();

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

      // Handle response
      try {
        if (response.ok) {
          const result = await response.json();
          
          // Validate response structure
          if (!result || typeof result !== 'object') {
            throw new Error('Invalid response from server');
          }
          
          // Success state
          submitButton.classList.remove("loading");
          submitButton.classList.add("success");
          buttonText.textContent = "Message Sent!";

          // Create success particle burst
          createFormSuccessEffect(submitButton);

          // Reset form
          contactForm.reset();
          formInputs.forEach((input) => {
            input.classList.remove("has-value", "error");
          });
          updateProgress();

          setTimeout(() => {
            submitButton.classList.remove("success");
            buttonText.textContent = originalText;
            submitButton.disabled = false;
          }, 3000);
        } else {
          // Handle non-OK responses
          let errorMessage = "Form submission failed";
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // If response is not JSON, use status text
            if (response && response.status) {
              errorMessage = response.statusText || `Server error (${response.status})`;
            }
          }
          throw new Error(errorMessage);
        }
      } catch (responseError) {
        throw responseError;
      }
    } catch (error) {
      console.error("Form submission error:", error);

      // Error state
      submitButton.classList.remove("loading");
      submitButton.classList.add("error");
      
      // Show more specific error message
      let errorMessage = "Error! Try Again";
      
      if (error.name === 'AbortError' || error.message.includes("timeout")) {
        errorMessage = "Request Timeout! Try Again";
      } else if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError") || error.message.includes("ERR_")) {
        errorMessage = "Network Error! Check Connection";
      } else if (error.message.includes("Rate limit") || error.message.includes("Too many requests")) {
        errorMessage = "Too Many Requests! Please wait a minute";
      } else if (error.message.includes("All fields are required")) {
        errorMessage = "Please fill all fields";
      } else if (error.message) {
        errorMessage = error.message.length > 50 ? "Error! Try Again" : error.message;
      }
      
      buttonText.textContent = errorMessage;

      setTimeout(() => {
        submitButton.classList.remove("error");
        buttonText.textContent = originalText;
        submitButton.disabled = false;
      }, 3000);
    }
  });

  // Initial progress update
  updateProgress();
}

// Form Success Particle Effect
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
          {
            transform: "translate(0, 0) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${tx}px, ${ty}px) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: "cubic-bezier(0, .9, .57, 1)",
        }
      ).onfinish = () => particle.remove();
    }, i * 30);
  }
}

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById("backToTop");

if (backToTopButton) {
  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("show");
    } else {
      backToTopButton.classList.remove("show");
    }
  });

  // Scroll to top when clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========================================
// MOBILE NOTICE POPUP
// ========================================

const mobileNotice = document.getElementById("mobileNotice");
const closeMobileNotice = document.getElementById("closeMobileNotice");

if (closeMobileNotice && mobileNotice) {
  // Function to close popup
  const closePopup = () => {
    mobileNotice.style.opacity = "0";
    setTimeout(() => {
      mobileNotice.style.display = "none";
    }, 300);
  };

  // Close on button click
  closeMobileNotice.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent triggering the window click immediately if overlapping
    closePopup();
  });

  // Close on click outside
  window.addEventListener("click", (e) => {
    // If popup is visible and click is outside the popup
    if (
      mobileNotice.style.display !== "none" &&
      !mobileNotice.contains(e.target)
    ) {
      closePopup();
    }
  });
}

// ========================================
// NEW CYBER FEATURES (Preloader, Radar, PWA, Terminal)
// ========================================

// 1. Optimized Progressive Loading & Preloader Dismissal
const initProgressiveLoad = () => {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    // Use a "Race Condition" so slow net won't block the user
    const dismissPreloader = () => {
        if (preloader.classList.contains('dismissed')) return;
        preloader.classList.add('dismissed');

        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power2.inOut",
            onComplete: () => {
                preloader.style.display = 'none';
                // Trigger Background Video Loading after preloader is gone
                document.querySelectorAll('video').forEach(vid => {
                    vid.setAttribute('preload', 'auto');
                    vid.play().catch(e => console.log("Autoplay blocked/waiting for interaction"));
                });
            }
        });
    };

    // Fast dismissal: If DOM is ready, wait max 2s for "Intro effect" 
    // but don't wait for heavy images/videos
    setTimeout(dismissPreloader, 2500);

    // If everything happens to load fast, dismiss sooner
    window.addEventListener('load', dismissPreloader);
};

// Initialize preloader logic immediately
initProgressiveLoad();

// 2. Register Service Worker (PWA)
if ('serviceWorker' in navigator) {

    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered.'))
            .catch(err => console.log('Service Worker failed:', err));
    });
}

// 3. (Removed Skill Radar)


// 4. Terminal Mode Logic
function initTerminalMode() {
    const toggleBtn = document.getElementById('toggleTerminal');
    const terminal = document.getElementById('contactTerminal');
    const normalForm = document.getElementById('contactForm');
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    const helpBtn = document.getElementById('terminalHelp');
    
    if (!toggleBtn || !terminal) return;

    let step = 0;
    const userData = { name: '', email: '', message: '' };

    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            printToTerminal("---| TERMINAL USER GUIDE |---");
            printToTerminal("1. Type 'contact' and press ENTER to start.");
            printToTerminal("2. Follow prompts to enter Name, Email, and Message.");
            printToTerminal("3. Your data will be sent automatically at the end.");
            printToTerminal("4. Commands: 'clear' to reset, 'exit' to close.");
        });
    }

    toggleBtn.addEventListener('click', () => {
        terminal.classList.toggle('active');
        if (terminal.classList.contains('active')) {
            normalForm.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-times"></i> EXIT TERMINAL';
            printToTerminal("SYSTEM: Establishing secure uplink...");
            setTimeout(() => printToTerminal("SYSTEM: Connection stabilized. Type 'help' for commands."), 1000);
            input.focus();
        } else {
            normalForm.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-terminal"></i> USE CYBER TERMINAL';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();
            printToTerminal(`<span class="terminal-prompt">root@sarshij:~$</span> ${input.value}`);
            input.value = '';
            processCommand(cmd);
        }
    });

    function printToTerminal(text, isTypewriter = false) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        output.appendChild(line);

        if (isTypewriter) {
            let i = 0;
            const speed = 20;
            function type() {
                if (i < text.length) {
                    if (text.charAt(i) === '<') {
                        // Simple tag handling for colors
                        const tagEnd = text.indexOf('>', i);
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
        if (cmd === 'help') {
            printToTerminal("---| TERMINAL USER GUIDE |---");
            printToTerminal("1. Type 'contact' and press ENTER to start.");
            printToTerminal("2. Commands: 'clear', 'status', 'exit'", true);
            return;
        }
        if (cmd === 'clear') {
            output.innerHTML = 'SYSTEM: Memory cleared...';
            setTimeout(() => output.innerHTML = '', 1000);
            return;
        }
        if (cmd === 'status') {
            printToTerminal("SYSTEM: Pinging uplink server...", true);
            try {
                const res = await fetch(`${BACKEND_URL}/api/wake-up`);
                if (res.ok) printToTerminal("SYSTEM: <span style='color: #00ff88'>UPLINK ONLINE</span> (v3.0.4)", true);
                else printToTerminal("SYSTEM: <span style='color: #ff3e3e'>UPLINK DEGRADED</span>", true);
            } catch (e) {
                printToTerminal("SYSTEM: <span style='color: #ff3e3e'>UPLINK OFFLINE</span>", true);
            }
            return;
        }
        if (cmd === 'exit') {
            toggleBtn.click();
            return;
        }
        
        // Contact wizard logic
        if (step === 0 && cmd === 'contact') {
            step = 1;
            printToTerminal("SURVEY: Initiation sequence started. Enter your name:", true);
        } else if (step === 1) {
            userData.name = cmd;
            step = 2;
            printToTerminal(`SUCCESS: ID confirmed as '${cmd}'. Enter neural-mail:`, true);
        } else if (step === 2) {
            userData.email = cmd;
            step = 3;
            printToTerminal("SUCCESS: Uplink address verified. Enter your transmission data:", true);
        } else if (step === 3) {
            userData.message = cmd;
            printToTerminal("SYSTEM: Encrypting and transmitting data packet...", true);
            sendData();
            step = 0;
        } else {
            printToTerminal(`ERROR: Unknown command '${cmd}'. Try 'help'.`);
        }
    }

    async function sendData() {
        try {
            const response = await fetch(`${BACKEND_URL}/api/contact`, {
                method: "POST",
                body: JSON.stringify(userData),
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                printToTerminal("SYSTEM: <span style='color: #00ff88'>TRANSMISSION SUCCESSFUL.</span> Uplink terminated.", true);
            } else {
                printToTerminal("ERROR: <span style='color: #ff3e3e'>TRANSMISSION REJECTED by server.</span>", true);
            }
        } catch (err) {
            printToTerminal("ERROR: <span style='color: #ff3e3e'>CONNECTION TIMEOUT.</span> Packet lost in transit.", true);
        }
    }
}

// Initializations
document.addEventListener('DOMContentLoaded', () => {
    initTerminalMode();

    // Initialize text scramble on section headers
    const headers = document.querySelectorAll('.heading-highlight');
    headers.forEach(header => {
        const fx = new TextScramble(header);
        const originalText = header.textContent;
        
        // Trigger on scroll/reveal - runs once for better performance
        ScrollTrigger.create({
            trigger: header,
            start: "top 90%",
            onEnter: () => fx.setText(originalText),
            once: true
        });
    });
});

