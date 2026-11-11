// Load configuration
let config = {};
if (typeof window !== 'undefined' && window.portfolioConfig) {
    config = window.portfolioConfig;
} else {
    // Fallback configuration
    config = {
        personal: { greeting: "Hello." },
        theme: { animations: { typingSpeed: 100, enabled: true } }
    };
}

// =====================================================
// MOTION CONTROLLER
// =====================================================
// One switch drives every animation on the page: CSS keyframes, scroll
// reveals, the typewriter, the counters and the particle swarm.

const MOTION_STORAGE_KEY = 'motionEnabled';

function motionEnabled() {
    return document.documentElement.getAttribute('data-motion') !== 'off';
}

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function syncMotionToggle() {
    const toggle = document.getElementById('motion-toggle');
    if (!toggle) return;

    const on = motionEnabled();
    toggle.setAttribute('aria-pressed', on ? 'true' : 'false');

    const label = on ? 'Turn animations off' : 'Turn animations on';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
}

function setMotion(enabled, options) {
    const persist = !options || options.persist !== false;

    document.documentElement.setAttribute('data-motion', enabled ? 'on' : 'off');

    if (persist) {
        try {
            localStorage.setItem(MOTION_STORAGE_KEY, String(enabled));
        } catch (error) {
            /* storage can be blocked — the toggle still works for this visit */
        }
    }

    syncMotionToggle();

    if (enabled) {
        initTypingAnimation();
        initBioReveal();
        initCounterAnimation();
        initBuildSequence();
        initRevealObserver();
        initRevealFallback();
        initCardInteractions();
        initParticleSwarm();
    } else {
        stopParticleSwarm();
        settleAnimations();
    }
}

function initMotionToggle() {
    const toggle = document.getElementById('motion-toggle');
    if (!toggle) return;

    if (toggle.dataset.bound !== 'true') {
        toggle.dataset.bound = 'true';
        toggle.addEventListener('click', () => setMotion(!motionEnabled()));
    }

    syncMotionToggle();
}

// Finish anything mid-flight so turning motion off never strands content.
function settleAnimations() {
    // With motion off the reveal gate must never hide anything: drop the gate
    // class and pin the final state inline as a belt-and-braces guarantee.
    document.documentElement.classList.remove('reveal-init');

    document.querySelectorAll('[data-reveal]').forEach((element) => {
        // A running animation beats inline styles, so stop those first.
        if (element.getAnimations) {
            element.getAnimations().forEach((animation) => animation.cancel());
        }
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
    });

    document.querySelectorAll('.build-section').forEach((section) => {
        section.classList.add('is-built');
    });

    document.querySelectorAll('.bio-word').forEach((word) => {
        word.style.opacity = '1';
        word.style.transform = 'none';
        word.style.filter = 'none';
    });

    document.querySelectorAll('.stat-number').forEach((counter) => {
        const target = counter.getAttribute('data-target');
        if (target !== null) {
            counter.textContent = target + (counter.getAttribute('data-suffix') || '');
        }
    });

    const greeting = document.querySelector('.hero-greeting');
    if (greeting && config.personal?.greeting) {
        greeting.textContent = config.personal.greeting;
    }
}

// Populate HTML content from configuration
function populateFromConfig() {
    // Update page title
    const titleElement = document.getElementById('page-title');
    if (titleElement && config.personal?.pageTitle) {
        titleElement.textContent = config.personal.pageTitle;
    } else if (titleElement && config.personal?.name && config.personal?.title) {
        // Fallback to constructing from name and title if pageTitle is not set
        titleElement.textContent = `${config.personal.name} - ${config.personal.title}`;
    }

    // Update favicon based on pageLogo (will be called after config is loaded)
    setTimeout(updateFavicon, 100);

    // Update page logo in navigation
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        if (config.personal?.pageLogo) {
            // Check if it's an emoji or image path
            if (config.personal.pageLogo.startsWith('/') || config.personal.pageLogo.startsWith('http')) {
                // It's an image path - create an img element
                navLogo.innerHTML = `<img src="${config.personal.pageLogo}" alt="Logo" class="nav-logo-image" loading="eager">`;
            } else {
                // It's an emoji or text - use it directly
                navLogo.textContent = config.personal.pageLogo;
            }
        } else if (config.navigation?.logo) {
            // Fallback to navigation logo if pageLogo is not set
            navLogo.textContent = config.navigation.logo;
        }
    }

    // Populate navigation menu
    const navMenu = document.getElementById('nav-menu');
    if (navMenu && config.navigation?.menuItems) {
        navMenu.innerHTML = '';
        config.navigation.menuItems.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.link;
            a.className = 'nav-link';
            a.setAttribute('aria-label', item.name);

            // Each letter lifts on its own so a hovered tab behaves like a card
            // being picked out of the deck.
            a.innerHTML = Array.from(item.name).map((char, index) => {
                const glyph = char === ' ' ? '&nbsp;' : escapeHtml(char);
                return `<span class="nav-char" style="--i:${index}" aria-hidden="true">${glyph}</span>`;
            }).join('');

            li.appendChild(a);
            navMenu.appendChild(li);
        });
    }

    // Initialize mobile menu toggle
    initMobileMenu();

    // Initialize logo scroll to top functionality
    initLogoScrollToTop();

// Mobile menu toggle functionality
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Logo scroll to top functionality
function initLogoScrollToTop() {
    const navLogo = document.getElementById('nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', function() {
            // Smooth scroll to top of page
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Remove active state from any active nav links
            const activeNavLinks = document.querySelectorAll('.nav-link.active');
            activeNavLinks.forEach(link => link.classList.remove('active'));
        });

        // Add visual feedback for clickable logo
        navLogo.style.cursor = 'pointer';
        navLogo.title = 'Click to scroll to top';
    }
}

    // Populate theme toggle buttons
    populateThemeToggle();

// One circular button that cycles through every configured theme.
function themeGlyph(themeKey) {
    const glyphs = {
        dark: '🌙',
        light: '☀️',
        cyberpunk: '🤖',
        techno: '⚡'
    };
    return glyphs[themeKey] || '🎨';
}

function themeKeys() {
    return Object.keys(config.theme?.modes || {});
}

function populateThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.innerHTML = '';
    themeToggle.classList.add('theme-cycle-wrap');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'theme-btn theme-cycle';
    button.id = 'theme-cycle';
    button.addEventListener('click', cycleTheme);
    themeToggle.appendChild(button);

    updateThemeCycleButton(config.theme?.mode || themeKeys()[0] || 'dark');
}

function updateThemeCycleButton(themeKey) {
    const button = document.getElementById('theme-cycle');
    if (!button) return;

    const keys = themeKeys();
    if (!keys.length) return;

    const index = Math.max(0, keys.indexOf(themeKey));
    const current = keys[index];
    const next = keys[(index + 1) % keys.length];
    const modes = config.theme?.modes || {};

    button.dataset.theme = current;
    button.textContent = themeGlyph(current);
    button.title = `Theme: ${modes[current]?.name || current} — switch to ${modes[next]?.name || next}`;
    button.setAttribute('aria-label', button.title);
}

function cycleTheme() {
    const keys = themeKeys();
    if (!keys.length) return;

    const current = config.theme?.mode || keys[0];
    const next = keys[(keys.indexOf(current) + 1) % keys.length];

    config.theme.mode = next;
    switchToTheme(next);
    updateThemeCycleButton(next);
}

