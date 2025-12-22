import create from 'zustand'

export interface WorkflowNode {
  id: string
  type: 'input' | 'agent' | 'output' | 'validator'
  data: {
    label: string
    agentType?: string
    config?: Record<string, any>
    description?: string
  }
  position: { x: number; y: number }
}

export interface WorkflowEdge {
  id: string
  source: string
  target: string
  label?: string
  data?: Record<string, any>
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'draft' | 'in_progress' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
  workflow?: {
    nodes: WorkflowNode[]
    edges: WorkflowEdge[]
  }
}

interface WorkflowStore {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  addNode: (node: WorkflowNode) => void
  removeNode: (nodeId: string) => void
  updateNode: (nodeId: string, data: Partial<WorkflowNode>) => void
  addEdge: (edge: WorkflowEdge) => void
  removeEdge: (edgeId: string) => void
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  clear: () => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isStreaming?: boolean
}

interface CopilotStore {
  messages: ChatMessage[]
  isLoading: boolean
  addMessage: (message: ChatMessage) => void
  updateLastMessage: (content: string) => void
  setLoading: (loading: boolean) => void
  clearMessages: () => void
}

interface ProjectStore {
  projects: Project[]
  currentProject: Project | null
  setProjects: (projects: Project[]) => void
  setCurrentProject: (project: Project | null) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  nodes: [],
  edges: [],
  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    })),
  updateNode: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, ...data } : n)),
    })),
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((e) => e.id !== edgeId),
    })),
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  clear: () => set({ nodes: [], edges: [] }),
}))

export const useCopilotStore = create<CopilotStore>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, idx) =>
        idx === state.messages.length - 1 ? { ...msg, content } : msg,
      ),
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
}))

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) =>
    set((state) => ({
      projects: [...state.projects, project],
    })),
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      currentProject: state.currentProject?.id === id ? { ...state.currentProject, ...updates } : state.currentProject,
    })),
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    })),
}))
