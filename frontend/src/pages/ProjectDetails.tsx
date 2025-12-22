import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import { motion } from 'framer-motion'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [executions, setExecutions] = useState<any[]>([])

  useEffect(() => {
    loadProjectDetails()
  }, [id])

  const loadProjectDetails = async () => {
    if (!id) return
    try {
      setLoading(true)
      const data = await apiClient.getProject(id)
      setProject(data)
      // TODO: Load executions history
    } catch (error) {
      console.error('Error loading project:', error)
      toast.error('Failed to load project')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const statusColors: Record<string, any> = {
    draft: { color: '#64748b', bg: 'rgba(100, 116, 139, 0.2)', icon: AccessTimeIcon },
    in_progress: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.2)', icon: CircularProgress },
    completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.2)', icon: CheckCircleIcon },
    failed: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)', icon: ErrorIcon },
  }

  const statusConfig = statusColors[project?.status] || statusColors.draft

  if (loading || !project) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ color: 'text.secondary' }}
          >
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {project.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {project.description}
            </Typography>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3}>
        {/* Project Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ width: '100%' }}
        >
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Project Status
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Chip
                      label={project.status.toUpperCase()}
                      sx={{
                        backgroundColor: statusConfig.bg,
                        color: statusConfig.color,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Last updated {new Date(project.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.status === 'completed' ? 100 : project.status === 'in_progress' ? 60 : 20}
                    sx={{
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: 'rgba(100, 116, 139, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: statusConfig.color,
                      },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Created
                    </Typography>
                    <Typography variant="body2">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                      Last Modified
                    </Typography>
                    <Typography variant="body2">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/project/${id}/workflow`)}
                  sx={{ color: 'primary.main' }}
                >
                  Edit Workflow
                </Button>
                <Button
                  startIcon={<PlayArrowIcon />}
                  onClick={() => {
                    apiClient.executeWorkflow(id!)
                    toast.success('Workflow execution started')
                  }}
                  sx={{ color: 'success.main' }}
                >
                  Execute
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </motion.div>

        {/* Workflow Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          style={{ width: '100%' }}
        >
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                backgroundColor: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(100, 116, 139, 0.2)',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Workflow
                </Typography>

                <List sx={{ mb: 2 }}>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {project.workflow?.nodes?.length || 0}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary="Agents" secondary={project.workflow?.nodes?.length || 0} />
                  </ListItem>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        {project.workflow?.edges?.length || 0}
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary="Connections" secondary={project.workflow?.edges?.length || 0} />
                  </ListItem>
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  Agents Used
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {project.workflow?.nodes?.map((node: any) => (
                    <Chip
                      key={node.id}
                      label={node.data.label}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: 'rgba(99, 102, 241, 0.5)',
                        color: 'primary.light',
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </motion.div>

        {/* Execution History */}
        {executions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            style={{ width: '100%' }}
          >
            <Grid item xs={12}>
              <Card
                sx={{
                  backgroundColor: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    Execution History
                  </Typography>

                  <List>
                    {executions.map((execution, idx) => (
                      <ListItem key={execution.id} divider={idx < executions.length - 1}>
                        <ListItemIcon>
                          {execution.status === 'completed' ? (
                            <CheckCircleIcon sx={{ color: 'success.main' }} />
                          ) : execution.status === 'failed' ? (
                            <ErrorIcon sx={{ color: 'error.main' }} />
                          ) : (
                            <AccessTimeIcon sx={{ color: 'warning.main' }} />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={execution.name}
                          secondary={new Date(execution.createdAt).toLocaleDateString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </motion.div>
        )}
      </Grid>
    </Box>
  )
}

export default ProjectDetails
