#!/usr/bin/env python3
"""
🔄 Enhanced GitHub Sync Script with Intelligent PULL & CONFLICT Resolution
The Smart Pull System - Handles Pull Conflicts Like a Boss!
"""

import subprocess
import sys
import os
import json
from datetime import datetime
import time

class GitSyncMaster:
    def __init__(self):
        self.current_dir = os.getcwd()
        self.repo_name = "Portfolio-Project"
        self.current_time = datetime.now().strftime("%Y%m%d_%H%M%S")

    def run_command(self, command, capture_output=False, encoding='utf-8'):
        """Enhanced command runner with error handling"""
        try:
            if capture_output:
                result = subprocess.run(
                    command,
                    shell=True,
                    capture_output=True,
                    text=True,
                    encoding=encoding,
                    cwd=self.current_dir
                )
                return result.returncode, result.stdout.strip(), result.stderr.strip()
            else:
                result = subprocess.run(command, shell=True, cwd=self.current_dir)
                return result.returncode, "", ""
        except Exception as e:
            print(f"❌ Command failed: {e}")
            return 1, "", str(e)

    def check_git_status(self):
        """Check current git status and detect any uncommitted changes"""
        print("🔍 Checking git status...")

        code, stdout, stderr = self.run_command("git status --porcelain", capture_output=True)
        has_local_changes = len(stdout.strip()) > 0

        if has_local_changes:
            print("⚠️  WARNING: You have uncommitted local changes!")
            print("Details:")
            for line in stdout.split('\n'):
                if line.strip():
                    print(f"  {line}")
            print("\n💡 Consider committing your changes first with: python update.py")

        return has_local_changes

    def intelligent_fetch(self):
        """Intelligent fetch with progress feedback"""
        print("📡 Fetching latest changes from GitHub...")

        code, stdout, stderr = self.run_command("git fetch origin --prune", capture_output=True)

        if code == 0:
            print("✅ Successfully fetched remote changes!")
            return True
        else:
            print(f"❌ Fetch failed: {stderr}")
            return False

    def analyze_pull_error(self, stderr):
        """Analyze pull error and categorize it"""
        error_lower = stderr.lower()

        if any(keyword in error_lower for keyword in ['merge conflict', 'automatic merge failed', 'conflicts']):
            return {'type': 'merge_conflict', 'severity': 'critical'}

        elif any(keyword in error_lower for keyword in ['diverged', 'branch has diverged']):
            return {'type': 'diverged', 'severity': 'moderate'}

        elif 'permission denied' in error_lower or 'authentication failed' in error_lower:
            return {'type': 'auth_error', 'severity': 'critical'}

        elif any(keyword in error_lower for keyword in ['could not resolve', 'unknown revision']):
            return {'type': 'branch_not_found', 'severity': 'moderate'}

        else:
            return {'type': 'unknown', 'severity': 'moderate'}

    def auto_resolve_diverged(self, branch="main"):
        """Auto-resolve diverged branches using stash strategy"""
        print("🔄 Repository diverged. Attempting smart merge strategy...")

        # Check what changes are coming
        print("📊 Analyzing incoming changes...")

        code, stdout, stderr = self.run_command("git log HEAD..origin/main --oneline -5", capture_output=True)
        if code == 0 and stdout.strip():
            print(f"📥 Incoming commits ({len(stdout.split('\n'))}):")
            for line in stdout.split('\n')[:5]:
                if line.strip():
                    print(f"  {line}")
        else:
            print("ℹ️  No incoming commits detected.")

        # Try rebase (cleaner history)
        code, stdout, stderr = self.run_command(f"git pull --rebase origin {branch}", capture_output=True)

        if code == 0:
            print("✅ Successfully rebased your changes on top of remote!")
            return True
        else:
            error_analysis = self.analyze_pull_error(stderr)

            if error_analysis['type'] == 'merge_conflict':
                print("💥 Merge conflicts detected during rebase.")
                print("🔄 Falling back to merge strategy...")

                # Abort rebase and try merge
                self.run_command("git rebase --abort")
                time.sleep(1)

                code, stdout, stderr = self.run_command(f"git pull origin {branch}", capture_output=True)

                if code == 0:
                    print("✅ Successfully merged remote changes!")
                    return True
                else:
                    self.generate_conflict_resolution_guide("merge", branch)
                    return False
            else:
                print(f"❌ Auto-resolution failed: {stderr}")
                return False

    def intelligent_pull(self, branch="main", max_attempts=3):
        """Intelligent pull with conflict resolution"""
        attempt = 0
        while attempt < max_attempts:
            attempt += 1
            print(f"\n🔄 Pull Attempt #{attempt} (Branch: {branch})")

            # Try pulling
            code, stdout, stderr = self.run_command(f"git pull origin {branch}", capture_output=True)

            if code == 0:
                print("✅ Successfully pulled latest changes!")
                return True, "success"

            # Analyze error
            error_analysis = self.analyze_pull_error(stderr)

            if error_analysis['type'] == 'diverged':
                print("🔄 Branches have diverged. Attempting auto-resolution...")
                if self.auto_resolve_diverged(branch):
                    return True, "auto_resolved"

            elif error_analysis['type'] == 'merge_conflict':
                print("💥 Major merge conflict detected!")
                self.generate_conflict_resolution_guide("merge", branch)
                return False, "merge_conflict"

            elif error_analysis['type'] == 'branch_not_found':
                print(f"📝 Branch '{branch}' not found on remote. Trying alternatives...")
                continue  # Will try different branches in try_alternative_branches

            elif error_analysis['type'] == 'auth_error':
                print("🔐 Authentication failed. Please check your GitHub credentials.")
                return False, "auth_error"

            else:
                print(f"⚠️  Pull failed with unknown error: {stderr}")

                # Wait before retry
                if attempt < max_attempts:
                    print(f"⏳ Retrying in 3 seconds... ({max_attempts - attempt} attempts left)")
                    time.sleep(3)

        return False, "max_attempts_exceeded"

    def generate_conflict_resolution_guide(self, conflict_type, branch):
        """Generate detailed conflict resolution guide"""
        guide_file = f"merge_conflicts_{conflict_type}_{self.current_time}.txt"

        print(f"📝 Generating conflict resolution guide: {guide_file}")

        with open(guide_file, 'w', encoding='utf-8') as f:
            f.write(f"🚨 GIT {conflict_type.upper()} CONFLICT RESOLUTION GUIDE 🚨\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Repository: {self.repo_name}\n")
            f.write(f"Branch: {branch}\n")
            f.write(f"Conflict Type: {conflict_type.upper()}\n\n")

            f.write("WHAT HAPPENED:\n")
            f.write("--------------\n")
            if conflict_type == "merge":
                f.write("- Remote has changes that conflict with your local changes\n")
                f.write("- Git could not automatically merge the files\n")
                f.write("- Some files have competing changes that need manual resolution\n\n")
            elif conflict_type == "rebase":
                f.write("- Your local commits conflict with incoming remote changes\n")
                f.write("- The rebase process stopped to let you resolve conflicts\n")
                f.write("- Each conflicting commit must be resolved before proceeding\n\n")

            f.write("HOW TO RESOLVE THIS:\n")
            f.write("--------------------\n\n")

            if conflict_type == "merge":
                f.write("OPTION 1 - RESOLVE CONFLICTS MANUALLY:\n")
                f.write("   1. Open files with conflicts (Git will show them)\n")
                f.write("   2. Look for conflict markers: <<<<<<< ======= >>>>>>>\n")
                f.write("   3. Choose which version to keep or merge both\n")
                f.write("   4. Remove conflict markers\n")
                f.write("   5. Stage the resolved files: git add <filename>\n")
                f.write("   6. Continue merge: git commit\n\n")

                f.write("OPTION 2 - ABORT THE MERGE:\n")
                f.write("   git merge --abort\n")
                f.write("   # Your changes remain, remote changes are ignored\n\n")

                f.write("OPTION 3 - ACCEPT REMOTE CHANGES (DISCARD LOCAL):\n")
                f.write("   git reset --hard origin/main\n")
                f.write("   ⚠️  WARNING: This will lose ALL your local changes!\n\n")

            elif conflict_type == "rebase":
                f.write("OPTION 1 - RESOLVE AND CONTINUE REBASE:\n")
                f.write("   1. Fix conflicting files manually\n")
                f.write("   2. Stage resolved files: git add <filename>\n")
                f.write("   3. Continue rebase: git rebase --continue\n\n")

                f.write("OPTION 2 - ABORT REBASE:\n")
                f.write("   git rebase --abort\n")
                f.write("   # Returns to state before rebase started\n\n")

                f.write("OPTION 3 - SKIP THIS COMMIT:\n")
                f.write("   git rebase --skip\n")
                f.write("   # Discards the conflicting commit\n\n")

            f.write("CONFLICTING FILES:\n")
            f.write("------------------\n")

            # Check for conflicts
            code, stdout, stderr = self.run_command("git status --porcelain", capture_output=True)
            conflict_files = []
            for line in stdout.split('\n'):
                if 'UU' in line or line.startswith('DD'):
                    conflict_files.append(line[3:])  # Remove status codes

            if conflict_files:
                for file in conflict_files:
                    f.write(f"🔴 {file}\n")
            else:
                f.write("No conflicting files detected in status.\n")

            f.write("\nHELPFUL COMMANDS:\n")
            f.write("-----------------\n")
            f.write("git status                    # See current status\n")
            f.write("git diff                      # See all changes\n")
            f.write("git log --oneline -10         # Recent commits\n")
            f.write("git remote -v                 # Check remotes\n")
            f.write("git stash list               # See stashed changes\n\n")

            f.write("=" * 60 + "\n")
            f.write("💡 PRO TIP: Use VS Code or another editor with Git integration\n")
            f.write("💡 for easier conflict resolution with visual conflict markers!\n\n")
            f.write("🔧 If you need help, visit: https://docs.github.com/en/pull-requests\n")

        print("📖 Open this file to see detailed resolution steps!")
        print("🎨 Consider using VS Code's Git integration for visual conflict resolution!")

    def try_alternative_branches(self):
        """Try alternative branch names if main fails"""
        print("\n🔄 Trying alternative branch names...")

        branches_to_try = ['master', 'develop', 'staging', 'dev']

        for branch in branches_to_try:
            print(f"🔄 Attempting to sync with '{branch}' branch...")

            success, result_type = self.intelligent_pull(branch)
            if success:
                return True, branch
            elif result_type in ["merge_conflict", "auth_error"]:
                return False, f"conflict_on_{branch}"

        return False, "all_branches_failed"

    def backup_strategy(self):
        """Backup current state before risky operations"""
        print("🛒 Creating safety backup...")

        backup_branch = f"backup_before_sync_{self.current_time}"
        code, stdout, stderr = self.run_command(f"git checkout -b {backup_branch}")

        if code == 0:
            print(f"✅ Backup created: '{backup_branch}'")
            # Switch back to original branch
            self.run_command("git checkout -")
            return backup_branch
        else:
            print(f"⚠️  Backup failed: {stderr}")
            return None

    def main_workflow(self):
        """Main intelligent sync workflow"""
        print("🔄 Enhanced GitHub Sync Script Starting...")
        print(f"📦 Repository: {self.repo_name}")
        print(f"🔗 Directory: {self.current_dir}")
        print(f"⏰ Started at: {self.current_time}")
        print()

        # Step 1: Check for local changes
        has_local_changes = self.check_git_status()

        if has_local_changes:
            print("\n⚠️  LOCAL CHANGES DETECTED!")
            print("You have uncommitted changes that could be overwritten.")
            print("\nRECOMMENDED ACTIONS:")
            print("1. Commit your changes first: python update.py")
            print("2. Or stash them temporarily: git stash")
            print("3. Then run sync again\n")

            choice = input("Continue anyway? (y/N): ").lower().strip()
            if choice not in ['y', 'yes']:
                print("❌ Sync cancelled by user.")
                return False

            # Create backup anyway
            self.backup_strategy()

        # Step 2: Fetch latest changes
        if not self.intelligent_fetch():
            print("❌ Cannot proceed without fetching remote changes.")
            return False

        # Step 3: Try intelligent pull
        print("\n🔄 Attempting to sync with remote...")
        success, result = self.intelligent_pull()

        if success:
            print("\n🎉 SUCCESS! Repository synchronized with GitHub!")
            print("✅ All changes have been successfully merged!")

            if result == "auto_resolved":
                print("🤖 Conflicts were automatically resolved!")

            return True
        else:
            # Step 4: Try alternative approaches
            if result in ["max_attempts_exceeded", "diverged"]:
                print("\n🔄 Trying alternative branches...")

                if has_local_changes:
                    print("⚠️  WARNING: You have local changes - be careful!")

                alt_success, alt_result = self.try_alternative_branches()

                if alt_success:
                    print(f"\n✅ SUCCESS! Synced with alternative branch: {alt_result}")
                    return True
                else:
                    print("❌ All sync attempts failed.")
                    print("💡 Try manual sync or check your internet connection.")
            elif result in ["merge_conflict", "auth_error"]:
                print("\n💥 CRITICAL ISSUE DETECTED!")
                if result == "auth_error":
                    print("🔐 Authentication issue. Please check your credentials.")
                else:
                    print("⚔️  Merge conflicts require manual resolution.")
                print("📖 Check the conflict resolution guide that was generated!")

            return False

def main():
    """Main entry point"""
    syncer = GitSyncMaster()
    success = syncer.main_workflow()

    if success:
        sys.exit(0)
    else:
        print("\n💡 TIP: Run 'git status' to see current state")
        print("💡 TIP: Run 'python update.py' to push your changes")
        sys.exit(1)

if __name__ == "__main__":
    main()
