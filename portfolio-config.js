// Portfolio Configuration File
// Edit this file to customize all aspects of your portfolio

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

    // Personal Information
    personal: {
        name: "Lloyd Agonia",
        title: "Robotics Engineer",
        greeting: "Hello.",
        profileImage: "/images/profile.jpg",
        resumeLink: "#", // Add your resume link here
        email: "agonia.lloyd8@gmail.com",
        bio: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering. Proficient in Python and C, I have worked on various robotics projects, integrating IoT and programming microcontrollers to create innovative solutions. I excel at diagnosing and resolving computer system issues while adapting to diverse environments. My expertise includes cloud computing (AWS), Kubernetes for managing containerized applications, and configuring MikroTik devices. Additionally, I specialize in building and maintaining network servers to ensure security, efficiency, and scalability. I am passionate about leveraging technology to solve real-world problems and continuously expanding my knowledge in emerging technologies.",
        location: "Davao City, Philippines"
    },

    // Navigation Menu
    navigation: {
        logo: "❖",
        menuItems: [
            { name: "Home", link: "#home" },
            { name: "Technical Skills", link: "#technical-skills" },
            { name: "Gallery", link: "#projects" },
            { name: "About", link: "#about" },
            { name: "Contacts", link: "#contacts" }
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

    // Technical Skills Section
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

    // About Section
    about: {
        title: "About me",
        description: "I am a versatile tech professional with a strong background in software development, robotics, and network engineering.",
        
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
            typingSpeed: 100, // milliseconds per character
            counterDuration: 2000, // milliseconds
            scrollSpeed: "30s", // for skills animation
            parallaxEnabled: false // set to true for parallax effect
        },

        performance: {
            throttleScroll: 16, // milliseconds
            useHardwareAcceleration: true,
            reduceMotion: false // respect user's motion preferences
        }
    },

    // Projects Section
    projects: {
        enabled: true,
        title: "Gallery",
        list: [
            {
                name: "VoIP PBX and Network Server Setup(IT Topology and Infrastructure)",
                description: "A comprehensive guide to setting up a VoIP PBX and network server infrastructure, including hardware and software configurations, network protocols, and security measures.",
                image: "/images/ServerDeploy.png",
                link: "https://github.com/yourusername/ecommerce-platform",
                technologies: ["Windows Server", "Linux Server", "Cisco ASA", "Cisco IOS", "Python", "Ansible", "Docker", "Kubernetes"],
                featured: true,
                date: ""
            },
            {
                name: "PLC Control System",
                description: "A comprehensive industrial automation solution using programmable logic controllers for manufacturing process optimization. Features real-time monitoring, predictive maintenance, and automated quality control.",
                image: "/images/PLC-operate.png",
                link: "https://github.com/yourusername/plc-automation",
                technologies: ["PLC", "SCADA", "Industrial IoT", "Python"],
                featured: false,
                date: ""
            },
            {
                name: "3D Printer Farming System",
                description: "A fully automated 3D printer farming system using Arduino and Raspberry Pi. Features automated printing, monitoring, and control systems.",
                image: "/images/repair3dPrinter.png",
                link: "https://github.com/yourusername/3d-printer-farming-system",
                technologies: ["Arduino", "Raspberry Pi", "3D Printing", "CNC Milling", "Laser Cutting", "CNC Router"],
                featured: false,
                date: ""
            },
            {
                name: "Teaching Robotics with VEX Robotics",
                description: "Teaching robotics with VEX Robotics, a robotics education platform that provides interactive lessons and simulations for students.",
                image: "/images/teach-robotics.png",
                link: "https://github.com/yourusername/teaching-robotics",
                technologies: ["VEX Robotics", "ROS", "Python", "C++"],
                featured: false,
                date: ""
            },
            {
                name: "Design and build network monitoring systems",
                description: "Network monitoring systems for network administrators and IT professionals, including hardware and software design, network protocols, and security measures.",
                image: "/images/network-monitoring.png",
                link: "https://github.com/yourusername/network-monitoring",
                technologies: ["Grafana", "Prometheus", "InfluxDB", "Python", "Ansible", "Docker", "Kubernetes"],
                featured: false,
                date: "2023-09-15"
            },
            {
                name: "R&D AI Algorithm",
                description: "R&D AI Algorithm for autonomous vehicles, including hardware and software design, network protocols, and security measures.",
                image: "/images/r&d-ai.png",
                link: "https://github.com/yourusername/network-monitoring",
                technologies: ["LLM", "Python", "C++", "Raspberry Pi", "Arduino", "ROS", "OpenCV", "TensorFlow", "PyTorch"],
                featured: false,
                date: "2023-09-15"
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
        title: "Video Demonstrations",
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
            }
        ]
    },

    // Character References Section
    references: {
        enabled: true,
        title: "Character References",
        list: [
            {
                name: "Dr. Ruvel Cuasito",
                title: "PhD in Computer Engineering",
                relationship: "Professor & Research Advisor",
                email: "ruvel.cuasito@university.edu",
                phone: "+63-917-123-4567",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
            },
            {
                name: "Engr. Taurine Auxilio",
                title: "Masters in Information Technology",
                relationship: "Industry Mentor",
                email: "maria.santos@company.com",
                phone: "+63-918-765-4321",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face"
            },
            {
                name: "Prof. Helen Grace",
                title: "Masters in Robotics Engineering",
                relationship: "Academic Supervisor",
                email: "jose.cruz@university.edu",
                phone: "+63-919-987-6543",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
            }
        ]
    },

    // Contact Section (Simplified)
    contacts: {
        enabled: true,
        title: "Contact Information",
        email: "agonia.lloyd8@gmail.com",
        phone: "+63-9606250319",
        location: "Davao City, Philippines",
        social: {
            github: "https://github.com/djdark08",
            linkedin: "https://linkedin.com/in/lloydagonia",
            facebook: "https://facebook.com/lloydagonia"
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