// Switch to specific theme
function switchToTheme(themeKey) {
    // Remove existing theme CSS links
    const existingThemeLinks = document.querySelectorAll('link[data-theme]');
    existingThemeLinks.forEach(link => link.remove());

    // Remove all theme active classes
    document.body.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');

    // Add new theme CSS link
    if (themeKey !== 'default') {
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = `themes/${themeKey}-theme.css`;
        themeLink.setAttribute('data-theme', themeKey);
        document.head.appendChild(themeLink);

        // Apply theme-specific effects
        applyThemeEffects(themeKey);
    }

    // Apply theme colors if configuration is available
    if (typeof window !== 'undefined' && window.portfolioConfig?.theme?.modes?.[themeKey]?.colors) {
        const colors = window.portfolioConfig.theme.modes[themeKey].colors;
        if (colors) {
            applyThemeColors(colors);
        }
    }

    // The swarm re-reads the accent colour on the next frame
    swarmState.palette = null;

    // Reflect the new theme on the cycle button
    updateThemeCycleButton(themeKey);
}

    // Update hero section content
    const greetingElement = document.querySelector('.hero-greeting');
    if (greetingElement && config.personal?.greeting) {
        greetingElement.textContent = config.personal.greeting;
    }

    // Update hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && config.personal?.name && config.personal?.title) {
        const prefix = config.personal?.heroTitlePrefix || "I'm";
        heroTitle.innerHTML = `${prefix} <span class="highlight">${config.personal.name}</span><br>${config.personal.title}`;
    }

    // Update profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && config.personal?.profileImage) {
        // Use loading="eager" for profile image as it's above the fold
        profileImg.setAttribute('loading', 'eager');
        profileImg.src = config.personal.profileImage;
        profileImg.alt = config.personal.name || 'Profile';
    }

    // Update buttons
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if (primaryBtn && config.heroButtons?.primary?.enabled) {
        primaryBtn.textContent = config.heroButtons.primary.text;
        if (config.heroButtons.primary.link !== '#') {
            primaryBtn.onclick = () => window.open(config.heroButtons.primary.link, '_blank', 'noopener,noreferrer');
        }
    }

    if (secondaryBtn && config.heroButtons?.secondary?.enabled) {
        secondaryBtn.textContent = config.heroButtons.secondary.text;
        if (config.heroButtons.secondary.link !== '#') {
            secondaryBtn.onclick = () => window.open(config.heroButtons.secondary.link, '_blank', 'noopener,noreferrer');
        }
    }

    // Update skills section
    const skillsScroll = document.querySelector('.skills-scroll');
    if (skillsScroll && config.skills?.list) {
        skillsScroll.innerHTML = '';
        config.skills.list.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-item';
            skillDiv.textContent = skill;
            skillsScroll.appendChild(skillDiv);
        });
    }

    // Populate every section from configuration
    populateTechnicalSkills();
    populateExperience();
    populateAbout();
    initializeTikTokVideos();
    populateProjectsWithTikTok();
    populateVideoLinks();
    populateReferences();
    populateContact();

    // Apply theme colours from configuration
    if (config.theme?.colors) {
        applyThemeColors(config.theme.colors);
    }
}

// =====================================================
// TECHNICAL SKILLS — TRADING-CARD (POKÉMON STYLE) GRID
// =====================================================

const SKILL_TYPES = {
    electric: { label: 'Electric', icon: '⚡' },
    psychic: { label: 'Psychic', icon: '🔮' },
    water: { label: 'Water', icon: '💧' },
    steel: { label: 'Steel', icon: '⚙️' },
    fire: { label: 'Fire', icon: '🔥' },
    grass: { label: 'Grass', icon: '🌱' },
    ghost: { label: 'Ghost', icon: '👻' },
    dragon: { label: 'Dragon', icon: '🐉' }
};

const CARD_TYPE_ORDER = ['electric', 'psychic', 'water', 'steel', 'fire', 'grass', 'ghost', 'dragon'];

function hashSkill(value) {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash);
}

// Stable pseudo-stats so every skill reads like a card move.
function skillDamage(name, index) {
    return 40 + ((hashSkill(name) + index * 7) % 9) * 10;
}

function populateTechnicalSkills() {
    if (!config.technicalSkills?.enabled) return;

    const titleElement = document.querySelector('.technical-skills-title');
    const subtitleElement = document.querySelector('.technical-skills-subtitle');

    if (titleElement && config.technicalSkills?.title) {
        titleElement.textContent = config.technicalSkills.title;
    }

    if (subtitleElement && config.technicalSkills?.subtitle) {
        subtitleElement.textContent = config.technicalSkills.subtitle;
    }

    const skillsGrid = document.querySelector('.technical-skills-grid');
    if (!skillsGrid || !config.technicalSkills?.categories) return;

    skillsGrid.innerHTML = '';

    config.technicalSkills.categories.forEach((category, index) => {
        const typeKey = SKILL_TYPES[category.type] ? category.type : CARD_TYPE_ORDER[index % CARD_TYPE_ORDER.length];
        const type = SKILL_TYPES[typeKey];
        const skills = (category.skills || []).map((skill) => (typeof skill === 'string' ? skill : skill.name));

        const card = document.createElement('article');
        card.className = 'tcg-card';
        card.dataset.type = typeKey;
        card.dataset.reveal = '';
        card.style.setProperty('--reveal-delay', `${index * 80}ms`);

        card.innerHTML = `
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Skill</span>
                    <h3 class="tcg-name">${escapeHtml(category.title)}</h3>
                </header>
                ${category.image
                    ? cardArt(category.image, category.imageAlt || `${category.title} illustration`, {
                        icon: category.icon || type.icon,
                        badge: `${type.icon} ${escapeHtml(type.label)}`,
                        rarity: escapeHtml(category.rarity || 'Holo'),
                        extraClass: 'tcg-art--wide'
                    })
                    : `<div class="tcg-art">
                    <span class="tcg-art__type">${type.icon} ${type.label}</span>
                    <span class="tcg-art__icon" aria-hidden="true">${category.icon || type.icon}</span>
                    <span class="tcg-art__rarity">${escapeHtml(category.rarity || 'Holo')}</span>
                </div>`}
                <div class="tcg-moves">
                    ${skills.map((skill) => `
                        <div class="tcg-move">
                            <span class="tcg-move__name">${escapeHtml(skill)}</span>
                        </div>`).join('')}
                </div>
                <footer class="tcg-foot">
                    <span><b>Set</b> ${escapeHtml(category.set || 'Tech Skills')}</span>
                </footer>
            </div>
        `;

        skillsGrid.appendChild(card);
    });

    initCardInteractions();
}
// Pointer-tracked tilt and foil shine for every trading card.
// ---------- Magnetic tilt, glow and radiation ------------------------------
const RADIATION_HUES = {
    fire: 12,
    water: 200,
    electric: 48,
    psychic: 288,
    grass: 120,
    steel: 210,
    dragon: 265,
    dark: 275
};

const radiation = { canvas: null, ctx: null, particles: [], frame: null, last: 0 };

function radiationHue(card) {
    const base = RADIATION_HUES[card.dataset.type] || 20;
    return base + (Math.random() * 26 - 13);
}

function sizeRadiationCanvas() {
    const canvas = radiation.canvas;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    radiation.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function ensureRadiationCanvas() {
    if (radiation.canvas) return radiation.canvas;

    const canvas = document.createElement('canvas');
    canvas.id = 'radiation-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);

    radiation.canvas = canvas;
    radiation.ctx = canvas.getContext('2d');
    sizeRadiationCanvas();

    if (document.body.dataset.radiationBound !== 'true') {
        document.body.dataset.radiationBound = 'true';
        window.addEventListener('resize', sizeRadiationCanvas, { passive: true });
    }

    return canvas;
}

function emitRadiation(x, y, hue, count) {
    if (!motionEnabled()) return;

    ensureRadiationCanvas();
    if (radiation.particles.length > 240) return;

    const total = count || 3;
    for (let i = 0; i < total; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.7 + Math.random() * 2.2;
        radiation.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 0.3,
            life: 1,
            decay: 0.014 + Math.random() * 0.016,
            size: 1 + Math.random() * 2.2,
            hue: hue === undefined ? 20 : hue
        });
    }

    if (!radiation.frame) {
        radiation.last = performance.now();
        radiation.frame = window.requestAnimationFrame(stepRadiation);
    }
}

