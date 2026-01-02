const enterBtn = document.getElementById("enterNewYearBtn");
const connectWalletBtn = document.getElementById("connectWalletBtn");
const walletAddressDiv = document.getElementById("walletAddress");
const walletAddrText = document.getElementById("walletAddrText");
const walletBtnText = document.getElementById("walletBtnText");
const sceneTree = document.getElementById("scene-tree");
const sceneHeart = document.getElementById("scene-heart");

const slides = Array.from(document.querySelectorAll(".carousel-slide"));
const carousel = document.querySelector(".carousel");
const dotsHost = document.querySelector(".carousel-dots");

const SLIDE_INTERVAL_MS = 5000;
let currentIndex = 0;
let carouselTimer;
let connectedAddress = null;

// ===== WEB3 METAMASK CONNECTION =====
function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

async function connectMetaMask() {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed! Please install MetaMask to connect.");
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });

    if (accounts.length > 0) {
      connectedAddress = accounts[0];
      return connectedAddress;
    }
  } catch (error) {
    if (error.code === 4001) {
      console.log("User rejected the connection request");
    } else {
      console.error("Error connecting to MetaMask:", error);
    }
  }
  return null;
}

function updateWalletUI(address) {
  if (!address) return;

  // Update button text to show connected
  if (walletBtnText) {
    walletBtnText.innerHTML = `
      <span>C</span><span>O</span><span>N</span><span>N</span><span>E</span><span>C</span><span>T</span><span>E</span><span>D</span>
      <span class="glow-spacer-sm"></span>
      <span>✓</span>
    `;
  }

  // Show wallet address
  if (walletAddressDiv && walletAddrText) {
    walletAddrText.textContent = shortenAddress(address);
    walletAddressDiv.style.display = "flex";

    // Animate with GSAP
    if (typeof gsap !== "undefined") {
      gsap.fromTo(walletAddressDiv,
        { opacity: 0, y: 20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }

  // Show Enter 2026 button
  if (enterBtn) {
    enterBtn.style.display = "block";
    if (typeof gsap !== "undefined") {
      gsap.fromTo(enterBtn,
        { opacity: 0, y: 20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1, 0.5)", delay: 0.3 }
      );
    }
  }

  // Disable connect button
  if (connectWalletBtn) {
    connectWalletBtn.style.pointerEvents = "none";
    connectWalletBtn.style.opacity = "0.7";
  }
}

// Listen for account changes
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", (accounts) => {
    if (accounts.length > 0) {
      connectedAddress = accounts[0];
      if (walletAddrText) {
        walletAddrText.textContent = shortenAddress(connectedAddress);
      }
    } else {
      // Disconnected
      connectedAddress = null;
      if (walletAddressDiv) walletAddressDiv.style.display = "none";
      if (enterBtn) enterBtn.style.display = "none";
      if (connectWalletBtn) {
        connectWalletBtn.style.pointerEvents = "auto";
        connectWalletBtn.style.opacity = "1";
      }
      if (walletBtnText) {
        walletBtnText.innerHTML = `
          <span>C</span><span>O</span><span>N</span><span>N</span><span>E</span><span>C</span><span>T</span>
          <span class="glow-spacer-sm"></span>
          <span>W</span><span>A</span><span>L</span><span>L</span><span>E</span><span>T</span>
        `;
      }
    }
  });
}

// Connect wallet button click handler
if (connectWalletBtn) {
  connectWalletBtn.addEventListener("click", async () => {
    const address = await connectMetaMask();
    if (address) {
      updateWalletUI(address);
    }
  });

  connectWalletBtn.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const address = await connectMetaMask();
      if (address) {
        updateWalletUI(address);
      }
    }
  });
}

