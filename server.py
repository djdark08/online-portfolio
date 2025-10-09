#!/usr/bin/env python3
"""
Simple HTTP Server for Portfolio Website
Usage: python server.py [port]
Default port: 3000
"""

import http.server
import socketserver
import sys
import os
import webbrowser
from pathlib import Path

# Get port from command line arguments or use default
# Check if portfolio-config.js exists and use its server settings
port = 3000
try:
    import json
    with open('portfolio-config.js', 'r') as f:
        # Extract port from JavaScript config file
        content = f.read()
        if 'defaultPort' in content:
            # Simple extraction of port value from JS config
            import re
            port_match = re.search(r'defaultPort:\s*(\d+)', content)
            if port_match:
                port = int(port_match.group(1))
except:
    # Fallback to command line argument or default
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 3000

class PortfolioHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)

    def end_headers(self):
        # Get cache control from config if available
        cache_control = 'no-cache'
        try:
            with open('portfolio-config.js', 'r') as f:
                content = f.read()
                import re
                cache_match = re.search(r'cacheControl:\s*["\']([^"\']+)["\']', content)
                if cache_match:
                    cache_control = cache_match.group(1)
        except:
            pass

        self.send_header('Cache-Control', cache_control)
        super().end_headers()

    def guess_type(self, path):
        # Get MIME type for the file
        guess_result = super().guess_type(path)

        # Handle different return value formats
        if isinstance(guess_result, tuple):
            mimetype, encoding = guess_result[0], guess_result[1] if len(guess_result) > 1 else None
        else:
            mimetype, encoding = guess_result, None

        # Custom MIME types
        if path.endswith('.js'):
            return 'text/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.json'):
            return 'application/json'

        return mimetype

    def log_message(self, format, *args):
        # Custom log format with colors
        print(f"\033[92m{self.address_string()}\033[0m - \033[94m{format % args}\033[0m")

def start_server():
    try:
        with socketserver.TCPServer(("", port), PortfolioHandler) as httpd:
            print('\n🚀 Portfolio Website Server Started!')
            print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
            print(f'📂 Serving from: {os.getcwd()}')
            print(f'🌐 Server running at: http://localhost:{port}')
            print(f'📱 Open in browser: http://localhost:{port}')
            print('')
            print('💡 Tips:')
            print(f'   • Press Ctrl+C to stop the server')
            print(f'   • Change port: python server.py [port_number]')
            print(f'   • Default port is 3000 if not specified')
            print('')
            print('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

            # Automatically open browser (optional)
            try:
                webbrowser.open(f'http://localhost:{port}')
                print(f'🌐 Opening browser to http://localhost:{port}\n')
            except:
                pass

            try:
                httpd.serve_forever()
            except KeyboardInterrupt:
                print('\n🛑 Server stopped. Goodbye!')

    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f'❌ Port {port} is already in use.')
            print(f'💡 Try a different port: python server.py {port + 1}')
        else:
            print(f'❌ Server error: {e}')
        sys.exit(1)
    except Exception as e:
        print(f'❌ Unexpected error: {e}')
        sys.exit(1)

if __name__ == "__main__":
    # Check if index.html exists
    if not Path("index.html").exists():
        print("❌ Error: index.html not found!")
        print("Make sure you're running this script from the portfolio website directory.")
        sys.exit(1)

    start_server()
