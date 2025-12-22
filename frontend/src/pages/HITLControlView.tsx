import React, { useEffect, useState } from 'react'
import DynamicForm, { A2UISchema } from '../components/hitl/DynamicForm'
import { parseA2UISchema, exampleActionRequest } from '../services/a2ui-adapter'
import { agentService } from '../services/agentService'

export default function HITLControlView(): JSX.Element {
  const [requests, setRequests] = useState<Array<{ id: string; schema: A2UISchema }>>([
    { id: exampleActionRequest.request_id, schema: exampleActionRequest.ui_schema },
  ])

  useEffect(() => {
    const onActionRequest = (payload: any) => {
      // Expect payload to include `request_id` and `ui_schema` (A2UI)
      const id = payload.request_id || `apr-${Date.now()}`
      const schema = parseA2UISchema(payload.ui_schema || payload.schema || {})
      setRequests((r) => [{ id, schema }, ...r])
    }

    agentService.on('action_request', onActionRequest)
    return () => {
      agentService.off('action_request', onActionRequest)
    }
  }, [])

  const handleSubmit = (requestId: string, values: Record<string, any>) => {
    // Send approval back to backend via agentService
    agentService.send('action_response', { approval_id: requestId, approved: true, values })
    setRequests((r) => r.filter((x) => x.id !== requestId))
  }

  const handleReject = (requestId: string) => {
    agentService.send('action_response', { approval_id: requestId, approved: false })
    setRequests((r) => r.filter((x) => x.id !== requestId))
  }

  return (
    <div
      style={{ padding: 16 }}
      role="region"
      aria-label="Human-in-the-Loop approval control panel"
      aria-live="polite"
    >
      <h2 id="hitl-title">HITL Control</h2>
      {requests.length === 0 && (
        <div
          role="status"
          aria-live="assertive"
          style={{ color: '#666', fontStyle: 'italic', padding: '12px 0' }}
        >
          No pending approval requests.
        </div>
      )}

      {requests.map((req, idx) => (
        <div
          key={req.id}
          role="article"
          aria-label={`Approval request ${idx + 1} of ${requests.length}`}
          style={{
            border: '1px solid #ddd',
            marginBottom: 12,
            padding: 12,
            borderRadius: 4,
            outline: 'none',
            transition: 'box-shadow 0.2s',
          }}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleReject(req.id)
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong id={`req-title-${req.id}`}>Action Request</strong>
            <div>
              <button
                style={{ marginRight: 8, padding: '6px 12px' }}
                onClick={() => handleReject(req.id)}
                aria-label={`Reject approval request ${idx + 1}`}
                title="Press Escape to reject (Ctrl+Z to undo)"
              >
                Reject
              </button>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <DynamicForm
              schema={req.schema}
              onSubmit={(values) => handleSubmit(req.id, values)}
              requestId={req.id}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