function stepRadiation(now) {
    const ctx = radiation.ctx;
    const canvas = radiation.canvas;
    if (!ctx || !canvas) {
        radiation.frame = null;
        return;
    }

    const dt = Math.min(2.5, Math.max(0.5, (now - radiation.last) / 16.67));
    radiation.last = now;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalCompositeOperation = 'lighter';

    radiation.particles = radiation.particles.filter((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 0.014 * dt;
        particle.vx *= 0.984;
        particle.vy *= 0.984;
        particle.life -= particle.decay * dt;

        if (particle.life <= 0) return false;

        const alpha = Math.max(0, particle.life);
        ctx.beginPath();
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${alpha * 0.9})`;
        ctx.arc(particle.x, particle.y, particle.size * (0.5 + alpha), 0, Math.PI * 2);
        ctx.fill();
        return true;
    });

    ctx.globalCompositeOperation = 'source-over';

    if (radiation.particles.length) {
        radiation.frame = window.requestAnimationFrame(stepRadiation);
    } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        radiation.frame = null;
    }
}

// Magnetic tilt + radiation sparks for every card.
function initCardInteractions() {
    let lastEmit = 0;

    document.querySelectorAll('.tcg-card').forEach((card) => {
        if (card.dataset.tiltBound === 'true') return;
        card.dataset.tiltBound = 'true';

        card.addEventListener('pointerenter', (event) => {
            if (!motionEnabled() || event.pointerType === 'touch') return;
            emitRadiation(event.clientX, event.clientY, radiationHue(card), 9);
        });

        card.addEventListener('pointermove', (event) => {
            if (!motionEnabled() || event.pointerType === 'touch') return;

            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width;
            const py = (event.clientY - rect.top) / rect.height;

            card.style.setProperty('--ry', `${((px - 0.5) * 13).toFixed(2)}deg`);
            card.style.setProperty('--rx', `${((0.5 - py) * 13).toFixed(2)}deg`);
            card.style.setProperty('--tx', `${((px - 0.5) * 14).toFixed(2)}px`);
            card.style.setProperty('--ty', `${((py - 0.5) * 14).toFixed(2)}px`);
            card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
            card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);

            const now = performance.now();
            if (now - lastEmit > 55) {
                lastEmit = now;
                emitRadiation(event.clientX, event.clientY, radiationHue(card), 2);
            }
        });

        const reset = () => {
            card.style.setProperty('--ry', '0deg');
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--tx', '0px');
            card.style.setProperty('--ty', '0px');
        };

        card.addEventListener('pointerleave', reset);
        card.addEventListener('blur', reset);
    });
}

// =====================================================
// SHARED CARD PIECES
// =====================================================

// Card artwork window. Falls back to a type emoji if the photo is missing
// or fails to load, so a card never shows a broken image.
function cardArt(image, alt, options) {
    const opts = options || {};
    const icon = opts.icon || '★';
    const img = image
        ? `<img src="${image}" alt="${escapeHtml(alt || '')}" loading="lazy" decoding="async" onerror="this.remove()">`
        : '';

    return `
        <div class="tcg-art tcg-art--photo ${opts.extraClass || ''}" style="--art-icon:'${icon}'">
            ${img}
            <span class="tcg-art__type">${opts.badge || ''}</span>
            <span class="tcg-art__rarity">${opts.rarity || ''}</span>
        </div>`;
}

// =====================================================
// EXPERIENCE
// =====================================================

function populateExperience() {
    if (!config.experience?.enabled) return;

    const experienceTitle = document.querySelector('.experience-title');
    if (experienceTitle && config.experience?.title) {
        experienceTitle.textContent = config.experience.title;
    }

    const experienceTimeline = document.querySelector('.experience-timeline');
    if (!experienceTimeline || !config.experience?.positions) return;

    experienceTimeline.innerHTML = '';

    config.experience.positions.forEach((position, index) => {
        const card = document.createElement('article');
        card.className = 'experience-card tcg-card tcg-card--tab';
        card.dataset.type = position.type || 'fire';
        card.dataset.reveal = '';
        card.style.setProperty('--reveal-delay', `${index * 90}ms`);

        card.innerHTML = `
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Experience</span>
                    <h3 class="tcg-name">${escapeHtml(position.title)}</h3>
                </header>
                ${cardArt(position.image, position.imageAlt || position.title, {
                    icon: position.icon || '💼',
                    badge: `${position.icon || '💼'} ${escapeHtml(position.company)}`,
                    rarity: escapeHtml(position.period),
                    extraClass: 'tcg-art--wide'
                })}
                <p class="tcg-text">${escapeHtml(position.description)}</p>
                <footer class="tcg-foot">
                    <span><b>Role</b> ${escapeHtml(position.company)}</span>
                </footer>
            </div>
        `;

        experienceTimeline.appendChild(card);
    });

    initCardInteractions();
}
// =====================================================
// ABOUT — one profile card
// =====================================================

function populateAbout() {
    const mount = document.querySelector('.about-content');
    if (!mount) return;

    const aboutTitle = config.about?.title || 'About me';
    const bio = (config.about?.description || '').trim();
    const services = config.about?.services || [];
    const name = config.personal?.name || '';
    const profileImage = config.personal?.profileImage || '/images/profile_optimized.jpg';
    const location = config.personal?.location || config.contacts?.location || '';

    mount.innerHTML = `
        <div class="about-head">
            <div class="about-eyebrow">Profile</div>
            <h2 class="about-title" id="about-title">${escapeHtml(aboutTitle)}</h2>
        </div>
        <article class="about-card tcg-card tcg-card--tab" data-type="electric" data-reveal>
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Profile</span>
                    <h3 class="tcg-name">${escapeHtml(name)}</h3>
                </header>
                <div class="about-card__grid">
                    ${cardArt(profileImage, `Portrait of ${name}`, {
                        icon: '🤖',
                        badge: '⚡ Robotics & AI',
                        rarity: 'Engineer',
                        extraClass: 'about-card__art'
                    })}
                    <p class="about-description" data-full-text="${escapeHtml(bio)}">${escapeHtml(bio)}</p>
                </div>
                <div class="tcg-moves about-abilities">
                    ${services.map((service) => `
                        <div class="tcg-move">
                            <span class="tcg-move__name">
                                <b>${service.icon || '★'} ${escapeHtml(service.title)}</b>
                                <small>${escapeHtml(service.description || '')}</small>
                            </span>
                        </div>
                    `).join('')}
                </div>
                <footer class="tcg-foot">
                    <span><b>Based in</b> ${escapeHtml(location)}</span>
                    <span><b>Open to</b> remote &amp; on-site</span>
                </footer>
            </div>
        </article>
    `;

    initCardInteractions();
}
// =====================================================
// BUILD SEQUENCE — the page assembles itself as you scroll
// =====================================================

function initBuildSequence() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    sections.forEach((section) => {
        section.classList.add('build-section');

        // Section headings join the same staggered build.
        section.querySelectorAll('h1, h2, .profile-container').forEach((heading, index) => {
            if (heading.closest('.tcg-card')) return;
            if (heading.hasAttribute('data-reveal')) return;
            heading.setAttribute('data-reveal', '');
            heading.style.setProperty('--reveal-delay', `${index * 40}ms`);
        });
    });

    if (!motionEnabled()) {
        sections.forEach((section) => section.classList.add('is-built'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        sections.forEach((section) => section.classList.add('is-built'));
        return;
    }

    const build = (section) => {
        if (section.classList.contains('is-built')) return;

        // Reveal first: the rebuild is decorative and must never be able to
        // stop a section from becoming visible.
        section.classList.add('is-built', 'is-building');
        window.setTimeout(() => section.classList.remove('is-building'), 1500);

    };

    // Whatever is already on screen builds immediately, so the first view never
    // depends on an observer tick.
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) build(section);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            build(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    sections.forEach((section) => {
        if (section.classList.contains('is-built')) return;
        observer.observe(section);
    });
}

// Gallery cards share one height so the grid reads as a single set.
function equalizeCardSet(selector) {
    const cards = Array.from(document.querySelectorAll(selector));
    if (cards.length < 2) return;

    const apply = () => {
        cards.forEach((card) => { card.style.height = ''; });
        // offsetHeight ignores the reveal/tilt transforms, so equalising is exact.
        const tallest = Math.max(...cards.map((card) => card.offsetHeight));
        if (tallest > 0) {
            cards.forEach((card) => { card.style.height = `${tallest}px`; });
        }
    };

    apply();
    window.setTimeout(apply, 350);
    window.addEventListener('resize', () => window.requestAnimationFrame(apply), { passive: true });
}

// Gallery and experience cards share one height per set.
function equalizeGalleryCards() {
    equalizeCardSet('.projects-grid .project-card.tcg-card');
    equalizeCardSet('.experience-timeline .experience-card');
}

// Populate projects from configuration (now includes TikTok phone UI as first gallery item)
function populateProjectsWithTikTok() {
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // Get TikTok videos for the phone UI
    const tiktokVideos = config.videoLinks?.videos?.filter(video => video.platform === 'tiktok') || [];

    // Create TikTok phone tile HTML if there are TikTok videos
    let tiktokHTML = '';
    if (tiktokVideos.length > 0) {
        tiktokHTML = `
            <div class="project-card gallery-tiktok-phone" style="background: transparent;">
                <div class="iphone-container">
                    <div class="iphone-notch"></div>
                    <div class="iphone-screen">
                        <div class="scrollable-videos">
                            ${tiktokVideos.map((video, index) => `
                                <div class="video-container">
                                    <iframe class="tiktok-video" src="https://www.tiktok.com/embed/${video.videoId}" allowfullscreen="" allow="autoplay"></iframe>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="iphone-buttons"></div>
                </div>
            </div>
        `;
    }

    // Generate regular projects HTML
    const regularProjectsHTML = config.projects?.list?.map((project, index) => {
        return `
        <article class="project-card tcg-card tcg-card--tab ${project.featured ? 'featured' : ''}" data-type="${project.featured ? 'dragon' : 'psychic'}" data-reveal style="--reveal-delay:${index * 70}ms">
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Project</span>
                    <h3 class="tcg-name">${escapeHtml(project.name)}</h3>
                </header>
                ${cardArt(project.image, project.name, {
                    icon: '🛠️',
                    badge: project.featured ? '★ Featured' : '◆ Build',
                    rarity: project.featured ? '★ Holo Rare' : '◆ Common'
                })}
                <p class="tcg-text">${escapeHtml(project.description)}</p>
                <div class="tcg-energy">
                    ${project.technologies.map(tech => `<span class="tech-tag">${escapeHtml(tech)}</span>`).join('')}
                </div>
                <footer class="tcg-foot">
                    <span><b>Type</b> ${project.featured ? 'Flagship' : 'Project'}</span>
                    <a class="tcg-foot__link" href="${project.link}" target="_blank" rel="noopener noreferrer">Open ↗</a>
                </footer>
            </div>
        </article>`;
    }).join('') || '';

    // Combine TikTok phone tile with regular projects
    projectsGrid.innerHTML = tiktokHTML + regularProjectsHTML;

    // Initialize TikTok phone scrolling if TikTok videos are present
    if (tiktokVideos.length > 0) {
        initTikTokPhoneScroll();
    }
}

// Populate contact information from configuration
function populateContact() {
    if (!config.contacts?.enabled) return;

    const container = document.querySelector('.contact-container');
    if (!container) return;

    const social = config.contacts.social || {};
    const socialIcons = {
        github: '🐙',
        linkedin: '💼',
        facebook: '📘',
        twitter: '🐦',
        instagram: '📷'
    };

    const socialLinks = Object.entries(social)
        .filter(([, url]) => url && url !== '#')
        .map(([platform, url]) => `
            <a class="contact-social__link" href="${url}" target="_blank" rel="noopener noreferrer">
                ${socialIcons[platform] || '🔗'} ${platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>`)
        .join('');

    container.innerHTML = `
        <h2 class="contact-title">${escapeHtml(config.contacts.title || 'Contact Information')}</h2>
        <article class="contact-card tcg-card tcg-card--tab" data-type="water" data-reveal style="--reveal-delay:60ms">
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Contact</span>
                    <h3 class="tcg-name">Get in touch</h3>
                </header>
                <div class="tcg-moves contact-moves">
                    <a class="tcg-move contact-move" href="mailto:${escapeHtml(config.contacts.email)}">
                        <span class="contact-icon">📧</span>
                        <span class="tcg-move__name"><b>Email</b><small>${escapeHtml(config.contacts.email)}</small></span>
                    </a>
                    <a class="tcg-move contact-move" href="tel:${escapeHtml(config.contacts.phone)}">
                        <span class="contact-icon">📱</span>
                        <span class="tcg-move__name"><b>Phone</b><small>${escapeHtml(config.contacts.phone)}</small></span>
                    </a>
                    <div class="tcg-move contact-move">
                        <span class="contact-icon">📍</span>
                        <span class="tcg-move__name"><b>Location</b><small>${escapeHtml(config.contacts.location)}</small></span>
                    </div>
                </div>
                <footer class="tcg-foot contact-social">
                    ${socialLinks}
                </footer>
            </div>
        </article>
    `;

    initCardInteractions();
}
// Initialize contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? '#ff4757' : 'var(--card-bg)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        border: 1px solid ${type === 'error' ? '#ff4757' : 'var(--border-color)'};
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }

        .notification-close:hover {
            opacity: 0.7;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Close notification
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
        style.remove();
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            style.remove();
        }
    }, 5000);
}

