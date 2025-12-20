// GSAP Animations and Interactions
gsap.registerPlugin(ScrollTrigger);

// ========================================
// ENHANCED NAVBAR
// ========================================

const navbar = document.getElementById("navbar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileLinks = document.querySelectorAll(".mobile-link");
const navLinks = document.querySelectorAll(".nav-link");

// Mobile Menu Toggle - Simple Dropdown
function toggleMobileMenu() {
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.classList.toggle("active");
    mobileMenu.classList.toggle("active");
  }
}

function closeMobileMenu() {
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", toggleMobileMenu);
}

// Close mobile menu when clicking on links
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Active Section Tracking
const sections = document.querySelectorAll("section[id]");

function updateActiveLink() {
  const scrollY = window.pageYOffset;

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
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink(); // Initial call

// Theme Management
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
let isDark = true;

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  body.className = isDark ? "dark" : "light";
  themeToggle.classList.toggle("active");

    // Theme logic handled by CSS variables for videos/backgrounds
});

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

gsap.from(".hero-photo-wrapper", {
  duration: animDuration,
  scale: isMobile ? 0.8 : 0,
  rotation: 0, /* No rotation */
  opacity: 0,
  ease: "back.out(1.7)",
});

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

// Navbar scroll effect - optimized with throttling
let scrollTimeout;
window.addEventListener("scroll", () => {
  if (scrollTimeout) return;

  scrollTimeout = setTimeout(() => {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 100) {
      navbar.style.backdropFilter = "blur(20px)";
    } else {
      navbar.style.backdropFilter = "blur(10px)";
    }
    scrollTimeout = null;
  }, 16); // ~60fps
});

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
  const statusEl = document.getElementById('serverStatus');
  const submitBtn = document.querySelector('.submit-button');
  const btnText = submitBtn ? submitBtn.querySelector('.button-text') : null;
  const originalBtnText = btnText ? "Send Message" : "Send";

  // Lock the button initially (Cyber Security Protocol)
  if(submitBtn && btnText) {
       submitBtn.disabled = true;
       submitBtn.classList.add('initializing');
       btnText.textContent = "📡 INITIALIZING UPLINK...";
  }

// 🔧 CONFIGURATION: CHANGE THIS URL WHEN DEPLOYING
const BACKEND_URL = 'https://backend-contact-form-hvqf.onrender.com'; 
// Example: const BACKEND_URL = 'https://my-backend.onrender.com';

  fetch(`${BACKEND_URL}/api/wake-up`)
    .then(res => {
        if(res.ok) {
            console.log('Server Status: Online');
            if(statusEl) {
                statusEl.classList.add('online');
                statusEl.querySelector('.status-text').textContent = "System Online";
            }
            // Unlock Button
            if(submitBtn && btnText) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('initializing');
                submitBtn.classList.add('system-ready');
                btnText.textContent = "TRANSMIT MESSAGE"; // Cooler text
                
                // Remove flash effect after animation
                setTimeout(() => submitBtn.classList.remove('system-ready'), 1000);
            }
        }
    })
    .catch(err => {
        console.log('Server waking up...');
        if(statusEl) {
             statusEl.classList.add('offline');
             statusEl.querySelector('.status-text').textContent = "Server Offline (Waking up...)";
        }
        // Unlock anyway (fallback) so they can try click
        if(submitBtn && btnText) {
             submitBtn.disabled = false;
             submitBtn.classList.remove('initializing');
             btnText.textContent = originalBtnText;
        }
    });

  // Create initial particles - reduced count for better performance
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
  // Add any scroll-based effects here
  ticking = false;
}

function requestTick() {
  if (!ticking) {
    requestAnimationFrame(updateScrollEffects);
    ticking = true;
  }
}

window.addEventListener("scroll", requestTick);

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

  // Form submission
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitButton = contactForm.querySelector(".submit-button");
    const buttonText = submitButton.querySelector(".button-text");
    const originalText = buttonText.textContent;

    // Add loading state
    submitButton.classList.add("loading");
    submitButton.disabled = true;

    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Success state
        submitButton.classList.remove("loading");
        submitButton.classList.add("success");
        buttonText.textContent = "Message Sent!";

        // Create success particle burst
        createFormSuccessEffect(submitButton);

        // Reset form
        contactForm.reset();
        formInputs.forEach((input) => input.classList.remove("has-value"));
        updateProgress();

        setTimeout(() => {
          submitButton.classList.remove("success");
          buttonText.textContent = originalText;
          submitButton.disabled = false;
        }, 3000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Error:", error);

      // Error state
      submitButton.classList.remove("loading");
      submitButton.classList.add("error");
      buttonText.textContent = "Error! Try Again";

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


