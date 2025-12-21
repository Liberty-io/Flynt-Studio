"""
# 🚀 Flynt - Personal Developer Assistant for Agentic AI Projects

> Build agentic AI projects from idea to deployment with AI-powered assistance.

Flynt is a meta-agentic system that helps you build and complete agentic AI projects by orchestrating specialized AI agents on your behalf. Stay focused, move fast, and turn inspirations into deployable prototypes.

## ✨ Features

### Current (App Shell - Phase 1)
- ✅ **Multi-Provider LLM Support** - Gemini (free tier) + Groq (free fallback)
- ✅ **Project Management** - Track projects from ideation to deployment
- ✅ **State Persistence** - SQLite-based project and task tracking
- ✅ **Intelligent Configuration** - YAML-based settings with environment variable support
- ✅ **Windows 11 Native** - No Docker required
- ✅ **Automatic Fallback** - Seamlessly switch between LLM providers
- ✅ **Usage Tracking** - Monitor token usage even on free tiers

### Coming Soon (Phase 2+)
- 🔄 **Idea Agent** - Research trends, brainstorm variations, refine concepts
- 🔄 **Planner Agent** - Decompose projects into actionable tasks
- 🔄 **Coder Agent** - Generate, test, and debug code
- 🔄 **Execution Loop** - Iterative development with human-in-the-loop
- 🔄 **Focus Enforcement** - Smart reminders and progress tracking
- 🔄 **Catch-Up Mechanism** - Stay current with agentic AI developments

## 🎯 Why Flynt?

**The Problem:**
- Losing focus across the project lifecycle
- Keeping up with rapidly evolving AI tech
- Bridging the gap from inspiration to deployed code
- Managing scope creep and maintaining momentum

**The Solution:**
Flynt acts as your persistent co-pilot, handling repetitive tasks, generating ideas, and pushing projects forward while keeping you in the creative driver's seat.

## 🛠️ Installation

### Prerequisites
- **Python 3.10+** (Check: `python --version`)
- **Git** (Optional, for version control)
- **API Keys** - Free tier from Gemini or Groq

### Step 1: Set Up Python Environment

```bash
# Clone or download Flynt
git clone <repository-url>
cd flynt

# Create virtual environment (Windows)
python -m venv venv

# Activate virtual environment
# PowerShell:
.\venv\Scripts\Activate.ps1
# CMD:
.\venv\Scripts\activate.bat

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Get Free API Keys

**Gemini (Recommended - Primary):**
1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create API key (no credit card required)
4. Copy your key

**Groq (Optional - Fallback):**
1. Visit: https://console.groq.com/
2. Sign up for free account
3. Generate API key
4. Copy your key

### Step 3: Configure API Keys

**Option A: Environment Variables (Recommended)**

Windows PowerShell:
```powershell
$env:GEMINI_API_KEY="your_gemini_key_here"
$env:GROQ_API_KEY="your_groq_key_here"  # Optional
```

Windows CMD:
```cmd
set GEMINI_API_KEY=your_gemini_key_here
set GROQ_API_KEY=your_groq_key_here
```

**To make keys persistent:**
1. Search "Environment Variables" in Windows
2. Click "Environment Variables" button
3. Add new User variables with your keys

**Option B: .env File**
```bash
# Copy example file
copy .env.example .env

# Edit .env and add your keys
notepad .env
```

### Step 4: Install Flynt

```bash
# Install in development mode
pip install -e .

# Verify installation
flynt --version
```

### Step 5: Initialize Flynt

```bash
flynt init
```

You should see:
```
✓ Configuration loaded
✓ Database initialized
✓ Primary LLM: gemini-1.5-flash
✓ Fallback LLM: llama-3.1-70b-versatile
✨ Flynt is ready!
```

## 🚦 Quick Start

### Create Your First Project

```bash
# Create a new project
flynt new "RAG Chatbot for Job Search" -d "Build an intelligent job search assistant"

# List all projects
flynt list

# View project details
flynt show "RAG Chatbot for Job Search"

# Check system status
flynt status
```

### Project Workflow (Current Phase)

1. **Initialize** - Set up your project
   ```bash
   flynt new "My Project"
   ```

2. **Ideate** - Coming in Phase 2!
   ```bash
   flynt ideate "My Project"
   ```

3. **Plan** - Coming in Phase 2!
   ```bash
   flynt plan "My Project"
   ```

4. **Execute** - Coming in Phase 2!
   ```bash
   flynt run "My Project"
   ```

## 📂 Project Structure

```
flynt/
├── cli/
│   └── main.py              # CLI interface
├── core/
│   ├── config.py            # Configuration management
│   ├── state.py             # State & persistence
│   └── llm_client.py        # Multi-provider LLM client
├── agents/                  # AI agents (Phase 2+)
│   ├── base.py
│   ├── idea_agent.py
│   ├── planner_agent.py
│   └── coder_agent.py
├── tools/                   # Agent tools (Phase 2+)
│   ├── research.py
│   ├── code_runner.py
│   └── git_ops.py
├── config/
│   └── settings.yaml        # User configuration
├── data/
│   └── flynt.db            # SQLite database
├── logs/
│   └── flynt.log           # Application logs
├── requirements.txt
├── setup.py
└── README.md
```

## 🎮 Commands

```bash
flynt init              # Initialize Flynt
flynt new NAME          # Create new project
flynt list              # List all projects
flynt show NAME         # Show project details
flynt status            # Show system status
flynt config            # View/edit configuration
flynt ideate NAME       # Start ideation (Phase 2)
flynt --help            # Show help
```

## ⚙️ Configuration

Edit `config/settings.yaml` to customize:

```yaml
llm:
  primary_provider: "gemini"
  fallback_provider: "groq"
  
  gemini:
    model: "gemini-1.5-flash"
    temperature: 0.7
    max_tokens: 4096
    
  groq:
    model: "llama-3.1-70b-versatile"
    temperature: 0.7
    max_tokens: 4096

system:
  max_retries: 3
  timeout: 30
  debug: false
```

## 💰 Cost Management (Free Tiers)

### Gemini Free Tier Limits:
- **1.5 Flash**: 15 req/min, 1M tokens/day, 1500 req/day
- **1.5 Pro**: 2 req/min, 50 req/day

### Groq Free Tier Limits:
- **14,400 requests/day** across models
- Ultra-fast inference

**Flynt automatically:**
- Tracks usage across providers
- Falls back when rate limits hit
- Logs all API calls for monitoring

## 🔧 Troubleshooting

### "No API keys detected"
- Ensure environment variables are set
- Restart terminal after setting variables
- Check spelling: `GEMINI_API_KEY` not `GEMINI_KEY`

### "Package not installed" errors
```bash
pip install google-generativeai groq
```

### Database locked errors
- Close any other Flynt instances
- Check `data/flynt.db` isn't opened elsewhere

### Import errors
```bash
# Reinstall Flynt
pip install -e .
```

## 🗺️ Roadmap

- [x] **Phase 1: App Shell** - Configuration, state, LLM client, CLI
- [ ] **Phase 2: Idea Agent** - Research, brainstorming, concept refinement
- [ ] **Phase 3: Planner Agent** - Task decomposition, milestone planning
- [ ] **Phase 4: Coder Agent** - Code generation, testing, debugging
- [ ] **Phase 5: Execution Loop** - Iterative development workflow
- [ ] **Phase 6: Advanced Features** - Focus tracking, catch-up mechanism

## 🤝 Contributing

Flynt is in active development! Contributions welcome.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with:
- Google Gemini API
- Groq API
- Click (CLI framework)
- SQLite (persistence)

---

**Ready to build?** Run `flynt init` and start creating! 🚀