// Format date helper function
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Apply theme colors from configuration
function applyThemeColors(colors) {
    const root = document.documentElement;
    if (root) {
        root.style.setProperty('--bg-color', colors.background || '#1e1e2f');
        root.style.setProperty('--card-bg', colors.cardBackground || '#2a2a3e');
        root.style.setProperty('--text-primary', colors.primary || '#ffffff');
        root.style.setProperty('--text-secondary', colors.secondary || '#a0a0b8');
        root.style.setProperty('--accent-color', colors.accent || '#ff6b61');
        root.style.setProperty('--accent-hover', colors.accentHover || '#ff5a4f');
        root.style.setProperty('--border-color', colors.border || '#3a3a4f');
    }
}

// Update animation speeds from configuration
function updateAnimationSpeed(speed) {
    const style = document.createElement('style');
    style.textContent = `
        .skills-scroll {
            animation: scroll ${speed} linear infinite;
        }
    `;
    document.head.appendChild(style);
}

// DOM Content Loaded - Only runs in browser
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Wire the switch before anything starts moving.
        initMotionToggle();

        // Populate content from configuration
        populateFromConfig();

        // Build sequence first: it tags section headings for the reveal pass.
        initBuildSequence();
        equalizeGalleryCards();

        const animate = motionEnabled() && config.theme?.animations?.enabled !== false;

        if (animate) {
            initTypingAnimation();
            initBioReveal();
            initCounterAnimation();
            initSmoothScrolling();
            initRevealObserver();
            initRevealFallback();
            initCardInteractions();
            initParticleSwarm();
        } else {
            initSmoothScrolling();
            initBasicInteractions();
            settleAnimations();
        }
    });

    // Stop painting the swarm while the tab is in the background.
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            stopParticleSwarm();
        } else if (motionEnabled()) {
            initParticleSwarm();
        }
    });
}

// Greeting typewriter — decorative only, and it never blocks navigation.
function initTypingAnimation() {
    const greeting = document.querySelector('.hero-greeting');
    if (!greeting || !config.personal?.greeting) return;

    const text = config.personal.greeting;
    const speed = config.theme?.animations?.greetingTypingSpeed || 120;
    const delay = config.theme?.animations?.greetingTypingDelay ?? 350;

    if (!motionEnabled()) {
        greeting.textContent = text;
        return;
    }

    greeting.textContent = '';
    let index = 0;

    const type = () => {
        if (!motionEnabled()) {
            greeting.textContent = text;
            return;
        }
        if (index >= text.length) return;
        greeting.textContent += text.charAt(index);
        index += 1;
        window.setTimeout(type, speed);
    };

    window.setTimeout(type, delay);
}

// About bio — a fast word-by-word reveal that always ends fully visible.
function initBioReveal() {
    const bio = document.querySelector('.about-description');
    if (!bio) return;

    const text = (bio.dataset.fullText || bio.textContent || '').trim();
    if (!text) return;

    if (!motionEnabled()) {
        bio.classList.remove('bio-typing');
        bio.textContent = text;
        return;
    }

    const words = text.split(/\s+/);
    bio.innerHTML = words
        .map((word, index) => `<span class="bio-word" style="--i:${index}">${escapeHtml(word)}</span>`)
        .join(' ');
    bio.classList.add('bio-typing');

    if (bio.classList.contains('bio-in')) return;

    if (!('IntersectionObserver' in window)) {
        bio.classList.add('bio-in');
        return;
    }

    if (bio.dataset.observed === 'true') {
        const rect = bio.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) bio.classList.add('bio-in');
        return;
    }

    bio.dataset.observed = 'true';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            bio.classList.add('bio-in');
            observer.disconnect();
        });
    }, { threshold: 0.2 });

    observer.observe(bio);
}

