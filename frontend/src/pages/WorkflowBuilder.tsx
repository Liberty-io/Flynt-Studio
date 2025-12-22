import React, { useState, useEffect } from 'react'
import { Box, Paper, CircularProgress, Drawer, Button, Typography, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import WorkflowCanvas from '../components/WorkflowCanvas'
import CopilotPanel from '../components/CopilotPanel'
import { useProjectStore, useWorkflowStore } from '../store'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CodeIcon from '@mui/icons-material/Code'
import StorageIcon from '@mui/icons-material/Storage'
import SecurityIcon from '@mui/icons-material/Security'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import BuildIcon from '@mui/icons-material/Build'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Node, Edge } from 'reactflow'

const WorkflowBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [copilotOpen, setCopilotOpen] = useState(true)
  const [availableAgents, setAvailableAgents] = useState<any[]>([])
  const { setNodes, setEdges } = useWorkflowStore()

  const agents = [
    { id: 'idea', label: 'Idea Agent', icon: SmartToyIcon, color: '#8b5cf6' },
    { id: 'coder', label: 'Coder Agent', icon: CodeIcon, color: '#6366f1' },
    { id: 'data_science', label: 'Data Science', icon: StorageIcon, color: '#10b981' },
    { id: 'security', label: 'Security Agent', icon: SecurityIcon, color: '#ef4444' },
    { id: 'mlops', label: 'MLOps Agent', icon: BuildIcon, color: '#06b6d4' },
    { id: 'validator', label: 'Validator', icon: AnalyticsIcon, color: '#f59e0b' },
  ]

  useEffect(() => {
    loadProject()
  }, [id])

  const loadProject = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await apiClient.getProject(id)
      setProject(data)

      if (data.workflow?.nodes && data.workflow?.edges) {
        setNodes(data.workflow.nodes)
        setEdges(data.workflow.edges)
      }

      const agentsData = await apiClient.getAvailableAgents()
      setAvailableAgents(agentsData)
    } catch (error) {
      console.error('Error loading project:', error)
      toast.error('Failed to load project')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveWorkflow = async (nodes: Node[], edges: Edge[]) => {
    if (!id) return

    try {
      await apiClient.saveWorkflow(id, { nodes, edges })
      toast.success('Workflow saved!')
    } catch (error) {
      console.error('Error saving workflow:', error)
      toast.error('Failed to save workflow')
    }
  }

  const handleExecuteWorkflow = async () => {
    if (!id) return

    try {
      await apiClient.executeWorkflow(id)
      toast.success('Workflow execution started!')
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Failed to execute workflow')
    }
  }

  const handleDragStart = (event: React.DragEvent, agent: any) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('agent', JSON.stringify(agent))
  }

  if (loading || !project) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 1, p: 2, backgroundColor: '#0f172a' }}>
      {/* Agent Sidebar */}
      {drawerOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%' }}
        >
          <Paper
            elevation={0}
            sx={{
              width: '240px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(100, 116, 139, 0.2)',
              borderRadius: '12px',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(100, 116, 139, 0.2)' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {project.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Drag agents to canvas
              </Typography>
            </Box>

            <List sx={{ flex: 1, overflowY: 'auto', px: 1, py: 1 }}>
              {agents.map((agent) => (
                <motion.div key={agent.id} whileHover={{ scale: 1.02 }}>
                  <Paper
                    draggable
                    onDragStart={(e) => handleDragStart(e, agent)}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      backgroundColor: `${agent.color}15`,
                      border: `1px solid ${agent.color}40`,
                      borderRadius: '8px',
                      cursor: 'grab',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: `${agent.color}25`,
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <agent.icon sx={{ fontSize: '18px', color: agent.color }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {agent.label}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </List>

            <Divider />

            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={handleExecuteWorkflow}
                fullWidth
                sx={{
                  backgroundColor: 'success.main',
                  '&:hover': { backgroundColor: 'success.dark' },
                }}
              >
                Execute
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/')}
                fullWidth
              >
                Back
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {/* Workflow Canvas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ flex: 1, height: '100%' }}
      >
        <Paper
          elevation={0}
          sx={{
            height: '100%',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid rgba(100, 116, 139, 0.2)',
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
          }}
        >
          <WorkflowCanvas
            onSave={handleSaveWorkflow}
            onExecute={handleExecuteWorkflow}
          />
        </Paper>
      </motion.div>

      {/* Co-pilot Panel */}
      {copilotOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ height: '100%', width: '320px' }}
        >
          <CopilotPanel projectId={id!} />
        </motion.div>
      )}
    </Box>
  )
}

export default WorkflowBuilder
