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
                navLogo.innerHTML = `<img src="${config.personal.pageLogo}" alt="Logo" class="nav-logo-image">`;
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
            a.textContent = item.name;
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

// Add populateThemeToggle function
function populateThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle || !config.theme?.modes) return;

    themeToggle.innerHTML = '';

    Object.entries(config.theme.modes).forEach(([key, modeConfig]) => {
        const button = document.createElement('button');
        button.className = 'theme-btn';
        button.setAttribute('data-theme', key);
        button.onclick = () => switchToTheme(key);
        button.innerHTML = '<span></span>';
        themeToggle.appendChild(button);
    });

    // Set initial active theme
    const currentTheme = config.theme?.mode || 'dark';
    setActiveTheme(currentTheme);
}

// Set active theme button
function setActiveTheme(themeKey) {
    // Remove active class from all theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to current theme button
    const activeBtn = document.querySelector(`[data-theme="${themeKey}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
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

    // Update active button
    setActiveTheme(themeKey);
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
        profileImg.src = config.personal.profileImage;
        profileImg.alt = config.personal.name || 'Profile';
    }

    // Update buttons
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    if (primaryBtn && config.heroButtons?.primary?.enabled) {
        primaryBtn.textContent = config.heroButtons.primary.text;
        if (config.heroButtons.primary.link !== '#') {
            primaryBtn.onclick = () => window.open(config.heroButtons.primary.link, '_blank');
        }
    }
    
    if (secondaryBtn && config.heroButtons?.secondary?.enabled) {
        secondaryBtn.textContent = config.heroButtons.secondary.text;
        if (config.heroButtons.secondary.link !== '#') {
            secondaryBtn.onclick = () => window.open(config.heroButtons.secondary.link, '_blank');
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

    // Populate technical skills section
    populateTechnicalSkills();

    // Populate experience section
    populateExperience();

// Populate technical skills section
function populateTechnicalSkills() {
    if (!config.technicalSkills?.enabled) return;

    // Update technical skills title and subtitle
    const titleElement = document.querySelector('.technical-skills-title');
    const subtitleElement = document.querySelector('.technical-skills-subtitle');

    if (titleElement && config.technicalSkills?.title) {
        titleElement.textContent = config.technicalSkills.title;
    }

    if (subtitleElement && config.technicalSkills?.subtitle) {
        subtitleElement.textContent = config.technicalSkills.subtitle;
    }

    // Populate technical skills grid
    const skillsGrid = document.querySelector('.technical-skills-grid');
    if (!skillsGrid || !config.technicalSkills?.categories) return;

    skillsGrid.innerHTML = '';

    config.technicalSkills.categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';

        categoryDiv.innerHTML = `
            <div class="skill-category-header">
                <div class="skill-category-icon">${category.icon}</div>
                <h3 class="skill-category-title">${category.title}</h3>
            </div>
            <div class="skill-list">
                ${category.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
            </div>
        `;

        skillsGrid.appendChild(categoryDiv);
    });

    // Initialize technical skills animations
    initTechnicalSkillsAnimations();
}

// Technical Skills Animations (Simplified - No Movement)
function initTechnicalSkillsAnimations() {
    const skillCategories = document.querySelectorAll('.skill-category');

    // Simple fade-in animation without movement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Initially hide categories for simple fade-in
    skillCategories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transition = `opacity 0.6s ease ${index * 0.1}s`;
        observer.observe(category);
    });

    // No hover interactions - completely static
    // Technical skills remain perfectly static at all times
}

// Populate experience section from configuration
function populateExperience() {
    if (!config.experience?.enabled) return;

    // Update experience section title
    const experienceTitle = document.querySelector('.experience-title');
    if (experienceTitle && config.experience?.title) {
        experienceTitle.textContent = config.experience.title;
    }

    // Populate experience timeline
    const experienceTimeline = document.querySelector('.experience-timeline');
    if (!experienceTimeline || !config.experience?.positions) return;

    experienceTimeline.innerHTML = '';

    config.experience.positions.forEach((position, index) => {
        const positionDiv = document.createElement('div');
        positionDiv.className = 'experience-item';

        positionDiv.innerHTML = `
            <div class="experience-header">
                <h3 class="experience-position">${position.title}</h3>
                <div class="experience-company">${position.company}</div>
                <div class="experience-period">${position.period}</div>
            </div>
            <div class="experience-description">
                <p>${position.description}</p>
            </div>
        `;

        experienceTimeline.appendChild(positionDiv);
    });

    // Initialize experience animations
    initExperienceAnimations();
}

// Experience section animations
function initExperienceAnimations() {
    const experienceItems = document.querySelectorAll('.experience-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    experienceItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(item);
    });
}

    // Update about section title
    const aboutTitle = document.querySelector('.about-title');
    if (aboutTitle && config.about?.title) {
        aboutTitle.textContent = config.about.title;
    }

    // Update about description (will be handled by typing animation)
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription) {
        // Clear initial content for typing animation
        aboutDescription.textContent = '';
        aboutDescription.setAttribute('data-text', config.about?.description || '');
    }

    // Update services
    const servicesContainer = document.querySelector('.services');
    if (servicesContainer && config.about?.services) {
        servicesContainer.innerHTML = '';
        config.about.services.forEach(service => {
            const serviceDiv = document.createElement('div');
            serviceDiv.className = 'service-item';
            serviceDiv.innerHTML = `
                <div class="service-icon">${service.icon}</div>
                <div class="service-text">${service.title}</div>
            `;
            servicesContainer.appendChild(serviceDiv);
        });
    }

    // Update statistics
    const statNumbers = document.querySelectorAll('.stat-number');
    const statLabels = document.querySelectorAll('.stat-label');
    
    if (config.about?.statistics && statNumbers.length === config.about.statistics.length) {
        config.about.statistics.forEach((stat, index) => {
            if (statNumbers[index]) {
                statNumbers[index].setAttribute('data-target', stat.number.toString());
                statNumbers[index].textContent = '0';
            }
            if (statLabels[index]) {
                statLabels[index].textContent = stat.label;
            }
        });
    }

    // Apply theme colors if configured
    if (config.theme?.colors) {
        applyThemeColors(config.theme.colors);
    }

    // Update CSS animations based on config
    if (config.theme?.animations?.scrollSpeed) {
        updateAnimationSpeed(config.theme.animations.scrollSpeed);
    }

    // Populate projects section
    populateProjects();

    // Populate project gallery section
    populateProjectGallery();

    // Populate video links section
    populateVideoLinks();

    // Populate experience section
    populateExperience();

    // Populate character references section
    populateReferences();

    // Populate contact section
    populateContact();
}

// Populate projects from configuration
function populateProjects() {
    if (!config.projects?.enabled) return;

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid || !config.projects?.list) return;

    projectsGrid.innerHTML = '';

    config.projects.list.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = `project-card ${project.featured ? 'featured' : ''}`;

        projectCard.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}">
                <div class="project-overlay">
                    <a href="${project.link}" class="project-link" target="_blank">View Project</a>
                </div>
            </div>
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-name">${project.name}</h3>
                    <div class="project-date">${formatDate(project.date)}</div>
                </div>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        projectsGrid.appendChild(projectCard);
    });
}

// Populate contact information from configuration
function populateContact() {
    if (!config.contacts?.enabled) return;

    // Update contact title and subtitle
    const contactTitle = document.querySelector('.contact-title');
    const contactSubtitle = document.querySelector('.contact-subtitle');

    if (contactTitle && config.contacts?.title) {
        contactTitle.textContent = config.contacts.title;
    }

    if (contactSubtitle && config.contacts?.subtitle) {
        contactSubtitle.textContent = config.contacts.subtitle;
    }

    // Update contact information
    const contactItems = document.querySelectorAll('.contact-item');
    const contactInfo = [
        { icon: '📧', value: config.contacts.email, label: 'Email' },
        { icon: '📱', value: config.contacts.phone, label: 'Phone' },
        { icon: '📍', value: config.contacts.location, label: 'Location' }
    ];

    contactItems.forEach((item, index) => {
        if (contactInfo[index]) {
            const icon = item.querySelector('.contact-icon');
            const label = item.querySelector('.contact-label');
            const value = item.querySelector('.contact-value');

            if (icon) icon.textContent = contactInfo[index].icon;
            if (label) label.textContent = contactInfo[index].label;
            if (value) value.textContent = contactInfo[index].value;
        }
    });

    // Update social links
    if (config.contacts?.social) {
        const socialLinks = document.querySelector('.social-links');
        if (socialLinks) {
            socialLinks.innerHTML = '';

            Object.entries(config.contacts.social).forEach(([platform, url]) => {
                if (url && url !== '#') {
                    const socialLink = document.createElement('a');
                    socialLink.href = url;
                    socialLink.className = 'social-link';
                    socialLink.target = '_blank';

                    const iconMap = {
                        github: '🐙',
                        linkedin: '💼',
                        twitter: '🐦',
                        instagram: '📷'
                    };

                    socialLink.innerHTML = `
                        <div class="social-icon">${iconMap[platform] || '🔗'}</div>
                        <span>${platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
                    `;

                    socialLinks.appendChild(socialLink);
                }
            });
        }
    }
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
        // Populate content from configuration
        populateFromConfig();
        
        // Check if user prefers reduced motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (config.theme?.animations?.enabled && !prefersReducedMotion) {
            // Initialize all animations and interactions
            initTypingAnimation();
            initCounterAnimation();
            initSmoothScrolling();
            initScrollAnimations();
            initButtonInteractions();
            initSkillsAnimation();
        } else {
            // Fallback for no animations or reduced motion preference
            initBasicInteractions();
        }
    });
}

// Typing Animation for Hero Text and About Bio (Optimized)
function initTypingAnimation() {
    const defaultTypingSpeed = config.theme?.animations?.typingSpeed || 100;
    const greetingTypingSpeed = config.theme?.animations?.greetingTypingSpeed || defaultTypingSpeed;
    const bioTypingSpeed = config.theme?.animations?.bioTypingSpeed || defaultTypingSpeed;
    const greetingDelay = config.theme?.animations?.greetingTypingDelay || 500;
    const bioDelay = config.theme?.animations?.bioTypingDelay || 1500;

    // Hero greeting typing animation
    if (config.personal?.greeting) {
        const greeting = document.querySelector('.hero-greeting');
        if (greeting) {
            const originalText = config.personal.greeting;
            greeting.textContent = '';
            let i = 0;
            const typeWriter = function() {
                if (i < originalText.length) {
                    greeting.textContent += originalText.charAt(i);
                    i++;
                    requestAnimationFrame(() => {
                        setTimeout(typeWriter, greetingTypingSpeed);
                    });
                }
            };

            setTimeout(() => {
                requestAnimationFrame(typeWriter);
            }, greetingDelay);
        }
    }

    // About bio typing animation
    const aboutDescription = document.querySelector('.about-description');
    if (aboutDescription && aboutDescription.getAttribute('data-text')) {
        const originalText = aboutDescription.getAttribute('data-text');
        aboutDescription.textContent = '';

        let i = 0;
        const typeWriter = function() {
            if (i < originalText.length) {
                aboutDescription.textContent += originalText.charAt(i);
                i++;
                requestAnimationFrame(() => {
                    setTimeout(typeWriter, bioTypingSpeed);
                });
            }
        };

        // Start about bio typing after hero greeting completes (with delay)
        setTimeout(() => {
            requestAnimationFrame(typeWriter);
        }, bioDelay);
    }
}

// Counter Animation for Statistics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current) + (target > 100 ? '+' : '%');
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + (target > 100 ? '+' : '%');
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// Smooth Scrolling for Navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                updateActiveNavLink(link);
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                if (navLink) {
                    updateActiveNavLink(navLink);
                }
            }
        });
    });
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.service-item, .about-title, .about-description');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
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

// Skills Animation Enhancement
function initSkillsAnimation() {
    const skillsSection = document.querySelector('.skills');
    const skillItems = document.querySelectorAll('.skill-item');
    
    // Pause animation on hover
    skillsSection.addEventListener('mouseenter', () => {
        skillItems.forEach(item => {
            item.style.animationPlayState = 'paused';
        });
    });
    
    skillsSection.addEventListener('mouseleave', () => {
        skillItems.forEach(item => {
            item.style.animationPlayState = 'running';
        });
    });
}

// Initialize skills animation
document.addEventListener('DOMContentLoaded', function() {
    initSkillsAnimation();
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .skill-item {
        animation: scroll 30s linear infinite;
    }
    
    .skills:hover .skill-item {
        animation-play-state: paused;
    }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
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
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Scroll-based animations can be added here if needed
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
            <img src="${image.src}" alt="${image.alt}">
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

    config.references.list.forEach(reference => {
        const referenceCard = document.createElement('div');
        referenceCard.className = 'reference-card';

        referenceCard.innerHTML = `
            <div class="reference-image">
                <img src="${reference.image}" alt="${reference.name}" onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'">
            </div>
            <div class="reference-content">
                <h3 class="reference-name">${reference.name}</h3>
                <p class="reference-title">${reference.title}</p>
                <p class="reference-relationship">${reference.relationship}</p>
                <div class="reference-contact">
                    <div class="contact-info">📧 ${reference.email}</div>
                    <div class="contact-info">📱 ${reference.phone}</div>
                </div>
            </div>
        `;

        referencesGrid.appendChild(referenceCard);
    });
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
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="timeline-details">
                    <h3 class="timeline-title">${project.title}</h3>
                    <p class="timeline-description">${project.description}</p>
                    <div class="timeline-tech">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                    <div class="timeline-links">
                        <a href="${project.githubLink}" class="project-link" target="_blank">View Code</a>
                        <a href="${project.demoLink}" class="project-link" target="_blank">Watch Demo</a>
                    </div>
                </div>
            </div>
        `;

        timelineItems.appendChild(timelineItem);
    });

    // Initialize timeline functionality
    initTimelineGallery();
}

// Populate video links from configuration
function populateVideoLinks() {
    if (!config.videoLinks?.enabled) return;

    const videoLinksGrid = document.querySelector('.video-links-grid');
    if (!videoLinksGrid || !config.videoLinks?.videos) return;

    videoLinksGrid.innerHTML = '';

    config.videoLinks.videos.forEach((video, index) => {
        const videoCard = document.createElement('div');
        videoCard.className = 'video-link-card';

        const iframeId = `video-${index + 1}`;

        // Get thumbnail URL based on platform
        let thumbnailUrl = video.thumbnail || '';
        if (!thumbnailUrl && video.platform === 'youtube') {
            thumbnailUrl = `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;
        }

        videoCard.innerHTML = `
            <div class="video-container">
                <iframe
                    id="${iframeId}"
                    class="video-iframe"
                    src=""
                    title="${video.title}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen>
                </iframe>
                <div class="video-overlay">
                    <button class="video-play-btn" onclick="loadVideo('${video.platform}', '${video.videoId}', '${iframeId}')">
                        <span class="play-icon">▶</span>
                        <span class="platform-badge">${video.platform === 'youtube' ? 'YouTube' : 'TikTok'}</span>
                    </button>
                </div>
                ${thumbnailUrl ? `<img class="video-thumbnail" src="${thumbnailUrl}" alt="${video.title}" loading="lazy" onerror="this.style.display='none'">` : ''}
            </div>
            <div class="video-content">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
            </div>
        `;

        videoLinksGrid.appendChild(videoCard);
    });

    // Initialize video hover previews
    initVideoPreviews();
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
function initVideoPreviews() {
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
                if (typeof config !== 'undefined' && config.videoLinks?.videos?.[cardIndex]) {
                    openVideoModal(config.videoLinks.videos[cardIndex]);
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

// Clean, production-ready code - no testing exports needed
