# Flynt Studio Frontend (development)

Quick notes to run the frontend dev server locally.

Install dependencies (from `frontend` directory):

```bash
cd frontend
npm install
```

Run dev server (default Vite port 5173):

```bash
npm run dev
```

Or run on port 3000:

```bash
npx vite --port 3000
```

HITL UI: http://localhost:3000/hitl (if served on port 3000)
# Flynt Studio Frontend

A modern, production-ready React frontend for Flynt Studio featuring:

- 🎨 **Drag-and-Drop Workflow Builder** - React Flow-based visual workflow designer
- 🤖 **Integrated AI Co-pilot** - Real-time chat with streaming responses
- 📊 **Project Management** - Create, edit, and track AI projects
- ⚡ **Real-time Updates** - WebSocket support for live execution monitoring
- 🎯 **Human-in-the-Loop** - Pause, modify, and resume workflows
- 🔐 **Type-Safe** - Full TypeScript support throughout
- ✅ **Well-Tested** - Vitest + React Testing Library with 80%+ coverage

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Flynt Studio backend running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173 (or configure port)
```

## 📝 Development Commands

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking
npm run type-check

# Format code with Prettier
npm run format
```

### Testing

```bash
# Run tests (watch mode)
npm run test

# Run tests with UI dashboard
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Directory Structure

```
src/
├── pages/              # Page components (Dashboard, WorkflowBuilder, etc.)
├── components/         # Reusable React components
│   ├── layout/        # Layout components (Header, Sidebar, Footer)
│   ├── workspace/     # Workspace components (CodeEditor, TerminalView)
│   ├── hitl/          # Human-in-the-Loop components (DynamicForm)
│   ├── workflow/      # Workflow builder components
│   └── copilot/       # Co-pilot chat components
├── services/          # API clients and business logic
│   ├── agentService.ts    # WebSocket client + event bus
│   ├── a2ui-adapter.ts    # A2UI schema parser
│   ├── hitlActions.ts     # Optimistic UI helpers
│   └── api.ts             # REST API client
├── store/             # Zustand state stores
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── test/              # Test setup and helpers
└── styles/            # Global styles
```

### Key Services

**agentService.ts** - Central event bus
- WebSocket connection with auto-reconnect and exponential backoff
- Mock event generator for development
- Pub/sub pattern for event handling
- Message queuing when offline

**a2ui-adapter.ts** - Dynamic form schema parsing
- Parses A2UI lite format schemas
- Validates field types (text, textarea, multi-select)
- Example envelope generation

**api.ts** - REST API client
- Axios-based HTTP client
- Base URL configured from environment
- Request/response interceptors

### Event Flow

```
Backend Agent
      ↓
WebSocket (agentService)
      ↓
Event Emitters
      ├→ agent_message → AgentActivityView
      ├→ action_request → HITLControlView
      ├→ workspace_update → Editor
      └→ execution_log → TerminalView
```

## 🧪 Testing Strategy

### Unit Tests (Services)
- `agentService.test.ts` - WebSocket, events, mock generation
- `a2ui-adapter.test.ts` - Schema parsing, validation

### Component Tests
- `DynamicForm.test.tsx` - Form rendering, submission, validation
- `HITLControlView.test.tsx` - HITL integration with agentService

### Test Coverage Target: 80%+

Run coverage:
```bash
npm run test:coverage
```

## 🌐 Environment Variables

Frontend uses Vite's environment variable system. Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000/ws
VITE_MOCK_AGENTS=true
```

## 📦 Dependencies

### Core
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router 6** - Navigation
- **Zustand** - State management

### UI & Components
- **Material-UI (MUI)** - Design system
- **React Flow** - Workflow visualization
- **Framer Motion** - Animations
- **React Markdown** - Markdown rendering
- **React Syntax Highlighter** - Code highlighting

### Development & Testing
- **Vitest** - Test runner
- **@testing-library/react** - Component testing
- **@testing-library/jest-dom** - DOM matchers
- **ESLint** - Linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚦 CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):

1. **Linting** - ESLint checks
2. **Type Checking** - TypeScript validation
3. **Tests** - Vitest runs all test suites
4. **Build** - Production build verification
5. **Coverage Upload** - Artifact storage

Merge blocked if any step fails.

## 🔧 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3001
```

### Tests failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Build errors
```bash
# Check TypeScript errors
npm run type-check

# Check ESLint errors
npm run lint
```

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React 18 Docs](https://react.dev/)
- [Material-UI](https://mui.com/)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

# Open http://localhost:3000 in your browser
```

## 📚 Documentation

- [Setup Guide](./FRONTEND_SETUP.md) - Detailed setup and configuration
- [Backend Integration](./BACKEND_INTEGRATION.md) - API endpoint requirements
- [Component API](./COMPONENT_API.md) - Component usage and props
- [Architecture](./ARCHITECTURE.md) - System design and patterns

## 🎯 Features

### 1. Workflow Builder

Visual workflow designer with React Flow:

```
┌─────────────┐      ┌──────────────┐      ┌──────────┐
│   Input     │─────▶│ Coder Agent  │─────▶│ Output   │
│  (Project   │      │ (Gen Code)   │      │(Results) │
│  Details)   │      └──────────────┘      └──────────┘
└─────────────┘              │
                    ┌────────▼──────────┐
                    │ Validator Agent   │
                    │ (QA & Testing)    │
                    └───────────────────┘
```

Features:
- Drag agents from sidebar to canvas
- Connect nodes with edges
- Real-time node validation
- Undo/redo support (coming soon)
- Auto-layout alignment
- Node inspection panel

### 2. AI Co-pilot

Real-time AI assistant for workflow design:

