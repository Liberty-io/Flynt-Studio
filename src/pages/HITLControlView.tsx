import React, { useState } from 'react';
import DynamicForm, { A2UISchema } from '../components/hitl/DynamicForm';
import { parseA2UISchema, exampleActionRequest } from '../services/a2ui-adapter';

export default function HITLControlView(): JSX.Element {
  const [requests, setRequests] = useState<Array<{ id: string; schema: A2UISchema }>>([
    { id: exampleActionRequest.request_id, schema: exampleActionRequest.ui_schema },
  ]);

  const handleSubmit = (requestId: string, values: Record<string, any>) => {
    // In a real integration this would call agentService.approve(requestId, values)
    console.log('Approve', requestId, values);
    setRequests((r) => r.filter((x) => x.id !== requestId));
  };

  const handleReject = (requestId: string) => {
    // In a real integration this would call agentService.reject(requestId)
    console.log('Reject', requestId);
    setRequests((r) => r.filter((x) => x.id !== requestId));
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>HITL Control</h2>
      {requests.length === 0 && <div>No pending approval requests.</div>}

      {requests.map((req) => {
        const parsed = parseA2UISchema(req.schema);
        return (
          <div key={req.id} style={{ border: '1px solid #ddd', marginBottom: 12, padding: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Action Request</strong>
              <div>
                <button style={{ marginRight: 8 }} onClick={() => handleReject(req.id)}>
                  Reject
                </button>
              </div>
            </div>
            <div style={{ marginTop: 8 }}>
              <DynamicForm
                schema={parsed}
                onSubmit={(values) => handleSubmit(req.id, values)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
