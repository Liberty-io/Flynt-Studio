import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WorkflowBuilder from './pages/WorkflowBuilder'
import ProjectDetails from './pages/ProjectDetails'
import AgentActivityView from './pages/AgentActivityView'
import HITLControlView from './pages/HITLControlView'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { ToastProvider } from './services/toast'
import { agentService } from './services/agentService'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '12px',
        },
      },
    },
  },
})

function App() {
  useEffect(() => {
    // Start mock agent events for local dev (no backend required)
    agentService.startMock(3000) // emit every 3s
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/project/:id/workflow" element={<WorkflowBuilder />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                <Route path="/agents" element={<AgentActivityView />} />
                <Route path="/hitl" element={<HITLControlView />} />
              </Routes>
            </Layout>
          </Router>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
            }}
          />
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default App
