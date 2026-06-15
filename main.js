const typedPhrases = [
  'Aspiring AI Engineer',
  'AI & Data Science Student',
  'Machine Learning Learner',
  'Web Project Builder'
];

const typedTextElement = document.getElementById('typedText');
const navLinks = document.querySelectorAll('.nav-links a');
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const progressBar = document.getElementById('progressBar');
const loader = document.getElementById('loader');
const counters = document.querySelectorAll('.counter');
const revealSections = document.querySelectorAll('.section');
const skillButtons = document.querySelectorAll('.skill-pill');
const skillFeatureTitle = document.getElementById('skillFeatureTitle');
const skillFeatureText = document.getElementById('skillFeatureText');
const skillFeatureLevel = document.getElementById('skillFeatureLevel');
const skillMeterFill = document.getElementById('skillMeterFill');
const canvas = document.getElementById('particleCanvas');
const ctx = canvas?.getContext('2d');

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingDelay = 120;
let pauseDelay = 1500;

const particles = [];
const particleCount = 55;
const skillLevelWidths = {
  'Learning now': '42%',
  'Core foundation': '58%',
  'Project practice': '72%',
  Comfortable: '80%',
  'Strong basics': '84%',
  'Daily tool': '88%'
};

function typePhrase() {
  const currentPhrase = typedPhrases[currentPhraseIndex];
  const displayedText = currentPhrase.slice(0, currentCharIndex);
  typedTextElement.textContent = displayedText;

  if (!isDeleting && currentCharIndex < currentPhrase.length) {
    currentCharIndex++;
    setTimeout(typePhrase, typingDelay);
  } else if (isDeleting && currentCharIndex > 0) {
    currentCharIndex--;
    setTimeout(typePhrase, typingDelay / 1.8);
  } else {
    if (!isDeleting) {
      isDeleting = true;
      setTimeout(typePhrase, pauseDelay);
    } else {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % typedPhrases.length;
      setTimeout(typePhrase, typingDelay);
    }
  }
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

function handleScroll() {
  updateProgress();
  if (window.scrollY > 560) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
}

function animateCounters() {
  counters.forEach((counter) => {
    const target = +counter.dataset.target;
    const current = +counter.textContent;
    const increment = Math.ceil(target / 80);
    if (current < target) {
      counter.textContent = Math.min(current + increment, target);
      requestAnimationFrame(animateCounters);
    }
  });
}

function initRevealObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          if (entry.target.id === 'about' || entry.target.id === 'skills') {
            animateCounters();
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealSections.forEach((section) => {
    section.classList.add('hidden');
    observer.observe(section);
  });
}

function setActiveNav() {
  const fromTop = window.scrollY + 120;
  navLinks.forEach((link) => {
    const section = document.querySelector(link.hash);
    if (!section) return;
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    link.classList.toggle('active', fromTop >= sectionTop && fromTop < sectionBottom);
  });
}

function chooseNavItem(event) {
  const href = event.target.getAttribute('href');
  if (href && href.startsWith('#')) {
    event.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    navLinksContainer.classList.remove('open');
  }
}

function toggleMobileNav() {
  navLinksContainer.classList.toggle('open');
}

function updateSkillFeature(button) {
  if (!button || !skillFeatureTitle || !skillFeatureText || !skillFeatureLevel || !skillMeterFill) return;

  skillButtons.forEach((skillButton) => {
    skillButton.classList.toggle('active', skillButton === button);
  });

  const level = button.dataset.level || 'Project practice';
  skillFeatureTitle.textContent = button.dataset.title || button.textContent.trim();
  skillFeatureText.textContent = button.dataset.detail || '';
  skillFeatureLevel.textContent = level;
  skillMeterFill.style.width = skillLevelWidths[level] || '68%';
}

function resizeCanvas() {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * canvas.clientWidth,
      y: Math.random() * canvas.clientHeight,
      radius: 1 + Math.random() * 2,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: 0.2 + Math.random() * 0.35
    });
  }
}

function drawParticles() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  particles.forEach((particle) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < -10) particle.x = canvas.clientWidth + 10;
    if (particle.x > canvas.clientWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = canvas.clientHeight + 10;
    if (particle.y > canvas.clientHeight + 10) particle.y = -10;

    const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 7);
    gradient.addColorStop(0, `rgba(45, 212, 191, ${particle.opacity})`);
    gradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}

function initParticles() {
  if (!canvas || !ctx) return;
  resizeCanvas();
  createParticles();
  drawParticles();
}

function init() {
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }

  initParticles();
  initRevealObserver();
  typePhrase();
  updateProgress();
  setActiveNav();
}

window.addEventListener('load', init);
window.addEventListener('scroll', () => {
  handleScroll();
  setActiveNav();
});
window.addEventListener('resize', resizeCanvas);

navLinks.forEach((link) => link.addEventListener('click', chooseNavItem));
skillButtons.forEach((button) => {
  button.addEventListener('click', () => updateSkillFeature(button));
  button.addEventListener('mouseenter', () => updateSkillFeature(button));
});
navToggle?.addEventListener('click', toggleMobileNav);
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
