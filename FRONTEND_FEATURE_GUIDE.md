# 🎨 Flynt Studio Frontend - Complete Feature Guide

## Overview

Flynt Studio now includes a **production-ready React frontend** with:

1. **Drag-and-Drop Workflow Builder** (Like LangFlow)
2. **Integrated AI Co-pilot** for natural language interaction
3. **Human-in-the-Loop** participation and execution control
4. **Real-time Collaboration** features
5. **Professional UI** with dark theme and glassmorphism

---

## 📦 What's Included

### Frontend Components

```
frontend/
├── src/
│   ├── components/
│   │   ├── CopilotPanel.tsx          ✨ AI assistant chat interface
│   │   ├── WorkflowCanvas.tsx        🎨 React Flow visual designer
│   │   ├── Header.tsx                📱 Navigation header
│   │   ├── Layout.tsx                📦 Main layout wrapper
│   │   └── nodes/
│   │       ├── AgentNode.tsx         🤖 Agent execution nodes
│   │       ├── InputNode.tsx         📥 Input/Start nodes
│   │       ├── OutputNode.tsx        📤 Output/End nodes
│   │       └── ValidatorNode.tsx     ✓ Validation nodes
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx             📊 Projects list & creation
│   │   ├── WorkflowBuilder.tsx       🔧 Main editor with 3-panel layout
│   │   └── ProjectDetails.tsx        📋 Project info & execution history
│   │
│   ├── store/
│   │   └── index.ts                  ⚙️ Zustand state management
│   │
│   ├── services/
│   │   └── api.ts                    🌐 API client (Axios)
│   │
│   └── styles/
│       └── globals.css               🎨 Global styles & animations
│
├── package.json                       📚 Dependencies
├── vite.config.ts                    ⚡ Build configuration
├── tailwind.config.ts                🎨 Tailwind theming
├── README.md                         📖 Frontend README
├── FRONTEND_SETUP.md                 🚀 Setup instructions
└── BACKEND_INTEGRATION.md            🔌 API endpoint guide
```

### Backend Integration

```
core/
└── frontend_api.py                   🔌 FastAPI endpoints for frontend
```

---

## 🚀 Getting Started

### Step 1: Setup Backend First

Ensure your Flynt Studio backend is running:

```bash
# In root directory
python -m pip install -r requirements.txt
python cli/main.py init
```

### Step 2: Install Frontend

```bash
cd frontend
npm install
```

### Step 3: Setup Backend API Endpoints

