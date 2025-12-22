import React from 'react'
import { Box, Typography } from '@mui/material'

interface Props {
  status: 'idle' | 'thinking' | 'executing' | 'waiting'
}

const statusMap: Record<string, { color: string; label: string }> = {
  idle: { color: '#94a3b8', label: 'Idle' },
  thinking: { color: '#f59e0b', label: 'Thinking' },
  executing: { color: '#10b981', label: 'Executing' },
  waiting: { color: '#ef4444', label: 'Waiting' },
}

const AgentStatus: React.FC<Props> = ({ status }) => {
  const meta = statusMap[status] || statusMap.idle
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 10, height: 10, bgcolor: meta.color, borderRadius: '50%' }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        {meta.label}
      </Typography>
    </Box>
  )
}

export default AgentStatus
