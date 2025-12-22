import React from 'react'
import { Box, AppBar, Toolbar, Typography, Button, Avatar, Menu, MenuItem } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    // TODO: Implement logout
    navigate('/')
  }

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(100, 116, 139, 0.2)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <FlightTakeoffIcon sx={{ fontSize: '28px', color: 'primary.main' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              FLYNT
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
              Studio
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/')}>
            Projects
          </Button>
          <Button color="inherit">Docs</Button>
          <Button color="inherit">Settings</Button>

          <Avatar
            onClick={handleMenuOpen}
            sx={{
              cursor: 'pointer',
              backgroundColor: 'primary.main',
              width: 36,
              height: 36,
              fontSize: '0.9rem',
            }}
          >
            U
          </Avatar>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
