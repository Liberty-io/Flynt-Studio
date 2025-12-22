import React from 'react'
import { Handle, Position } from 'reactflow'
import { Box, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { motion } from 'framer-motion'

const ValidatorNode: React.FC<any> = ({ data, selected }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
      <Paper
        elevation={selected ? 8 : 2}
        sx={{
          p: 2,
          minWidth: '160px',
          backgroundColor: selected ? 'rgba(245, 158, 11, 0.15)' : 'rgba(30, 41, 59, 0.8)',
          border: `2px solid ${selected ? '#f59e0b' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: '12px',
          backgroundImage: 'linear-gradient(135deg, #f59e0b20 0%, transparent 100%)',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <CheckCircleIcon sx={{ color: '#f59e0b', fontSize: '20px' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {data.label}
          </Typography>
        </Box>

        {data.description && (
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: 'block',
              maxWidth: '160px',
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

export default ValidatorNode