Update your `main.py` or create one:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.frontend_api import setup_frontend_api

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup frontend API routes
setup_frontend_api(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Step 4: Run Everything

**Terminal 1 - Backend:**
```bash
python main.py
# Backend starts on http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend starts on http://localhost:3000
```

### Step 5: Open in Browser

```
http://localhost:3000
```

---

## 🎯 Feature Walkthrough

### 1. Dashboard - Project Management

**Page**: `http://localhost:3000`

```
┌─────────────────────────────────────────┐
│  FLYNT Studio                           │
├─────────────────────────────────────────┤
│                                         │
│  [+ New Project]                       │
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ RAG Chatbot  │  │ Data Pipeline│   │
│  │ In Progress  │  │ Draft        │   │
│  │ [Edit] [Del] │  │ [Edit] [Del] │   │
│  └──────────────┘  └──────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Features:**
- ✅ Create new projects
- ✅ View project status
- ✅ Edit or delete projects
- ✅ Quick access to workflow builder

---

### 2. Workflow Builder - Visual Design

**Page**: `http://localhost:3000/project/{id}/workflow`

```
┌─────────────────────────────────────────────────────────────────┐
│                         FLYNT Studio                            │
├─────────────────────────────────────────────────────────────────┤
│
│  ┌────────────────┐  ┌──────────────────────┐  ┌─────────────┐
│  │ AGENTS         │  │   WORKFLOW CANVAS    │  │  CO-PILOT   │
│  ├────────────────┤  ├──────────────────────┤  ├─────────────┤
│  │                │  │                      │  │             │
│  │ 💡 Idea        │  │  ┌───────────────┐  │  │ 🤖 Ask AI  │
│  │ 💻 Coder       │  │  │ Input: Idea   │  │  │             │
│  │ 📊 Data Sci    │  │  └───────┬───────┘  │  │ _________   │
│  │ 🔒 Security    │  │          │          │  │ |Message |  │
│  │ 🔧 MLOps       │  │  ┌───────▼───────┐  │  │ |_______|  │
│  │ ✓ Validator    │  │  │ Coder Agent   │  │  │ [Send]      │
│  │                │  │  └───────┬───────┘  │  │             │
│  │  [Execute]     │  │          │          │  │ Suggestions │
│  │  [Back]        │  │  ┌───────▼───────┐  │  │ • Add VAL   │
│  │                │  │  │ Output        │  │  │ • Add SEC   │
│  └────────────────┘  │  └───────────────┘  │  │             │
│                      │                      │  │             │
│                      │  [Save] [Execute]   │  │             │
│                      └──────────────────────┘  └─────────────┘
│
└─────────────────────────────────────────────────────────────────┘
```

**Features:**

#### Left Panel - Agent Library
- 6 pre-configured agent types
- Drag agents to canvas
- Visually distinct colors
- Quick execute button

#### Center Panel - Workflow Designer
- **Nodes**: Drag agents, define inputs/outputs
- **Edges**: Connect nodes to create flow
- **Controls**: Save, Execute, Delete
- **Node Inspector**: View/edit selected node
- **Auto-layout**: Grid snapping
- **Mini Map**: Overview of large workflows

#### Right Panel - AI Co-pilot
- Chat interface
- Real-time responses
- Code syntax highlighting
- Smart suggestions
- Context-aware help

---

### 3. Project Details - Execution History

**Page**: `http://localhost:3000/project/{id}`

```
Status: In Progress
Created: Jan 15, 2024
Last Modified: Jan 16, 2024

Workflow Summary:
├─ Nodes: 3 agents
├─ Connections: 2 edges
└─ Agents: [Coder] [Validator] [Deployer]

Execution History:
├─ exec_001 ✓ Completed (Jan 16)
├─ exec_002 ✓ Completed (Jan 15)
└─ exec_003 ⏳ Running...
```

**Features:**
- ✅ View project status
- ✅ Check workflow structure
- ✅ See execution history
- ✅ Track past results

---

## 💬 AI Co-pilot Features

### Natural Language Interaction

```
User: "Add a data validation step between the code generator and output"

Co-pilot: "I'll add a Validator agent node to ensure code quality...
          
          This will:
          1. Check code syntax
          2. Run linting
          3. Execute unit tests
          
          Should I add it now?"

Suggestions:
- [Apply] [Save Template] [Learn More]
```

### Context-Aware Assistance

The co-pilot understands:
- Current workflow structure
- Project context and goals
- Available agents and capabilities
- Best practices for AI workflows

### Streaming Responses

Responses appear in real-time as they're generated:

```
User: "Generate a complete ML pipeline"
↓
Co-pilot starts responding... (streaming)
"I'll create a 4-stage..."
"...ML pipeline for your..."
"...project."
(Real-time character streaming)
```

---

## 🔄 Human-in-the-Loop Features

### Before Execution

1. **Review Workflow**
   - Visual inspection of node connections
   - Check agent configuration
   - Validate workflow logic

2. **Ask Co-pilot for Help**
   - "Is this workflow correct?"
   - "How do I add error handling?"
   - "What's missing?"

3. **Modify on the Fly**
   - Add/remove agents
   - Adjust connections
   - Change configurations

### During Execution

1. **Real-time Monitoring**
   ```
   Step 1: Idea Generation
   ████████░░ 80% - Processing...
   
   Step 2: Code Generation  
   ░░░░░░░░░░ 0% - Waiting...
   ```

2. **Pause & Resume**
   - Pause at any step
   - Inspect intermediate results
   - Modify and continue

3. **Error Recovery**
   - Get co-pilot suggestions for errors
   - Retry with modifications
   - Continue from failure point

### After Execution

1. **Review Results**
   - View generated code
   - Check metrics
   - Export artifacts

2. **Iterate**
   - Modify workflow based on results
   - Create new version
   - Compare versions

---

## 🎨 UI/UX Highlights

### Dark Theme
- **Primary**: Deep slate (`#0f172a`)
- **Surface**: Slate (`#1e293b`)
- **Accent**: Indigo (`#6366f1`)
- **Text**: Light slate (`#f1f5f9`)

### Glassmorphism Design
```
┌─────────────────────────┐
│ Frosted Glass Panel     │ ← 0.8 opacity + backdrop blur
│ ┌───────────────────┐   │
│ │ Content Area      │   │
│ └───────────────────┘   │
└─────────────────────────┘
```

### Smooth Animations
- Node entrance: Fade + scale
- Panel transitions: Slide in/out
- Button hover: Color transition
- Loading states: Pulse animation

### Responsive Layout
- **Desktop**: 3-column layout (agents, canvas, copilot)
- **Tablet**: 2-column layout (collapsible sidebar)
- **Mobile**: Single column (coming soon)

---

## 🔌 API Integration

### Frontend → Backend Communication

```
Frontend (React)
    ↓
API Client (Axios)
    ↓ JSON/HTTP
FastAPI Backend
    ↓
Core Services (Agents, LLM, State)
    ↓
Database (SQLite)
```

### Example Flow - Create Workflow

```typescript
// 1. User drags agent to canvas
handleDragStart(event, agent)

// 2. Create node in React state
const newNode = {
  id: "node_123",
  type: "agent",
  data: { label: "Coder Agent", agentType: "coder" },
  position: { x: 300, y: 200 }
}

// 3. Add to workflow store
useWorkflowStore.setState(state => ({
  nodes: [...state.nodes, newNode]
}))

// 4. User clicks Save
handleSaveWorkflow()

// 5. POST to backend
await apiClient.saveWorkflow(projectId, {
  nodes: [...],
  edges: [...]
})

// 6. Backend persists to database
state_manager.save_workflow(projectId, workflow_data)

// 7. Frontend shows success toast
toast.success("Workflow saved!")
```

---

## 📊 State Management

### Zustand Stores

```typescript
// Workflow Store - Nodes & Edges
useWorkflowStore: {
  nodes: [],
  edges: [],
  addNode: (node) => {},
  removeNode: (id) => {},
  updateNode: (id, data) => {},
  // ...
}

// Co-pilot Store - Chat Messages
useCopilotStore: {
  messages: [],
  isLoading: false,
  addMessage: (message) => {},
  updateLastMessage: (content) => {},
  // ...
}

// Project Store - Project Data
useProjectStore: {
  projects: [],
  currentProject: null,
  setProjects: (projects) => {},
  addProject: (project) => {},
  // ...
}
```

---

## 🔐 Security

- ✅ **HTTPS in Production** - Always use SSL/TLS
- ✅ **CORS Configured** - Only allow frontend domain
- ✅ **Input Validation** - All inputs validated
- ✅ **API Key Protection** - Keys never exposed to frontend
- ✅ **XSS Prevention** - React escapes content
- ✅ **CSRF Protection** - HTTP-only cookies

---

## 🚀 Deployment

### Docker Deployment

```bash
# Build frontend
docker build -t flynt-studio-frontend ./frontend

# Build backend
docker build -t flynt-studio-api .

# Run both with docker-compose
docker-compose up
```

### Production Checklist

- [ ] Update API URL to production domain
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set environment variables
- [ ] Enable logging and monitoring
- [ ] Setup backup and disaster recovery
- [ ] Configure CDN for static assets
- [ ] Setup rate limiting on API
- [ ] Enable authentication/authorization
- [ ] Setup monitoring and alerts

---

## 📚 File Structure

### Key Frontend Files

```
frontend/src/
├── components/
│   ├── CopilotPanel.tsx      (350 lines) - AI chat interface
│   ├── WorkflowCanvas.tsx    (200 lines) - React Flow canvas
│   ├── Header.tsx            (80 lines)  - Navigation
│   ├── Layout.tsx            (40 lines)  - Main layout
│   └── nodes/
│       ├── AgentNode.tsx     (70 lines)
│       ├── InputNode.tsx     (60 lines)
│       ├── OutputNode.tsx    (60 lines)
│       └── ValidatorNode.tsx (60 lines)
│
├── pages/
│   ├── Dashboard.tsx         (300 lines) - Projects list
│   ├── WorkflowBuilder.tsx   (250 lines) - Main editor
│   └── ProjectDetails.tsx    (350 lines) - Project info
│
├── store/
│   └── index.ts             (200 lines) - State management
│
├── services/
│   └── api.ts               (200 lines) - API client
│
├── App.tsx                  (100 lines) - Main app
├── main.tsx                 (15 lines)  - Entry point
└── styles/
    └── globals.css          (250 lines) - Styling
```

### Backend Integration File

```
core/
└── frontend_api.py          (400 lines) - FastAPI endpoints
```

---

## 🎓 Learning Resources

### For Customization

1. **React Flow**: [reactflow.dev](https://reactflow.dev)
2. **Material-UI**: [mui.com](https://mui.com)
3. **Zustand**: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
4. **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

### For Extension

Check the component comments and type definitions:
- `src/types/index.ts` - All TypeScript interfaces
- `src/components/*.tsx` - Component documentation
- `src/services/api.ts` - API client methods

---

## 🐛 Troubleshooting

### Frontend won't connect to backend

```bash
# Check backend is running
curl http://localhost:8000/api/projects

# Check CORS in browser console
# Look for CORS error messages

# Verify API URL in api.ts
const API_BASE_URL = 'http://localhost:8000/api'
```

### Co-pilot not responding

```bash
# Check LLM API keys set on backend
echo $GEMINI_API_KEY
echo $GROQ_API_KEY

# Check backend logs for errors
python main.py  # Look for error messages
```

### Workflow won't save

```bash
# Check browser Network tab (F12)
# Verify POST request to /api/projects/{id}/workflow

# Check backend receives data
# Add logging: logger.info(f"Saving workflow: {workflow}")
```

---

## 🎉 You're Ready!

You now have a complete AI workflow builder with:

✅ Professional drag-and-drop interface  
✅ AI-powered co-pilot assistance  
✅ Human-in-the-loop execution control  
✅ Real-time collaboration features  
✅ Beautiful dark theme UI  
✅ Full backend integration  
✅ Production-ready code  

### Next Steps

1. **Customize** agents and workflows for your use case
2. **Extend** with additional features (authentication, analytics, etc.)
3. **Deploy** to your cloud platform
4. **Integrate** with your existing systems
5. **Monitor** usage and performance

---

**Start building amazing AI workflows now!** 🚀

For detailed setup and documentation, see:
- [Frontend Setup Guide](./frontend/FRONTEND_SETUP.md)
- [Backend Integration Guide](./frontend/BACKEND_INTEGRATION.md)
- [Frontend README](./frontend/README.md)
