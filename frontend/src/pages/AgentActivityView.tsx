import React, { useEffect, useState, useCallback } from 'react'
import { Box, Divider, List, ListItem, ListItemText, Typography, Paper, Stack, Button } from '@mui/material'
import AgentAvatar from '../components/agents/AgentAvatar'
import AgentStatus from '../components/agents/AgentStatus'
import MessageBubble from '../components/agents/MessageBubble'
import { agentService } from '../services/agentService'

interface AgentInfo { id: string; name: string; status: string; color: string }
interface AgentMessage { agent: string; message: string; timestamp?: string }

const initialAgents: AgentInfo[] = [
  { id: 'idea', name: 'Idea Agent', status: 'idle', color: '#8b5cf6' },
  { id: 'planner', name: 'Planner Agent', status: 'thinking', color: '#6366f1' },
  { id: 'coder', name: 'Coder Agent', status: 'executing', color: '#10b981' },
]

const AgentActivityView: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>(initialAgents)
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [overview, setOverview] = useState({ activeExecutions: 0, pendingApprovals: 0 })

  const handleAgentMessage = useCallback((payload: any) => {
    setMessages((m) => [...m, { agent: payload.agent, message: payload.message, timestamp: payload.timestamp }])
    setOverview((o) => ({ ...o, activeExecutions: Math.max(0, o.activeExecutions + (payload.agent.includes('Coder') ? 1 : 0)) }))
  }, [])

  const handleActionRequest = useCallback((payload: any) => {
    setOverview((o) => ({ ...o, pendingApprovals: o.pendingApprovals + 1 }))
    setMessages((m) => [
      ...m,
      { agent: payload.agent || 'Agent', message: `Action request: ${payload.title || 'request'}`, timestamp: new Date().toISOString() },
    ])
  }, [])

  useEffect(() => {
    // Subscribe to agentService events
    agentService.on('agent_message', handleAgentMessage)
    agentService.on('action_request', handleActionRequest)
    agentService.startMock(3500)

    return () => {
      agentService.off('agent_message', handleAgentMessage)
      agentService.off('action_request', handleActionRequest)
      agentService.stopMock()
    }
  }, [handleAgentMessage, handleActionRequest])

  return (
    <Box sx={{ display: 'flex', height: '100%', p: 2, gap: 2 }}>
      {/* Left: Agent roster */}
      <Paper sx={{ width: 260, p: 2, backgroundColor: 'rgba(15,23,42,0.6)' }} elevation={0}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Agents
        </Typography>
        <List>
          {agents.map((a) => (
            <ListItem key={a.id} sx={{ gap: 1, alignItems: 'center' }}>
              <AgentAvatar name={a.name} color={a.color} />
              <ListItemText primary={a.name} secondary={<AgentStatus status={a.status as any} />} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Button variant="outlined" size="small" onClick={() => { agentService.startMock(2000); setMessages([]); setOverview({ activeExecutions: 0, pendingApprovals: 0 }) }}>
          Restart Mock
        </Button>
      </Paper>

      {/* Middle: Message stream */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper sx={{ p: 2, backgroundColor: 'rgba(15,23,42,0.6)' }} elevation={0}>
          <Typography variant="h6">Agent Activity</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Live stream of agent messages and actions
          </Typography>
        </Paper>

        <Paper sx={{ flex: 1, p: 2, overflow: 'auto', backgroundColor: 'rgba(2,6,23,0.6)' }} elevation={0}>
          <Stack>
            {messages.map((m, i) => (
              <MessageBubble key={i} agent={m.agent} message={m.message} timestamp={m.timestamp} />
            ))}
          </Stack>
        </Paper>
      </Box>

      {/* Right: Quick stats / actions */}
      <Paper sx={{ width: 300, p: 2, backgroundColor: 'rgba(15,23,42,0.6)' }} elevation={0}>
        <Typography variant="h6">Overview</Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Active executions: {overview.activeExecutions}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          Pending approvals: {overview.pendingApprovals}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Last activity: {new Date().toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  )
}

export default AgentActivityView
