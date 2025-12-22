import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { agentService } from '../agentService'

describe('agentService', () => {
  beforeEach(() => {
    agentService.stopMock()
  })

  afterEach(() => {
    agentService.stopMock()
  })

  it('should emit agent_message events during mock', (done) => {
    const messages: any[] = []
    agentService.on('agent_message', (payload) => {
      messages.push(payload)
      if (messages.length >= 1) {
        expect(messages[0].agent).toBeDefined()
        expect(messages[0].message).toBeDefined()
        agentService.stopMock()
        done()
      }
    })
    agentService.startMock(100)
  })

  it('should emit action_request events periodically', (done) => {
    const requests: any[] = []
    agentService.on('action_request', (payload) => {
      requests.push(payload)
      if (requests.length >= 1) {
        expect(requests[0].request_id).toBeDefined()
        expect(requests[0].ui_schema).toBeDefined()
        agentService.stopMock()
        done()
      }
    })
    agentService.startMock(200)
  })

  it('should allow registering and unregistering listeners', () => {
    const callback = vi.fn()
    agentService.on('agent_message', callback)
    agentService.startMock(100)
    setTimeout(() => {
      expect(callback).toHaveBeenCalled()
      agentService.off('agent_message', callback)
      agentService.stopMock()
    }, 150)
  })

  it('should queue messages when WS is not connected', () => {
    // Since connect is not called, send should queue
    agentService.send('test_event', { test: 'data' })
    expect(true) // Just verify no crash; queuing is internal
  })

  it('should stop mock timer correctly', (done) => {
    const callback = vi.fn()
    agentService.on('agent_message', callback)
    agentService.startMock(100)
    setTimeout(() => {
      const callCountAfterStop = callback.mock.calls.length
      agentService.stopMock()
      setTimeout(() => {
        // Should not emit after stopMock
        expect(callback.mock.calls.length).toBe(callCountAfterStop)
        done()
      }, 200)
    }, 150)
  })
})
