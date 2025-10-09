#!/usr/bin/env node

/**
 * Simple HTTP Server for Portfolio Website
 * Usage: node server.js [port]
 * Default port: 3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Get port from command line arguments or use default
// Check if portfolio-config.js exists and use its server settings
let port = 3000;
try {
    const config = require('./portfolio-config.js');
    port = config.server?.defaultPort || 3000;
} catch (error) {
    // Fallback to command line argument or default
    port = process.argv[2] || 3000;
}

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }
    
    // Read and serve file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Not Found</title>
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                background: #1e1e2f; 
                                color: #fff; 
                                text-align: center; 
                                padding: 50px; 
                            }
                        </style>
                    </head>
                    <body>
                        <h1>404 - File Not Found</h1>
                        <p>The requested file <code>${pathname}</code> could not be found.</p>
                        <p><a href="/index.html" style="color: #ff6b61;">← Back to Portfolio</a></p>
                    </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            // Success - serve the file
            // Get cache control from config if available
            let cacheControl = 'no-cache';
            try {
                const config = require('./portfolio-config.js');
                cacheControl = config.server?.cacheControl || 'no-cache';
            } catch (error) {
                // Use default cache control
            }

            res.writeHead(200, {
                'Content-Type': mimeType,
                'Cache-Control': cacheControl
            });
            res.end(data);
        }
    });
});

// Start server
server.listen(port, () => {
    console.log('\n🚀 Portfolio Website Server Started!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📂 Serving from: ${__dirname}`);
    console.log(`🌐 Server running at: http://localhost:${port}`);
    console.log(`📱 Open in browser: http://localhost:${port}`);
    console.log('');
    console.log('💡 Tips:');
    console.log(`   • Press Ctrl+C to stop the server`);
    console.log(`   • Change port: node server.js [port_number]`);
    console.log(`   • Default port is 3000 if not specified`);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped. Goodbye!');
    server.close();
    process.exit(0);
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use.`);
        console.log(`💡 Try a different port: node server.js ${parseInt(port) + 1}`);
    } else {
        console.error('❌ Server error:', err.message);
    }
    process.exit(1);
});
