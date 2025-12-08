#!/usr/bin/env python3
"""
Simple GitHub Sync Script
Pulls latest changes from GitHub repository to local
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a shell command"""
    return os.system(command)

def main():
    """Main function"""
    print("🔄 Simple GitHub Sync Starting...")

    # Simple git commands
    print("📥 Fetching from GitHub...")
    run_command("git fetch origin")

    print("🔄 Pulling changes...")
    result = run_command("git pull origin main")

    if result != 0:
        print("🔄 Trying master branch...")
        result = run_command("git pull origin master")

    if result == 0:
        print("✅ Successfully synced from GitHub!")
    else:
        print("❌ Sync failed")

if __name__ == "__main__":
    main()
