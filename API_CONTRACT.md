# API Contract Documentation

This document defines the contract between the Flynt Studio frontend and backend for WebSocket and HTTP communication.

## 🔌 WebSocket Events

### Base URL
```
ws://localhost:8000/ws
wss://api.yourapp.com/ws (production)
```

### Message Format

All WebSocket messages follow this structure:

```json
{
  "type": "EVENT_TYPE",
  "payload": {
    // Event-specific data
  },
  "timestamp": "2025-12-22T10:00:00Z"
}
```

---

## 📤 Backend → Frontend Events

### `agent_message`

**Description**: Agent sends a message or status update.

**Payload**:
```json
{
  "type": "agent_message",
  "payload": {
    "agent_id": "idea_agent_001",
    "agent_name": "Idea Agent",
    "message": "What is your project's primary goal?",
    "message_type": "query" | "status" | "result",
    "timestamp": "2025-12-22T10:00:00Z"
  }
}
```

**Handler**: `agentService.on('agent_message', callback)`

### `action_request`

**Description**: Agent requests approval for an action (HITL approval flow).

**Payload**:
```json
{
  "type": "action_request",
  "payload": {
    "request_id": "apr-12345",
    "agent_id": "coder_agent_001",
    "action_type": "file_write" | "file_delete" | "shell_exec" | "web_api_call",
    "ui_schema": {
      "title": "Approve Code Generation",
      "fields": [
        {
          "type": "text" | "textarea" | "multi-select",
          "key": "field_key",
          "label": "Field Label",
          "placeholder": "Optional placeholder",
          "options": ["Option 1", "Option 2"] // For multi-select only
        }
      ]
    },
    "context": {
      "file_path": "/src/utils.py", // For file operations
      "proposed_content": "...", // Preview of change
      "shell_command": "..." // For shell execution
    }
  }
}
```

**Handler**: `agentService.on('action_request', callback)`

### `workspace_update`

**Description**: Update to workspace (files, execution logs, etc).

**Payload**:
```json
{
  "type": "workspace_update",
  "payload": {
    "subtype": "code_stream" | "file_created" | "execution_log",
    "filepath": "/src/main.py",
    "chunk": "def hello():", // For streaming
    "content": "full file content", // For single update
    "log_line": "Execution started at 10:00:00" // For logs
  }
}
```

**Handler**: `agentService.on('workspace_update', callback)`

### `execution_log`

**Description**: Execution output (stdout, stderr).

**Payload**:
```json
{
  "type": "execution_log",
  "payload": {
    "session_id": "exec-abc123",
    "log_level": "INFO" | "WARNING" | "ERROR",
    "message": "Process started",
    "timestamp": "2025-12-22T10:00:00Z"
  }
}
```

**Handler**: `agentService.on('execution_log', callback)`

---

## 📥 Frontend → Backend Events

### `action_response`

**Description**: User approves or rejects a pending action request.

**Payload**:
```json
{
  "type": "action_response",
  "payload": {
    "request_id": "apr-12345",
    "approved": true | false,
    "values": {
      "field_key": "user_input_value",
      "another_key": ["selected", "options"]
    },
    "user_feedback": "Optional explanation"
  }
}
```

**Sent by**: `agentService.send('action_response', payload)`

### `workspace_update`

**Description**: Frontend requests a workspace change (e.g., file edit).

**Payload**:
```json
{
  "type": "workspace_update",
  "payload": {
    "subtype": "file_write" | "file_delete",
    "filepath": "/src/utils.py",
    "content": "new file content",
    "diff": "... unified diff format ..."
  }
}
```

**Sent by**: `agentService.send('workspace_update', payload)`

### `user_intervention`

**Description**: User provides guidance or clarification to agents.

**Payload**:
```json
{
  "type": "user_intervention",
  "payload": {
    "target_agent_id": "idea_agent_001",
    "message": "The project should focus on real-time collaboration",
    "intervention_type": "clarification" | "course_correction" | "approval"
  }
}
```

**Sent by**: `agentService.send('user_intervention', payload)`

---

## 🔗 HTTP REST Endpoints

Base URL: `http://localhost:8000`

### GET `/api/projects`

**Description**: List all projects.

**Response**:
```json
{
  "projects": [
    {
      "id": "proj-123",
      "name": "My Project",
      "description": "...",
      "created_at": "2025-12-22T09:00:00Z",
      "updated_at": "2025-12-22T10:00:00Z"
    }
  ]
}
```

### POST `/api/projects`

**Description**: Create a new project.

**Request Body**:
```json
{
  "name": "My New Project",
  "description": "Project description"
}
```

**Response**:
```json
{
  "id": "proj-123",
  "name": "My New Project",
  "description": "Project description",
  "created_at": "2025-12-22T10:00:00Z"
}
```

### GET `/api/projects/{id}/workflow`

**Description**: Get workflow for a project.

**Response**:
```json
{
  "workflow": {
    "id": "wf-123",
    "nodes": [
      {
        "id": "node-1",
        "type": "agent",
        "data": { "agent_type": "idea_agent" }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2"
      }
    ]
  }
}
```

### POST `/api/projects/{id}/execute`

**Description**: Start execution of a workflow.

**Request Body**:
```json
{
  "initial_prompt": "Build a web app for tracking expenses"
}
```

**Response**:
```json
{
  "execution_id": "exec-abc123",
  "status": "running",
  "started_at": "2025-12-22T10:00:00Z"
}
```

### GET `/api/health`

**Description**: Health check endpoint.

**Response**:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-12-22T10:00:00Z"
}
```

---

## 🔐 Authentication (Future)

When implementing authentication, add to all requests:

```
Authorization: Bearer <jwt_token>
```

Backend should validate token and return `401 Unauthorized` if invalid.

---

## ⚙️ Connection Flow

```
Frontend                          Backend
   |                                |
   |---- Open WebSocket ----------->|
   |                                |
   |<---- agent_message ------------|
   |                                |
   |<---- action_request ------------|
   |                                |
   |---- action_response ---------->|
   |                                |
   |<---- workspace_update ---------|
   |                                |
   |---- workspace_update (opt) --->|
   |                                |
   |---- Close WebSocket ---------->|
   |                                |
```

---

## 📝 Error Handling

### WebSocket Errors

```json
{
  "type": "error",
  "payload": {
    "code": "INVALID_REQUEST" | "AUTH_FAILED" | "SERVER_ERROR",
    "message": "Human-readable error message",
    "request_id": "apr-12345" // If applicable
  }
}
```

### HTTP Errors

Standard HTTP status codes:
- `200` - OK
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error

Response format:
```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

---

## 🧪 Testing

Use provided test files:
- `src/services/agentService.test.ts` - Mock WebSocket events
- `src/services/a2ui-adapter.test.ts` - Schema validation
- `src/pages/HITLControlView.test.tsx` - Integration tests

To test with real backend:
1. Start backend: `uvicorn core.frontend_api:app --reload`
2. Set `VITE_MOCK_AGENTS=false` in `.env.local`
3. Frontend will connect to real WebSocket

---

## 📚 References

- [WebSocket Protocol](https://tools.ietf.org/html/rfc6455)
- [JSON Schema](https://json-schema.org/)
- [REST API Design Best Practices](https://restfulapi.net/)
