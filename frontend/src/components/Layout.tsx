import React from 'react'
import { Box } from '@mui/material'
import Header from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        color: '#f1f5f9',
      }}
    >
      <Header />
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
