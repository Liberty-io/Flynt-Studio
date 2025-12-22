import React from 'react'

export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  label?: string
  fullScreen?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  label = 'Loading...',
  fullScreen = false,
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 60,
  }

  const spinnerSize = sizeMap[size]

  const containerStyle: React.CSSProperties = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '12px',
      }

  return (
    <div style={containerStyle} role="status" aria-live="polite" aria-label={label}>
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: '3px solid #f0f0f0',
          borderTop: '3px solid #2196F3',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      {label && <div style={{ fontSize: '14px', color: '#666' }}>{label}</div>}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
