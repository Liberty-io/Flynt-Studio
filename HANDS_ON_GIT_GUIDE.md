# Hands-On Git & GitHub Deployment Guide

This guide walks you through the complete process of pushing Flynt Studio to GitHub.

## 🎯 Learning Objectives

By the end of this, you'll understand:
- ✅ How Git tracks changes
- ✅ How to stage and commit work
- ✅ How to push code to GitHub
- ✅ How to use GitHub as your project's home
- ✅ How to collaborate with git branches
- ✅ How to document your development progress

---

## Phase 1: Git Basics (Understanding)

### What is Git?
Git is version control - it tracks every change you make to files. Think of it like:
- **Save points** in a video game (commits)
- **Checkpoint history** you can return to
- **Collaboration** mechanism (multiple people can work on same project)

### What is GitHub?
GitHub is a cloud hosting service for Git repositories. It's like:
- **Google Drive** for code (cloud backup)
- **Portfolio** for your projects
- **Collaboration platform** (see others' code, contribute)

### Key Terms

| Term | Meaning |
|------|---------|
| **Repository (Repo)** | Folder with all your project files + Git history |
| **Commit** | A snapshot of changes with a message |
| **Stage** | Mark files to be included in next commit |
| **Branch** | Parallel version of your code (for features) |
| **Push** | Send commits from your computer to GitHub |
| **Pull** | Get commits from GitHub to your computer |
| **Remote** | Link to GitHub repository |

---

## Phase 2: Initial Setup (Hands-On)

### 2.1 Check Git Installation

Once the installer finishes, open PowerShell and run:

```powershell
git --version
```

Expected output:
```
git version 2.43.0.windows.1
```

If it fails, Git isn't in PATH yet. Restart PowerShell or computer.

### 2.2 Configure Git Identity

```powershell
# Tell Git who you are (used on every commit)
git config --global user.name "John Doe"
git config --global user.email "john@example.com"

# Verify it worked
git config --list
```

**Why?** Every commit needs an author. GitHub will link commits to your account.

### 2.3 Navigate to Project

```powershell
cd C:\Users\user\Desktop\FlyntStudio

# Verify location
pwd  # Shows: C:\Users\user\Desktop\FlyntStudio
```

---

## Phase 3: Initialize Repository (Hands-On)

### 3.1 Initialize Git

```powershell
# Create .git folder (hidden Git metadata)
git init

# Verify
git status
```

Expected output:
```
On branch master

No commits yet

nothing to commit
```

**What happened?** Git created a `.git` folder that tracks all changes.

### 3.2 Check Current Status

```powershell
git status
```

Expected output shows:
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        frontend/
        backend_main.py
        requirements.txt
        ... (many more files)
```

**Explanation**: Git sees all your files but hasn't tracked them yet.

---

## Phase 4: Staging Files (Hands-On)

### 4.1 Review What Will Be Committed

```powershell
# See all files that could be committed
git status
```

### 4.2 Create .gitignore (Skip Unnecessary Files)

We don't want to commit `node_modules/`, virtual environments, etc.

```powershell
# The .gitignore file already exists in frontend/
# Let's check it
Get-Content frontend\.gitignore
```

### 4.3 Stage All Files

```powershell
# Add all files to staging area
git add .

# Verify what's staged
git status
```

Expected output:
```
On branch master

No commits yet

Changes to be committed:
  (use "rm --cached <file>..." to unstage)
        new file:   .github/workflows/ci.yml
        new file:   .gitignore
        new file:   API_CONTRACT.md
        ... (many files in green)
```

**Explanation**: All files are now marked to be included in the next commit.

### 4.4 Understanding Staging

```
Working Directory  →  Staging Area  →  Git Repository
(files on disk)      (git add .)      (git commit)
```

This two-step process lets you:
- Choose which files to commit
- Review changes before committing
- Split changes into logical chunks

---

## Phase 5: Create First Commit (Hands-On)

### 5.1 Commit Staged Files

```powershell
git commit -m "feat: initial Flynt Studio project setup - phases 0-7"
```

**What this does**: Creates a snapshot with all staged files.

### 5.2 Verify Commit

```powershell
git log
```

Expected output:
```
commit abc123def456... (HEAD -> master)
Author: John Doe <john@example.com>
Date:   Thu Dec 22 10:00:00 2025 -0500

    feat: initial Flynt Studio project setup - phases 0-7
```

**Explanation**: Your commit is now in local Git history with unique ID.

### 5.3 View Commit Details

```powershell
git log --oneline              # Shorter format
git log -p                     # Show all changes in each commit
git show HEAD                  # Show details of latest commit
```

---

## Phase 6: Connect to GitHub (Hands-On)

### 6.1 Create GitHub Repository

**In web browser**:
1. Go to https://github.com/new
2. **Repository name**: `FlyntStudio`
3. **Description**: `LangFlow-like AI workflow builder with Human-in-the-Loop controls`
4. **Visibility**: Choose Public (others can learn) or Private
5. **Initialize with**: Leave unchecked (we already have files)
6. Click **Create repository**

**Result**: GitHub shows you instructions like:
```
git remote add origin https://github.com/YOUR_USERNAME/FlyntStudio.git
git branch -M main
git push -u origin main
```

### 6.2 Add Remote (Link Local to GitHub)

```powershell
# Replace YOUR_USERNAME
git remote add origin https://github.com/YOUR_USERNAME/FlyntStudio.git

# Verify it worked
git remote -v
```

Expected output:
```
origin  https://github.com/YOUR_USERNAME/FlyntStudio.git (fetch)
origin  https://github.com/YOUR_USERNAME/FlyntStudio.git (push)
```

**Explanation**: `origin` is the name for your GitHub repo. You can have multiple remotes!

### 6.3 Rename Branch to `main`

GitHub uses `main` (inclusive) instead of `master` (old default).

```powershell
git branch -M main

# Verify
git branch
```

Expected output:
```
* main
```

---

## Phase 7: Push to GitHub (Hands-On)

### 7.1 First Push (Upload History)

```powershell
git push -u origin main
```

**-u flag**: Sets `main` as the default upstream branch for future pushes.

### 7.2 Authenticate with GitHub

GitHub will prompt you to authenticate:

**Option A: Personal Access Token (Recommended)**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Scopes: Select `repo`, `workflow`, `user:email`
4. Copy the token
5. Paste as password when prompted

**Option B: SSH Key (Advanced)**
```powershell
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub Settings → SSH keys
Get-Content ~/.ssh/id_ed25519.pub

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/FlyntStudio.git
```

### 7.3 Verify Push

```powershell
git log --oneline -n 3
```

Should show your commits. Then visit GitHub.com:
- Go to https://github.com/YOUR_USERNAME/FlyntStudio
- Should see your files!

---

## Phase 8: Daily Workflow (Repeat)

### 8.1 Make Changes in Editor

Edit files like usual (e.g., add Phase 8 features).

### 8.2 Check Status

```powershell
git status
```

Shows what changed:
```
Changes not staged for commit:
  modified:   frontend/src/App.tsx
  modified:   PHASE8_PLAN.md
```

### 8.3 Review Changes

```powershell
# See exact changes
git diff

# See specific file changes
git diff frontend/src/App.tsx

# Stage-by-stage comparison
git diff --cached
```

### 8.4 Stage Changes

```powershell
# Option 1: Stage all
git add .

# Option 2: Stage specific file
git add frontend/src/App.tsx

# Option 3: Interactive staging
git add -p  # Prompts for each chunk
```

### 8.5 Commit

```powershell
git commit -m "feat: phase 8 - agent graph visualization

- Add D3.js for network visualization
- Create AgentGraph component
- Wire to agentService events
- Add zoom/pan controls
- Style with dark theme support"
```

**Good commit messages**:
- First line: short summary (50 chars)
- Blank line
- Detailed explanation (wrapped at 72 chars)
- Bullet points for changes

### 8.6 Push

```powershell
git push
```

Now simpler (no -u flag needed).

### 8.7 Verify on GitHub

Visit https://github.com/YOUR_USERNAME/FlyntStudio and see new commit!

---

## Phase 9: Branching for Features (Advanced)

### 9.1 Why Branches?

Branches let you:
- Work on features independently
- Keep `main` branch stable
- Test features before merging
- Collaborate without conflicts

### 9.2 Create Feature Branch

```powershell
# Create new branch
git checkout -b phase-8-features

# Verify you're on new branch
git branch
```

Expected output:
```
* phase-8-features
  main
```

### 9.3 Make Changes on Branch

```powershell
# Edit files...

# Commit as usual
git add .
git commit -m "feat: add agent graph visualization"

# Push new branch to GitHub
git push -u origin phase-8-features
```

### 9.4 Create Pull Request (PR)

On GitHub.com:
1. You'll see a notification: "Your branch phase-8-features had recent pushes"
2. Click "Compare & pull request"
3. Add description of changes
4. Click "Create pull request"

**Benefits**:
- Code review before merge
- Discussion on changes
- CI/CD tests run automatically
- Professional workflow

### 9.5 Merge Branch

```powershell
# Switch to main
git checkout main

# Update main from GitHub
git pull

# Merge feature branch
git merge phase-8-features

# Delete feature branch
git branch -d phase-8-features

# Push merged code
git push
```

---

## Phase 10: Useful Commands Reference

### View History
```powershell
git log                     # Full history
git log --oneline           # Short format
git log --graph --all       # Visual tree
git log -n 5                # Last 5 commits
git log --author="John"     # Filter by author
git log --since="2 weeks ago"  # Filter by date
git show <commit-id>        # Details of specific commit
```

### Undo Changes
```powershell
git status                  # What changed?
git diff                    # See exact changes
git restore <file>          # Discard changes to file
git restore --staged <file> # Unstage file
git reset HEAD~1            # Undo last commit (keep changes)
git revert HEAD             # Create commit that undoes last commit
git log --oneline           # Find commit to undo
git reset <commit-id>       # Go back to specific commit
```

### Branches
```powershell
git branch                  # List local branches
git branch -a               # List all (including remote)
git branch -d <branch>      # Delete local branch
git branch -D <branch>      # Force delete
git checkout -b <new>       # Create and switch
git checkout <existing>     # Switch branch
git merge <branch>          # Merge into current branch
git rebase main             # Rebase onto main (advanced)
```

### Remote
```powershell
git remote -v               # List remotes
git remote add <name> <url> # Add new remote
git fetch                   # Get updates from GitHub
git pull                    # Fetch + merge
git push                    # Send commits to GitHub
git clone <url>             # Download entire repo
```

---

## Phase 11: Mistakes & Recovery

### Forgot to Commit Something
```powershell
git add forgotten_file.txt
git commit --amend --no-edit
# Amends latest commit without changing message
```

### Committed to Wrong Branch
```powershell
git reset HEAD~1        # Undo commit, keep changes
git checkout -b new-branch  # Create correct branch
git add .
git commit -m "message"
```

### Pushed Wrong Code
```powershell
git revert HEAD         # Create commit that undoes it
git push                # Push the undo commit

# Or (if not shared with others):
git reset --hard HEAD~1 # Remove commit
git push --force-with-lease # Careful!
```

### Want to See What Changed
```powershell
git diff HEAD~1         # Compare to previous commit
git diff main..feature  # Compare two branches
git log -p <file>       # History of file
git blame <file>        # Who changed each line
```

---

## Phase 12: Collaboration (Team Work)

### Before Starting Work
```powershell
git checkout main
git pull    # Get latest from team
```

### While Working
```powershell
git add .
git commit -m "feat: my feature"
git push -u origin my-feature
```

### Code Review
1. Create Pull Request on GitHub
2. Team reviews and comments
3. Make requested changes:
   ```powershell
   git add .
   git commit -m "review: address feedback"
   git push
   ```
4. PR automatically updates

### Merging
1. Team approves PR
2. Click "Merge" on GitHub or:
   ```powershell
   git checkout main
   git pull
   git merge my-feature
   ```

---

## Learning Checklist

After completing this guide, you should be able to:

- [ ] Explain what Git is (version control)
- [ ] Explain what GitHub is (cloud hosting)
- [ ] Initialize a Git repository
- [ ] Stage files for commit
- [ ] Create meaningful commits
- [ ] Push code to GitHub
- [ ] Create and switch branches
- [ ] Merge branches
- [ ] Use git status, log, diff commands
- [ ] Handle basic mistakes
- [ ] Explain commit history to others

---

## Next Steps

1. **Once Git installs**: Follow Phase 2-7 above
2. **After first push**: You have a backup on GitHub!
3. **Each phase**: Commit with `feat: phase X - description`
4. **When ready to share**: Send GitHub URL to team/friends
5. **For portfolio**: Link to GitHub in resume/portfolio

---

## Resources

- **Git Docs**: https://git-scm.com/doc
- **GitHub Guides**: https://guides.github.com/
- **Interactive Tutorial**: https://learngitbranching.js.org/
- **30-day challenge**: https://git-tips.github.io/

---

**Happy committing! 🚀**

Your code is now version-controlled and backed up on GitHub!
