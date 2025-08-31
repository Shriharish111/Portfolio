// ========= THEME TOGGLE =========
const toggleBtn = document.getElementById("theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  
  // Change icon
  if (document.body.classList.contains("dark")) {
    toggleBtn.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    toggleBtn.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.textContent = "☀️";
}
// ========= SCROLL SPY =========
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
const navbar = document.querySelector("header");
const navbarHeight = navbar.offsetHeight;

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const sectionHeight = section.offsetHeight;
    const offset = navbarHeight + 10;

    if (window.scrollY >= sectionTop - offset && window.scrollY < sectionTop + sectionHeight - offset) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ========= UNLOCK PROJECT CARDS =========
function unlockProject(card) {
  if (card.classList.contains("locked")) {
    card.classList.remove("locked");
    card.classList.add("visible"); // reveal animation

    const content = card.querySelector(".card-content");
    content.style.filter = "none";
    content.style.pointerEvents = "auto";

    const hiddenItems = card.querySelectorAll(".hidden");
    hiddenItems.forEach(item => {
      item.style.display = "block";
      item.style.opacity = 0;
      item.style.transition = "opacity 0.5s ease";
      setTimeout(() => item.style.opacity = 1, 50);
    });

    alert("🔓 You unlocked: " + card.querySelector("h3").textContent);
  }
}

// ========= SCROLL TRIGGERED PROJECT ANIMATION =========
const projectCards = document.querySelectorAll('.project-card');

function revealProjects() {
  const triggerBottom = window.innerHeight * 0.85; // when 85% of viewport
  projectCards.forEach((card, index) => {
    const cardTop = card.getBoundingClientRect().top;
    if (cardTop < triggerBottom && !card.classList.contains('visible')) {
      // staggered reveal for scroll
      setTimeout(() => card.classList.add('visible'), index * 150);
    }
  });
}

// trigger on scroll
window.addEventListener('scroll', revealProjects);
window.addEventListener('load', revealProjects); // reveal on load if in viewport


// initial check and on scroll
window.addEventListener('scroll', revealProjects);
window.addEventListener('load', revealProjects);

// ========= GALLERY LIGHTBOX =========

// Utility function to create overlay
function createOverlay(content) {
  const overlay = document.createElement("div");
  overlay.classList.add("lightbox");

  // Close button
  const closeBtn = document.createElement("span");
  closeBtn.classList.add("lightbox-close");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => overlay.remove();

  overlay.appendChild(closeBtn);
  overlay.appendChild(content);

  // Close on outside click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // Close on Esc
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      overlay.remove();
      document.removeEventListener("keydown", escHandler);
    }
  });

  document.body.appendChild(overlay);
}

// Handle images
document.querySelectorAll(".gallery-carousel img").forEach(img => {
  img.addEventListener("click", () => {
    const imgEl = document.createElement("img");
    imgEl.src = img.src;
    imgEl.alt = img.alt;
    createOverlay(imgEl);
  });
});

// Handle videos
document.querySelectorAll(".gallery-carousel video").forEach(video => {
  video.addEventListener("click", () => {
    const vidEl = document.createElement("video");
    vidEl.controls = true;
    vidEl.autoplay = true;
    vidEl.loop = true;
    vidEl.muted = true; // required for autoplay
    vidEl.playsInline = true;

    // Copy source
    const src = video.querySelector("source").src;
    const source = document.createElement("source");
    source.src = src;
    source.type = "video/mp4";
    vidEl.appendChild(source);

    createOverlay(vidEl);

    // Force play immediately after adding
    setTimeout(() => {
      vidEl.play().catch(err => console.log("Autoplay blocked:", err));
    }, 50);
  });
});



// ========= HIRE ME QUEST =========
function hireMe() {
  alert("🎯 Quest Accepted!\n\nMission: Contact Shri Harish\nReward: A passionate Game Dev + AI Engineer 🚀");
}

// ========= CONTACT TYPING ANIMATION =========
const contactSection = document.getElementById("contact");
const typeLines = document.querySelectorAll(".type");
const endLine = document.querySelector(".end-line");

function typeEffect(element, text, speed, linkData, callback, cursor) {
  let i = 0;
  element.textContent = ""; // clear before typing
  element.appendChild(cursor); // attach cursor here

  function typing() {
    if (i < text.length) {
      cursor.before(text.charAt(i));
      i++;
      setTimeout(typing, speed);
    } else {
      // If line has a link, add it
      if (linkData) {
        const link = document.createElement("a");
        link.href = linkData.href;
        link.target = "_blank";
        link.textContent = linkData.label;
        cursor.before(link);
      }
      if (callback) callback(); // move cursor to next line
    }
  }
  typing();
}

let contactTyped = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !contactTyped) {
      contactTyped = true;

      // Create ONE cursor that moves across lines
      let cursor = document.createElement("span");
      cursor.classList.add("cursor");
      cursor.textContent = "█";

      let index = 0;
      function typeNextLine() {
        if (index < typeLines.length) {
          const line = typeLines[index];
          const text = line.getAttribute("data-text");
          const linkHref = line.getAttribute("data-link");
          const linkLabel = line.getAttribute("data-label");
          const linkData = linkHref && linkLabel ? { href: linkHref, label: linkLabel } : null;

          typeEffect(line, text, 50, linkData, () => {
            index++;
            setTimeout(typeNextLine, 400);
          }, cursor);
        } else {
          // After last line (GitHub), drop cursor to new ">█" line
          endLine.textContent = "> ";
          endLine.appendChild(cursor);
        }
      }

      typeNextLine();
    }
  });
}, { threshold: 0.5 });

observer.observe(contactSection);
// ========= SMOOTH SCROLL =========
// Smooth scroll with easing
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const headerOffset = 70; // offset for fixed navbar
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});




// ========= SCROLL REVEAL =========
const revealElements = document.querySelectorAll("section, .project-card, .gallery-grid img");

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

revealElements.forEach(el => revealObserver.observe(el));


// Navbar scroll effect
const header = document.querySelector("header");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Smooth scroll with easing
document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    const headerOffset = 70; // offset for fixed navbar
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});

// Hero Typing Animation
const typingElement = document.getElementById("typing");
const heroText = "Final-year CSE (AI & ML) Student | Game Developer | Curious Learner";
let charIndex = 0;

function typeHeroText() {
  if (charIndex < heroText.length) {
    typingElement.textContent += heroText.charAt(charIndex);
    charIndex++;
    setTimeout(typeHeroText, 40); // faster typing
  } else {
    // Fade in CTA button after typing
    const ctaBtn = document.querySelector(".hero .btn");
    ctaBtn.style.opacity = 1;
  }
}

window.addEventListener("load", () => {
  typingElement.textContent = ""; // clear before typing
  charIndex = 0;
  setTimeout(typeHeroText, 300); // slight delay
});