// ===== VIBRANT COLOR PALETTE =====
const COLORS = [
  "#ffd760", // yellow
  "#ffaa00", // gold
  "#ff8c42", // orange
  "#ff7ac4", // pink
  "#ff2d95", // magenta
  "#6bd5ff", // blue
  "#00f5d4", // cyan
  "#7dffb2", // green
  "#c8ff00", // lime
  "#ff6b6b", // red
  "#b388ff", // purple
  "#ffffff", // white
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

// ===== METEOR TREE GENERATION (More colorful & dense) =====
function createMeteorTree(containerId = ".meteor-container") {
  const container = document.querySelector(containerId);
  if (!container) return;

  // More meteors for denser effect
  const METEOR_COUNT = 100;

  for (let i = 0; i < METEOR_COUNT; i++) {
    const meteor = document.createElement("div");
    meteor.className = "meteor";

    const side = Math.random() > 0.5 ? "swirl-left" : "swirl-right";
    meteor.classList.add(side);

    const color = randomColor();
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 5;
    const size = 2 + Math.random() * 5;
    const trail = 20 + Math.random() * 35;

    // Tree shape: wider at bottom
    const progress = i / METEOR_COUNT;
    const maxSpread = 8 + progress * 140;
    const endX = 50 + (Math.random() - 0.5) * maxSpread;
    const endY = 50 + progress * 340;
    const swirl = 15 + Math.random() * 60;

    meteor.style.setProperty("--color", color);
    meteor.style.setProperty("--duration", `${duration}s`);
    meteor.style.setProperty("--delay", `${delay}s`);
    meteor.style.setProperty("--size", `${size}px`);
    meteor.style.setProperty("--trail", `${trail}px`);
    meteor.style.setProperty("--endX", `${endX}%`);
    meteor.style.setProperty("--endY", `${endY}px`);
    meteor.style.setProperty("--swirl", `${swirl}px`);

    container.appendChild(meteor);
  }

  createTreeSilhouette(container);
}

function createTreeSilhouette(container) {
  const treeHeight = 380;
  const layers = 35; // More layers for denser tree

  for (let layer = 0; layer < layers; layer++) {
    const y = 25 + (layer / layers) * treeHeight;
    const widthAtLayer = 6 + (layer / layers) * 150;
    const particlesInLayer = 4 + Math.floor((layer / layers) * 12);

    for (let p = 0; p < particlesInLayer; p++) {
      const particle = document.createElement("div");
      particle.className = "tree-glow-particle";

      const xOffset = (p / (particlesInLayer - 1 || 1)) * widthAtLayer - widthAtLayer / 2;
      const x = 50 + (xOffset / 150) * 50;

      const color = randomColor();
      const size = 2 + Math.random() * 4;
      const twinkle = 1 + Math.random() * 2.5;
      const delay = Math.random() * 3;

      particle.style.setProperty("--x", `${x}%`);
      particle.style.setProperty("--y", `${y}px`);
      particle.style.setProperty("--color", color);
      particle.style.setProperty("--size", `${size}px`);
      particle.style.setProperty("--twinkle", `${twinkle}s`);
      particle.style.setProperty("--delay", `${delay}s`);
      particle.style.setProperty("--minOp", `${0.4 + Math.random() * 0.2}`);
      particle.style.setProperty("--maxOp", `${0.85 + Math.random() * 0.15}`);

      container.appendChild(particle);
    }
  }
}

// Initialize Scene 1 meteor tree
createMeteorTree(".meteor-container");

// ===== GSAP ENTRANCE ANIMATIONS =====
function animateEntrance() {
  if (typeof gsap === "undefined") return;

  // Animate title letters falling in
  const letters = document.querySelectorAll(".glow-letter");
  gsap.fromTo(letters,
    { opacity: 0, y: -50, scale: 0.5, rotation: -20 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      rotation: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "back.out(1.7)",
      delay: 0.3
    }
  );

  // Animate button entrance
  const btn = document.querySelector(".glow-button");
  if (btn) {
    gsap.fromTo(btn,
      { opacity: 0, y: 30, scale: 0.8 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        delay: 1.2
      }
    );
  }

  // Animate tree star
  const star = document.querySelector(".tree-star");
  if (star) {
    gsap.fromTo(star,
      { scale: 0, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        delay: 0.1
      }
    );
  }
}

// Run entrance animation
animateEntrance();

// ===== FIREWORKS / FIRECRACKERS EFFECT =====
const FIREWORK_COLORS = [
  "#ffd760", "#ffaa00", "#ff8c42", "#ff7ac4", "#ff2d95",
  "#6bd5ff", "#00f5d4", "#7dffb2", "#c8ff00", "#ff6b6b",
  "#b388ff", "#ffffff"
];

function randomFireworkColor() {
  return FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
}

// Create a single firework burst at position
function createFirework(container, x, y, size = "medium") {
  if (typeof gsap === "undefined") return;

  const sparkCount = size === "large" ? 24 : size === "medium" ? 16 : 10;
  const burstRadius = size === "large" ? 150 : size === "medium" ? 100 : 60;
  const color = randomFireworkColor();

  // Center flash
  const flash = document.createElement("div");
  flash.className = "flash-overlay";
  flash.style.setProperty("--x", `${x}%`);
  flash.style.setProperty("--y", `${y}%`);
  container.appendChild(flash);

  gsap.to(flash, {
    opacity: 0.6,
    duration: 0.08,
    yoyo: true,
    repeat: 1,
    onComplete: () => flash.remove()
  });

  // Create sparks shooting outward
  for (let i = 0; i < sparkCount; i++) {
    const spark = document.createElement("div");
    spark.className = "spark";
    const sparkColor = Math.random() > 0.3 ? color : randomFireworkColor();
    spark.style.setProperty("--color", sparkColor);
    spark.style.left = `${x}%`;
    spark.style.top = `${y}%`;

    const angle = (i / sparkCount) * 360 + (Math.random() - 0.5) * 20;
    spark.style.transform = `rotate(${angle}deg)`;

    container.appendChild(spark);

    const distance = burstRadius * (0.6 + Math.random() * 0.4);
    const radians = (angle * Math.PI) / 180;
    const endX = x + (Math.cos(radians) * distance) / 3;
    const endY = y + (Math.sin(radians) * distance) / 3;

    gsap.timeline()
      .to(spark, { opacity: 1, duration: 0.05 })
      .to(spark, {
        left: `${endX}%`,
        top: `${endY}%`,
        opacity: 0,
        height: "4px",
        duration: 0.6 + Math.random() * 0.4,
        ease: "power2.out"
      })
      .then(() => spark.remove());
  }

  // Create glitter particles
  const glitterCount = size === "large" ? 30 : size === "medium" ? 20 : 12;
  for (let i = 0; i < glitterCount; i++) {
    const glitter = document.createElement("div");
    glitter.className = "glitter";
    const glitterColor = randomFireworkColor();
    glitter.style.setProperty("--color", glitterColor);
    glitter.style.setProperty("--size", `${2 + Math.random() * 4}px`);
    glitter.style.left = `${x}%`;
    glitter.style.top = `${y}%`;

    container.appendChild(glitter);

    const angle = Math.random() * 360;
    const distance = burstRadius * (0.3 + Math.random() * 0.7);
    const radians = (angle * Math.PI) / 180;
    const endX = x + (Math.cos(radians) * distance) / 3;
    const endY = y + (Math.sin(radians) * distance) / 3 + 10; // gravity

    gsap.timeline({ delay: Math.random() * 0.1 })
      .to(glitter, { opacity: 1, duration: 0.1 })
      .to(glitter, {
        left: `${endX}%`,
        top: `${endY}%`,
        opacity: 0,
        duration: 0.8 + Math.random() * 0.6,
        ease: "power1.out"
      })
      .then(() => glitter.remove());
  }
}

// Create trailing rocket going up then exploding
function createRocket(container, startX, endX, endY, delay = 0) {
  if (typeof gsap === "undefined") return;

  const trail = document.createElement("div");
  trail.className = "trail";
  const color = randomFireworkColor();
  trail.style.setProperty("--color", color);
  trail.style.left = `${startX}%`;
  trail.style.top = "100%";

  container.appendChild(trail);

  gsap.timeline({ delay })
    .to(trail, { opacity: 1, duration: 0.1 })
    .to(trail, {
      left: `${endX}%`,
      top: `${endY}%`,
      duration: 0.5 + Math.random() * 0.3,
      ease: "power2.in"
    })
    .call(() => {
      trail.remove();
      createFirework(container, endX, endY, Math.random() > 0.5 ? "large" : "medium");
    });
}

// Trigger multiple fireworks
function triggerFireworksShow(intensity = "medium") {
  const container = document.getElementById("lightningContainer");
  if (!container) return;

  const count = intensity === "large" ? 8 : intensity === "medium" ? 5 : 3;

  for (let i = 0; i < count; i++) {
    const startX = 20 + Math.random() * 60;
    const endX = 15 + Math.random() * 70;
    const endY = 15 + Math.random() * 40;
    createRocket(container, startX, endX, endY, i * 0.15);
  }
}

// Quick burst of firecrackers (no rockets, instant bursts)
function triggerFirecrackers(count = 5) {
  const container = document.getElementById("lightningContainer");
  if (!container) return;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const x = 20 + Math.random() * 60;
      const y = 20 + Math.random() * 50;
      createFirework(container, x, y, "small");
    }, i * 80);
  }
}

