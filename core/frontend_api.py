"""
FastAPI endpoints for Flynt Studio Frontend Integration

Add these endpoints to your FastAPI main application to enable frontend communication.
"""

from fastapi import FastAPI, WebSocket, HTTPException, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Generator, Dict, Any
import json
from datetime import datetime
from core.state import StateManager
from core.llm_client import LLMClient, create_llm_client_from_config
from core.collaboration_state import CollaborationStateManager
from core.monitoring import get_agent_monitor, HealthStatus
from core.error_handler import get_error_recovery_manager
from orchestration.executor import Executor
from core.config import get_config_manager

# ============================================================================
# DATA MODELS
# ============================================================================

class ProjectCreate(BaseModel):
    name: str
    description: str

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class WorkflowNode(BaseModel):
    id: str
    type: str
    data: dict
    position: dict

class WorkflowEdge(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    data: Optional[dict] = None

class WorkflowSave(BaseModel):
    nodes: List[WorkflowNode]
    edges: List[WorkflowEdge]

class CopilotMessage(BaseModel):
    message: str

class HealthCheckResponse(BaseModel):
    """Health check response model."""
    status: str
    timestamp: str
    llm_health: Dict[str, Any]
    agents: Dict[str, Any]
    error_recovery: Dict[str, Any]
    system: Dict[str, Any]

class CopilotContext(BaseModel):
    workflow: Optional[dict] = None
    project_context: Optional[dict] = None

# ============================================================================
# DEPENDENCY INJECTION
# ============================================================================

def get_state_manager() -> StateManager:
    """Get the state manager instance."""
    return StateManager()

def get_llm_client() -> LLMClient:
    """Get the LLM client instance."""
    # Build LLM client from configured providers
    try:
        config = get_config_manager().load()
        return create_llm_client_from_config(config)
    except Exception:
        # Fallback: re-raise to make the error visible to startup logs
        raise

def get_executor() -> Executor:
    """Get the executor instance."""
    return Executor()

# ============================================================================
# PROJECT ENDPOINTS
# ============================================================================

def setup_project_routes(app: FastAPI, state_manager: StateManager = Depends(get_state_manager)):
    """
    Setup project management routes.
    
    Usage:
        app = FastAPI()
        setup_project_routes(app)
    """
    
    @app.get("/api/projects")
    async def list_projects():
        """List all projects."""
        try:
            projects = state_manager.list_projects()
            return projects
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/projects")
    async def create_project(project: ProjectCreate):
        """Create a new project."""
        try:
            new_project = state_manager.create_project(
                name=project.name,
                description=project.description
            )
            return new_project
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/projects/{project_id}")
    async def get_project(project_id: str):
        """Get project details."""
        try:
            project = state_manager.get_project(project_id)
            if not project:
                raise HTTPException(status_code=404, detail="Project not found")
            return project
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.put("/api/projects/{project_id}")
    async def update_project(project_id: str, updates: ProjectUpdate):
        """Update project."""
        try:
            project = state_manager.update_project(project_id, updates.dict(exclude_unset=True))
            return project
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.delete("/api/projects/{project_id}")
    async def delete_project(project_id: str):
        """Delete project."""
        try:
            state_manager.delete_project(project_id)
            return {"status": "deleted"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# WORKFLOW ENDPOINTS
# ============================================================================

def setup_workflow_routes(app: FastAPI, state_manager: StateManager = Depends(get_state_manager)):
    """Setup workflow management routes."""
    
    @app.get("/api/projects/{project_id}/workflow")
    async def get_workflow(project_id: str):
        """Get project workflow."""
        try:
            workflow = state_manager.get_workflow(project_id)
            return workflow or {"nodes": [], "edges": []}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/projects/{project_id}/workflow")
    async def save_workflow(project_id: str, workflow: WorkflowSave):
        """Save project workflow."""
        try:
            saved = state_manager.save_workflow(
                project_id,
                {
                    "nodes": [node.dict() for node in workflow.nodes],
                    "edges": [edge.dict() for edge in workflow.edges]
                }
            )
            return saved
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# EXECUTION ENDPOINTS
# ============================================================================

def setup_execution_routes(app: FastAPI, executor: Executor = Depends(get_executor)):
    """Setup workflow execution routes."""
    
    @app.post("/api/projects/{project_id}/execute")
    async def execute_workflow(project_id: str):
        """Execute workflow."""
        try:
            execution_id = await executor.execute_workflow(project_id)
            return {"execution_id": execution_id, "status": "started"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/projects/{project_id}/executions/{execution_id}")
    async def get_execution_status(project_id: str, execution_id: str):
        """Get execution status."""
        try:
            status = await executor.get_execution_status(execution_id)
            return status
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# CO-PILOT ENDPOINTS
# ============================================================================

def setup_copilot_routes(app: FastAPI, llm_client: LLMClient = Depends(get_llm_client)):
    """Setup co-pilot AI assistant routes."""
    
    @app.post("/api/projects/{project_id}/copilot")
    async def send_copilot_message(project_id: str, message: CopilotMessage):
        """Send message to co-pilot and get response."""
        try:
            response = await llm_client.generate_response(
                prompt=message.message,
                context={
                    "project_id": project_id,
                    "task": "assist_with_workflow_design"
                }
            )
            
            return {
                "response": response,
                "suggestions": extract_suggestions(response)
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.post("/api/projects/{project_id}/copilot/suggestions")
    async def get_copilot_suggestions(project_id: str, context: CopilotContext):
        """Get AI suggestions based on workflow context."""
        try:
            suggestions = await llm_client.generate_suggestions(
                context=context.dict(),
                project_id=project_id
            )
            return {"suggestions": suggestions}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    
    @app.get("/api/projects/{project_id}/copilot/stream")
    async def stream_copilot_response(project_id: str, message: str):
        """Stream co-pilot response."""
        async def generate():
            try:
                async for chunk in llm_client.stream_response(message, project_id):
                    yield f"data: {json.dumps({'chunk': chunk})}\n\n"
            except Exception as e:
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(generate(), media_type="text/event-stream")

# ============================================================================
# AGENT ENDPOINTS
# ============================================================================

def setup_agent_routes(app: FastAPI):
    """Setup agent information routes."""
    
    @app.get("/api/agents")
    async def list_agents():
        """List available agents."""
        agents = [
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
            },
        ]
        return agents
    
    @app.get("/api/agents/{agent_id}")
    async def get_agent_details(agent_id: str):
        """Get detailed agent information."""
        # TODO: Implement based on actual agent details
        agents = await list_agents()
        agent = next((a for a in agents if a["id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        return agent

# ============================================================================
# WEBSOCKET ENDPOINTS
# ============================================================================

def setup_websocket_routes(app: FastAPI):
    """Setup WebSocket routes for real-time updates."""
    
    @app.websocket("/api/ws/projects/{project_id}")
    async def websocket_project_updates(websocket: WebSocket, project_id: str):
        """WebSocket for real-time project updates."""
        await websocket.accept()
        try:
            while True:
                data = await websocket.receive_text()
                # Process data and send updates
                await websocket.send_json({"type": "ack", "message": data})
        except Exception as e:
            await websocket.close(code=1000)
    
    @app.websocket("/api/ws/executions/{execution_id}")
    async def websocket_execution_updates(websocket: WebSocket, execution_id: str):
        """WebSocket for real-time execution updates."""
        await websocket.accept()
        try:
            while True:
                # Stream execution updates
                status = {}  # Get from executor
                await websocket.send_json({"type": "status_update", "data": status})
        except Exception as e:
            await websocket.close(code=1000)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def extract_suggestions(response: str) -> List[str]:
    """Extract suggestions from LLM response."""
    # Parse response for suggested actions
    suggestions = []
    lines = response.split('\n')
    for line in lines:
        if line.startswith('- ') or line.startswith('• '):
            suggestions.append(line[2:].strip())
    return suggestions[:3]  # Return top 3 suggestions

# ============================================================================
# INITIALIZATION FUNCTION
# ============================================================================

def setup_frontend_api(app: FastAPI):
    """
    Initialize all frontend API routes.
    
    Usage:
        from fastapi import FastAPI
        from frontend_api import setup_frontend_api
        
        app = FastAPI()
        setup_frontend_api(app)
    """
    state_manager = get_state_manager()
    llm_client = get_llm_client()
    executor = get_executor()
    
    # Setup health check endpoint
    @app.get("/health", response_model=HealthCheckResponse)
    async def health_check():
        """
        Comprehensive health check endpoint.
        Returns status of all system components.
        """
        # Get LLM health
        try:
            llm_health = llm_client.health_check()
        except Exception as e:
            llm_health = {"error": str(e), "available": False}
        
        # Get agent monitoring stats
        monitor = get_agent_monitor()
        agent_stats = monitor.get_monitoring_summary()
        
        # Get error recovery stats
        recovery_mgr = get_error_recovery_manager()
        error_stats = recovery_mgr.get_error_stats()
        
        # Overall status
        overall_status = "healthy"
        if not llm_health.get("primary", {}).get("success"):
            overall_status = "degraded"
        if agent_stats.get("agent_count_by_status", {}).get("unhealthy", 0) > 0:
            overall_status = "degraded"
        if error_stats.get("total_errors", 0) > 100:
            overall_status = "degraded"
        
        return HealthCheckResponse(
            status=overall_status,
            timestamp=datetime.now().isoformat(),
            llm_health=llm_health,
            agents=agent_stats,
            error_recovery=error_stats,
            system={
                "total_errors_recorded": len(recovery_mgr.error_history),
                "circuit_breaker_status": "monitoring"
            }
        )
    
    @app.get("/health/agents")
    async def agents_health():
        """Get detailed health status for all agents."""
        monitor = get_agent_monitor()
        return monitor.get_monitoring_summary()
    
    @app.get("/health/agents/{agent_name}")
    async def agent_health(agent_name: str):
        """Get health status for a specific agent."""
        monitor = get_agent_monitor()
        metrics = monitor.get_agent_metrics(agent_name)
        return {
            "agent_name": metrics.agent_name,
            "status": metrics.status.value,
            "success_rate": metrics.success_rate,
            "avg_execution_time_ms": metrics.avg_execution_time_ms,
            "avg_quality_score": metrics.avg_quality_score,
            "error_rate": metrics.error_rate,
            "total_executions": metrics.total_executions,
            "last_execution": metrics.last_execution.isoformat() if metrics.last_execution else None
        }
    
    @app.get("/health/errors")
    async def errors_health():
        """Get error statistics and history."""
        recovery_mgr = get_error_recovery_manager()
        return {
            "stats": recovery_mgr.get_error_stats(),
            "recent_errors": [
                {
                    "timestamp": e.timestamp.isoformat(),
                    "error_type": e.error_type.value,
                    "severity": e.severity.value,
                    "message": e.message,
                    "agent_name": e.agent_name
                }
                for e in recovery_mgr.error_history[-10:]  # Last 10 errors
            ]
        }
    
    setup_project_routes(app, state_manager)
    setup_workflow_routes(app, state_manager)
    setup_execution_routes(app, executor)
    setup_copilot_routes(app, llm_client)
    setup_agent_routes(app)
    setup_websocket_routes(app)
    
    return app
