import axios, { AxiosInstance } from 'axios'

// Vite exposes env variables via `import.meta.env`. Use `VITE_API_URL` for customization.
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api'

class APIClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Projects API
  async getProjects() {
    const response = await this.client.get('/projects')
    return response.data
  }

  async createProject(data: any) {
    const response = await this.client.post('/projects', data)
    return response.data
  }

  async getProject(id: string) {
    const response = await this.client.get(`/projects/${id}`)
    return response.data
  }

  async updateProject(id: string, data: any) {
    const response = await this.client.put(`/projects/${id}`, data)
    return response.data
  }

  async deleteProject(id: string) {
    const response = await this.client.delete(`/projects/${id}`)
    return response.data
  }

  // Workflow API
  async saveWorkflow(projectId: string, workflow: any) {
    const response = await this.client.post(`/projects/${projectId}/workflow`, workflow)
    return response.data
  }

  async getWorkflow(projectId: string) {
    const response = await this.client.get(`/projects/${projectId}/workflow`)
    return response.data
  }

  // Execution API
  async executeWorkflow(projectId: string) {
    const response = await this.client.post(`/projects/${projectId}/execute`, {})
    return response.data
  }

  async getExecutionStatus(projectId: string, executionId: string) {
    const response = await this.client.get(`/projects/${projectId}/executions/${executionId}`)
    return response.data
  }

  // Co-pilot API
  async sendCopilotMessage(projectId: string, message: string) {
    const response = await this.client.post(`/projects/${projectId}/copilot`, {
      message,
    })
    return response.data
  }

  async getCopilotSuggestions(projectId: string, context: any) {
    const response = await this.client.post(`/projects/${projectId}/copilot/suggestions`, {
      context,
    })
    return response.data
  }

  // Agent API
  async getAvailableAgents() {
    const response = await this.client.get('/agents')
    return response.data
  }

  async getAgentDetails(agentType: string) {
    const response = await this.client.get(`/agents/${agentType}`)
    return response.data
  }

  // Streaming API
  async *streamCopilotResponse(projectId: string, message: string) {
    const response = await this.client.get(`/projects/${projectId}/copilot/stream`, {
      params: { message },
      responseType: 'stream',
    })

    const reader = response.data.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      yield chunk
    }
  }
}

export const apiClient = new APIClient()
