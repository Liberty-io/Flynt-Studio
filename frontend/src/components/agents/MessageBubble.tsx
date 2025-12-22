import React from 'react'
import { Box, Paper, Typography } from '@mui/material'

interface Props {
  agent: string
  message: string
  timestamp?: string
}

const MessageBubble: React.FC<Props> = ({ agent, message, timestamp }) => {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
      <Paper elevation={0} sx={{ p: 2, backgroundColor: 'rgba(30,41,59,0.8)', borderRadius: '10px' }}>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 0.5 }}>
          {agent} {timestamp ? `• ${new Date(timestamp).toLocaleTimeString()}` : ''}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
          {message}
        </Typography>
      </Paper>
    </Box>
  )
}

export default MessageBubble