// Counter animation for statistics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const finish = (counter) => {
        const target = Number(counter.getAttribute('data-target')) || 0;
        counter.textContent = target + (counter.getAttribute('data-suffix') || '');
    };

    if (!motionEnabled() || !('IntersectionObserver' in window)) {
        counters.forEach(finish);
        return;
    }

    const run = (counter) => {
        if (counter.dataset.counted === 'true') return;
        counter.dataset.counted = 'true';

        const target = Number(counter.getAttribute('data-target')) || 0;
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = config.theme?.animations?.counterDuration || 1400;
        const start = performance.now();

        const step = (now) => {
            if (!motionEnabled()) {
                finish(counter);
                return;
            }

            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased) + suffix;

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            run(entry.target);
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.35 });

    counters.forEach((counter) => {
        // Never rewind a counter that already finished — toggling motion back on
        // must not leave the statistic stranded at zero.
        if (counter.dataset.counted !== 'true') {
            counter.textContent = '0' + (counter.getAttribute('data-suffix') || '');
        }
        observer.observe(counter);
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    if (document.body.dataset.navBound !== 'true') {
        document.body.dataset.navBound = 'true';

        document.querySelectorAll('.nav-link').forEach((link) => {
            link.addEventListener('click', (event) => {
                const targetId = link.getAttribute('href');
                if (!targetId || targetId.charAt(0) !== '#') return;

                const targetSection = document.querySelector(targetId);
                if (!targetSection) return;

                event.preventDefault();
                targetSection.scrollIntoView({
                    behavior: motionEnabled() ? 'smooth' : 'auto',
                    block: 'start'
                });
                updateActiveNavLink(link);
            });
        });
    }

    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!sections.length) return;

    if (document.body.dataset.sectionBound !== 'true') {
        document.body.dataset.sectionBound = 'true';

        let ticking = false;
        const syncActiveSection = () => {
            ticking = false;
            const probe = window.scrollY + 140;
            let current = sections[0];

            sections.forEach((section) => {
                if (section.offsetTop <= probe) current = section;
            });

            const link = document.querySelector(`.nav-link[href="#${current.id}"]`);
            if (link && !link.classList.contains('active')) updateActiveNavLink(link);
        };

        window.addEventListener('scroll', () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(syncActiveSection);
        }, { passive: true });

        syncActiveSection();
    }
}

function updateActiveNavLink(activeLink) {
    document.querySelectorAll('.nav-link').forEach((link) => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });

    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'true');
}

// Scroll reveals: class toggles only, one observer, no per-frame layout reads.
function initRevealObserver() {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return;

    if (!motionEnabled() || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    document.documentElement.classList.add('reveal-init');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    elements.forEach((element) => {
        if (element.classList.contains('is-visible')) return;
        observer.observe(element);
    });

    // Safety net: anything already on screen must never stay hidden, even if
    // an observer callback or its transition is missed.
    window.setTimeout(() => {
        elements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (!inView) return;
            if (parseFloat(getComputedStyle(element).opacity) > 0.6) return;

            // Drop the transition first: a paused one would otherwise hold the
            // old opacity and keep the element invisible.
            element.style.transition = 'none';
            element.classList.add('is-visible');
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }, 900);
}

// Belt-and-braces pass: the same rules as the observers, applied on scroll, so
// a missed observer tick can never leave a section invisible.
function initRevealFallback() {
    if (document.body.dataset.revealFallback === 'true') return;
    document.body.dataset.revealFallback = 'true';

    let queued = false;

    const pass = () => {
        queued = false;
        const vh = window.innerHeight;

        document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.top < vh - 40 && rect.bottom > 0) {
                element.classList.add('is-visible');
            }
        });

        document.querySelectorAll('.build-section:not(.is-built)').forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < vh && rect.bottom > 0) {
                section.classList.add('is-built', 'is-building');
                window.setTimeout(() => section.classList.remove('is-building'), 1500);
            }
        });
    };

    window.addEventListener('scroll', () => {
        if (queued) return;
        queued = true;
        window.requestAnimationFrame(pass);
    }, { passive: true });

    window.addEventListener('resize', pass, { passive: true });
}

// Button Interactions
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Magnetic effect on hover (optional enhancement)
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// NOTE: the legacy marquee skill strip (.skills-scroll) was removed in v3 —
// every skill is now a trading-card move instead of an endlessly scrolling chip.

// Performance optimization: Throttle scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

// Performance optimization: Debounce resize events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Optimize scroll events
let lastScrollTop = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // Only trigger if scroll direction changed
    if (Math.abs(scrollTop - lastScrollTop) > 5) {
        lastScrollTop = scrollTop;
        // Scroll-based animations can be added here
    }
}, 16));

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Optional: Add a subtle parallax effect to the hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroText = document.querySelector('.hero-text');
    const heroImage = document.querySelector('.hero-image');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (scrolled < window.innerHeight) {
            heroText.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }, 16));
}

// Parallax effect disabled for better performance

// Basic interactions for when animations are disabled
function initBasicInteractions() {
    // Just initialize smooth scrolling and basic button interactions
    initSmoothScrolling();
    
    // Simple button click effects without animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Simple click feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Performance monitoring (optional)
function initPerformanceMonitoring() {
    if ('performance' in window) {
        // Monitor animation performance
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'measure') {
                    console.log('Animation performance:', entry);
                }
            }
        });
        
        observer.observe({ entryTypes: ['measure'] });
    }
}

// Production-ready code - no development monitoring needed

// Populate gallery from configuration
function populateGallery() {
    if (!config.gallery?.enabled) return;

    const galleryScroll = document.querySelector('.gallery-scroll');
    const galleryDots = document.querySelector('.gallery-dots');

    if (!galleryScroll || !config.gallery?.images) return;

    // Clear existing content
    galleryScroll.innerHTML = '';
    if (galleryDots) galleryDots.innerHTML = '';

    config.gallery.images.forEach((image, index) => {
        // Create gallery item
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${index === 0 ? 'active' : ''}`;
        galleryItem.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy" width="600" height="400">
            <div class="gallery-caption">${image.caption}</div>
        `;
        galleryScroll.appendChild(galleryItem);

        // Create dot
        if (galleryDots) {
            const dot = document.createElement('span');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.onclick = () => currentSlide(index + 1);
            galleryDots.appendChild(dot);
        }
    });

    // Initialize gallery functionality
    initGallery();
}

// Populate character references from configuration
function populateReferences() {
    if (!config.references?.enabled) return;

    const referencesGrid = document.getElementById('references-grid');
    if (!referencesGrid || !config.references?.list) return;

    referencesGrid.innerHTML = '';

    const allyTypes = ['grass', 'water', 'psychic', 'steel'];

    config.references.list.forEach((reference, index) => {
        const referenceCard = document.createElement('article');
        referenceCard.className = 'reference-card tcg-card tcg-card--tab';
        referenceCard.dataset.type = allyTypes[index % allyTypes.length];
        referenceCard.dataset.reveal = '';
        referenceCard.style.setProperty('--reveal-delay', `${index * 80}ms`);

        referenceCard.innerHTML = `
            <div class="tcg-card__inner">
                <span class="tcg-card__holo" aria-hidden="true"></span>
                <header class="tcg-top">
                    <span class="tcg-stage">Ally</span>
                    <h3 class="tcg-name">${escapeHtml(reference.name)}</h3>
                </header>
                ${cardArt(reference.image, reference.name, {
                    icon: '🎓',
                    badge: '🎓 Ally',
                    rarity: escapeHtml(reference.relationship),
                    extraClass: 'tcg-art--portrait'
                })}
                <div class="reference-title">${escapeHtml(reference.title)}</div>
                <div class="tcg-moves reference-moves">
                    <div class="tcg-move">
                        <span class="tcg-move__name">${escapeHtml(reference.email)}</span>
                    </div>
                    <div class="tcg-move">
                        <span class="tcg-move__name">${escapeHtml(reference.phone)}</span>
                    </div>
                </div>
                <footer class="tcg-foot">
                    <span><b>Role</b> ${escapeHtml(reference.relationship)}</span>
                </footer>
            </div>
        `;

        referencesGrid.appendChild(referenceCard);
    });

    initCardInteractions();
}

// Gallery functionality
let currentSlideIndex = 1;

