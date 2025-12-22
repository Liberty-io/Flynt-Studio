# Frontend & Backend Integration Guide

## 🔌 API Endpoints Required

The frontend expects these API endpoints from the backend. Implement them in your FastAPI application.

### Base URL
```
http://localhost:8000/api
```

## 📋 Complete Endpoint Reference

### Projects Management

#### List Projects
```http
GET /api/projects
```

**Response:**
```json
[
  {
    "id": "proj_123",
    "name": "RAG Chatbot",
    "description": "Intelligent job search assistant",
    "status": "in_progress",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-16T15:30:00Z"
  }
]
```

#### Create Project
```http
POST /api/projects
Content-Type: application/json

{
  "name": "My Project",
  "description": "Project description"
}
```

**Response:**
```json
{
  "id": "proj_456",
  "name": "My Project",
  "description": "Project description",
  "status": "draft",
  "createdAt": "2024-01-17T10:00:00Z",
  "updatedAt": "2024-01-17T10:00:00Z"
}
```

#### Get Project
```http
GET /api/projects/{projectId}
```

**Response:**
```json
{
  "id": "proj_123",
  "name": "RAG Chatbot",
  "description": "Intelligent job search assistant",
  "status": "in_progress",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-16T15:30:00Z",
  "workflow": {
    "nodes": [...],
    "edges": [...]
  }
}
```

#### Update Project
```http
PUT /api/projects/{projectId}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "completed"
}
```

#### Delete Project
```http
DELETE /api/projects/{projectId}
```

---

### Workflow Management

#### Get Workflow
```http
GET /api/projects/{projectId}/workflow
```

**Response:**
```json
{
  "nodes": [
    {
      "id": "node_1",
      "type": "input",
      "data": {
        "label": "Project Idea",
        "description": "User provides project idea"
      },
      "position": { "x": 100, "y": 100 }
    },
    {
      "id": "node_2",
      "type": "agent",
      "data": {
        "label": "Idea Agent",
        "agentType": "idea",
        "description": "Brainstorm and research ideas"
      },
      "position": { "x": 300, "y": 100 }
    }
  ],
  "edges": [
    {
      "id": "edge_1",
      "source": "node_1",
      "target": "node_2",
      "label": "refined idea"
    }
  ]
}
```

#### Save Workflow
```http
POST /api/projects/{projectId}/workflow
Content-Type: application/json

{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workflow saved successfully"
}
```

---

### Workflow Execution

#### Execute Workflow
```http
POST /api/projects/{projectId}/execute
```

**Response:**
```json
{
  "execution_id": "exec_789",
  "status": "started",
  "startTime": "2024-01-17T10:05:00Z"
}
```

#### Get Execution Status
```http
GET /api/projects/{projectId}/executions/{executionId}
```

**Response:**
```json
{
  "id": "exec_789",
  "projectId": "proj_123",
  "status": "running",
  "progress": 50,
  "steps": [
    {
      "id": "step_1",
      "nodeId": "node_1",
      "status": "completed",
      "output": { "idea": "RAG Chatbot" },
      "startTime": "2024-01-17T10:05:00Z",
      "endTime": "2024-01-17T10:05:30Z"
    },
    {
      "id": "step_2",
      "nodeId": "node_2",
      "status": "running",
      "startTime": "2024-01-17T10:05:30Z"
    }
  ],
  "startTime": "2024-01-17T10:05:00Z"
}
```

---

### Co-pilot AI Assistant

#### Send Message
```http
POST /api/projects/{projectId}/copilot
Content-Type: application/json

{
  "message": "Add a security validation step to the workflow"
}
```

**Response:**
```json
{
  "response": "I'll add a security agent node that performs...",
  "suggestions": [
    "Add security scanning step",
    "Include dependency audit",
    "Add compliance check"
  ]
}
```

#### Get Suggestions
```http
POST /api/projects/{projectId}/copilot/suggestions
Content-Type: application/json

{
  "context": {
    "workflow": { "nodes": [...], "edges": [...] },
    "projectContext": { "type": "data-science" }
  }
}
```

**Response:**
```json
{
  "suggestions": [
    "Consider adding a model evaluation step",
    "Add feature engineering before training",
    "Include cross-validation step"
  ]
}
```

#### Stream Response (SSE)
```http
GET /api/projects/{projectId}/copilot/stream?message=...
```

**Response:** Server-Sent Events stream
```
data: {"chunk": "I"}
data: {"chunk": " will"}
data: {"chunk": " help"}
data: {"chunk": " you"}
...
```

---

### Available Agents

#### List Agents
```http
GET /api/agents
```

