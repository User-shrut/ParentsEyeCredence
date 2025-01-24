import React from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

const Maintenance = () => {
  const token = Cookies.get('authToken')

  const handleRedirectToMaintenance = () => {
    try {
      if (!token) {
        throw new Error('No authentication token found. Please log in.')
      }

      // Decode the token to check expiration or required claims
      const decodedToken = jwtDecode(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        throw new Error('Token expired. Please log in again.')
      }

      // Redirect with token (consider encrypting it for added security)
      window.location.href = `http://localhost:3001?token=${encodeURIComponent(token)}`
    } catch (error) {
      console.error('Redirect error:', error)
      alert(error.message || 'Failed to access Maintenance Portal.')
    }
  }

  return (
    <div className="maintenance">
      <h1>Under Maintenance</h1>
      <p>Sorry, our website is currently undergoing maintenance. Please check back later.</p>
      <button className="btn btn-primary" onClick={handleRedirectToMaintenance}>
        Go To Maintenance
      </button>
    </div>
  )
}

export default Maintenance
