# Flynt Studio Frontend Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Flynt Studio backend running on `http://localhost:8000`

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 2. Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the frontend on `http://localhost:3000`

### 3. Production Build

```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CopilotPanel.tsx          # AI assistant chat interface
│   │   ├── WorkflowCanvas.tsx        # React Flow-based workflow designer
│   │   ├── Layout.tsx                # Main layout wrapper
│   │   ├── Header.tsx                # Navigation header
│   │   └── nodes/
│   │       ├── AgentNode.tsx         # Agent node component
│   │       ├── InputNode.tsx         # Input node component
│   │       ├── OutputNode.tsx        # Output node component
│   │       └── ValidatorNode.tsx     # Validator node component
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx             # Project list and creation
│   │   ├── WorkflowBuilder.tsx       # Main workflow editor
│   │   └── ProjectDetails.tsx        # Project info and history
│   │
│   ├── store/
│   │   └── index.ts                  # Zustand state management
│   │
│   ├── services/
│   │   └── api.ts                    # API client for backend
│   │
│   ├── styles/
│   │   └── globals.css               # Global styles and animations
│   │
│   ├── App.tsx                       # Main app component
│   └── main.tsx                      # Entry point
│
├── public/
│   └── index.html
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## 🎨 Key Features

### 1. Drag-and-Drop Workflow Builder
- **React Flow Integration**: Professional workflow visualization
- **Custom Node Types**: Agent, Input, Output, Validator nodes
- **Real-time Connections**: Drag to connect workflow components
- **Auto-layout**: Organize nodes with grid alignment

```typescript
// Example: Add agent to workflow
const handleDragStart = (event: React.DragEvent, agent: any) => {
  event.dataTransfer.setData('agent', JSON.stringify(agent))
}
```

### 2. Integrated Co-pilot
- **Real-time Chat**: Message-based AI interaction
- **Markdown Support**: Rich formatted responses
- **Code Highlighting**: Syntax highlighting for code blocks
- **Smart Suggestions**: Context-aware action recommendations
- **Streaming Responses**: Real-time token streaming

```typescript
// Example: Send message to co-pilot
const response = await apiClient.sendCopilotMessage(
  projectId,
  "Create a data science pipeline with feature engineering"
)
```

### 3. Project Management
- **Create Projects**: Start new AI projects
- **Workflow Editor**: Design complex multi-agent workflows
- **Execution Tracking**: Monitor workflow execution status
- **Project History**: View past executions and artifacts

### 4. State Management (Zustand)
```typescript
// Workflow state
useWorkflowStore((state) => ({
  nodes: state.nodes,
  edges: state.edges,
  addNode: state.addNode,
  removeNode: state.removeNode,
}))

// Co-pilot state
useCopilotStore((state) => ({
  messages: state.messages,
  addMessage: state.addMessage,
  isLoading: state.isLoading,
}))

// Project state
useProjectStore((state) => ({
  projects: state.projects,
  currentProject: state.currentProject,
  addProject: state.addProject,
}))
```

## 🔌 Backend Integration

### API Endpoints Required

The backend must provide these endpoints:

#### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

#### Workflows
- `GET /api/projects/{id}/workflow` - Get workflow
- `POST /api/projects/{id}/workflow` - Save workflow

#### Execution
- `POST /api/projects/{id}/execute` - Execute workflow
- `GET /api/projects/{id}/executions/{executionId}` - Get execution status

#### Co-pilot
- `POST /api/projects/{id}/copilot` - Send message
- `POST /api/projects/{id}/copilot/suggestions` - Get suggestions
- `GET /api/projects/{id}/copilot/stream` - Stream responses

#### Agents
- `GET /api/agents` - List available agents
- `GET /api/agents/{agentId}` - Get agent details

### Quick Backend Setup

Add these to your FastAPI app:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.frontend_api import setup_frontend_api

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup all frontend API routes
setup_frontend_api(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## 🎯 Common Tasks

### Add New Node Type

1. Create component in `src/components/nodes/CustomNode.tsx`:

```typescript
import { Handle, Position } from 'reactflow'

const CustomNode: React.FC<any> = ({ data, selected }) => {
  return (
    <div>
      <h3>{data.label}</h3>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
}

export default CustomNode
```

2. Register in `WorkflowCanvas.tsx`:

```typescript
const nodeTypes = {
  // ... existing types
  custom: CustomNode,
}
```

### Extend Co-pilot Features

1. Update `CopilotPanel.tsx` with new UI components
2. Add endpoint in backend `frontend_api.py`
3. Call from `services/api.ts`

Example:

```typescript
// In api.ts
async askForCodeGeneration(projectId: string, description: string) {
  const response = await this.client.post(
    `/projects/${projectId}/copilot/generate-code`,
    { description }
  )
  return response.data
}

// In CopilotPanel.tsx
const generatedCode = await apiClient.askForCodeGeneration(
  projectId,
  userInput
)
```

### Customize Styling

Edit `src/styles/globals.css` or use Tailwind classes:

```typescript
<Box sx={{
  backgroundColor: 'rgba(30, 41, 59, 0.8)',
  backdropFilter: 'blur(10px)',
  borderRadius: '12px',
  border: '1px solid rgba(100, 116, 139, 0.2)',
}}>
  {/* Content */}
</Box>
```

## 🔐 Security

### API Key Handling
```typescript
// Backend should never expose API keys to frontend
// Keep keys in environment variables on backend
const apiKey = process.env.GEMINI_API_KEY
```

### CORS Configuration
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Development
        "https://yourdomain.com",  # Production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

## 📦 Dependencies

### Core Libraries
- **React 18**: UI framework
- **React Flow**: Workflow visualization
- **Material-UI**: Component library
- **Zustand**: State management
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animations
- **React Router**: Navigation

### Optional
- **react-markdown**: Rich text rendering
- **react-syntax-highlighter**: Code highlighting
- **recharts**: Data visualization
- **react-hot-toast**: Notifications

## 🚀 Deployment

### Docker Setup

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://api:8000/api
    depends_on:
      - api

  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - GROQ_API_KEY=${GROQ_API_KEY}
```

## 🧪 Testing

```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Build check
npm run build
```

## 📊 Performance Tips

1. **Code Splitting**: Components are automatically split by Vite
2. **Lazy Loading**: Use React.lazy() for routes
3. **Memoization**: Use React.memo() for expensive components
4. **Virtual Scrolling**: For large lists, use react-window

Example:

```typescript
import { lazy, Suspense } from 'react'

const WorkflowBuilder = lazy(() => import('./pages/WorkflowBuilder'))

<Suspense fallback={<Loading />}>
  <WorkflowBuilder />
</Suspense>
```

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find process on port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### API Connection Issues
1. Ensure backend is running on `http://localhost:8000`
2. Check CORS headers in browser DevTools
3. Verify API endpoints match backend implementation

### State Management Issues
- Use Redux DevTools extension for debugging
- Check Zustand store subscriptions
- Verify state updates in console

## 📚 Resources

- [React Flow Documentation](https://reactflow.dev)
- [Material-UI Docs](https://mui.com)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)

## 💡 Next Steps

1. **Customize Theme**: Edit `tailwind.config.ts` and MUI theme
2. **Add Authentication**: Integrate auth provider (Auth0, Firebase)
3. **Real-time Updates**: Enable WebSocket connections
4. **Analytics**: Add usage tracking
5. **Mobile Support**: Optimize for mobile devices

## 🤝 Contributing

Improvements welcome! Please:
1. Create feature branch
2. Test thoroughly
3. Submit PR with description

---

**Happy building!** 🎉
