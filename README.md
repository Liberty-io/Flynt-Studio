# Flynt Studio

Your Personal Developer Assistant — build agentic AI projects rapidly.

Flynt Studio is a production-ready platform for turning ideas into working projects using a small agent framework, a powerful CLI, and multi-provider LLM integration. It helps you go from ideation → planning → code generation → execution with safe file operations, rollback, and test-mode support.

---

## Highlights

- Fully functional CLI with 16 commands for end-to-end workflows
- Agent framework (IdeaAgent, PlannerAgent, CoderAgent, NotebookAgent)
- Multi-provider LLM integration with graceful fallbacks
- Deterministic test-mode for offline development and CI
- Safe file operations with backups and rollback
- SQLite persistence for projects, tasks and execution history
- Supports Python, JavaScript, and TypeScript code generation

---

## Quick features overview

- CLI: 16 commands available (see below)
- Agents: IdeaAgent, PlannerAgent, CoderAgent, NotebookAgent
- Core modules: CLI, Agent framework, StateManager (SQLite), Execution Engine
- File structure produced by code gen: src/, tests/, config/
- Config: YAML-based with environment variable support

---

## CLI Commands

All commands are available through the `flynt` CLI. Example: `flynt --help`

- init — Initialize Flynt
- new — Create new project
- list — List all projects
- show — Display project details
- ideate — Start ideation phase
- plan — Break down into tasks
- execute — Run code generation
- code — Generate code directly
- config — Manage configuration
- llm-health — Check LLM provider status
- roadmap — View project roadmap
- status — Project status overview
- tasks — Manage project tasks
- history — View execution history
- review — Code review functionality
- rollback — Rollback changes

---

## Agent Framework

Agents inherit from a BaseAgent with standardized lifecycle, logging and LLM client integration.

- IdeaAgent
  - Researches trends, brainstorms ideas, refines concepts
- PlannerAgent
  - Breaks project into tasks, identifies dependencies and milestones
- CoderAgent
  - Generates production-ready code (Python, JavaScript, TypeScript)
  - Supports test-mode with deterministic stubs
- NotebookAgent
  - Generates reproducible Jupyter notebooks for data-workflows

All agents include verbose logging and an execution interface for orchestration.

---

## Typical Workflow

1. Create a new project
   - flynt new "My Project"
2. Ideate
   - flynt ideate "My Project"
3. Plan
   - flynt plan "My Project"
4. Generate code (test-mode available)
   - flynt execute "My Project" --test-mode
5. Review / Show
   - flynt show "My Project"
6. Rollback if needed
   - flynt rollback "My Project"

Example:
```bash
$ flynt new "RAG Chatbot for Job Search"
$ flynt ideate "RAG Chatbot for Job Search"
$ flynt plan "RAG Chatbot for Job Search"
$ flynt execute "RAG Chatbot for Job Search" --test-mode
$ flynt show "RAG Chatbot for Job Search"
```

---

## Installation (developer)

These are general steps — adjust for your environment.

1. Clone the repo:
   - git clone https://github.com/Liberty-io/Flynt-Studio.git
2. Create a virtualenv and install dependencies:
   - python -m venv .venv
   - source .venv/bin/activate
   - pip install -r requirements.txt
3. Configure credentials and settings (YAML + environment variables)
   - Copy `config/example.yaml` -> `config/local.yaml` and set API keys or use env vars
4. Run the CLI:
   - flynt --help
   - or python -m flynt <command>

Notes:
- Flynt supports multiple LLM providers (Gemini, Groq, OpenRouter, Ollama, etc.). Configure provider credentials in YAML or ENV.
- Use `--test-mode` when you want deterministic offline behavior (useful for CI or development without LLM calls).

---

## Persistence & State

- SQLite database: Flynt.db
- Models for Project and Task tracking
- History of executions and status tracking are persisted for reproducibility and auditing

---

## Logging & Safety

- Structured logging to console and file
- Safe file operations: create with backup, validate before apply, and rollback support
- Execution engine applies patches and keeps traceable changes

---

## Contributing

We welcome contributions.

- Open issues for bug reports and feature requests
- Use branches for changes and create PRs targeting the `main` branch
- Include tests and update documentation when applicable
- Run the test suite and linters before submitting PRs

Suggested local workflow:
```bash
git checkout -b feat/my-change
# make changes
pytest
# commit and push
```

---

## Validation & Status

Current internal validation (from system overview):

- Syntax: 16/16 files passed
- Imports: 9/9 classes functional
- CLI: 16/16 commands registered
- Agents: 4/4 initialized
- Workflow: End-to-end tested
- Code Gen: Produces valid files
- System Status: Fully operational, production-ready (per internal checks)

---

## License

This repository is licensed under the MIT License. See LICENSE for details.

---

## Contact

Maintainers: Liberty-io
Repository: https://github.com/Liberty-io/Flynt-Studio

If you need help getting started, open an issue or reach out via the repo discussions.
