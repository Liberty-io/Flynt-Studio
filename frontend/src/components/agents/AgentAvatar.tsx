import React from 'react'
import { Avatar, Tooltip } from '@mui/material'

interface Props {
  name: string
  color?: string
  size?: number
}

const AgentAvatar: React.FC<Props> = ({ name, color = '#6366f1', size = 40 }) => {
  const initials = name
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Tooltip title={name}>
      <Avatar sx={{ bgcolor: color, width: size, height: size, fontWeight: 700 }}>{initials}</Avatar>
    </Tooltip>
  )
}

export default AgentAvatar