**Response:**
```json
[
  {
    "id": "idea",
    "name": "Idea Agent",
    "description": "Research and brainstorming",
    "icon": "SmartToyIcon",
    "color": "#8b5cf6"
  },
  {
    "id": "coder",
    "name": "Coder Agent",
    "description": "Code generation and architecture",
    "icon": "CodeIcon",
    "color": "#6366f1"
  },
  {
    "id": "data_science",
    "name": "Data Science Agent",
    "description": "ML pipelines and experimentation",
    "icon": "StorageIcon",
    "color": "#10b981"
  },
  {
    "id": "security",
    "name": "Security Agent",
    "description": "Vulnerability scanning and compliance",
    "icon": "SecurityIcon",
    "color": "#ef4444"
  },
  {
    "id": "mlops",
    "name": "MLOps Agent",
    "description": "Pipeline orchestration and versioning",
    "icon": "BuildIcon",
    "color": "#06b6d4"
  },
  {
    "id": "validator",
    "name": "Validator Agent",
    "description": "Quality assurance and compliance",
    "icon": "AnalyticsIcon",
    "color": "#f59e0b"
  }
]
```

#### Get Agent Details
```http
GET /api/agents/{agentId}
```

---

### WebSocket Endpoints (Optional)

#### Project Updates
```
ws://localhost:8000/api/ws/projects/{projectId}
```

**Message format:**
```json
{
  "type": "status_update|node_changed|execution_started",
  "data": { ... }
}
```

#### Execution Updates
```
ws://localhost:8000/api/ws/executions/{executionId}
```

**Response:**
```json
{
  "type": "step_completed|step_failed|execution_completed",
  "step": { ... },
  "progress": 75
}
```

---

## 🚀 Quick Backend Setup

### 1. Install FastAPI
```bash
pip install fastapi uvicorn
```

### 2. Create FastAPI App
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Flynt Studio API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and setup frontend routes
from core.frontend_api import setup_frontend_api
setup_frontend_api(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
```

### 3. Run Backend
```bash
python main.py
```

---

## 🔄 Data Flow Example

### Workflow Creation Flow

```
Frontend (User Action)
    ↓
Drag agent to canvas
    ↓
Create node in state
    ↓
Click "Save"
    ↓
POST /api/projects/{id}/workflow
    ↓
Backend saves to database
    ↓
Return success response
    ↓
Frontend shows toast notification
    ↓
Update local state
```

### Co-pilot Interaction Flow

```
Frontend (User Types Message)
    ↓
GET /api/projects/{id}/copilot/stream?message=...
    ↓
Backend processes with LLM
    ↓
Returns SSE stream chunks
    ↓
Frontend appends to chat (streaming)
    ↓
Show response with suggestions
```

---

## 🧪 Testing with cURL

### Test Project Creation
```bash
curl -X POST http://localhost:8000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Testing"}'
```

### Test Co-pilot
```bash
curl -X POST http://localhost:8000/api/projects/proj_123/copilot \
  -H "Content-Type: application/json" \
  -d '{"message":"Add a security step"}'
```

### Test Workflow Save
```bash
curl -X POST http://localhost:8000/api/projects/proj_123/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [...],
    "edges": [...]
  }'
```

---

## 🔐 CORS Configuration

For production, restrict origins:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://yourdomain.com",
        "https://www.yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=3600,
)
```

---

## 📊 Error Handling

All endpoints should return errors in this format:

```json
{
  "status": 400,
  "message": "Invalid project name",
  "details": {
    "field": "name",
    "error": "name must be at least 3 characters"
  }
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Server error

---

## 🔗 Frontend API Client Usage

```typescript
import { apiClient } from '@/services/api'

// Create project
const project = await apiClient.createProject({
  name: 'My Project',
  description: 'Description'
})

// Get projects
const projects = await apiClient.getProjects()

// Save workflow
await apiClient.saveWorkflow(projectId, {
  nodes: [...],
  edges: [...]
})

// Send copilot message
const response = await apiClient.sendCopilotMessage(
  projectId,
  'Add a data validation step'
)

// Execute workflow
const execution = await apiClient.executeWorkflow(projectId)

// Get execution status
const status = await apiClient.getExecutionStatus(projectId, executionId)
```

---

## 🐛 Debugging

### Enable Logging
```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.get("/api/projects")
async def list_projects():
    logger.debug("Fetching all projects")
    # ...
```

### View Frontend Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Make requests
4. Check status, headers, response

### View Backend Logs
```bash
# Backend output shows all requests
python main.py
```

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Frontend API Client](../frontend/src/services/api.ts)
- [Types Definition](../frontend/src/types/index.ts)

---

**Questions?** Check the main [Readme.md](../../Readme.md) or create an issue! 🚀
