import React from 'react'

/**
 * TypeScript type definitions for Flynt Studio Frontend
 */

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

export interface Position {
  x: number
  y: number
}

export interface WorkflowNodeData {
  label: string
  agentType?: string
  config?: Record<string, any>
  description?: string
  [key: string]: any
}

export interface WorkflowNode {
  id: string
  type: 'input' | 'agent' | 'output' | 'validator'
  data: WorkflowNodeData
  position: Position
  selected?: boolean
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  data?: Record<string, any>
}

export interface Workflow {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'failed'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  workflow?: Workflow
  createdAt: string
  updatedAt: string
  tags?: string[]
  metadata?: Record<string, any>
}

export interface ProjectCreate {
  name: string
  description: string
}

export interface ProjectUpdate {
  name?: string
  description?: string
  status?: ProjectStatus
}

// ============================================================================
// EXECUTION TYPES
// ============================================================================

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface ExecutionStep {
  id: string
  nodeId: string
  status: ExecutionStatus
  startTime: string
  endTime?: string
  output?: any
  error?: string
}

export interface Execution {
  id: string
  projectId: string
  status: ExecutionStatus
  steps: ExecutionStep[]
  startTime: string
  endTime?: string
  error?: string
  metadata?: Record<string, any>
}

// ============================================================================
// CO-PILOT TYPES
// ============================================================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
  suggestions?: string[]
}

export interface CopilotContext {
  projectId: string
  workflow?: Workflow
  projectContext?: Record<string, any>
}

export interface CopilotResponse {
  response: string
  suggestions?: string[]
  actions?: string[]
}

// ============================================================================
// AGENT TYPES
// ============================================================================

export interface Agent {
  id: string
  name: string
  description: string
  type: string
  icon: string
  color: string
  config?: AgentConfig
}

export interface AgentConfig {
  [key: string]: any
}

export interface AgentCapability {
  name: string
  description: string
  inputFormat?: string
  outputFormat?: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
  data: T
  error?: string
  message?: string
}

export interface ApiError {
  status: number
  message: string
  details?: Record<string, any>
}

// ============================================================================
// STATE MANAGEMENT TYPES
// ============================================================================

export interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNode: WorkflowNode | null
  isDirty: boolean
}

export interface CopilotState {
  messages: ChatMessage[]
  isLoading: boolean
  error?: string
  context?: CopilotContext
}

export interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error?: string
}

export interface AppState {
  workflow: WorkflowState
  copilot: CopilotState
  projects: ProjectState
}

// ============================================================================
// UI COMPONENT PROP TYPES
// ============================================================================

export interface NodeProps {
  id: string
  data: WorkflowNodeData
  selected?: boolean
  isConnecting?: boolean
}

export interface WorkflowCanvasProps {
  initialNodes?: WorkflowNode[]
  initialEdges?: WorkflowEdge[]
  onSave?: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void
  onExecute?: () => void
  onNodeSelect?: (node: WorkflowNode) => void
}

export interface CopilotPanelProps {
  projectId: string
  onMessage?: (message: ChatMessage) => void
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type Async<T> = Promise<T>

export interface PaginationParams {
  page: number
  limit: number
  sort?: string
  filter?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

// ============================================================================
// HOOK RETURN TYPES
// ============================================================================

export interface UseAsyncState<T> {
  data: Nullable<T>
  loading: boolean
  error: Nullable<Error>
}

export interface UseAsyncReturnType<T> extends UseAsyncState<T> {
  refetch: () => Promise<void>
}