// ===== REVEAL ANIMATION =====
function animateReveal() {
  if (typeof gsap === "undefined") return;

  const tl = gsap.timeline();

  // Initial fireworks burst
  tl.call(() => triggerFireworksShow("medium"));

  // Wait for fireworks
  tl.to({}, { duration: 1.2 });

  // Reveal "HAPPY" letters with firecracker per letter
  const line1 = document.querySelectorAll("#revealLine1 span");
  line1.forEach((letter, i) => {
    tl.call(() => {
      triggerFirecrackers(2);
    }, null, `+=${i * 0.08}`);
  });

  tl.to(line1, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    stagger: 0.08,
    ease: "back.out(2)"
  }, "-=0.4");

  // More fireworks
  tl.call(() => triggerFireworksShow("small"));

  // Reveal "NEW YEAR" letters
  const line2 = document.querySelectorAll("#revealLine2 span:not(.reveal-spacer)");
  tl.to(line2, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.5,
    stagger: 0.06,
    ease: "back.out(2)"
  }, "-=0.2");

  // Big fireworks burst for 2026
  tl.call(() => triggerFireworksShow("large"));

  // Reveal "2026" with big impact
  const year = document.querySelectorAll("#revealYear span");
  tl.to(year, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.8,
    stagger: 0.12,
    ease: "elastic.out(1, 0.4)"
  }, "-=0.3");

  // Final celebration burst
  tl.call(() => {
    triggerFireworksShow("large");
    setTimeout(() => triggerFirecrackers(10), 200);
    setTimeout(() => triggerFireworksShow("medium"), 400);
  });

  // Pulse effect on year
  tl.to(year, {
    filter: "drop-shadow(0 0 30px rgba(107, 213, 255, 1)) drop-shadow(0 0 60px rgba(179, 136, 255, 1))",
    duration: 0.3,
    yoyo: true,
    repeat: 1
  });

  return tl;
}

