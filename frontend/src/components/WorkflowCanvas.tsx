import React, { useCallback, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  Panel,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Box, Paper, Tooltip, IconButton, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import AgentNode from './nodes/AgentNode'
import InputNode from './nodes/InputNode'
import OutputNode from './nodes/OutputNode'
import ValidatorNode from './nodes/ValidatorNode'
import SaveIcon from '@mui/icons-material/Save'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DeleteIcon from '@mui/icons-material/Delete'

interface WorkflowCanvasProps {
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onExecute?: () => void
  initialNodes?: Node[]
  initialEdges?: Edge[]
}

const nodeTypes: NodeTypes = {
  agent: AgentNode,
  input: InputNode,
  output: OutputNode,
  validator: ValidatorNode,
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  onSave,
  onExecute,
  initialNodes = [],
  initialEdges = [],
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds))
    },
    [setEdges],
  )

  const handleNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node)
  }, [])

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id))
      setEdges((eds) =>
        eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id),
      )
      setSelectedNode(null)
    }
  }

  const handleSave = () => {
    onSave?.(nodes, edges)
  }

  const handleExecute = () => {
    onExecute?.()
  }

  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        {/* Toolbar */}
        <Panel position="top-right">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Paper
              elevation={2}
              sx={{
                display: 'flex',
                gap: 1,
                p: 1.5,
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(100, 116, 139, 0.2)',
              }}
            >
              <Tooltip title="Save Workflow">
                <IconButton
                  size="small"
                  onClick={handleSave}
                  sx={{
                    color: 'primary.main',
                    '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.2)' },
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Execute Workflow">
                <IconButton
                  size="small"
                  onClick={handleExecute}
                  sx={{
                    color: 'success.main',
                    '&:hover': { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                  }}
                >
                  <PlayArrowIcon />
                </IconButton>
              </Tooltip>

              {selectedNode && (
                <Tooltip title="Delete Selected Node">
                  <IconButton
                    size="small"
                    onClick={handleDeleteNode}
                    sx={{
                      color: 'error.main',
                      '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Paper>
          </motion.div>
        </Panel>

        {/* Node Inspector */}
        {selectedNode && (
          <Panel position="top-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  minWidth: '250px',
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(100, 116, 139, 0.2)',
                }}
              >
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  {selectedNode.data.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  ID: {selectedNode.id}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 1 }}>
                  Type: {selectedNode.type}
                </Typography>
                {selectedNode.data.agentType && (
                  <Typography variant="caption" sx={{ color: 'primary.light', display: 'block', mt: 1 }}>
                    Agent: {selectedNode.data.agentType}
                  </Typography>
                )}
              </Paper>
            </motion.div>
          </Panel>
        )}
      </ReactFlow>
    </Box>
  )
}

export default WorkflowCanvas
