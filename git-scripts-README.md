# Git Sync Scripts

This directory contains two Python scripts for easy synchronization between your local repository and GitHub.

## Scripts Overview

### 🔄 `update.py` - Push Local Changes to GitHub
- **Purpose**: Uploads your local changes to GitHub
- **Use when**: You want to backup your local work to GitHub
- **What it does**:
  - Checks for uncommitted changes
  - Adds all changes to staging
  - Commits with timestamp
  - Pushes to GitHub remote

### 📥 `sync.py` - Pull Changes from GitHub
- **Purpose**: Downloads latest changes from GitHub to your local machine
- **Use when**: You want to get the latest updates from GitHub
- **What it does**:
  - Fetches latest changes from GitHub
  - Pulls changes with rebase (clean history)
  - Handles local changes safely (stashing if needed)
  - Shows summary of changes

## Prerequisites

1. **Git Repository**: Must be in a git-initialized directory
2. **GitHub Remote**: Must have a remote repository configured
3. **Authentication**: Must have GitHub authentication set up

### Setting up GitHub Authentication

#### Option 1: SSH Keys (Recommended)
```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub account
# Copy the public key and add it to GitHub: Settings > SSH and GPG keys

# Test connection
ssh -T git@github.com
```

#### Option 2: Personal Access Token
```bash
# Set remote URL with token
git remote set-url origin https://YOUR_TOKEN@github.com/username/repo.git
```

## Usage

### Basic Usage

```bash
# Push local changes to GitHub
python3 update.py

# Pull latest changes from GitHub
python3 sync.py
```

### What Each Script Does

#### `update.py` Workflow:
1. ✅ Checks if you're in a git repository
2. 🔍 Shows current git status
3. 📋 Adds all changes to staging
4. 💾 Commits with automatic timestamp message
5. 🚀 Pushes to GitHub (tries main, then master branch)
6. 🎉 Confirms successful upload

#### `sync.py` Workflow:
1. ✅ Checks if you're in a git repository
2. 🔐 Verifies GitHub authentication
3. 📦 Stashes local changes (if any) for safety
4. 📥 Fetches latest changes from GitHub
5. 🔄 Pulls changes with rebase
6. 📦 Restores stashed changes (if any)
7. 📊 Shows summary of what was synced

## Safety Features

### `update.py` Safety:
- ✅ Shows what will be committed before proceeding
- ✅ Requires confirmation before pushing
- ✅ Handles authentication errors gracefully
- ✅ Provides helpful error messages

### `sync.py` Safety:
- ✅ Stashes local changes before pulling (asks first)
- ✅ Restores stashed changes after successful sync
- ✅ Handles merge conflicts gracefully
- ✅ Shows remote changes before pulling
- ✅ Requires confirmation before proceeding

## Example Output

### Update Script:
```
🔄 GitHub Update Script Starting...
==================================================
📊 Current Status:
 M script.js
 A new-feature.js

🔍 Proceed with update? (y/N): y

🚀 Starting update process...
📋 Adding files to staging...
✅ Files added successfully
💾 Committing changes with message: 'Update portfolio - 2024-01-15 14:30:22'
✅ Changes committed successfully
🚀 Pushing to GitHub...
✅ Successfully pushed to GitHub!

🎉 Update completed successfully!
✅ All local changes have been pushed to GitHub
```

### Sync Script:
```
🔄 GitHub Sync Script Starting...
==================================================
🌿 Current branch: main

🔍 Checking for updates...
📋 Remote changes available:
   • 2a1b3c4 Add new portfolio section
   • 5d6e7f8 Fix responsive design issues

🔍 Proceed with sync? (y/N): y

🚀 Starting sync process...
📦 Stashing local changes...
✅ Local changes stashed
📥 Fetching latest changes from GitHub...
✅ Successfully fetched from GitHub
🔄 Pulling changes from GitHub...
✅ Successfully pulled from GitHub
📦 Restoring stashed changes...
✅ Stashed changes restored

📊 Sync Summary:
Recent commits:
   • 2a1b3c4 Add new portfolio section
   • 5d6e7f8 Fix responsive design issues
   • 8g9h0i1 Update portfolio - 2024-01-15 14:25:10

🎉 Sync completed successfully!
✅ Local repository is now up to date with GitHub
```

## Troubleshooting

### Common Issues

#### "Not in a git repository"
```bash
# Initialize git repository
git init
git remote add origin https://github.com/username/repo.git
```

#### "No remote repository configured"
```bash
# Add GitHub remote
git remote add origin https://github.com/yourusername/yourrepo.git
```

#### Authentication Issues
```bash
# Test SSH connection
ssh -T git@github.com

# If that fails, check SSH key setup
ssh-keygen -t ed25519 -C "your_email@example.com"
# Then add the public key to GitHub
```

#### Merge Conflicts
```bash
# If conflicts occur during sync:
# 1. Manually resolve conflicts in files
# 2. Add resolved files: git add <filename>
# 3. Continue: git rebase --continue
```

## Tips

1. **Regular Backups**: Run `update.py` frequently to backup your work
2. **Stay Updated**: Run `sync.py` before starting new work to get latest changes
3. **Branch Management**: Scripts work with any branch (main, master, feature branches)
4. **Safety First**: Scripts will ask for confirmation before making changes
5. **Error Recovery**: If something goes wrong, check the error messages for guidance

## File Permissions

The scripts are already executable, but if you need to make them executable:
```bash
chmod +x update.py sync.py
```

## Integration

You can integrate these scripts into your development workflow:

- **Before starting work**: Run `sync.py` to get latest changes
- **After making changes**: Run `update.py` to backup your work
- **End of day**: Always run `update.py` to ensure work is backed up

## Support

If you encounter issues:
1. Check the error messages - they provide specific guidance
2. Ensure GitHub authentication is properly configured
3. Verify you're in the correct directory (git repository)
4. Check your internet connection for GitHub operations