function initGallery() {
    // Auto-scroll gallery every 5 seconds
    setInterval(() => {
        if (config.theme?.animations?.enabled) {
            nextImage();
        }
    }, 5000);
}

function nextImage() {
    showSlide(currentSlideIndex + 1);
}

function previousImage() {
    showSlide(currentSlideIndex - 1);
}

function currentSlide(n) {
    showSlide(n);
}

function showSlide(n) {
    const slides = document.querySelectorAll('.gallery-item');
    const dots = document.querySelectorAll('.dot');

    if (n > slides.length) {
        currentSlideIndex = 1;
    } else if (n < 1) {
        currentSlideIndex = slides.length;
    } else {
        currentSlideIndex = n;
    }

    // Update slides
    slides.forEach((slide, index) => {
        if (index + 1 === currentSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Update dots
    dots.forEach((dot, index) => {
        if (index + 1 === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Populate project gallery from configuration (Timeline Style)
function populateProjectGallery() {
    if (!config.projectGallery?.enabled) return;

    const timelineItems = document.querySelector('.timeline-items');

    if (!timelineItems || !config.projectGallery?.projects) return;

    // Clear existing content
    timelineItems.innerHTML = '';

    config.projectGallery.projects.forEach((project, index) => {
        // Create timeline item
        const timelineItem = document.createElement('div');
        timelineItem.className = `timeline-item ${index === 0 ? 'active' : ''}`;

        timelineItem.innerHTML = `
            <div class="timeline-date">${formatDate(project.date)}</div>
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" width="300" height="200">
                </div>
                <div class="timeline-details">
                    <h3 class="timeline-title">${project.title}</h3>
                    <p class="timeline-description">${project.description}</p>
                    <div class="timeline-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="timeline-links">
                        <a href="${project.githubLink}" class="project-link" target="_blank" rel="noopener noreferrer">View Code</a>
                        <a href="${project.demoLink}" class="project-link" target="_blank" rel="noopener noreferrer">Watch Demo</a>
                    </div>
                </div>
            </div>
        `;

        timelineItems.appendChild(timelineItem);
    });

    // Initialize timeline functionality
    initTimelineGallery();
}

// Populate video links from configuration - Phone interface for TikTok, cards for YouTube
function populateVideoLinks() {
    if (!config.videoLinks?.enabled) return;

    const videoLinksGrid = document.querySelector('.video-links-grid');
    if (!videoLinksGrid || !config.videoLinks?.videos) return;

    videoLinksGrid.innerHTML = '';

    // Only handle YouTube videos now (TikTok phone moved to Gallery section)
    const youtubeVideos = config.videoLinks.videos.filter(video => video.platform === 'youtube');

    // Create YouTube video cards (embedded videos with modal)
    if (youtubeVideos.length > 0) {
        youtubeVideos.forEach((video, originalIndex) => {
            const videoCard = document.createElement('div');
            videoCard.className = 'youtube-video-card tcg-card tcg-card--tab';
            videoCard.dataset.type = ['electric', 'water', 'psychic'][originalIndex % 3];
            videoCard.dataset.reveal = '';
            videoCard.style.setProperty('--reveal-delay', `${originalIndex * 70}ms`);

            // Generate unique iframe ID for each video tile
            const tileIframeId = `youtube-tile-${originalIndex}`;

            videoCard.innerHTML = `
                <div class="tcg-card__inner">
                    <span class="tcg-card__holo" aria-hidden="true"></span>
                    <header class="tcg-top">
                        <span class="tcg-stage">Clip</span>
                        <h3 class="tcg-name">${escapeHtml(video.title)}</h3>
                    </header>
                    <div class="video-container tcg-art tcg-art--video">
                        <iframe
                            id="${tileIframeId}"
                            class="video-iframe"
                            src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${video.videoId}&modestbranding=1"
                            title="${escapeHtml(video.title)}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                        <div class="video-overlay">
                            <button class="video-play-btn">
                                <span class="play-icon">▶</span>
                                <span class="platform-badge">Watch Full Video</span>
                            </button>
                        </div>
                    </div>
                    <p class="tcg-text">${escapeHtml(video.description)}</p>
                    <footer class="tcg-foot">
                        <span><b>Source</b> YouTube</span>
                        <span><b>Mode</b> Full demo</span>
                    </footer>
                </div>
            `;

            // Bind in JS so titles/descriptions can never break an inline handler.
            const overlay = videoCard.querySelector('.video-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    openYouTubeModal(video.title, video.description, video.videoId);
                });
            }

            videoLinksGrid.appendChild(videoCard);
        });
    }

    // Initialize video hover previews for YouTube videos
    initVideoPreviews(youtubeVideos);
}

// Initialize TikTok phone scrolling functionality with auto-play
function initTikTokPhoneScroll() {
    const videos = document.querySelectorAll('.gallery-tiktok-phone .tiktok-video');

    function updateVideoPlayback(entries) {
        entries.forEach(entry => {
            const iframe = entry.target;
            const src = new URL(iframe.src);

            if (entry.isIntersecting) {
                src.searchParams.set("autoplay", "1");
                src.searchParams.set("mute", "0");
            } else {
                src.searchParams.set("autoplay", "0");
                src.searchParams.set("mute", "1");
            }

            iframe.src = src.toString();
        });
    }

    const observer = new IntersectionObserver(updateVideoPlayback, { threshold: 0.7 });

    videos.forEach(video => observer.observe(video));
}

// TikTok video functionality
let tiktokVideos = [];

function initializeTikTokVideos() {
    // Get tiktok videos from config
    if (window.portfolioConfig && window.portfolioConfig.videoLinks) {
        tiktokVideos = window.portfolioConfig.videoLinks.videos.filter(video => video.platform === 'tiktok');
    }
}

function playTikTokVideo(index) {
    if (!tiktokVideos || !tiktokVideos[index]) {
        console.error('TikTok video not found at index:', index);
        return;
    }

    const videoItem = document.querySelector(`.tiktok-video-item[data-video-index="${index}"]`);
    if (!videoItem) {
        console.error('TikTok video item not found for index:', index);
        return;
    }

    const iframe = videoItem.querySelector('.tiktok-video-iframe');
    const overlay = videoItem.querySelector('.tiktok-overlay');

    if (!iframe || !overlay) {
        console.error('Required elements not found for video:', index);
        return;
    }

    // Hide overlay and start video
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';

    const tiktokVideo = tiktokVideos[index];
    const videoId = tiktokVideo.videoId;

    // Use TikTok embed v2 format for better auto-play support
    let embedUrl = '';

    // Use the standard TikTok embed v2 format
    if (videoId && videoId.length > 10) {
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    }

    if (embedUrl) {
        iframe.src = embedUrl;
        console.log('Loading TikTok video:', embedUrl);
        iframe.style.display = 'block'; // Ensure iframe is visible
    }

    // Set a timeout to handle loading issues
    setTimeout(() => {
        // If video didn't load, try fallback approach
        if (iframe.src && iframe.contentWindow) {
            try {
                // Check if iframe loaded successfully
                console.log('TikTok iframe probably loaded');
            } catch (e) {
                console.error('TikTok iframe load issue detected');
                // Fallback: Open TikTok in new tab
                window.open(`https://www.tiktok.com/@username/video/${videoId}`, '_blank');
            }
        }
    }, 3000);
}

// Function to stop/pause TikTok video
function stopTikTokVideo(index) {
    const videoItem = document.querySelector(`.tiktok-video-item[data-video-index="${index}"]`);
    if (!videoItem) return;

    const iframe = videoItem.querySelector('.tiktok-video-iframe');
    const overlay = videoItem.querySelector('.tiktok-overlay');

    if (iframe && overlay) {
        // Show overlay and clear video to pause
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        iframe.src = '';
    }
}

// Toggle like animation on TikTok videos
function toggleLike(index) {
    const likeBtn = document.querySelector(`.tiktok-video-item[data-video-index="${index}"] .like-btn .action-icon`);

    if (likeBtn) {
        const currentIcon = likeBtn.textContent;
        if (currentIcon === '🤍') {
            likeBtn.textContent = '❤️';
            // Add popup animation
            likeBtn.style.animation = 'likePopup 0.6s ease';
            setTimeout(() => {
                likeBtn.style.animation = '';
            }, 600);
        } else {
            likeBtn.textContent = '🤍';
        }
    }
}

// Timeline Gallery functionality
function initTimelineGallery() {
    // Initialize timeline animations and scroll effects
    initTimelineScrollAnimations();
    initTimelineInteractions();
}

function initTimelineScrollAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

function initTimelineInteractions() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach(item => {
        // Add click functionality to expand/collapse details
        item.addEventListener('click', () => {
            // Toggle active state for visual feedback
            timelineItems.forEach(i => i.classList.remove('focused'));
            item.classList.add('focused');
        });

        // Add hover effects for better UX
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '5';
        });

        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '';
            item.classList.remove('focused');
        });
    });
}

