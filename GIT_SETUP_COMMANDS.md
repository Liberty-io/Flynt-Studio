# Git Setup Commands - Step by Step

Run these commands in PowerShell or Command Prompt once Git installation completes.

## Step 1: Verify Git Installation

```powershell
git --version
```

Expected output: `git version 2.43.0.windows.1` (or similar)

---

## Step 2: Configure Git (One-Time Setup)

```powershell
# Set your name and email (required for commits)
git config --global user.name "Your Full Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

**Replace**:
- `"Your Full Name"` with your actual name
- `"your.email@example.com"` with your GitHub email

---

## Step 3: Initialize Repository

```powershell
cd C:\Users\user\Desktop\FlyntStudio

# Initialize git repository
git init

# Verify it worked
git status
```

Expected output: `On branch master` (or `main`)

---

## Step 4: Add .gitignore File

The `.gitignore` file is already in `frontend/`. Let's create one for the root:

```powershell
# You can manually create C:\Users\user\Desktop\FlyntStudio\.gitignore
# Or copy from frontend to root (if you want unified ignore rules)
```

---

## Step 5: Stage All Files

```powershell
# Check what files will be committed
git status

# Stage all changes
git add .

# View staged files
git status
```

Expected: You should see many files listed in green under "Changes to be committed"

---

## Step 6: Create First Commit

```powershell
git commit -m "feat: initial Flynt Studio project - phases 0-7 complete

- Core UI scaffolding with React, TypeScript, Vite
- Agent activity view with real-time WebSocket updates
- Human-in-the-Loop (HITL) approval flows
- Accessibility improvements (ARIA labels, keyboard nav)
- Error boundary and toast notification system
- Comprehensive test suite (Vitest, Testing Library)
- ESLint and Prettier configuration
- GitHub Actions CI/CD pipeline
- Deployment guides (Docker, Vercel, Netlify, AWS)
- API contract documentation
"
```

---

## Step 7: Create GitHub Repository

1. Go to https://github.com/new
2. **Repository name**: FlyntStudio
3. **Description**: LangFlow-like AI workflow builder with HITL
4. **Visibility**: Public or Private (your choice)
5. **Initialize with**: Do NOT check "Initialize with README"
6. Click "Create repository"

You'll see a page with:
```
git remote add origin https://github.com/YOUR_USERNAME/FlyntStudio.git
git branch -M main
git push -u origin main
```

---

## Step 8: Add Remote and Push to GitHub

```powershell
# Add GitHub as remote (replace YOUR_USERNAME and REPO)
git remote add origin https://github.com/YOUR_USERNAME/FlyntStudio.git

# Rename default branch to main
git branch -M main

# Push to GitHub (first time)
git push -u origin main

# Verify
git remote -v
```

---

## Step 9: Subsequent Commits (Daily Workflow)

```powershell
# After making changes...

# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add phase 8 features"

# Push to GitHub
git push
```

---

## Commit Message Format

Use this format for consistent commit history:

```
<type>: <description>

Optional detailed explanation of changes
```

**Types**:
- `feat:` - New feature (e.g., "feat: add agent graph visualization")
- `fix:` - Bug fix (e.g., "fix: resolve toast notification z-index issue")
- `docs:` - Documentation (e.g., "docs: update deployment guide")
- `test:` - Tests (e.g., "test: add DynamicForm component tests")
- `refactor:` - Code refactoring (e.g., "refactor: optimize agentService")
- `perf:` - Performance (e.g., "perf: add virtual list for large datasets")
- `chore:` - Maintenance (e.g., "chore: update dependencies")

---

## Example Workflow for Next Features

```powershell
# After Phase 7, when starting Phase 8:

# 1. Create feature branch (optional but recommended)
git checkout -b phase-8-features

# 2. Make changes in editor

# 3. Commit your work
git add .
git commit -m "feat: phase 8 - agent graph visualization

- Add D3.js dependency
- Create AgentGraph component
- Wire to agentService events
- Style with dark theme compatibility"

# 4. Push to GitHub
git push -u origin phase-8-features

# 5. On GitHub, create Pull Request
# 6. Review and merge (or keep branch for review)

# 7. Switch back to main and pull
git checkout main
git pull
```

---

## Helpful Git Commands

```powershell
# View commit history
git log
git log --oneline           # Shorter format
git log -n 10               # Last 10 commits
git log --graph --all       # Visual tree

# See unstaged changes
git diff

# See staged changes
git diff --cached

# Undo last commit (keep changes)
git reset HEAD~1

# Discard all local changes
git checkout -- .

# See all branches
git branch -a

# Delete local branch
git branch -D branch-name

# Update from GitHub
git pull

# Force push (careful! overwrites remote)
git push --force-with-lease
```

---

## Troubleshooting

### "fatal: not a git repository"
```powershell
# You're in wrong directory or repo not initialized
cd C:\Users\user\Desktop\FlyntStudio
git init
```

### "Author identity unknown"
```powershell
# Set global config
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

### "Permission denied" on push
```powershell
# Use HTTPS instead of SSH, or set up SSH keys
# For now, use HTTPS with GitHub personal token
git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/FlyntStudio.git
```

### Want to change last commit message
```powershell
git commit --amend -m "new message"
git push --force-with-lease
```

---

## Next: Once Git is Installed

1. Follow steps 1-8 above
2. Your code will be on GitHub
3. You can commit after each phase
4. Push major milestones
5. Share the GitHub URL with collaborators

**Questions?** Check [git-scm.com/doc](https://git-scm.com/doc)