```
User: "Create a data pipeline with feature engineering"
│
▼
Co-pilot: "I'll design a 3-stage pipeline...
          - Data Ingestion Stage
          - Feature Engineering Stage
          - Validation Stage"
│
▼
Suggestions: [Apply] [Save as Template] [Learn More]
```

Features:
- **Streaming Responses** - See AI responses in real-time
- **Context Awareness** - Understands current workflow
- **Code Generation** - Generate nodes from descriptions
- **Smart Suggestions** - Action recommendations
- **Markdown Support** - Rich formatted responses

### 3. Project Management

Complete project lifecycle management:

- **Create Projects** - Initialize new AI projects
- **Version Control** - Auto-save workflow changes
- **Execution History** - Track past runs and results
- **Status Monitoring** - Real-time execution tracking
- **Artifact Management** - Download generated code and configs

## 🏗️ Architecture

### State Management (Zustand)

```typescript
// Workflow state - manages nodes and edges
useWorkflowStore()

// Co-pilot state - manages chat history
useCopilotStore()

// Project state - manages projects and metadata
useProjectStore()
```

### API Integration

```
Frontend (React)
    ↓
API Client (Axios)
    ↓
FastAPI Backend
    ↓
Core Services (Agents, LLM, State)
```

### Component Structure

```
┌─ Layout (Header)
├─ Router
│  ├─ Dashboard (Projects List)
│  ├─ WorkflowBuilder (Main Editor)
│  │  ├─ Agent Sidebar
│  │  ├─ WorkflowCanvas (React Flow)
│  │  └─ CopilotPanel (Chat)
│  └─ ProjectDetails (Info & History)
└─ Toast Notifications
```

## 📦 Tech Stack

### Frontend Framework
- **React 18** - UI library
- **React Flow** - Workflow visualization
- **TypeScript** - Type safety

### UI & Styling
- **Material-UI (MUI)** - Component library
- **Tailwind CSS** - Utility CSS
- **Framer Motion** - Animations

### State & Data
- **Zustand** - State management
- **Axios** - HTTP client
- **React Query** - Data fetching (optional)

### Developer Experience
- **Vite** - Fast build tool
- **React Router** - Navigation
- **TypeScript** - Type checking

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Flynt Studio
VITE_ENABLE_LOGGING=true
```

### Customization

#### Change API Base URL
```typescript
// src/services/api.ts
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api'
```

#### Customize Theme
```typescript
// src/App.tsx
const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Your color
    },
  },
})
```

#### Add New Agent Types
```typescript
// src/pages/WorkflowBuilder.tsx
const agents = [
  { id: 'custom', label: 'Custom Agent', color: '#your-color' },
]
```

## 🎨 Styling Guide

### Dark Mode Theme
```
Background:  #0f172a (slate-950)
Surface:     #1e293b (slate-800)
Primary:     #6366f1 (indigo-500)
Text:        #f1f5f9 (slate-100)
```

### Color Palette
```
Primary:     #6366f1 (Indigo)
Secondary:   #8b5cf6 (Violet)
Success:     #10b981 (Emerald)
Warning:     #f59e0b (Amber)
Error:       #ef4444 (Red)
Info:        #3b82f6 (Blue)
```

### Spacing System
Based on 4px grid:
```
xs: 4px   (0.25rem)
sm: 8px   (0.5rem)
md: 16px  (1rem)
lg: 24px  (1.5rem)
xl: 32px  (2rem)
```

## 🔌 API Integration

### Example: Send Co-pilot Message

```typescript
import { apiClient } from '@/services/api'

const response = await apiClient.sendCopilotMessage(
  projectId,
  "Add a security validation step"
)

console.log(response.response)      // AI response
console.log(response.suggestions)   // Suggested actions
```

### Example: Save Workflow

```typescript
import { useWorkflowStore } from '@/store'
import { apiClient } from '@/services/api'

const handleSave = async () => {
  const { nodes, edges } = useWorkflowStore.getState()
  
  await apiClient.saveWorkflow(projectId, {
    nodes: nodes.map(n => ({ id: n.id, type: n.type, data: n.data })),
    edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target })),
  })
}
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build
npm run build

# Preview production build
npm run preview
```

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

Current metrics:
- **First Paint**: < 1s
- **Interactive**: < 2s
- **Workflow Load**: < 500ms
- **API Response**: < 200ms

### Optimization Tips

1. **Code Splitting** - Routes automatically code-split
2. **Image Optimization** - Use WebP with fallbacks
3. **Lazy Loading** - Components load on demand
4. **Caching** - HTTP cache headers enabled

## 🔐 Security

- **HTTPS in Production** - Always use HTTPS
- **CORS Configuration** - Properly configured on backend
- **Input Validation** - All inputs validated before API call
- **XSS Protection** - React escapes content by default
- **Environment Variables** - Secrets never in code

## 🚀 Deployment

### Docker

```bash
docker build -t flynt-studio-frontend .
docker run -p 3000:3000 flynt-studio-frontend
```

### Vercel/Netlify

```bash
npm run build
# Upload dist/ folder
```

### GitHub Pages

```bash
npm run build
# Push dist/ to gh-pages branch
```

## 📊 Monitoring

### Analytics Integration (Optional)

```typescript
// src/services/analytics.ts
export const trackWorkflowCreated = (projectId: string) => {
  gtag.event('workflow_created', {
    project_id: projectId,
    timestamp: new Date().toISOString(),
  })
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 💬 Support

- 📖 [Documentation](./FRONTEND_SETUP.md)
- 🐛 [Issue Tracker](../../issues)
- 💬 [Discussions](../../discussions)
- 📧 support@flynt.dev

## 🎉 Acknowledgments

Built with:
- [React Flow](https://reactflow.dev)
- [Material-UI](https://mui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Ready to build amazing AI workflows?** Start with `npm run dev` 🚀
