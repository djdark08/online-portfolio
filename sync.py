#!/usr/bin/env python3
"""
GitHub Sync Script
Pulls latest changes from GitHub repository to local
"""

import subprocess
import sys
import os
from pathlib import Path
import datetime

def run_command(command, shell=False):
    """Run a shell command and return the result"""
    try:
        # Use shell=True for git commands to ensure PATH is available
        if command.startswith("git ") or command == "git":
            shell = True

        result = subprocess.run(
            command,
            shell=shell,
            capture_output=True,
            text=True,
            check=True,
            env=os.environ.copy()  # Use current environment
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running command: {command}")
        print(f"Error: {e.stderr}")
        return None

def check_git_repo():
    """Check if current directory is a git repository"""
    try:
        result = run_command("git rev-parse --git-dir")
        return result is not None and ".git" in result
    except:
        return False

def check_remote_exists():
    """Check if remote repository is configured"""
    remotes = run_command("git remote")
    return remotes and "origin" in remotes

def get_current_branch():
    """Get current branch name"""
    return run_command("git branch --show-current")

def fetch_from_github():
    """Fetch latest changes from GitHub"""
    print("📥 Fetching latest changes from GitHub...")
    result = run_command("git fetch origin")
    if result is not None:
        print("✅ Successfully fetched from GitHub")
        return True
    return False

def check_for_updates():
    """Check if there are updates available"""
    try:
        # Get current commit
        current_commit = run_command("git rev-parse HEAD")

        # Get remote commit
        current_branch = get_current_branch()
        if current_branch:
            remote_commit = run_command(f"git rev-parse origin/{current_branch}")
            return current_commit != remote_commit
        return False
    except:
        return False

def show_remote_changes():
    """Show what changes are available from remote"""
    current_branch = get_current_branch()
    if not current_branch:
        return

    try:
        # Show commits that are in remote but not in local
        result = run_command(f"git log HEAD..origin/{current_branch} --oneline")
        if result:
            print("📋 Remote changes available:")
            for line in result.split('\n'):
                if line.strip():
                    print(f"   • {line}")
        else:
            print("ℹ️  No new remote changes found")
    except:
        print("ℹ️  Could not retrieve remote changes")

def pull_from_github():
    """Pull changes from GitHub"""
    print("🔄 Pulling changes from GitHub...")

    current_branch = get_current_branch()
    if not current_branch:
        print("❌ Could not determine current branch")
        return False

    # Try to pull with rebase first (cleaner history)
    print(f"🔄 Attempting to pull with rebase on branch: {current_branch}")
    result = run_command(f"git pull --rebase origin {current_branch}")

    if result is not None:
        print("✅ Successfully pulled with rebase")
        return True

    # If rebase fails, try regular pull
    print("🔄 Rebase failed, trying regular pull...")
    result = run_command(f"git pull origin {current_branch}")

    if result is not None:
        print("✅ Successfully pulled from GitHub")
        return True

    return False

def handle_merge_conflicts():
    """Handle merge conflicts if they occur"""
    print("⚠️  Merge conflicts detected!")
    print("💡 Please resolve conflicts manually and then run:")
    print("   git add <resolved-files>")
    print("   git rebase --continue")
    print("")
    print("🔍 Files with conflicts:")

    try:
        # Show files with conflicts
        result = run_command("git diff --name-only --diff-filter=U")
        if result:
            for file in result.split('\n'):
                if file.strip():
                    print(f"   • {file}")
    except:
        pass

    return False

def check_local_changes():
    """Check for uncommitted local changes"""
    status = run_command("git status --porcelain")
    return status and status.strip()

def stash_local_changes():
    """Stash local changes before pulling"""
    print("📦 Stashing local changes...")
    result = run_command("git stash push -m 'Auto-stash before sync'")
    if result is not None:
        print("✅ Local changes stashed")
        return True
    return False

def pop_stashed_changes():
    """Restore stashed changes after pulling"""
    print("📦 Restoring stashed changes...")
    result = run_command("git stash pop")
    if result is not None:
        print("✅ Stashed changes restored")
        return True
    return False

def show_sync_summary():
    """Show summary of what was synced"""
    print("\n📊 Sync Summary:")
    try:
        # Show recent commits
        result = run_command("git log --oneline -5")
        if result:
            print("Recent commits:")
            for line in result.split('\n'):
                if line.strip():
                    print(f"   • {line}")
    except:
        pass

def check_github_auth():
    """Check if GitHub authentication is configured"""
    try:
        # Try to access GitHub
        result = run_command("ssh -T git@github.com", shell=True)
        if "successfully authenticated" in result.lower():
            return True
    except:
        pass

    print("⚠️  GitHub authentication not configured or failed")
    print("💡 Please set up SSH keys or configure GitHub token:")
    print("   - SSH: https://docs.github.com/en/authentication/connecting-to-github-with-ssh")
    print("   - Token: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token")
    return False

def main():
    """Main function"""
    print("🔄 GitHub Sync Script Starting...")
    print("=" * 50)

    # Check if we're in a git repository
    if not check_git_repo():
        print("❌ Not in a git repository!")
        print("💡 Please initialize git or navigate to a git repository")
        sys.exit(1)

    # Check if remote is configured
    if not check_remote_exists():
        print("❌ No remote repository configured!")
        print("💡 Please add your GitHub repository as remote:")
        print("   git remote add origin https://github.com/yourusername/yourrepo.git")
        sys.exit(1)

    # Check authentication
    if not check_github_auth():
        print("❌ GitHub authentication required")
        sys.exit(1)

    # Check for local changes
    if check_local_changes():
        print("⚠️  You have uncommitted local changes!")
        print("📋 Local changes detected:")
        status = run_command("git status --short")
        if status:
            print(status)

        response = input("\n🔍 Do you want to stash these changes and continue? (y/N): ").lower()
        if response == 'y':
            if not stash_local_changes():
                print("❌ Failed to stash changes")
                sys.exit(1)
            stashed = True
        else:
            print("👋 Sync cancelled. Please commit or stash your changes first.")
            sys.exit(1)
    else:
        stashed = False

    # Show current branch
    current_branch = get_current_branch()
    if current_branch:
        print(f"🌿 Current branch: {current_branch}")

    # Check for updates
    print("\n🔍 Checking for updates...")
    if not check_for_updates():
        print("ℹ️  Already up to date with GitHub")
        if stashed:
            response = input("🔄 Restore stashed changes? (y/N): ").lower()
            if response == 'y':
                pop_stashed_changes()
        sys.exit(0)

    # Show remote changes
    show_remote_changes()

    # Confirm sync
    response = input("\n🔍 Proceed with sync? (y/N): ").lower()
    if response != 'y':
        print("👋 Sync cancelled")
        if stashed:
            pop_stashed_changes()
        sys.exit(0)

    # Fetch latest changes
    if not fetch_from_github():
        print("❌ Failed to fetch from GitHub")
        if stashed:
            pop_stashed_changes()
        sys.exit(1)

    # Pull changes
    if not pull_from_github():
        # Check if there are merge conflicts
        if "conflict" in run_command("git status").lower():
            handle_merge_conflicts()
            if stashed:
                pop_stashed_changes()
            sys.exit(1)
        else:
            print("❌ Failed to pull from GitHub")
            if stashed:
                pop_stashed_changes()
            sys.exit(1)

    # Restore stashed changes if any
    if stashed:
        if not pop_stashed_changes():
            print("⚠️  Failed to restore stashed changes")
            print("💡 You can restore them manually with: git stash pop")

    # Show summary
    show_sync_summary()

    print("\n🎉 Sync completed successfully!")
    print("✅ Local repository is now up to date with GitHub")

if __name__ == "__main__":
    main()