// Video loading functionality
function loadVideo(platform, videoId, iframeId) {
    const iframe = document.getElementById(iframeId);
    if (!iframe) return;

    // Pause all other videos first
    pauseAllVideos(iframeId);

    let embedUrl = '';

    if (platform === 'youtube') {
        // YouTube embed URL
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    } else if (platform === 'tiktok') {
        // TikTok embed URL - using the standard TikTok embed format
        embedUrl = `https://www.tiktok.com/embed/v2/${videoId}`;
    }

    if (embedUrl) {
        iframe.src = embedUrl;
        // Hide the overlay after loading
        const overlay = iframe.parentElement.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }

        // Magnify the video container for better viewing
        const videoContainer = iframe.parentElement;
        if (videoContainer) {
            videoContainer.classList.add('video-playing');
        }
    }
}

// Pause all videos except the specified one
function pauseAllVideos(exceptIframeId) {
    const iframes = document.querySelectorAll('.video-iframe');

    iframes.forEach(iframe => {
        if (iframe.id !== exceptIframeId && iframe.src) {
            // Extract video ID from YouTube URL to stop video
            const src = iframe.src;
            if (src.includes('youtube.com')) {
                // Stop YouTube video by setting src to empty and then back
                const originalSrc = src;
                iframe.src = '';
                setTimeout(() => {
                    iframe.src = originalSrc.replace('autoplay=1', 'autoplay=0');
                }, 100);
            }

            // Show overlay again for non-playing videos
            const overlay = iframe.parentElement.querySelector('.video-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }

            // Remove magnification from non-playing videos
            const videoContainer = iframe.parentElement;
            if (videoContainer) {
                videoContainer.classList.remove('video-playing');
            }
        }
    });
}

// Hide video overlay when iframe loads (for direct loading)
function hideVideoOverlay(iframeId) {
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        const overlay = iframe.parentElement.querySelector('.video-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
}

// Video play/pause functionality
function togglePlayPause(button) {
    const videoContainer = button.closest('.project-gallery-video');
    const video = videoContainer.querySelector('video');

    if (video) {
        if (video.paused) {
            video.play();
            button.textContent = '⏸';
        } else {
            video.pause();
            button.textContent = '▶';
        }
    }
}

// Video mute/unmute functionality
function toggleMute(button) {
    const videoContainer = button.closest('.project-gallery-video');
    const video = videoContainer.querySelector('video');

    if (video) {
        if (button.textContent === '🔊') {
            video.muted = true;
            button.textContent = '🔇';
        } else {
            video.muted = false;
            button.textContent = '🔊';
        }
    }
}

// Video progress tracking
function initVideoControls() {
    const videos = document.querySelectorAll('.project-gallery-video video');

    videos.forEach(video => {
        const container = video.closest('.project-gallery-video');
        const progressBar = container.querySelector('.video-progress-bar');
        const playPauseBtn = container.querySelector('.video-play-pause');
        const muteBtn = container.querySelector('.video-mute-unmute');
        const progressContainer = container.querySelector('.video-progress');
        const timeDisplay = container.querySelector('.video-time');

        // Format time helper function
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }

        // Update progress bar and time display
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressBar.style.width = progress + '%';

                if (timeDisplay) {
                    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
                }
            }
        });

        // Update progress on loadedmetadata
        video.addEventListener('loadedmetadata', () => {
            if (timeDisplay && video.duration) {
                timeDisplay.textContent = `00:00 / ${formatTime(video.duration)}`;
            }
        });

        // Click on progress bar to seek
        progressContainer.addEventListener('click', (e) => {
            const rect = progressContainer.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const progressWidth = rect.width;
            const seekTime = (clickX / progressWidth) * video.duration;
            video.currentTime = seekTime;
        });

        // Update play/pause button on video events
        video.addEventListener('play', () => {
            if (playPauseBtn) playPauseBtn.textContent = '⏸';
        });

        video.addEventListener('pause', () => {
            if (playPauseBtn) playPauseBtn.textContent = '▶';
        });

        // Update mute button on video events
        video.addEventListener('volumechange', () => {
            if (muteBtn) {
                muteBtn.textContent = video.muted ? '🔇' : '🔊';
            }
        });

        // Show controls on hover
        container.addEventListener('mouseenter', () => {
            const controls = container.querySelector('.video-custom-controls');
            if (controls) controls.style.opacity = '1';
        });

        container.addEventListener('mouseleave', () => {
            const controls = container.querySelector('.video-custom-controls');
            if (controls && video.paused) controls.style.opacity = '0';
        });

        // Keep controls visible when video is playing
        video.addEventListener('play', () => {
            const controls = container.querySelector('.video-custom-controls');
            if (controls) controls.style.opacity = '1';
        });

        video.addEventListener('pause', () => {
            // Keep controls visible for a moment after pause
            setTimeout(() => {
                const controls = container.querySelector('.video-custom-controls');
                if (controls && video.paused) controls.style.opacity = '0';
            }, 2000);
        });

        // Handle video end
        video.addEventListener('ended', () => {
            if (playPauseBtn) playPauseBtn.textContent = '▶';
        });
    });
}

// Seek video function (for progress bar clicking)
function seekVideo(event, progressContainer) {
    const videoContainer = progressContainer.closest('.project-gallery-video');
    const video = videoContainer.querySelector('video');

    if (video && video.duration) {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const progressWidth = rect.width;
        const seekTime = (clickX / progressWidth) * video.duration;
        video.currentTime = seekTime;
    }
}

// Video preview functionality with modal popups
function initVideoPreviews(youtubeVideos) {
    const videoCards = document.querySelectorAll('.video-link-card');

    videoCards.forEach(card => {
        const videoContainer = card.querySelector('.video-container');
        const overlay = card.querySelector('.video-overlay');
        const thumbnail = card.querySelector('.video-thumbnail');
        const playBtn = card.querySelector('.video-play-btn');

        if (!videoContainer || !overlay) return;

        // Desktop hover functionality for thumbnail preview
        card.addEventListener('mouseenter', () => {
            // Hide overlay and show thumbnail on hover
            if (overlay) overlay.style.opacity = '0';
            if (thumbnail) thumbnail.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            // Show overlay and hide thumbnail on mouse leave
            if (overlay) overlay.style.opacity = '1';
            if (thumbnail) thumbnail.style.opacity = '0';
        });

        // Click to open modal
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const cardIndex = Array.from(document.querySelectorAll('.video-link-card')).indexOf(card);
                if (youtubeVideos && youtubeVideos[cardIndex]) {
                    openVideoModal(youtubeVideos[cardIndex]);
                }
            });
        }
    });

    // Also create the modal HTML
    createVideoModal();
}

