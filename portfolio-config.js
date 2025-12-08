// =====================================================
// PORTFOLIO CONFIGURATION FILE
// =====================================================
// EDITABLE CONTENT FOR YOUR PORTFOLIO WEBSITE
// Simply modify the values below to customize your portfolio
// =====================================================

const portfolioConfig = {
    // Personal Information - EDITABLE
    personal: {
        name: "Lloyd Enterina Agonia",
        title: "Robotics & AI Engineer",
        pageTitle: "Lloyd Enterina Agonia - Portfolio",
        pageLogo: "/images/logo.jpg",
        greeting: "Hello.",
        profileImage: "/images/profile.jpg",
        resumeLink: "#",
        email: "agonia.lloyd8@gmail.com",
        bio: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering.",
        location: "Davao City, Philippines",
        heroTitlePrefix: "I'm"
    },

    // Navigation Menu - EDITABLE
    navigation: {
        logo: "❖",
        menuItems: [
            { name: "Home", link: "#home" },
            { name: "About Me", link: "#about" },
            { name: "Technical Skills", link: "#technical-skills" },
            { name: "Experiences", link: "#experience" },
            { name: "Gallery", link: "#projects" },
            { name: "References", link: "#references" },
            { name: "Contacts", link: "#contacts" }
        ]
    },

    // Technical Skills Section - EDITABLE
    technicalSkills: {
        enabled: true,
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

    // About Section - EDITABLE
    about: {
        title: "About me",
        description: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering. With a BS in Electro-Mechanical Technology, major in Robotics and Mechatronics, I bring a solid academic foundation to my hands-on expertise. Proficient in Python and C, I have worked on various robotics projects, integrating IoT and programming microcontrollers to create innovative solutions. I excel at diagnosing and resolving computer system issues while adapting to diverse environments. My expertise includes cloud computing (AWS), Kubernetes for managing containerized applications, and configuring MikroTik devices. Additionally, I specialize in building and maintaining network servers to ensure security, efficiency, and scalability.",

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
            { number: 16, suffix: "+", label: "Completed Projects" },
            { number: 95, suffix: "%", label: "Client satisfaction" },
            { number: 4, suffix: "+", label: "Years of experience" }
        ]
    },

    // Theme Configuration
    theme: {
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
            typingSpeed: 30,
            greetingTypingSpeed: 250,
            bioTypingSpeed: 10,
            counterDuration: 2000,
            scrollSpeed: "30s",
            parallaxEnabled: false,
            greetingTypingDelay: 500,
            bioTypingDelay: 1500,
            fadeInDelay: 100,
            scrollThrottle: 16
        }
    },

    // Projects Section - EDITABLE
    projects: {
        enabled: true,
        title: "Gallery",
        list: [
            {
                name: "VoIP PBX and Network Server Setup",
                description: "Comprehensive VoIP PBX and network infrastructure setup with security and monitoring.",
                image: "/images/ServerDeploy.png",
                link: "#",
                technologies: ["Windows Server", "Linux Server", "Cisco ASA", "Python", "Docker", "Kubernetes"],
                featured: true,
                date: "Project"
            },
            {
                name: "PLC Control System",
                description: "Industrial automation solution with PLC control for manufacturing optimization.",
                image: "/images/PLC-operate.png",
                link: "#",
                technologies: ["PLC", "SCADA", "Industrial IoT", "Python"],
                featured: false,
                date: "Project"
            },
            {
                name: "3D Printer Farming System",
                description: "Automated 3D printing farming system with monitoring and control.",
                image: "/images/repair3dPrinter.png",
                link: "#",
                technologies: ["Arduino", "Raspberry Pi", "3D Printing"],
                featured: false,
                date: "Project"
            },
            {
                name: "Teaching Robotics with VEX",
                description: "Robotics education platform with VEX Robotics integration.",
                image: "/images/teach-robotics.png",
                link: "#",
                technologies: ["VEX Robotics", "ROS", "Python", "C++"],
                featured: false,
                date: "Project"
            },
            {
                name: "Network Monitoring Systems",
                description: "Comprehensive network monitoring solutions for administrators.",
                image: "/images/network-monitoring.png",
                link: "#",
                technologies: ["Grafana", "Prometheus", "Python", "Docker"],
                featured: false,
                date: "Project"
            },
            {
                name: "R&D AI Algorithm",
                description: "Advanced AI algorithms for autonomous systems.",
                image: "/images/r&d-ai.png",
                link: "#",
                technologies: ["LLM", "Python", "C++", "Raspberry Pi", "ROS", "OpenCV", "TensorFlow"],
                featured: false,
                date: "Project"
            }
        ]
    },

    // Video Links Section - EDITABLE
    // Modal behavior controlled by isPortrait property:
    // true = Portrait modal (mobile/TikTok style), false = Landscape modal (desktop/YouTube style)
    videoLinks: {
        enabled: true,
        title: "Videos",

        videos: [
            // Landscape Videos (16:9 - Desktop/YouTube style)
            {
                platform: "youtube",
                title: "Hexapod Robot Build with Arduino",
                description: "Building and programming a hexapod robot using Arduino microcontroller with custom gait algorithms and sensor integration",
                videoId: "8PpI4K6It7U",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "Facial Recognition AI with Python",
                description: "Real-time facial recognition system using Python, OpenCV, and machine learning algorithms",
                videoId: "RSFlfT5mHoE",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "Human Detection AI using HOG Cascades",
                description: "Advanced human detection system using Histogram of Oriented Gradients (HOG) cascades",
                videoId: "aITQ3wRgmTE",
                isPortrait: false
            },

            // Portrait Videos (9:16 - Mobile/TikTok style)
            {
                platform: "tiktok",
                title: "Robotics R&D Project Demo",
                description: "Demonstrating advanced robotics research and development project",
                videoId: "7344258260507184389",
                isPortrait: true
            },
            {
                platform: "tiktok",
                title: "Dancing Servos using Arduino",
                description: "Creative servo motor choreography with Arduino control",
                videoId: "7312649776233729286",
                isPortrait: true
            },
            {
                platform: "tiktok",
                title: "Hexapod Robot Calibration",
                description: "Precise hexapod robot calibration process",
                videoId: "7193904203901734171",
                isPortrait: true
            }
        ]
    },

    // Character References Section - EDITABLE
    references: {
        enabled: true,
        title: "Character References",
        list: [
            {
                name: "Dr. Ruvel J. Cuasito Sr. PhD.",
                title: "USTP COT DEAN, CIT",
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
    experience: {
        enabled: true,
        title: "Experiences",
        positions: [
            {
                title: "Programmer Consultant",
                company: "Freelance",
                period: "06/2021 - 03/2024",
                description: "Developed facial detection algorithms and microcontroller integration for client applications."
            },
            {
                title: "Local Internet Service Provider",
                company: "Self-Employed",
                period: "04/2019 - 02/2023",
                description: "Built and managed network infrastructure and server hosting services during the COVID pandemic."
            },
            {
                title: "Network Specialist Consultant",
                company: "Contract-Based",
                period: "02/2023 - 06/2023",
                description: "Designed network topologies, firewall architecture, and optimized load balancing systems."
            }
        ]
    },

    // Contact Section - EDITABLE
    contacts: {
        enabled: true,
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

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioConfig;
}

// Make available globally
window.portfolioConfig = portfolioConfig;