// ===== CAROUSEL =====
function buildDots() {
  if (!dotsHost) return;
  dotsHost.innerHTML = "";

  for (let i = 0; i < slides.length; i += 1) {
    const dot = document.createElement("div");
    dot.className = "carousel-dot";
    dot.classList.toggle("active", i === currentIndex);
    dotsHost.appendChild(dot);
  }
}

function pulseCarousel() {
  if (!carousel) return;
  carousel.classList.remove("carousel--pulse");
  void carousel.offsetWidth;
  carousel.classList.add("carousel--pulse");
}

function goToSlide(index) {
  if (!slides.length) return;

  currentIndex = ((index % slides.length) + slides.length) % slides.length;

  for (let i = 0; i < slides.length; i += 1) {
    slides[i].classList.toggle("active", i === currentIndex);
  }

  if (dotsHost) {
    const dots = Array.from(dotsHost.querySelectorAll(".carousel-dot"));
    for (let i = 0; i < dots.length; i += 1) {
      dots[i].classList.toggle("active", i === currentIndex);
    }
  }

  pulseCarousel();
}

function startCarousel() {
  if (!slides.length) return;
  if (carouselTimer !== undefined) return;

  buildDots();
  goToSlide(currentIndex);

  carouselTimer = window.setInterval(() => {
    goToSlide(currentIndex + 1);
  }, SLIDE_INTERVAL_MS);
}

// ===== SCENE TRANSITION =====
function switchToHeartScene() {
  if (!sceneTree || !sceneHeart) return;

  if (typeof gsap !== "undefined") {
    // Cinematic exit for Scene 1
    gsap.to(sceneTree, {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        sceneTree.classList.remove("scene--active");
        sceneTree.classList.add("scene--hidden");

        // Show Scene 2
        sceneHeart.classList.remove("scene--hidden");
        sceneHeart.classList.add("scene--active");

        gsap.fromTo(sceneHeart,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 }
        );

        // Create Scene 2 meteor tree
        createMeteorTree("#scene2-meteors");

        // Trigger reveal animation
        setTimeout(() => {
          animateReveal();
        }, 500);
      }
    });
  } else {
    sceneTree.classList.remove("scene--active");
    sceneTree.classList.add("scene--hidden");
    sceneHeart.classList.remove("scene--hidden");
    sceneHeart.classList.add("scene--active");
  }
}

// ===== EVENT LISTENERS =====
if (enterBtn) {
  enterBtn.addEventListener("click", () => {
    switchToHeartScene();
    setTimeout(startCarousel, 3500); // Start carousel after reveal
  });

  enterBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      switchToHeartScene();
      setTimeout(startCarousel, 3500);
    }
  });
}
