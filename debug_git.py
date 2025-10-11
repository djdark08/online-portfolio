#!/usr/bin/env python3
"""
Debug script to test git commands
"""

import subprocess
import sys

def run_command(command, shell=False):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(
            command,
            shell=shell,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

# Test git commands
print("Testing git commands...")
print("=" * 30)

try:
    print("1. Testing 'git rev-parse --git-dir':")
    result1 = run_command("git rev-parse --git-dir")
    print(f"   Result: {result1}")

    print("\n2. Testing 'git status':")
    result2 = run_command("git status")
    print(f"   Result: {result2}")

    print("\n3. Testing 'git branch --show-current':")
    result3 = run_command("git branch --show-current")
    print(f"   Result: {result3}")

    print("\n4. Testing 'git remote':")
    result4 = run_command("git remote")
    print(f"   Result: {result4}")

    # Test the logic from our script
    print("\n5. Testing script logic:")
    if result1 is not None and ".git" in result1:
        print("   ✅ Git repository detected")
    else:
        print("   ❌ Git repository NOT detected")

except Exception as e:
    print(f"Exception: {e}")
    import traceback
    traceback.print_exc()
