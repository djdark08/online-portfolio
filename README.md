# 🚀 Lloyd Agonia - Robotics Engineer Portfolio

A cutting-edge, fully responsive portfolio website showcasing expertise in robotics, automation, and technology. Built with modern web technologies featuring multiple themes, advanced animations, and comprehensive project showcases.

## ✨ Key Features

### 🎨 **Multiple Themes**
- **Dark Mode**: Professional dark theme with coral accents
- **Light Mode**: Clean light theme for accessibility
- **Cyberpunk Mode**: Neon aesthetic with animated effects
- **Techno Mode**: Futuristic green/blue theme

### 📱 **Advanced Responsive Design**
- **Auto-responsive columns** that adapt to any screen size
- **Mobile-first approach** with touch-friendly interfaces
- **Perfect text wrapping** ensuring all content fits properly
- **Cross-device compatibility** from mobile to ultra-wide monitors

### ⚡ **Enhanced Navigation**
- **Logo click-to-scroll** - Click logo to smoothly scroll to top
- **Stable navbar** that never disappears in any theme
- **Smooth scrolling** between sections
- **Mobile hamburger menu** with smooth animations

### 🛠️ **Technical Skills Showcase**
- **Auto-adjusting columns** based on screen size and content
- **4 comprehensive categories**: Programming, Network/Security, Cloud/Infrastructure, Hardware/Systems
- **31+ technical skills** with perfect text fitting
- **Interactive hover effects** with electric animations

### 📹 **Rich Media Sections**
- **Video demonstrations** with YouTube integration
- **Project gallery** with timeline view
- **Character references** with contact information
- **Interactive project cards** with hover effects

## 📁 File Structure

```
portfolio-website/
├── index.html              # Main HTML file
├── styles.css              # CSS styles and animations
├── script.js               # JavaScript functionality
├── portfolio-config.js     # Configuration file for easy customization
├── server.js               # Node.js development server (recommended)
├── server.py               # Python development server (alternative)
├── themes/                 # Theme-specific CSS files
│   ├── dark-theme.css      # Dark theme styles
│   ├── light-theme.css     # Light theme styles
│   ├── cyberpunk-theme.css # Cyberpunk theme styles
│   └── techno-theme.css    # Techno theme styles
├── images/                 # Profile and project images
└── README.md              # This file
```

## 🛠️ Setup & Usage

### Option 1: Open Directly in Browser
1. Simply open `index.html` in any modern web browser
2. The website will load with all animations and interactions

### Option 2: Custom Server (Recommended)
Use the included server files for the best development experience:

#### Node.js Server (server.js)
```bash
# Basic usage (default port 3000)
node server.js

# Custom port
node server.js 8080

# Examples:
node server.js 3000    # Run on port 3000
node server.js 8080    # Run on port 8080
node server.js 9000    # Run on port 9000
```

#### Python Server (server.py)
```bash
# Basic usage (default port 3000)
python server.py

# Custom port
python server.py 8080

# Examples:
python server.py 3000    # Run on port 3000
python server.py 8080    # Run on port 8080
python server.py 9000    # Run on port 9000
```

### Option 3: Other Local Servers
For development with live reload, you can use any local server:

```bash
# Using Python (if installed)
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP (if installed)
php -S localhost:8000
```

Then open `http://localhost:PORT` in your browser (replace PORT with your chosen port number).

## ⚠️ Node.js Error Fix

**Error**: `ReferenceError: document is not defined` when running `node script.js`

**Solution**: The JavaScript file is designed to run in a browser environment, not Node.js. To fix this:

1. **Don't run `node script.js`** - this will cause errors because `document` is a browser API
2. **Open `index.html` in a browser** instead - this is the correct way to view the website
3. The script will load and execute properly in the browser environment

## 🎨 Customization

### Using the Configuration File

Edit `portfolio-config.js` to customize all aspects of your portfolio:

```javascript
const portfolioConfig = {
    // Personal Information
    personal: {
        name: "Your Name",
        title: "Your Title",
        greeting: "Hello.",
        profileImage: "path/to/your/image.jpg",
        resumeLink: "https://your-resume-link.com"
    },

    // Theme Colors
    theme: {
        colors: {
            background: "#1e1e2f",
            accent: "#ff6b61",
            primary: "#ffffff"
            // ... more colors
        }
    },

    // Skills List
    skills: {
        list: ["HTML5", "CSS", "JavaScript", "React", "Node.js"]
    },

    // About Section Content
    about: {
        title: "About me",
        description: "Your description here...",
        statistics: [
            { number: 100, suffix: "+", label: "Projects Completed" }
        ]
    }
};
```

### Direct HTML Editing

