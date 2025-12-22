import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  TextField,
  CircularProgress,
  Chip,
  Typography,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { motion, AnimatePresence } from 'framer-motion'
import { useProjectStore } from '../store'
import { apiClient } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { projects, setProjects, deleteProject } = useProjectStore()
  const [openDialog, setOpenDialog] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsInitialLoading(true)
      const data = await apiClient.getProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
      toast.error('Failed to load projects')
    } finally {
      setIsInitialLoading(false)
    }
  }

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      setLoading(true)
      const newProject = await apiClient.createProject({
        name: newProjectName,
        description: newProjectDesc,
      })

      const projects = await apiClient.getProjects()
      setProjects(projects)

      toast.success('Project created successfully!')
      setOpenDialog(false)
      setNewProjectName('')
      setNewProjectDesc('')
    } catch (error) {
      console.error('Error creating project:', error)
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProject = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await apiClient.deleteProject(id)
        deleteProject(id)
        toast.success('Project deleted')
      } catch (error) {
        console.error('Error deleting project:', error)
        toast.error('Failed to delete project')
      }
    }
  }

  const statusColors: Record<string, any> = {
    draft: { color: '#64748b', label: 'Draft' },
    in_progress: { color: '#f59e0b', label: 'In Progress' },
    completed: { color: '#10b981', label: 'Completed' },
    failed: { color: '#ef4444', label: 'Failed' },
  }

  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            Projects
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Create and manage AI-powered project workflows
          </Typography>
        </Box>
      </motion.div>

      {/* Create Project Button */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          sx={{
            mb: 3,
            px: 3,
            py: 1.2,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          New Project
        </Button>
      </motion.div>

      {/* Projects Grid */}
      {isInitialLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
          <CircularProgress />
        </Box>
      ) : projects.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              backgroundColor: 'rgba(51, 65, 85, 0.3)',
              border: '1px dashed rgba(100, 116, 139, 0.3)',
              borderRadius: '12px',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
              No projects yet
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Create your first project to get started with Flynt Studio
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                style={{ width: '100%', maxWidth: 'calc(25% - 18px)' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(100, 116, 139, 0.2)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      border: '1px solid rgba(99, 102, 241, 0.5)',
                      backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    },
                  }}
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, maxWidth: '75%' }}>
                        {project.name}
                      </Typography>
                      <Chip
                        label={statusColors[project.status]?.label || project.status}
                        size="small"
                        sx={{
                          backgroundColor: `${statusColors[project.status]?.color}30`,
                          color: statusColors[project.status]?.color,
                          height: '20px',
                          fontSize: '0.7rem',
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {project.description}
                    </Typography>

                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/project/${project.id}/workflow`)
                      }}
                      sx={{ color: 'primary.main' }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteProject(project.id, project.name)
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </Grid>
      )}

      {/* Create Project Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#1e293b',
            border: '1px solid rgba(100, 116, 139, 0.3)',
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Create New Project
          </Typography>

          <TextField
            fullWidth
            label="Project Name"
            placeholder="e.g., RAG Chatbot"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            disabled={loading}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            placeholder="What is your project about?"
            value={newProjectDesc}
            onChange={(e) => setNewProjectDesc(e.target.value)}
            disabled={loading}
            multiline
            rows={3}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenDialog(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateProject}
              disabled={loading || !newProjectName.trim()}
            >
              {loading ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

export default Dashboard
