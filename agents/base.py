"""
Flynt Base Agent Module
Foundation for all specialized agents in Flynt Studio.
"""

import logging
from typing import Dict, Any, Optional, List
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime

from core.llm_client import LLMClient, LLMResponse

logger = logging.getLogger(__name__)


@dataclass
class AgentContext:
    """Context passed to agents during execution."""
    project_id: int
    project_name: str
    project_description: str
    user_input: str
    metadata: Dict[str, Any] = field(default_factory=dict)
    conversation_history: List[Dict[str, str]] = field(default_factory=list)


@dataclass
class AgentResult:
    """Result returned by agent execution."""
    success: bool
    output: str
    agent_name: str
    execution_time: float
    metadata: Dict[str, Any] = field(default_factory=dict)
    error: Optional[str] = None
    intermediate_steps: List[str] = field(default_factory=list)


class BaseAgent(ABC):
    """Abstract base class for all Flynt agents.
    
    All agents inherit from this class and implement their specific logic.
    """
    
    def __init__(
        self,
        name: str,
        description: str,
        llm_client: LLMClient,
        verbose: bool = False,
        retriever: Optional[object] = None,
    ):
        """Initialize base agent.
        
        Args:
            name: Agent name.
            description: Agent description/purpose.
            llm_client: LLM client for AI interactions.
            verbose: Whether to log detailed execution info.
        """
        self.name = name
        self.description = description
        self.llm_client = llm_client
        self.verbose = verbose
        # Optional retriever (must implement search(query, k))
        self.retriever = retriever
        self.execution_count = 0
        
    @abstractmethod
    def get_system_prompt(self) -> str:
        """Get the system prompt for this agent.
        
        Returns:
            System prompt string.
        """
        pass
    
    @abstractmethod
    def execute(self, context: AgentContext) -> AgentResult:
        """Execute the agent's main task.
        
        Args:
            context: Agent execution context.
            
        Returns:
            AgentResult with execution outcome.
        """
        pass
    
    def _generate_response(
        self,
        prompt: str,
        system_prompt: Optional[str] = None
    ) -> LLMResponse:
        """Generate response using LLM client.
        
        Args:
            prompt: User prompt.
            system_prompt: Optional system prompt override.
            
        Returns:
            LLMResponse object.
        """
        system = system_prompt or self.get_system_prompt()
        
        if self.verbose:
            logger.info(f"[{self.name}] Generating response...")
            logger.debug(f"System prompt: {system[:200]}...")
            logger.debug(f"User prompt: {prompt[:200]}...")
        
        # Prefer retrieval-augmented generation when retriever is available
        if getattr(self, 'retriever', None) is not None and hasattr(self.llm_client, 'generate_with_retrieval'):
            response = self.llm_client.generate_with_retrieval(
                prompt=prompt,
                retriever=self.retriever,
                system_prompt=system
            )
        else:
            response = self.llm_client.generate(prompt, system)
        
        if self.verbose:
            if response.success:
                logger.info(f"[{self.name}] OK - Response generated ({response.usage.get('total_tokens', 0)} tokens)")
            else:
                logger.error(f"[{self.name}] FAIL - Generation failed: {response.error}")
        
        return response
    
    def _log_step(self, step: str):
        """Log an intermediate step.
        
        Args:
            step: Step description.
        """
        if self.verbose:
            logger.info(f"[{self.name}] > {step}")
    
    def _format_context(self, context: AgentContext) -> str:
        """Format context into a readable string.
        
        Args:
            context: Agent context.
            
        Returns:
            Formatted context string.
        """
        parts = [
            f"Project: {context.project_name}",
            f"Description: {context.project_description}",
            f"User Input: {context.user_input}"
        ]
        
        if context.metadata:
            parts.append(f"Additional Context: {context.metadata}")
        
        return "\n".join(parts)
    
    def validate_context(self, context: AgentContext) -> bool:
        """Validate that context has required fields.
        
        Args:
            context: Agent context to validate.
            
        Returns:
            True if valid, False otherwise.
        """
        required = ['project_id', 'project_name', 'user_input']
        for field in required:
            if not getattr(context, field):
                logger.error(f"[{self.name}] Missing required context field: {field}")
                return False
        return True
    
    def create_result(
        self,
        success: bool,
        output: str,
        execution_time: float,
        metadata: Optional[Dict[str, Any]] = None,
        error: Optional[str] = None,
        intermediate_steps: Optional[List[str]] = None
    ) -> AgentResult:
        """Create a standardized agent result.
        
        Args:
            success: Whether execution succeeded.
            output: Agent output/result.
            execution_time: Execution time in seconds.
            metadata: Optional metadata dictionary.
            error: Optional error message.
            intermediate_steps: Optional list of execution steps.
            
        Returns:
            AgentResult object.
        """
        return AgentResult(
            success=success,
            output=output,
            agent_name=self.name,
            execution_time=execution_time,
            metadata=metadata or {},
            error=error,
            intermediate_steps=intermediate_steps or []
        )
    
    def __str__(self) -> str:
        """String representation of agent."""
        return f"{self.name}: {self.description}"
    
    def __repr__(self) -> str:
        """Detailed representation of agent."""
        return f"<{self.__class__.__name__}(name='{self.name}', executions={self.execution_count})>"


class AgentRegistry:
    """Registry for managing available agents."""
    
    def __init__(self):
        """Initialize agent registry."""
        self._agents: Dict[str, BaseAgent] = {}
        logger.info("Agent registry initialized")
    
    def register(self, agent: BaseAgent):
        """Register an agent.
        
        Args:
            agent: Agent to register.
        """
        self._agents[agent.name] = agent
        logger.info(f"Registered agent: {agent.name}")
    
    def get(self, name: str) -> Optional[BaseAgent]:
        """Get an agent by name.
        
        Args:
            name: Agent name.
            
        Returns:
            Agent instance or None if not found.
        """
        return self._agents.get(name)
    
    def list_agents(self) -> List[str]:
        """List all registered agent names.
        
        Returns:
            List of agent names.
        """
        return list(self._agents.keys())
    
    def get_all(self) -> Dict[str, BaseAgent]:
        """Get all registered agents.
        
        Returns:
            Dictionary of agent name to agent instance.
        """
        return self._agents.copy()


# Global registry instance
_agent_registry: Optional[AgentRegistry] = None


def get_agent_registry() -> AgentRegistry:
    """Get or create the global agent registry.
    
    Returns:
        AgentRegistry singleton instance.
    """
    global _agent_registry
    if _agent_registry is None:
        _agent_registry = AgentRegistry()
    return _agent_registry