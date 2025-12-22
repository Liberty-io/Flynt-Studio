import { agentService } from './agentService'

type Change = {
  id: string
  description?: string
  payload?: any
}

/**
 * Apply an optimistic change locally and notify backend. The frontend should
 * listen for confirmation or errors and call `rollback` if needed.
 */
export function applyOptimisticChange(change: Change) {
  // emit local workspace update so UIs can update immediately
  agentService.emit('workspace_update', { id: change.id, payload: change.payload, optimistic: true })
  // notify backend
  agentService.send('apply_change', { id: change.id, payload: change.payload })
}

export function rollbackChange(changeId: string, reason?: string) {
  // notify UI to rollback
  agentService.emit('workspace_update', { id: changeId, rollback: true, reason })
}

export default { applyOptimisticChange, rollbackChange }