You can also directly edit `index.html` for structural changes, but using the config file is recommended for content updates.

## 🎭 Animation Features

### Performance Optimizations
- **Hardware Acceleration**: Uses `transform` and `opacity` for smooth animations
- **Throttled Scroll Events**: Prevents performance issues during scrolling
- **Intersection Observer**: Efficient scroll-triggered animations
- **Reduced Motion Support**: Respects user's motion preferences
- **Will-Change Properties**: Optimizes browser rendering

### Available Animations
- **Typing Animation**: Animated greeting text
- **Counter Animation**: Statistics count up when scrolled into view
- **Scroll Animations**: Elements fade in as they enter the viewport
- **Hover Effects**: Interactive button and element animations
- **Background Animations**: Subtle rotating effects behind profile image

### Disabling Animations
To disable animations for better performance or accessibility:

1. **Via Configuration**:
   ```javascript
   theme: {
       animations: {
           enabled: false
       }
   }
   ```

2. **System Preference**: The site automatically respects `prefers-reduced-motion: reduce`

## 📱 Responsive Breakpoints

- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🔧 Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **CSS Grid & Flexbox**: Required for layout
- **ES6+ JavaScript**: Required for functionality
- **Intersection Observer**: Required for scroll animations (polyfill available if needed)

## 🚀 Performance Tips

1. **Enable Hardware Acceleration**: Animations use transform and opacity
2. **Throttle Scroll Events**: Prevents excessive function calls
3. **Lazy Load Animations**: Elements animate only when visible
4. **Optimize Images**: Use appropriate sizes for profile image
5. **Minify Assets**: For production, consider minifying CSS and JS

## 🛠️ Development

### Adding New Sections

1. Add HTML structure to `index.html`
2. Add corresponding styles to `styles.css`
3. Add any necessary configuration to `portfolio-config.js`
4. Update JavaScript if interactive features are needed

### Customizing Colors

Edit the CSS custom properties in `styles.css`:
```css
:root {
    --bg-color: #1e1e2f;
    --accent-color: #ff6b61;
    --text-primary: #ffffff;
    /* ... more variables */
}
```

Or use the configuration file for dynamic color changes.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 🎯 Featured Sections

### 🛠️ **Technical Skills Section**
The portfolio includes a comprehensive technical skills showcase with:
- **4 Skill Categories**: Programming & Automation, Network & Cybersecurity, Cloud & Server Infrastructure, Hardware & Systems
- **31+ Technical Skills**: Including Python, C Programming, Machine Learning, AWS, Docker, Kubernetes, and more
- **Auto-responsive Grid**: Automatically adjusts from 1-4 columns based on screen size
- **Perfect Text Fitting**: All skill names wrap properly without overlapping
- **Interactive Animations**: Electric hover effects and smooth transitions

### 🎨 **Theme System**
Four distinct themes with unique characteristics:

#### **Dark Theme** (Default)
- Professional dark background (#1e1e2f)
- Coral accent colors (#ff6b61)
- Perfect for showcasing technical work

#### **Light Theme**
- Clean white background
- Blue accent colors for accessibility
- Great for daytime viewing

#### **Cyberpunk Theme**
- Dark background with neon accents
- Animated navbar with scanning effects
- Electric hover animations
- **Fixed navbar** that never disappears on scroll

#### **Techno Theme**
- Futuristic green/blue color scheme
- Tech-inspired animations
- Modern aesthetic for tech professionals

### 📹 **Media Integration**
- **YouTube Video Integration**: Direct embedding of demonstration videos
- **Project Gallery**: Timeline-style project showcase
- **Character References**: Professional references with contact information
- **Interactive Elements**: Clickable video overlays and project cards

## 📞 Support

If you encounter any issues:
1. Check that you're opening `index.html` in a browser (not running with Node.js)
2. Ensure all files are in the same directory
3. Check browser console for any JavaScript errors
4. Verify that `portfolio-config.js` is properly formatted JSON

## 🔄 Recent Updates

### Version 2.0 Features
- ✅ **Auto-responsive technical skills columns** - No more overlapping text
- ✅ **Logo click-to-scroll functionality** - Smooth scroll to top
- ✅ **Enhanced navbar stability** - Never disappears in any theme
- ✅ **Perfect text wrapping** - All words fit properly in containers
- ✅ **Advanced theme system** - 4 distinct themes with unique effects
- ✅ **Cyberpunk navbar fix** - Stable navigation across all themes

### Performance Improvements
- Hardware-accelerated animations
- Throttled scroll events for smooth performance
- Intersection Observer for efficient loading
- Reduced motion support for accessibility

---

**Note**: This portfolio website is designed to be a starting point. Feel free to customize it extensively to match your personal brand and requirements!
