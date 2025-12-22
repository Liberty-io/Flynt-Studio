import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
  Typography,
  Divider,
  Chip,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import { motion, AnimatePresence } from 'framer-motion'
import { useCopilotStore } from '../store'
import { apiClient } from '../services/api'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CopilotPanelProps {
  projectId: string
}

const CopilotPanel: React.FC<CopilotPanelProps> = ({ projectId }) => {
  const { messages, addMessage, updateLastMessage, setLoading, isLoading } = useCopilotStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText: string = input) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content: messageText,
      timestamp: new Date(),
    }

    addMessage(userMessage)
    setInput('')
    setLoading(true)

    // Add assistant placeholder
    const assistantMessage = {
      id: `msg-${Date.now() + 1}`,
      role: 'assistant' as const,
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    addMessage(assistantMessage)

    try {
      const response = await apiClient.sendCopilotMessage(projectId, messageText)

      updateLastMessage(response.response)

      // Get suggestions for next actions
      const newSuggestions = response.suggestions || []
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error sending message:', error)
      updateLastMessage('Sorry, I encountered an error processing your request.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Paper
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(100, 116, 139, 0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(100, 116, 139, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SmartToyIcon sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Flynt Co-pilot
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
            Chat with AI to design and execute workflows
          </Typography>
        </Box>

        {/* Messages Area */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(100, 116, 139, 0.3)',
              borderRadius: '3px',
            },
          }}
        >
          <AnimatePresence>
            {messages.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 2,
                  color: 'text.secondary',
                }}
              >
                <SmartToyIcon sx={{ fontSize: '48px', opacity: 0.5 }} />
                <Typography align="center">
                  Start a conversation to design your workflow or ask for AI assistance
                </Typography>
              </Box>
            ) : (
              messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: 'primary.main',
                          flexShrink: 0,
                        }}
                      >
                        <SmartToyIcon sx={{ fontSize: '18px' }} />
                      </Avatar>
                    )}

                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        maxWidth: '80%',
                        backgroundColor:
                          message.role === 'user'
                            ? 'primary.main'
                            : 'rgba(100, 116, 139, 0.2)',
                        borderRadius: '12px',
                      }}
                    >
                      {message.role === 'assistant' ? (
                        <Box sx={{ fontSize: '0.9rem', lineHeight: 1.5 }}>
                          <ReactMarkdown
                            components={{
                              code: ({ node, inline, className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={atomDark}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                )
                              },
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                          {message.isStreaming && (
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  animate={{ opacity: [0.4, 1, 0.4] }}
                                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                  style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: 'currentColor',
                                  }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Typography sx={{ color: 'text.primary' }}>{message.content}</Typography>
                      )}
                    </Paper>

                    {message.role === 'user' && (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: 'secondary.main',
                          flexShrink: 0,
                        }}
                      >
                        <PersonIcon sx={{ fontSize: '18px' }} />
                      </Avatar>
                    )}
                  </Box>
                </motion.div>
              ))
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Box>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid rgba(100, 116, 139, 0.2)' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', mb: 1, display: 'block' }}>
              Suggestions:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {suggestions.map((suggestion, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                  <Chip
                    label={suggestion}
                    size="small"
                    onClick={() => handleSendMessage(suggestion)}
                    sx={{
                      backgroundColor: 'rgba(99, 102, 241, 0.2)',
                      color: 'primary.light',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.3)',
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        )}

        {/* Input Area */}
        <Divider />
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask me anything about your workflow..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            multiline
            maxRows={3}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(51, 65, 85, 0.5)',
                '& fieldset': {
                  borderColor: 'rgba(100, 116, 139, 0.3)',
                },
              },
            }}
          />
          <IconButton
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            sx={{
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </IconButton>
        </Box>
      </Paper>
    </motion.div>
  )
}

export default CopilotPanel
