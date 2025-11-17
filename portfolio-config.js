// Portfolio Configuration File
// =====================================================
// EDITABLE PORTFOLIO CONFIGURATION
// =====================================================
// This file contains all the editable content for your portfolio website.
// Simply modify the values below to customize your portfolio:
//
// 1. NAVIGATION: Add/remove menu items in the navigation section
// 2. PERSONAL INFO: Update your name, title, bio, and contact details
// 3. SECTIONS: Each major section is clearly marked as "EDITABLE"
// 4. SKILLS: Add your technical skills and categorize them
// 5. PROJECTS: Showcase your work and achievements
// 6. EXPERIENCE: Add your professional background
// 7. REFERENCES: Include professional recommendations
// 8. CONTACT: Update your contact information and social links
//
// To disable any section, set "enabled: false"
// To modify content, edit the text, URLs, and other properties
// =====================================================

const portfolioConfig = {
    // Server Configuration
    server: {
        defaultPort: 6969,
        preferredServer: "node", // "node" or "python"
        autoOpenBrowser: true, // Automatically open browser when server starts
        cacheControl: "no-cache", // Cache control for development
        host: "localhost", // Server host (usually localhost)
        errorPages: {
            notFound: "/404.html",
            maintenance: "/maintenance.html"
        }
    },

    // Personal Information - EDITABLE
    personal: {
        name: "Lloyd Agonia",
        title: "Robotics & AI Engineer",
        pageTitle: "Lloyd Agonia - Portfolio", // Complete page title shown in browser tab
        pageLogo: "/images/logo.jpg", // Logo for the page - can be emoji or image path (e.g., "/images/logo.png")
        greeting: "Hello.", // This appears in the hero section with typing animation
        profileImage: "/images/profile.jpg",
        resumeLink: "#", // Add your resume link here
        email: "agonia.lloyd8@gmail.com",
        bio: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering.", // This appears in the about section with typing animation
        location: "Davao City, Philippines",
        heroTitlePrefix: "I'm" // The prefix text before the name in hero section (e.g., "I'm [Name]")
    },

    // Navigation Menu - EDITABLE SECTIONS
    // Add, remove, or modify menu items here. Each item needs a name and link.
    // The link should match the ID of the section in index.html (e.g., #home, #about)
    navigation: {
        logo: "❖",
        menuItems: [
            { name: "Home", link: "#home", enabled: true },
            { name: "About Me", link: "#about", enabled: true },
            { name: "Technical Skills", link: "#technical-skills", enabled: true },
            { name: "Experiences", link: "#experience", enabled: true },
            { name: "Gallery", link: "#projects", enabled: true },
            { name: "References", link: "#references", enabled: true },
            { name: "Contacts", link: "#contacts", enabled: true }
            // To disable a section, set enabled: false
            // To add a new section, add: { name: "Your Section", link: "#your-section-id", enabled: true }
        ]
    },

    // Hero Section Buttons (Disabled)
    heroButtons: {
        primary: {
            text: "Got a project?",
            link: "#",
            enabled: false
        },
        secondary: {
            text: "My resume",
            link: "#",
            enabled: false
        }
    },

    // Technical Skills Section - EDITABLE
    // Add, remove, or modify skill categories and skills here
    technicalSkills: {
        enabled: true, // Set to false to hide this section
        title: "Technical Skills",
        subtitle: "A comprehensive overview of my technical expertise across multiple domains.",
        categories: [
            {
                title: "Programming & Automation",
                icon: "👨‍💻",
                skills: [
                    "Python Programming",
                    "C Programming",
                    "Machine Learning & AI",
                    "Arduino Projects",
                    "Robotics & IoT Systems",
                    "Microcontrollers",
                    "3D Printing/3D Modeling/3D Simulation",
                    "Webserver Management"
                ]
            },
            {
                title: "Network & Cybersecurity",
                icon: "🔐",
                skills: [
                    "pfSense System",
                    "MikroTik Systems",
                    "Linux Systems",
                    "IT Network Topologies",
                    "Server Management",
                    "Proxmox Servers",
                    "DNS Resolver",
                    "ERP/ARP Systems"
                ]
            },
            {
                title: "Cloud & Server Infrastructure",
                icon: "☁️",
                skills: [
                    "Cloud Computing/Hosting",
                    "Server Design & Management",
                    "End Point Protection",
                    "Dockers/Kubernetes",
                    "Cybersecurity/Pentester",
                    "Smart NAS System",
                    "VoIP/PBX Phone Server",
                    "DNS Server Protection"
                ]
            },
            {
                title: "Hardware & Systems",
                icon: "🔧",
                skills: [
                    "CCTV Systems",
                    "AutoCAD/Webots/SketchUp",
                    "Server Management",
                    "Virtualization Servers",
                    "System Issue Resolution",
                    "Technical Support",
                    "Smart Storage Systems"
                ]
            }
        ]
    },

    // Skills Section (Legacy - keeping for backward compatibility)
    skills: {
        list: [
            "Robotics",
            "PLC",
            "Arduino",
            "Raspberry Pi",
            "Python",
            "C++",
            "Java",
            "MATLAB",
            "Simulink",
            "ROS",
            "Webots",
            "React",
            "Git",
            "Github",
            "AutoCadd",
            "Prometheus",
            "Grafana",
            "Webots",
            "ROS",
            "OpenCV",
            "TensorFlow",
            "PyTorch",
            "LLM",
        ],
        animationSpeed: "30s" // Animation duration for scrolling
    },

    // About Section - EDITABLE
    // Customize your professional description, services, and statistics here
    about: {
        title: "About me",
        description: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering. Proficient in Python and C, I have worked on various robotics projects, integrating IoT and programming microcontrollers to create innovative solutions. I excel at diagnosing and resolving computer system issues while adapting to diverse environments. My expertise includes cloud computing (AWS), Kubernetes for managing containerized applications, and configuring MikroTik devices. Additionally, I specialize in building and maintaining network servers to ensure security, efficiency, and scalability.",
        
        services: [
            {
                icon: "🤖",
                title: "Robotics Development",
                description: "Custom robotics projects built with Arduino and ROS"
            },
            {
                icon: "🔌",
                title: "PLC Development",
                description: "Custom PLC systems built with Simulink and Webots"
            },
            {
                icon: "🌐",
                title: "R&D Projects",
                description: "Custom R&D projects built with MATLAB, ROS, Autodesk Inventor, and SolidWorks"
            },
            {
                icon: "🧠",
                title: "Machine Learning",
                description: "Machine learning projects built with Python, TensorFlow, and PyTorch, raspberry pi, and Arduino"
            }
        ],

        statistics: [
            {
                number: 16,
                suffix: "+",
                label: "Completed Projects"
            },
            {
                number: 95,
                suffix: "%",
                label: "Client satisfaction"
            },
            {
                number: 4,
                suffix: "+",
                label: "Years of experience"
            }
        ]
    },

    // Theme Configuration
    theme: {
        // Available theme modes: dark, light, cyberpunk, techno
        mode: "dark",

        modes: {
            dark: {
                name: "Dark Mode",
                colors: {
                    background: "#1e1e2f",
                    cardBackground: "#2a2a3e",
                    primary: "#ffffff",
                    secondary: "#a0a0b8",
                    accent: "#ff6b61",
                    accentHover: "#ff5a4f",
                    border: "#3a3a4f",
                    gradient: "linear-gradient(135deg, #1e1e2f 0%, #252536 100%)"
                }
            },

            light: {
                name: "Light Mode",
                colors: {
                    background: "#ffffff",
                    cardBackground: "#f8f9fa",
                    primary: "#212529",
                    secondary: "#6c757d",
                    accent: "#007bff",
                    accentHover: "#0056b3",
                    border: "#dee2e6",
                    gradient: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
                }
            },

            cyberpunk: {
                name: "Cyberpunk Mode",
                colors: {
                    background: "#0a0a0a",
                    cardBackground: "#1a1a2e",
                    primary: "#00ffff",
                    secondary: "#ff00ff",
                    accent: "#ff006e",
                    accentHover: "#ff4081",
                    border: "#16213e",
                    gradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)"
                }
            },

            techno: {
                name: "Techno Mode",
                colors: {
                    background: "#0f1419",
                    cardBackground: "#1a2332",
                    primary: "#00ff88",
                    secondary: "#00b4d8",
                    accent: "#ff0080",
                    accentHover: "#ff1a90",
                    border: "#1e2d3d",
                    gradient: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)"
                }
            }
        },

        animations: {
            enabled: true,
            typingSpeed: 30, // default milliseconds per character for typing animations
            greetingTypingSpeed: 250, // milliseconds per character for greeting animation
            bioTypingSpeed: 10, // milliseconds per character for bio animation (slower)
            counterDuration: 2000, // milliseconds for counter animations
            scrollSpeed: "30s", // animation duration for scrolling skills
            parallaxEnabled: false, // set to true for parallax effect
            greetingTypingDelay: 500, // delay before greeting starts typing (ms)
            bioTypingDelay: 1500, // delay before bio starts typing (ms)
            fadeInDelay: 100, // delay between fade-in animations (ms)
            scrollThrottle: 16 // throttle scroll events (ms)
        },

        performance: {
            throttleScroll: 16, // milliseconds
            useHardwareAcceleration: true,
            reduceMotion: false // respect user's motion preferences
        }
    },

    // Projects Section - EDITABLE
    // Add, remove, or modify your project portfolio here
    projects: {
        enabled: true, // Set to false to hide this section
        title: "Gallery",
        list: [
            {
                name: "VoIP PBX and Network Server Setup(IT Topology and Infrastructure)",
                description: "A comprehensive guide to setting up a VoIP PBX and network server infrastructure, including hardware and software configurations, network protocols, and security measures.",
                image: "/images/ServerDeploy.png",
                link: "https://github.com/yourusername/ecommerce-platform",
                technologies: ["Windows Server", "Linux Server", "Cisco ASA", "Cisco IOS", "Python", "Ansible", "Docker", "Kubernetes"],
                featured: true,
                date: "Project"
            },
            {
                name: "PLC Control System",
                description: "A comprehensive industrial automation solution using programmable logic controllers for manufacturing process optimization. Features real-time monitoring, predictive maintenance, and automated quality control.",
                image: "/images/PLC-operate.png",
                link: "https://github.com/yourusername/plc-automation",
                technologies: ["PLC", "SCADA", "Industrial IoT", "Python"],
                featured: false,
                date: "Project"
            },
            {
                name: "3D Printer Farming System",
                description: "A fully automated 3D printer farming system using Arduino and Raspberry Pi. Features automated printing, monitoring, and control systems.",
                image: "/images/repair3dPrinter.png",
                link: "https://github.com/yourusername/3d-printer-farming-system",
                technologies: ["Arduino", "Raspberry Pi", "3D Printing", "CNC Milling", "Laser Cutting", "CNC Router"],
                featured: false,
                date: "Project"
            },
            {
                name: "Teaching Robotics with VEX Robotics",
                description: "Teaching robotics with VEX Robotics, a robotics education platform that provides interactive lessons and simulations for students.",
                image: "/images/teach-robotics.png",
                link: "https://github.com/yourusername/teaching-robotics",
                technologies: ["VEX Robotics", "ROS", "Python", "C++"],
                featured: false,
                date: "Project"
            },
            {
                name: "Design and build network monitoring systems",
                description: "Network monitoring systems for network administrators and IT professionals, including hardware and software design, network protocols, and security measures.",
                image: "/images/network-monitoring.png",
                link: "https://github.com/yourusername/network-monitoring",
                technologies: ["Grafana", "Prometheus", "InfluxDB", "Python", "Ansible", "Docker", "Kubernetes"],
                featured: false,
                date: "Project"
            },
            {
                name: "R&D AI Algorithm",
                description: "R&D AI Algorithm for autonomous vehicles, including hardware and software design, network protocols, and security measures.",
                image: "/images/r&d-ai.png",
                link: "https://github.com/yourusername/network-monitoring",
                technologies: ["LLM", "Python", "C++", "Raspberry Pi", "Arduino", "ROS", "OpenCV", "TensorFlow", "PyTorch"],
                featured: false,
                date: "Project"
            },
        ]
    },

    // Project Gallery Section
    projectGallery: {
        enabled: true,
        title: "Project Gallery",
        projects: [
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop",
                alt: "Autonomous Robot Navigation System",
                title: "Autonomous Robot Navigation System",
                description: "An advanced robotics project featuring autonomous navigation using computer vision and sensor fusion. The robot can detect obstacles, map its environment, and navigate complex spaces without human intervention.",
                technologies: ["ROS", "OpenCV", "Python", "Raspberry Pi"],
                githubLink: "https://github.com/djdark08/robot-navigation",
                demoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ"
            },
            {
                type: "video",
                src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                poster: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
                title: "PLC Industrial Automation System",
                description: "A comprehensive industrial automation solution using programmable logic controllers for manufacturing process optimization. Features real-time monitoring, predictive maintenance, and automated quality control.",
                technologies: ["PLC", "SCADA", "Industrial IoT", "Python"],
                githubLink: "https://github.com/djdark08/plc-automation",
                demoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ"
            },
            {
                type: "image",
                src: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&h=400&fit=crop",
                alt: "Custom PCB Design and Assembly",
                title: "Custom PCB Design and Assembly",
                description: "Professional PCB design and assembly project featuring multi-layer boards, surface mount technology, and comprehensive testing procedures. Designed for high-reliability applications.",
                technologies: ["Altium Designer", "SMT Assembly", "PCB Testing", "Electronics"],
                githubLink: "https://github.com/djdark08/pcb-design",
                demoLink: "https://youtube.com/watch?v=dQw4w9WgXcQ"
            }
        ]
    },

    // Video Links Section
    videoLinks: {
        enabled: true,
        title: "Videos",
        videos: [
            {
                platform: "youtube",
                title: "Hexapod Robot Build with Arduino",
                description: "Building and programming a hexapod robot using Arduino microcontroller with custom gait algorithms and sensor integration",
                videoId: "8PpI4K6It7U",
                thumbnail: "https://img.youtube.com/vi/8PpI4K6It7U/maxresdefault.jpg"
            },
            {
                platform: "youtube",
                title: "Facial Recognition AI with Python",
                description: "Real-time facial recognition system using Python, OpenCV, and machine learning algorithms for accurate face detection and identification",
                videoId: "RSFlfT5mHoE",
                thumbnail: "https://img.youtube.com/vi/RSFlfT5mHoE/maxresdefault.jpg"
            },
            {
                platform: "youtube",
                title: "Human Detection AI using HOG Cascades",
                description: "Advanced human detection system using Histogram of Oriented Gradients (HOG) cascades and computer vision techniques",
                videoId: "aITQ3wRgmTE",
                thumbnail: "https://img.youtube.com/vi/aITQ3wRgmTE/maxresdefault.jpg"
            },
            {
                platform: "tiktok",
                title: "Robotics R&D Project Demo",
                description: "Demonstrating advanced robotics research and development project with innovative automation solutions",
                videoId: "7344258260507184389",
                thumbnail: "https://www.tiktok.com/@grayagony/video/7344258260507184389?is_from_webapp=1&sender_device=pc&web_id=7555855229960013320"
            },
            {
                platform: "tiktok",
                title: "Dancing Servos using Arduino",
                description: "Creative servo motor choreography project demonstrating precise Arduino control and timing algorithms",
                videoId: "7312649776233729286",
                thumbnail: "https://www.tiktok.com/@grayagony/video/7312649776233729286?is_from_webapp=1&sender_device=pc&web_id=7555855229960013320"
            },
            {
                platform: "tiktok",
                title: "Hexapod Robot Calibration",
                description: "Precise hexapod robot calibration process using advanced kinematics and sensor integration techniques",
                videoId: "7193904203901734171",
                thumbnail: "https://www.tiktok.com/@grayagony/video/7193904203901734171?is_from_webapp=1&sender_device=pc&web_id=7555855229960013320"
            }
        ]
    },

    // Character References Section - EDITABLE
    // Add, remove, or modify your professional references here
    references: {
        enabled: true, // Set to false to hide this section
        title: "Character References",
        list: [
            {
                name: "Dr. Ruvel J. Cuasito Sr.  PhD.",
                title: "USTP COT DEAN, CIT ",
                relationship: "Dean & Research Advisor",
                email: "ruvel.cuasito@university.edu",
                phone: "09171307793",
                image: "/images/docruvel.png"
            },
            {
                name: "Ms. Taurine C. Auxilio",
                title: "USTP Chairperson, MIT",
                relationship: "Industry Mentor",
                email: "neveltaurine.cuasito@ustp.edu.ph",
                phone: "09778038587",
                image: "/images/mamtau.png"
            },
            {
                name: "Engr. Helen Grace Gonzales",
                title: "USTP Chairperson, ROBOTICS",
                relationship: "Academic Supervisor",
                email: "helen.grace@university.edu",
                phone: "09674297770",
                image: "/images/hg.png"
            },
            {
                name: "Engr. Raymond S. Saldua",
                title: "USTP Instructor, Industrial Automation",
                relationship: "Academic Instructor",
                email: "raymond.saldua@university.edu",
                phone: "09757097300",
                image: "/images/saldua.png"
            }
        ]
    },

    // Experience Section - EDITABLE
    // Add, remove, or modify your professional experience positions here
    experience: {
        enabled: true, // Set to false to hide this section
        title: "Experiences",
        positions: [
            {
                title: "Programmer Consultant",
                company: "Freelance",
                period: "06/2021 - 03/2024",
                description: "In my role as a Programmer Consultant, I developed a facial detection algorithm utilizing Haar cascade techniques in Python. I tailored a unique cascade algorithm to meet specific client requirements, ensuring optimal performance for their application. Additionally, I created a program that was successfully integrated into a microcontroller, enhancing its functionality and enabling efficient real-time processing of facial recognition tasks. This experience allowed me to refine my skills in algorithm development and embedded systems, contributing to innovative solutions for my clients."
            },
            {
                title: "Local Internet Service Provider",
                company: "Self-Employed",
                period: "04/2019 - 02/2023",
                description: "During the COVID pandemic, I launched a small business as a Local Internet Service Provider, which provided me with invaluable exposure to networking and cybersecurity. In this role, I designed my own network topology and constructed a server to host various services, enabling me to offer reliable internet access to my clients. This hands-on experience was crucial in developing my technical skills and understanding of networking principles. The challenges I encountered while managing the business laid a strong foundation for my expertise in the field, allowing me to cultivate a deep understanding of network infrastructure and security protocols."
            },
            {
                title: "Network Specialist Consultant",
                company: "Contract-Based",
                period: "02/2023 - 06/2023",
                description: "As a contract-based Network Specialist Consultant, I provided comprehensive networking solutions for my client. I was responsible for designing their network topology and firewall architecture, ensuring robust security measures and optimal performance. My work involved assessing their existing infrastructure and implementing a tailored solution that addressed their specific needs. Additionally, I optimized their load balancing systems to enhance traffic management, ensuring efficient resource allocation and minimizing latency. This role allowed me to leverage my expertise in network design and security, contributing to a more resilient and efficient network environment for my client."
            }
        ]
    },

    // Contact Section - EDITABLE
    // Update your contact information and social media links here
    contacts: {
        enabled: true, // Set to false to hide this section
        title: "Contact Information",
        email: "agonia.lloyd8@gmail.com",
        phone: "+63-9606250319",
        location: "Davao City, Philippines",
        social: {
            github: "https://github.com/djdark08",
            linkedin: "https://www.linkedin.com/in/lloyd-agonia-573300308/",
            facebook: "https://www.facebook.com/agonialloyd/"
        }
    }
};

// Function to update the portfolio with new config
function updatePortfolio() {
    // This function can be called to refresh the portfolio with new settings
    console.log("Portfolio configuration loaded:", portfolioConfig);
    return portfolioConfig;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioConfig;
}

// Make available globally
window.portfolioConfig = portfolioConfig;
