type AgentEvent = 'agent_message' | 'action_request' | 'workspace_update' | 'connected' | 'disconnected'

type Callback = (payload: any) => void

class AgentService {
  private ws: WebSocket | null = null
  private url: string | null = null
  private reconnectAttempts = 0
  private maxReconnectDelay = 30000 // 30s
  private sendQueue: Array<{ event: string; payload: any }> = []
  private heartbeatTimer: number | null = null
  private listeners: Map<AgentEvent, Set<Callback>> = new Map()
  private mockTimer: number | null = null

  constructor() {
    ;['agent_message', 'action_request', 'workspace_update', 'connected', 'disconnected'].forEach((e) =>
      this.listeners.set(e as AgentEvent, new Set())
    )
  }

  connect(url?: string) {
    if (!url && !this.url) return
    const target = url || this.url!
    this.url = target

    if (typeof WebSocket === 'undefined') return

    try {
      this.ws = new WebSocket(target)
      this.ws.onopen = () => {
        this.reconnectAttempts = 0
        this.emit('connected', { url: target })
        // flush queued messages
        while (this.sendQueue.length > 0) {
          const it = this.sendQueue.shift()!
          this.send(it.event, it.payload)
        }
        // start heartbeat
        this.startHeartbeat()
      }

      this.ws.onmessage = (m) => {
        try {
          const data = JSON.parse(m.data)
          if (data && data.type) {
            const ev = typeof data.type === 'string' ? data.type.toLowerCase() : data.type
            if (this.listeners.has(ev as any)) {
              this.emit(ev as any, data.payload)
            } else {
              this.emit(data.type as any, data.payload)
            }
          }
        } catch (e) {
          console.warn('agentService: failed to parse message', e)
        }
      }

      this.ws.onclose = () => {
        this.emit('disconnected', {})
        this.stopHeartbeat()
        // schedule reconnect with backoff
        this.reconnectAttempts += 1
        const delay = Math.min(1000 * 2 ** (this.reconnectAttempts - 1), this.maxReconnectDelay)
        setTimeout(() => this.connect(), delay)
      }

      this.ws.onerror = (e) => {
        console.warn('agentService ws error', e)
      }
    } catch (e) {
      console.warn('agentService: ws connect failed', e)
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat()
    try {
      this.heartbeatTimer = window.setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // lightweight ping
          this.ws!.send(JSON.stringify({ type: 'ping' }))
        }
      }, 20000)
    } catch (e) {
      // ignore
    }
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.stopMock()
  }

  on(event: AgentEvent, cb: Callback) {
    const set = this.listeners.get(event)
    set?.add(cb)
  }

  off(event: AgentEvent, cb: Callback) {
    const set = this.listeners.get(event)
    set?.delete(cb)
  }

  emit(event: AgentEvent, payload: any) {
    const set = this.listeners.get(event)
    set?.forEach((cb) => {
      try {
        cb(payload)
      } catch (e) {
        console.error('agentService listener error', e)
      }
    })
  }

  send(event: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: event, payload }))
    } else {
      // queue send until connected
      this.sendQueue.push({ event, payload })
    }
  }

  // Allow programmatic injection of an action request (useful for adapters)
  pushActionRequest(payload: any) {
    // normalize to `action_request` listeners
    this.emit('action_request', payload)
  }

  // Mocking helpers for local dev
  startMock(intervalMs = 4000) {
    this.stopMock()
    let counter = 0
    const agents = ['Idea Agent', 'Planner Agent', 'Coder Agent']
    this.mockTimer = window.setInterval(() => {
      const agent = agents[counter % agents.length]
      const message = {
        agent,
        message:
          agent === 'Coder Agent'
            ? `Streaming code chunk ${counter}\nfunction hello() {\n  console.log(\"hello ${counter}\")\n}`
            : `${agent} says update ${counter}`,
        timestamp: new Date().toISOString(),
      }
      this.emit('agent_message', message)
      counter += 1

      // Occasionally emit an action_request (include minimal ui_schema)
      if (counter % 5 === 0) {
        this.emit('action_request', {
          request_id: `apr-${Date.now()}-${counter}`,
          agent,
          title: 'Write file',
          ui_schema: {
            title: `Approve write from ${agent}`,
            fields: [
              { type: 'textarea', key: 'summary', label: 'Summary of change' },
              { type: 'multi-select', key: 'files', label: 'Files', options: ['src/example.ts'] },
            ],
          },
          files: [{ path: 'src/example.ts', diff: '+++ new file' }],
        })
      }
    }, intervalMs)
  }

  stopMock() {
    if (this.mockTimer) {
      clearInterval(this.mockTimer)
      this.mockTimer = null
    }
  }
}

export const agentService = new AgentService()
export type { AgentEvent }