// Create video modal HTML structure
function createVideoModal() {
    const modalHTML = `
        <div id="video-modal" class="video-modal">
            <div class="video-modal-backdrop" id="video-modal-backdrop"></div>
            <div class="video-modal-content">
                <button class="video-modal-close" id="video-modal-close">✕</button>
                <div class="video-modal-iframe-container">
                    <iframe id="video-modal-iframe" class="video-modal-iframe" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="video-modal-info">
                    <h3 id="video-modal-title"></h3>
                    <p id="video-modal-description"></p>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add modal event listeners
    const modal = document.getElementById('video-modal');
    const backdrop = document.getElementById('video-modal-backdrop');
    const closeBtn = document.getElementById('video-modal-close');

    // Close modal functions
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Stop the video
        const iframe = document.getElementById('video-modal-iframe');
        if (iframe) {
            iframe.src = '';
        }
    };

    // Event listeners for closing modal
    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Open video modal with specific video
function openVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const iframe = document.getElementById('video-modal-iframe');
    const title = document.getElementById('video-modal-title');
    const description = document.getElementById('video-modal-description');

    if (!modal || !iframe || !title || !description) return;

    // Stop any playing videos in the grid
    pauseAllVideos();

    // Set video information
    title.textContent = video.title || '';
    description.textContent = video.description || '';

    // Determine video orientation - TikTok videos ALWAYS get portrait modal regardless of device
    const isPortraitVideo = video.isPortrait || false;
    const isMobile = window.innerWidth <= 768;

    // Determine appropriate modal classes
    let modalClasses = ['video-modal'];

    if (isPortraitVideo) {
        // TikTok videos (portrait content) - ALWAYS use portrait modal orientation for both mobile and desktop
        modalClasses.push('portrait-video');
        if (isMobile) {
            modalClasses.push('portrait-mobile');
        } else {
            // Force TikTok to always use mobile portrait styling even on desktop
            modalClasses.push('portrait-mobile');
        }
    } else {
        // YouTube videos (landscape content) - Use normal modal behavior
        if (isMobile) {
            modalClasses.push('landscape-video', 'landscape-mobile');
        } else {
            modalClasses.push('landscape-video', 'landscape-desktop');
        }
    }

    // Ensure TikTok and portrait videos get proper portrait modal styling
    if (isPortraitVideo || video.platform === 'tiktok') {
        modalClasses = ['video-modal', 'portrait-video', 'portrait-mobile'];
    }

    // Apply modal classes
    modal.className = modalClasses.join(' ');
    console.log('Modal classes applied:', modalClasses, 'Video platform:', video.platform, 'isPortrait:', isPortraitVideo);

    // Set iframe source based on platform with modal-specific parameters
    let embedUrl = '';
    if (video.platform === 'youtube') {
        embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=0&controls=1&enablejsapi=1&origin=${window.location.origin}`;
    } else if (video.platform === 'tiktok') {
        embedUrl = `https://www.tiktok.com/embed/v2/${video.videoId}`;
    }

    iframe.src = embedUrl;

    // Show modal with animation
    modal.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus management for accessibility
    setTimeout(() => {
        modal.focus();
    }, 100);
}

// YouTube modal functionality
function openYouTubeModal(title, description, videoId) {
    // Create modal if it doesn't exist
    if (!document.getElementById('youtube-modal')) {
        const modalHTML = `
            <div id="youtube-modal" class="video-modal youtube-only-modal">
                <div class="video-modal-backdrop" onclick="closeYouTubeModal()"></div>
                <div class="video-modal-content">
                    <button class="video-modal-close" onclick="closeYouTubeModal()">✕</button>
                    <div class="video-modal-iframe-container">
                        <iframe id="youtube-modal-iframe" class="video-modal-iframe"
                                frameborder="0" allowfullscreen>
                        </iframe>
                    </div>
                    <div class="video-modal-info">
                        <h3 id="youtube-modal-title"></h3>
                        <p id="youtube-modal-description"></p>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Show modal
    const modal = document.getElementById('youtube-modal');
    const iframe = document.getElementById('youtube-modal-iframe');
    const modalTitle = document.getElementById('youtube-modal-title');
    const modalDesc = document.getElementById('youtube-modal-description');

    // Set content
    modalTitle.textContent = title;
    modalDesc.textContent = description;

    // Load YouTube video with controls enabled
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&controls=1&modestbranding=0&enablejsapi=1&origin=${window.location.origin}`;

    // Show modal
    modal.classList.add('active');
    document.body.classList.add('modal-open');
}

function closeYouTubeModal() {
    const modal = document.getElementById('youtube-modal');
    const iframe = document.getElementById('youtube-modal-iframe');

    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        if (iframe) {
            iframe.src = '';
        }
    }
}

// Initialize video controls when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initVideoControls, 1000); // Delay to ensure videos are loaded
});

// Theme switching functionality
function switchTheme() {
    const themeSelect = document.getElementById('theme-select');
    if (!themeSelect) return;

    const selectedTheme = themeSelect.value;

    // Remove existing theme CSS links
    const existingThemeLinks = document.querySelectorAll('link[data-theme]');
    existingThemeLinks.forEach(link => link.remove());

    // Remove all theme active classes
    document.body.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');

    // Add new theme CSS link
    if (selectedTheme !== 'default') {
        const themeLink = document.createElement('link');
        themeLink.rel = 'stylesheet';
        themeLink.href = `themes/${selectedTheme}-theme.css`;
        themeLink.setAttribute('data-theme', selectedTheme);
        document.head.appendChild(themeLink);

        // Apply theme-specific effects
        applyThemeEffects(selectedTheme);
    }

    // Save selected theme to localStorage
    localStorage.setItem('selectedTheme', selectedTheme);

    // Apply theme colors if configuration is available
    if (typeof window !== 'undefined' && window.portfolioConfig?.theme?.colors) {
        const colors = window.portfolioConfig.theme.colors[selectedTheme] || window.portfolioConfig.theme.colors;
        if (colors) {
            applyThemeColors(colors);
        }
    }
}

// Apply theme-specific effects
function applyThemeEffects(theme) {
    const body = document.body;
    const heroGreeting = document.querySelector('.hero-greeting');
    const heroTitle = document.querySelector('.hero-title');
    const navbar = document.querySelector('.navbar');

    // Remove all theme effects first
    body.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');
    if (heroGreeting) {
        heroGreeting.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');
        heroGreeting.removeAttribute('data-text');
    }
    if (heroTitle) {
        heroTitle.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');
        heroTitle.removeAttribute('data-text');
    }
    if (navbar) {
        navbar.classList.remove('cyberpunk-active', 'techno-active', 'dark-active', 'light-active');
    }

    // Apply theme-specific effects
    switch(theme) {
        case 'cyberpunk':
            body.classList.add('cyberpunk-active');
            navbar?.classList.add('cyberpunk-active');

            // Add glitch text effects to hero elements
            if (heroGreeting) {
                heroGreeting.classList.add('cyberpunk-active');
                heroGreeting.setAttribute('data-text', heroGreeting.textContent);
            }
            if (heroTitle) {
                heroTitle.classList.add('cyberpunk-active');
                heroTitle.setAttribute('data-text', heroTitle.textContent);
            }
            break;

        case 'techno':
            body.classList.add('techno-active');
            navbar?.classList.add('techno-active');

            if (heroGreeting) {
                heroGreeting.classList.add('techno-active');
                heroGreeting.setAttribute('data-text', heroGreeting.textContent);
            }
            if (heroTitle) {
                heroTitle.classList.add('techno-active');
                heroTitle.setAttribute('data-text', heroTitle.textContent);
            }
            break;

        case 'dark':
            body.classList.add('dark-active');
            break;

        case 'light':
            body.classList.add('light-active');
            break;
    }
}

// Load saved theme on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    const themeSelect = document.getElementById('theme-select');

    // Default to dark theme if no theme is saved
    const defaultTheme = savedTheme || 'dark';

    if (themeSelect) {
        themeSelect.value = defaultTheme;
        switchTheme();
    }
}

// Initialize theme functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved theme after a short delay to ensure all elements are ready
    setTimeout(loadSavedTheme, 100);

    // Also initialize video controls
    setTimeout(initVideoControls, 1000);
});

// Update favicon based on pageLogo configuration
function updateFavicon() {
    // Remove existing favicon links (except the first one we added)
    const existingFavicons = document.querySelectorAll('link[rel="icon"]');
    if (existingFavicons.length > 1) {
        // Remove all except the first one (our default)
        for (let i = existingFavicons.length - 1; i > 0; i--) {
            existingFavicons[i].remove();
        }
    }

    if (config.personal?.pageLogo) {
        // Create new favicon based on pageLogo
        const favicon = document.createElement('link');
        favicon.rel = 'icon';

        if (config.personal.pageLogo.startsWith('/') || config.personal.pageLogo.startsWith('http')) {
            // It's an image path - use it as favicon
            favicon.href = config.personal.pageLogo;
            favicon.type = 'image/x-icon';
        } else {
            // It's an emoji - create SVG favicon
            const emoji = config.personal.pageLogo;
            const svgData = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
            favicon.href = `data:image/svg+xml,${encodeURIComponent(svgData)}`;
            favicon.type = 'image/svg+xml';
        }

        document.head.appendChild(favicon);
    }
}

// =====================================================
// PARTICLE SWARM (rebuilt)
