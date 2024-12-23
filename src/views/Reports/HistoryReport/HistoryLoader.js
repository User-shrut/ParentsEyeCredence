import React from 'react'
import { CSpinner } from '@coreui/react'

const HistoryLoader = () => {
  const loaderContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }

  const loaderOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
    backdropFilter: 'blur(5px)', // Apply blur effect
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  }

  return (
    <div style={loaderContainerStyle}>
      <div style={loaderOverlayStyle}>
        <CSpinner color="primary" />
      </div>
    </div>
  )
}

export default HistoryLoader
