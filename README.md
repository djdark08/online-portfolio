# Lloyd Agonia - Robotics Engineer Portfolio

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Tech](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-orange)
![Version](https://img.shields.io/badge/Version-2.0-purple)

A cutting-edge, fully responsive portfolio website showcasing expertise in robotics, automation, and technology. Built with modern web technologies featuring multiple themes, advanced animations, and comprehensive project showcases.

🌐 **Live Site**: [lloydagonia.is-a.dev](https://lloydagonia.is-a.dev)

## ✨ Features

### 🎨 Multiple Themes
- **Dark Mode** - Professional dark theme with coral accents (default)
- **Light Mode** - Clean light theme for accessibility
- **Cyberpunk Mode** - Neon aesthetic with animated effects
- **Techno Mode** - Futuristic green/blue theme

### 📱 Advanced Responsive Design
- Auto-responsive columns adapting to any screen size
- Mobile-first approach with touch-friendly interfaces
- Perfect text wrapping ensuring all content fits properly
- Cross-device compatibility from mobile to ultra-wide monitors

### 🧭 Enhanced Navigation
- Logo click-to-scroll to top
- Stable navbar that never disappears in any theme
- Smooth scrolling between sections
- Mobile hamburger menu with smooth animations

### 💼 Technical Skills Showcase
- **4 comprehensive categories**: Programming, Network/Security, Cloud/Infrastructure, Hardware/Systems
- **31+ technical skills** with perfect text fitting
- Interactive hover effects with electric animations
- Auto-adjusting columns based on screen size

### 🎥 Rich Media Sections
- Video demonstrations with YouTube integration
- Project gallery with timeline view
- Character references with contact information
- Interactive project cards with hover effects

## 🚀 Quick Start

### Option 1: Open Directly (Easiest)
```bash
# Simply open index.html in any modern browser
open index.html
```

### Option 2: Development Server (Recommended)

**Node.js Server:**
```bash
node server.js              # Default port 3000
node server.js 8080         # Custom port
```

**Python Server:**
```bash
python server.py            # Default port 3000
python server.py 8080       # Custom port
```

**Then open:** `http://localhost:3000`

### Option 3: Other Local Servers
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

## 📁 Project Structure

```
online-portfolio-main/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and animations
├── script.js               # JavaScript functionality
├── portfolio-config.js     # Configuration file (edit this!)
├── server.js               # Node.js development server
├── server.py               # Python development server
├── themes/                 # Theme-specific CSS files
│   ├── dark-theme.css
│   ├── light-theme.css
│   ├── cyberpunk-theme.css
│   └── techno-theme.css
├── images/                 # Profile and project images
├── update.py               # Git push automation
├── sync.py                 # Git pull automation
├── debug_git.py            # Git debugging utility
├── CNAME                   # Custom domain config
└── README.md               # This file
```

## ⚙️ Customization

### Using Configuration File

Edit `portfolio-config.js` to customize all aspects:

```javascript
const portfolioConfig = {
    personal: {
        name: "Your Name",
        title: "Your Title",
        email: "your@email.com",
        greeting: "Hello.",
        profileImage: "/images/profile.jpg"
    },
    
    navigation: {
        menuItems: [
            { name: "Home", link: "#home" },
            { name: "About", link: "#about" }
        ]
    },
    
    technicalSkills: {
        categories: [
            {
                title: "Programming",
                skills: ["Python", "JavaScript", "C++"]
            }
        ]
    }
};
```

### Available Configuration Sections

- **personal** - Name, title, contact info, bio
- **navigation** - Menu items and logo
- **technicalSkills** - Skills categories and items
- **about** - About section content and statistics
- **projects** - Project gallery items
- **videoLinks** - YouTube/TikTok videos
- **references** - Character references
- **experience** - Work experience
- **contacts** - Contact information
- **theme** - Colors, animations, settings

## 🎬 Animation Features

### Performance Optimizations
- ✅ Hardware acceleration (transform & opacity)
- ✅ Throttled scroll events
- ✅ Intersection Observer for efficient loading
- ✅ Reduced motion support
- ✅ Will-change properties for optimization

### Available Animations
- Typing animation for greeting text
- Counter animation for statistics
- Scroll-triggered fade-in effects
- Hover effects on buttons and cards
- Subtle background animations

### Disable Animations
```javascript
theme: {
    animations: {
        enabled: false
    }
}
```

## 🌐 Deployment

### GitHub Pages
1. Push to GitHub repository
2. Enable GitHub Pages in Settings → Pages
3. Select branch (main/master) and `/root` folder
4. Site will be available at `https://username.github.io/repo-name`

### Custom Domain
1. Add `CNAME` file with your domain (already configured for lloydagonia.is-a.dev)
2. Configure DNS records with your provider
3. Wait for propagation (up to 24 hours)

### Netlify / Vercel
1. Drag and drop the entire folder
2. Or connect your GitHub repository
3. Automatic deployments on push

### Static Hosting
The site is fully static - upload all files to any web host:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Firebase Hosting
- GitLab Pages

## 🔧 Development

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add corresponding styles to `styles.css`
3. Add configuration to `portfolio-config.js`
4. Update JavaScript if interactive features needed

### Customizing Colors
Edit CSS custom properties in `styles.css`:
```css
:root {
    --bg-color: #1e1e2f;
    --accent-color: #ff6b61;
    --text-primary: #ffffff;
}
```

## 🔄 Git Automation Scripts

This project includes Python scripts for easy GitHub synchronization.

### `update.py` - Push to GitHub
```bash
python update.py  # Pushes local changes to GitHub
```
- Checks for uncommitted changes
- Stages all files
- Commits with timestamp
- Pushes to remote

### `sync.py` - Pull from GitHub
```bash
python sync.py  # Pulls latest changes from GitHub
```
- Fetches latest changes
- Handles local changes safely (stashing)
- Pulls with rebase
- Restores stashed changes

**See [git-scripts-README.md](git-scripts-README.md) for detailed documentation.**

## 📊 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

**Requirements:**
- CSS Grid & Flexbox
- ES6+ JavaScript
- Intersection Observer (or polyfill)

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🐛 Troubleshooting

**Error: `ReferenceError: document is not defined`**
- Don't run `node script.js` - open `index.html` in browser instead

**Styles not loading**
- Ensure all files are in the same directory
- Check browser console for errors
- Verify `portfolio-config.js` is properly formatted

**Animations not working**
- Check browser compatibility
- Ensure JavaScript is enabled
- Verify animations are enabled in config

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with vanilla HTML, CSS, and JavaScript
- Icons and assets from various sources
- Inspired by modern portfolio design trends

## 📞 Support

If you encounter issues:
1. Check that you're opening `index.html` in a browser
2. Ensure all files are in the same directory
3. Check browser console for errors
4. Verify `portfolio-config.js` is valid JavaScript

## 📌 Version History

### Version 2.0
- ✅ Auto-responsive technical skills columns
- ✅ Logo click-to-scroll functionality
- ✅ Enhanced navbar stability across all themes
- ✅ Perfect text wrapping
- ✅ Advanced theme system
- ✅ Performance improvements

---

**Note**: This portfolio website is designed to be a starting point. Customize it extensively to match your personal brand!

Made with ❤️ by Lloyd Agonia
