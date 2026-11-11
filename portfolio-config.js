// =====================================================
// PORTFOLIO CONFIGURATION FILE
// =====================================================
// EDITABLE CONTENT FOR YOUR PORTFOLIO WEBSITE
// Simply modify the values below to customize your portfolio
// =====================================================

const portfolioConfig = {
    optimization: {
        imageLazyLoading: true,
        preconnectFonts: true,
        preconnectCDN: true,
        hardwareAcceleration: true,
        animationThrottle: 16,
        debounceResize: 250
    },
    // Personal Information - EDITABLE
    personal: {
        name: "Lloyd Enterina Agonia",
        title: "Robotics & AI Engineer",
        pageTitle: "Lloyd Enterina Agonia - Portfolio",
        pageLogo: "/images/logo.jpg",
        greeting: "Hello.",
        profileImage: "/images/profile_optimized.jpg",
        resumeLink: "https://github.com/djdark08",
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
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Code on a monitor",
                icon: "👨‍💻",
                type: "electric",
                hp: 150,
                rarity: "★ Rare Holo",
                weakness: "Deadlines",
                resistance: "Bugs",
                retreat: 2,
                set: "Automation Set",
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
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Cybersecurity padlock over code",
                icon: "🔐",
                type: "psychic",
                hp: 160,
                rarity: "★ Ultra Rare",
                weakness: "Downtime",
                resistance: "Firewalls",
                retreat: 3,
                set: "Security Set",
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
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Server room racks",
                icon: "☁️",
                type: "water",
                hp: 140,
                rarity: "★ Rare Holo",
                weakness: "Outages",
                resistance: "Redundancy",
                retreat: 3,
                set: "Cloud Set",
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
                image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Circuit board close-up",
                icon: "🔧",
                type: "steel",
                hp: 180,
                rarity: "★ Secret Rare",
                weakness: "Heat",
                resistance: "Maintenance",
                retreat: 1,
                set: "Hardware Set",
                skills: [
                    "CCTV Systems",
                    "AutoCAD/Webots/SketchUp",
                    "Server Management",
                    "Virtualization Servers",
                    "System Issue Resolution",
                    "Technical Support",
                    "Smart Storage Systems"
                ]
            },
            {
                title: "Industrial Infrastructure",
                icon: "\u{1F3ED}",
                type: "steel",
                hp: 170,
                rarity: "\u2605 Ultra Rare",
                set: "Industrial Set",
                image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Industrial plant piping and control systems",
                skills: [
                    "Electrical Maintenance & Installation",
                    "PLC / SCADA Networking",
                    "Electronic Repair",
                    "Robotics Projects"
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
            scrollThrottle: 16,
            particleSwarm: {
                enabled: true,
                defaultOn: true,
                count: 72,
                speed: 0.6,
                size: 1.8,
                linkDistance: 130,
                pointerRadius: 150
            }
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
                link: "#projects",
                technologies: ["Windows Server", "Linux Server", "Cisco ASA", "Python", "Docker", "Kubernetes"],
                featured: true,
                date: "Project"
            },
            {
                name: "PLC Control System",
                description: "Industrial automation solution with PLC control for manufacturing optimization.",
                image: "/images/PLC-operate.png",
                link: "#projects",
                technologies: ["PLC", "SCADA", "Industrial IoT", "Python"],
                featured: false,
                date: "Project"
            },
            {
                name: "3D Printer Farming System",
                description: "Automated 3D printing farming system with monitoring and control.",
                image: "/images/repair3dPrinter.png",
                link: "#projects",
                technologies: ["Arduino", "Raspberry Pi", "3D Printing"],
                featured: false,
                date: "Project"
            },
            {
                name: "Teaching Robotics with VEX",
                description: "Robotics education platform with VEX Robotics integration.",
                image: "/images/teach-robotics.png",
                link: "#projects",
                technologies: ["VEX Robotics", "ROS", "Python", "C++"],
                featured: false,
                date: "Project"
            },
            {
                name: "Network Monitoring Systems",
                description: "Comprehensive network monitoring solutions for administrators.",
                image: "/images/network-monitoring.png",
                link: "#projects",
                technologies: ["Grafana", "Prometheus", "Python", "Docker"],
                featured: false,
                date: "Project"
            },
            {
                name: "R&D AI Algorithm",
                description: "Advanced AI algorithms for autonomous systems.",
                image: "/images/r&d-ai.png",
                link: "#projects",
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
                title: "Data Entry System",
                description: "Full-stack web application with Python backend, HTML/CSS/JS frontend. Streamlines data management with secure, user-friendly interface.",
                videoId: "1GtONU2KWS0",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "3D Printer Assembly",
                description: "Complete end-to-end 3D printer build from scratch. Mechanical assembly, electronics integration, and software calibration tutorial.",
                videoId: "8lbMTotptBU",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "Hexapod Robot Build with Arduino",
                description: "Six-legged autonomous robot construction. Arduino microcontroller integration with custom gait algorithms and sensor feedback.",
                videoId: "8PpI4K6It7U",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "Facial Recognition AI with Python",
                description: "Computer vision project using OpenCV and Python. Real-time facial detection and recognition system with machine learning.",
                videoId: "RSFlfT5mHoE",
                isPortrait: false
            },
            {
                platform: "youtube",
                title: "Human Detection AI using HOG Cascades",
                description: "Advanced computer vision algorithm for pedestrian detection using Histogram of Oriented Gradients and cascade classifiers.",
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
                type: "fire",
                icon: "💻",
                hp: 130,
                image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Source code filling a dark monitor",
                weakness: "Legacy systems",
                resistance: "Scope creep",
                retreat: 1,
                description: "In my role as a Programmer Consultant, I developed a facial detection algorithm utilizing Haar cascade techniques in Python. I tailored a unique cascade algorithm to meet specific client requirements, ensuring optimal performance for their application. Additionally, I created a program that was successfully integrated into a microcontroller, enhancing its functionality and enabling efficient real-time processing of facial recognition tasks. This experience allowed me to refine my skills in algorithm development and embedded systems, contributing to innovative solutions for my clients."
            },
            {
                title: "Local Internet Service Provider",
                company: "Self-Employed",
                period: "04/2019 - 02/2023",
                type: "water",
                icon: "📡",
                hp: 140,
                image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Rows of servers and network cabling in a data room",
                weakness: "Outages",
                resistance: "Bad weather",
                retreat: 3,
                description: "During the COVID pandemic, I launched a small business as a Local Internet Service Provider, which provided me with invaluable exposure to networking and cybersecurity. In this role, I designed my own network topology and constructed a server to host various services, enabling me to offer reliable internet access to my clients. This hands-on experience was crucial in developing my technical skills and understanding of networking principles. The challenges I encountered while managing the business laid a strong foundation for my expertise in the field, allowing me to cultivate a deep understanding of network infrastructure and security protocols."
            },
            {
                title: "Network Specialist Consultant",
                company: "Contract-Based",
                period: "02/2023 - 06/2023",
                type: "psychic",
                icon: "🔐",
                hp: 125,
                image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Network security analyst monitoring systems",
                weakness: "Downtime",
                resistance: "Firewalls",
                retreat: 2,
                description: "As a contract-based Network Specialist Consultant, I provided comprehensive networking solutions for my client. I was responsible for designing their network topology and firewall architecture, ensuring robust security measures and optimal performance. My work involved assessing their existing infrastructure and implementing a tailored solution that addressed their specific needs. Additionally, I optimized their load balancing systems to enhance traffic management, ensuring efficient resource allocation and minimizing latency. This role allowed me to leverage my expertise in network design and security, contributing to a more resilient and efficient network environment for my client."
            },
            {
                title: "IT Support",
                company: "Side Job",
                period: "2016 - Present",
                type: "steel",
                icon: "\u{1F5A5}\uFE0F",
                image: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Technician servicing a desktop workstation",
                description: "A side job I have kept for 10 years, since I was 16. My main role is making sure company equipment is well maintained and up to standards \u2014 diagnosing hardware faults, servicing workstations and peripherals, and keeping every machine on site reliable and ready for use."
            },
            {
                title: "Plant Operator",
                company: "Plant Operations",
                period: "03/2023 - 03/2024",
                type: "grass",
                icon: "\u2699\uFE0F",
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=60",
                imageAlt: "Industrial plant machinery and piping",
                description: "A one-year role from March 2023 to 2024, running day-to-day plant operations. I monitored equipment, carried out routine checks and maintenance, and kept production running safely within standard operating limits."
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
