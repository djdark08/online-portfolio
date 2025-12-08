#!/usr/bin/env python3
"""
🚀 Enhanced GitHub Update Script with Intelligent PUSH & CONFLICT Resolution
The Swiss Army Knife of Git Operations - Handles Everything Automatically!
"""

import subprocess
import sys
import os
import json
from datetime import datetime
import time

class GitPushMaster:
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
        """Check current git status and return detailed info"""
        print("🔍 Analyzing git status...")

        # Check if repo is clean
        code, stdout, stderr = self.run_command("git status --porcelain", capture_output=True)
        has_changes = len(stdout.strip()) > 0

        # Check if ahead/behind
        code, stdout, stderr = self.run_command("git status -b --porcelain", capture_output=True)
        status_lines = stdout.split('\n')
        ahead_behind = status_lines[0] if status_lines else ""

        # Get current branch
        code, stdout, stderr = self.run_command("git branch --show-current", capture_output=True)
        current_branch = stdout.strip() or "main"

        print(f"📋 Current branch: {current_branch}")
        print(f"📝 Uncommitted changes: {'Yes' if has_changes else 'No'}")
        print(f"🔄 Branch status: {ahead_behind}")

        return {
            'has_changes': has_changes,
            'current_branch': current_branch,
            'ahead_behind': ahead_behind
        }

    def stage_and_commit(self, commit_message=None):
        """Smart staging and committing"""
        if commit_message is None:
            commit_message = f"🚀 Portfolio Auto-Update {self.current_time}"

        print(f"📋 Staging files...")
        self.run_command("git add .")

        print(f"💾 Committing with message: '{commit_message}'")
        code, stdout, stderr = self.run_command(f'git commit -m "{commit_message}"', capture_output=True)

        if code == 0:
            print("✅ Files committed successfully!")
            return True
        else:
            if "nothing to commit" in stderr.lower():
                print("ℹ️  No changes to commit")
                return True
            else:
                print(f"❌ Commit failed: {stderr}")
                return False

    def intelligent_push(self, branch="main", max_attempts=3):
        """Intelligent push with conflict resolution"""
        attempt = 0
        while attempt < max_attempts:
            attempt += 1
            print(f"\n🚀 Push Attempt #{attempt} (Branch: {branch})")

            # Try pushing
            code, stdout, stderr = self.run_command(f"git push origin {branch}", capture_output=True)

            if code == 0:
                print("✅ Successfully pushed to GitHub!")
                return True, "success"

            # Analyze error and handle intelligently
            error_analysis = self.analyze_push_error(stderr)

            if error_analysis['type'] == 'ahead_behind':
                print("🔄 Repository diverged. Attempting auto-sync...")
                if self.auto_sync_conflict():
                    continue  # Try push again

            elif error_analysis['type'] == 'no_remote_branch':
                print(f"📝 Creating remote branch '{branch}'...")
                self.run_command(f"git push -u origin {branch}")
                continue

            elif error_analysis['type'] == 'major_conflict':
                print("💥 Major conflict detected! Creating recovery branch...")
                recovery_branch = self.create_recovery_branch(branch)
                return False, f"major_conflict:{recovery_branch}"

            else:
                print(f"⚠️  Unknown error type. Full error: {stderr}")

                # Wait a bit before retry
                if attempt < max_attempts:
                    print(f"⏳ Retrying in 2 seconds... ({max_attempts - attempt} attempts left)")
                    time.sleep(2)

        return False, "max_attempts_exceeded"

    def analyze_push_error(self, stderr):
        """Analyze push error and categorize it"""
        error_lower = stderr.lower()

        if any(keyword in error_lower for keyword in ['non-fast-forward', 'updates were rejected because', 'diverged']):
            return {'type': 'ahead_behind', 'severity': 'minor'}

        elif any(keyword in error_lower for keyword in ['does not exist', 'remote branch'] and 'origin' in error_lower):
            return {'type': 'no_remote_branch', 'severity': 'minor'}

        elif any(keyword in error_lower for keyword in ['merge conflict', 'automatic merge failed', 'conflicts']):
            return {'type': 'major_conflict', 'severity': 'critical'}

        elif 'permission denied' in error_lower or 'authentication failed' in error_lower:
            return {'type': 'auth_error', 'severity': 'critical'}

        else:
            return {'type': 'unknown', 'severity': 'moderate'}

    def auto_sync_conflict(self):
        """Auto-resolve diverged branches by pulling and merging"""
        print("🔄 Attempting to sync diverged branches...")

        # Fetch latest
        code, stdout, stderr = self.run_command("git fetch origin")
        if code != 0:
            print("❌ Failed to fetch remote changes")
            return False

        # Try to rebase (less messy than merge)
        code, stdout, stderr = self.run_command("git pull --rebase origin main", capture_output=True)

        if code == 0:
            print("✅ Branches successfully synced!")
            return True
        else:
            print(f"❌ Auto-sync failed: {stderr}")
            return False

    def create_recovery_branch(self, original_branch):
        """Create a recovery branch for major conflicts"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        recovery_branch = f"recovery_{original_branch}_{timestamp}"

        print(f"🛒 Creating recovery branch: {recovery_branch}")

        # Create and switch to recovery branch
        code, stdout, stderr = self.run_command(f"git checkout -b {recovery_branch}")
        if code != 0:
            print(f"❌ Failed to create recovery branch: {stderr}")
            return None

        # Force push to create remote branch
        code, stdout, stderr = self.run_command(f"git push -u origin {recovery_branch}")
        if code != 0:
            print(f"⚠️  Remote recovery branch creation failed: {stderr}")

        # Generate conflict resolution file
        self.generate_conflict_resolution_file(original_branch, recovery_branch)

        return recovery_branch

    def generate_conflict_resolution_file(self, original_branch, recovery_branch):
        """Generate a detailed conflict resolution file"""
        conflict_file = f"git_conflicts_{self.current_time}.txt"

        print(f"📝 Generating conflict resolution file: {conflict_file}")

        with open(conflict_file, 'w', encoding='utf-8') as f:
            f.write("🚨 GIT CONFLICT RESOLUTION REQUIRED 🚨\n")
            f.write("=" * 50 + "\n\n")
            f.write(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write(f"Repository: {self.repo_name}\n\n")

            f.write("PROBLEM:\n")
            f.write("--------\n")
            f.write(f"- Your local '{original_branch}' branch has major conflicts with remote\n")
            f.write("- A recovery branch has been created to preserve your changes\n\n")

            f.write("SOLUTION OPTIONS:\n")
            f.write("-----------------\n")
            f.write("Choose one of the following approaches:\n\n")

            f.write("OPTION 1 - USE YOUR LOCAL CHANGES (Force Push):\n")
            f.write(f"   git checkout {recovery_branch}\n")
            f.write(f"   git push --force origin {recovery_branch}\n")
            f.write(f"   git checkout main && git merge {recovery_branch}\n\n")

            f.write("OPTION 2 - MERGE REMOTE CHANGES INTO YOURS:\n")
            f.write(f"   git checkout {recovery_branch}\n")
            f.write("   git pull --no-ff origin main  # Creates merge commit\n")
            f.write("   # Resolve any merge conflicts manually\n")
            f.write("   git push origin HEAD:main\n\n")

            f.write("OPTION 3 - REBASE YOUR CHANGES ON REMOTE:\n")
            f.write(f"   git checkout {recovery_branch}\n")
            f.write("   git rebase origin/main\n")
            f.write("   # Resolve any rebase conflicts manually\n")
            f.write("   git push origin HEAD:main\n\n")

            f.write("CURRENT STATUS:\n")
            f.write("---------------\n")

            # Get detailed diff
            f.write("\nLOCAL CHANGES (Your work):\n")
            f.write("-" * 30 + "\n")
            code, stdout, stderr = self.run_command("git log --oneline origin/main..HEAD -10", capture_output=True)
            if code == 0 and stdout.strip():
                f.write(stdout + "\n")
            else:
                f.write("No specific local commits found.\n")

            f.write("\nREMOTE CHANGES (Repository):\n")
            f.write("-" * 30 + "\n")
            code, stdout, stderr = self.run_command("git log --oneline HEAD..origin/main -10", capture_output=True)
            if code == 0 and stdout.strip():
                f.write(stdout + "\n")
            else:
                f.write("No remote commits found.\n")

            f.write("\nDETAILED CHANGES:\n")
            f.write("-" * 20 + "\n")

            # Get file differences
            f.write("\nModified Files:\n")
            code, stdout, stderr = self.run_command("git diff --name-status origin/main", capture_output=True)
            if code == 0 and stdout.strip():
                f.write(stdout + "\n")
            else:
                f.write("No file differences found.\n")

            f.write("\nUnpushed Commits:\n")
            code, stdout, stderr = self.run_command("git log --oneline origin/main..HEAD --stat", capture_output=True)
            if code == 0 and stdout.strip():
                f.write(stdout + "\n")
            else:
                f.write("No unpushed commits.\n")

            f.write("\n" + "=" * 50 + "\n")
            f.write("💡 TIP: Review the differences above and choose the best option!\n")
            f.write("🔧 If you need help, check: https://docs.github.com/en/get-started/quickstart/github-flow\n")

        print(f"✅ Conflict resolution file created: {conflict_file}")
        print("📖 Open this file to see your options for resolving the conflict!")

        return conflict_file

    def try_alternative_branches(self, base_message=None):
        """Try alternative branch names if main fails"""
        print("\n🔄 Trying alternative branch names...")

        branches_to_try = ['master', 'develop', 'staging']

        for branch in branches_to_try:
            print(f"🚀 Attempting to push to '{branch}' branch...")

            success, result_type = self.intelligent_push(branch)
            if success:
                return True, branch

            if result_type.startswith("major_conflict:"):
                recovery = result_type.split(":")[1]
                return False, f"conflict_{branch}:{recovery}"

        return False, "all_branches_failed"

    def main_workflow(self, commit_message=None):
        """Main intelligent update workflow"""
        print("🚀 Enhanced GitHub Update Script Starting...")
        print(f"📦 Repository: {self.repo_name}")
        print(f"🔗 Directory: {self.current_dir}")
        print(f"⏰ Started at: {self.current_time}")

        # Step 1: Check status
        status = self.check_git_status()

        if not status['has_changes']:
            print("ℹ️  No changes to commit. Checking if push needed...")
            # Still try to push in case we had commits but repo is out of sync
            success, result = self.intelligent_push(status['current_branch'])
            if success:
                print("✅ Repository already up to date!")
                return True
            else:
                # Handle conflict resolution even with no new changes
                pass  # Fall through to error handling

        # Step 2: Stage and commit
        if not self.stage_and_commit(commit_message):
            print("❌ Failed to stage/commit changes")
            return False

        # Step 3: Intelligent push
        success, result = self.intelligent_push(status['current_branch'])

        if success:
            print("\n🎉 SUCCESS! Portfolio updated and pushed to GitHub!")
            print(f"🌐 Changes are live at: https://github.com/djdark08/online-portfolio")
            return True
        else:
            # Step 4: Try alternative approaches
            if result.startswith("major_conflict:"):
                recovery_branch = result.split(":")[1]
                print(f"\n💥 MAJOR CONFLICT CREATED RECOVERY BRANCH: {recovery_branch}")
                print("📖 Check the conflict resolution file for options!")
            elif result == "max_attempts_exceeded":
                print("\n🔄 Max push attempts exceeded. Trying alternative branches...")
                alt_success, alt_result = self.try_alternative_branches(commit_message)

                if alt_success:
                    print(f"✅ Successfully pushed to alternative branch: {alt_result}")
                    return True
                elif alt_result.startswith("conflict_"):
                    branch, recovery = alt_result.split(":")
                    print(f"💥 Conflict on alternative branch. Recovery: {recovery}")
                else:
                    print("❌ All push attempts failed. Manual intervention required.")

            return False

def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        commit_message = " ".join(sys.argv[1:])
    else:
        commit_message = None

    updater = GitPushMaster()
    success = updater.main_workflow(commit_message)

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
