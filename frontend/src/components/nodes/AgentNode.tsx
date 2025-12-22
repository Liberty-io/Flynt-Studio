import React from 'react'
import { Handle, Position } from 'reactflow'
import { Box, Paper, Typography, Chip } from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { motion } from 'framer-motion'

const AgentNode: React.FC<any> = ({ data, isConnecting, selected }) => {
  const agentColors: Record<string, string> = {
    idea: '#8b5cf6',
    coder: '#6366f1',
    validator: '#f59e0b',
    security: '#ef4444',
    data_science: '#10b981',
    mlops: '#06b6d4',
    devops: '#3b82f6',
    deployer: '#8b5cf6',
  }

  const color = agentColors[data.agentType] || '#6366f1'

  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Paper
        elevation={selected ? 8 : 2}
        sx={{
          p: 2,
          minWidth: '200px',
          backgroundColor: selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(30, 41, 59, 0.8)',
          border: `2px solid ${selected ? color : 'rgba(100, 116, 139, 0.3)'}`,
          borderRadius: '12px',
          backgroundImage: `linear-gradient(135deg, ${color}20 0%, transparent 100%)`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <SmartToyIcon sx={{ color, fontSize: '20px' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {data.label}
          </Typography>
        </Box>

        {data.agentType && (
          <Chip
            label={data.agentType}
            size="small"
            sx={{
              backgroundColor: `${color}40`,
              color: color,
              height: '22px',
              '& .MuiChip-label': {
                px: 1,
                fontSize: '0.75rem',
              },
            }}
          />
        )}

        {data.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              mt: 1,
              display: 'block',
              maxWidth: '200px',
              whiteSpace: 'normal',
            }}
          >
            {data.description}
          </Typography>
        )}

        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
      </Paper>
    </motion.div>
  )
}

export default AgentNode
