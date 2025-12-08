#!/usr/bin/env python3
"""
Simple GitHub Update Script - Old
Pushes local changes to GitHub repository
"""

import subprocess
import sys
import os

def run_command(command):
    """Run a shell command"""
    return os.system(command)

def main():
    """Main function"""
    print("🔄 Simple GitHub Update Starting...")

    # Simple git commands
    print("📋 Adding files...")
    run_command("git add .")

    print("💾 Committing...")
    run_command('git commit -m "Update Portfolio"')

    print("🚀 Pushing to GitHub...")
    result = run_command("git push origin main")

    if result == 0:
        print("✅ Successfully pushed to GitHub!")
    else:
        print("🔄 Trying master branch...")
        result = run_command("git push origin master")

        if result == 0:
            print("✅ Successfully pushed to GitHub!")
        else:
            print("❌ Push failed")

if __name__ == "__main__":
    main()
