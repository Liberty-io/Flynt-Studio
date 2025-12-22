# GitHub Workflow Guide for Flynt Studio

This guide helps you commit and push your changes to GitHub as you continue development.

## Prerequisites

1. **Git installed** - Download from [git-scm.com](https://git-scm.com/download/win)
2. **GitHub account** - Create at [github.com](https://github.com)
3. **GitHub repository** - Create a new repo at github.com (don't initialize with README)

---

## Step 1: Initialize Git Repository (First Time Only)

```bash
cd C:\Users\user\Desktop\FlyntStudio

# Initialize git
git init

# Configure your identity (one-time setup)
git config user.name "Your Name"
git config user.email "your-email@example.com"

# Or set globally (applies to all repos)
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

---

## Step 2: Create .gitignore File

Add this to the project root to exclude unnecessary files:

```bash
# At: C:\Users\user\Desktop\FlyntStudio\.gitignore
```

**File content** (already partially created in frontend/):

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
venv/
ENV/
.venv

# Node/Frontend
frontend/node_modules/
frontend/dist/
frontend/coverage/
frontend/.env.local
frontend/.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
*.o
*.a

# Environment
.env
.env.production

# Testing
.coverage
htmlcov/

# Docker
.dockerignore
```

---

## Step 3: Stage and Commit Files (Daily Workflow)

### Check status
```bash
git status
```

### Stage all changes
```bash
# Add all new/modified files
git add .

# Or add specific files
git add frontend/src/pages/HITLControlView.tsx
git add backend_main.py
```

### Commit with descriptive message
```bash
# Good commit message format: <type>: <description>
git commit -m "feat: add accessibility improvements to HITL components"

# Examples:
git commit -m "feat: implement error boundary and toast notifications"
git commit -m "fix: rename toast.ts to toast.tsx for JSX support"
git commit -m "docs: add deployment and API contract documentation"
git commit -m "refactor: optimize Vite build configuration"
git commit -m "test: add unit tests for agentService"
```

**Commit message best practices:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `perf:` - Performance improvements
- `chore:` - Maintenance tasks

---

## Step 4: Connect to GitHub (First Time Only)

### Create repository on GitHub

1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `FlyntStudio` (or your preferred name)
3. **Description**: "LangFlow-like AI workflow builder with HITL"
4. **Public or Private**: Your choice
5. **Do NOT initialize with README** (we have files already)
6. Click "Create repository"

### Add remote origin

```bash
# Replace YOUR_USERNAME and REPO_NAME with your values
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Verify it worked
git remote -v
# Should show:
# origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (fetch)
# origin  https://github.com/YOUR_USERNAME/REPO_NAME.git (push)
```

### Set default branch
```bash
git branch -M main
```

---

## Step 5: Push to GitHub

### First push (establishes tracking)
```bash
git push -u origin main
```

### Subsequent pushes (simpler)
```bash
git push
```

---

## Daily Workflow Summary

Each development session, follow this pattern:

```bash
# 1. Check what changed
git status

# 2. Review changes (optional)
git diff

# 3. Stage your changes
git add .

# 4. Commit with a message
git commit -m "feat: description of what you did"

# 5. Push to GitHub
git push
```

---

## Useful Git Commands

### View commit history
```bash
git log                    # See all commits
git log --oneline         # Shorter format
git log -n 5              # Last 5 commits
```

### View changes before committing
```bash
git diff                  # Unstaged changes
git diff --cached         # Staged changes
git diff HEAD~1           # Last commit vs current
```

### Undo changes
```bash
git restore <filename>    # Discard unstaged changes
git restore --staged <filename>  # Unstage a file
git reset HEAD~1          # Undo last commit (keep changes)
git revert HEAD           # Create new commit that undoes last commit
```

### Create branches (optional but recommended)
```bash
git branch phase-7-features      # Create branch
git checkout phase-7-features    # Switch to branch
git checkout -b phase-8-features # Create and switch in one command

# Push branch to GitHub
git push -u origin phase-7-features

# Switch back to main
git checkout main
git pull  # Get latest from GitHub
```

### Merge branches
```bash
git checkout main
git pull  # Get latest
git merge phase-7-features
git push
```

---

## Authentication: SSH vs HTTPS

### HTTPS (Easier, password-based)
```bash
# GitHub will ask for username/password or personal token on push
# Or use GitHub CLI for automatic authentication
```

### SSH (More secure, key-based)

**Generate SSH key** (one-time):
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# Press Enter for defaults
# Add passphrase (optional but recommended)
```

**Add to GitHub**:
1. Copy key: `type C:\Users\YOUR_USERNAME\.ssh\id_ed25519.pub`
2. Go to GitHub Settings → SSH and GPG keys → New SSH key
3. Paste the public key
4. Click "Add SSH key"

**Update remote to use SSH**:
```bash
git remote remove origin
git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

---

## Phase-Based Commit Strategy

After completing each phase, create a summary commit:

```bash
# Phase 6 Complete
git add .
git commit -m "feat: phase 6 - testing infrastructure and CI/CD setup

- Add Vitest configuration with jsdom
- Implement unit tests for agentService and a2ui-adapter
- Add component tests for DynamicForm and HITLControlView
- Configure ESLint and Prettier
- Expand GitHub Actions CI pipeline
- Update frontend README with test documentation"

# Phase 7 Complete
git add .
git commit -m "feat: phase 7 - polish and deployment

- Add accessibility improvements (ARIA labels, keyboard nav)
- Implement error boundary and loading spinner
- Add toast notification system
- Optimize Vite build with code splitting
- Add Dockerfile and docker-compose
- Write deployment guide for Vercel/Netlify/Docker
- Document API contract and environment setup"

git push
```

---

## GitHub Desktop Alternative

If you prefer a GUI, use **GitHub Desktop**:
1. Download from [desktop.github.com](https://desktop.github.com)
2. Sign in with GitHub account
3. Clone or create repository
4. Make changes in your editor
5. GitHub Desktop shows changed files
6. Write commit message
7. Click "Commit to main"
8. Click "Push origin"

---

## Collaborating with Others (Future)

When you have collaborators:

```bash
# Pull latest changes from others
git pull

# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: implement new feature"

# Push your branch
git push -u origin feature/new-feature

# Go to GitHub → Create Pull Request
# Wait for review → Merge when approved
```

---

## Recommended Initial Commits

Based on your current project state, here's a good first set of commits:

```bash
# Commit 1: Project structure and phase 0-2
git add .
git commit -m "feat: initial project setup with core UI scaffolding"

# Commit 2: Phase 3-5 features
git add .
git commit -m "feat: implement HITL controls and agent activity"

# Commit 3: Phase 6 testing
git add .
git commit -m "test: add comprehensive test suite and CI/CD pipeline"

# Commit 4: Phase 7 polish
git add .
git commit -m "feat: add accessibility, error handling, and deployment config"

git push
```

---

## Troubleshooting

### "fatal: not a git repository"
```bash
# You're not in the project directory, or git isn't initialized
git init
```

### "fatal: The remote origin already exists"
```bash
# Remote was added twice
git remote remove origin
git remote add origin <your-url>
```

### Authentication failed
```bash
# If using HTTPS and GitHub changed password/token requirements:
# 1. Use personal access token instead of password
# 2. Or switch to SSH (see SSH section above)
# 3. Or use GitHub Desktop for automatic auth
```

### Forgot to add a file to last commit
```bash
git add forgotten_file.ts
git commit --amend --no-edit
git push --force-with-lease  # Careful! Only if not shared with others
```

---

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub CLI](https://cli.github.com/) - Alternative to Git commands

---

**Next**: Follow the daily workflow above as you continue building. Create meaningful commits that describe what you changed. This keeps your project history clean and makes it easy to track progress!
