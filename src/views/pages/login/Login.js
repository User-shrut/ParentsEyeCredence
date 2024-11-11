import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import './login.css'
import Logo from '../../../assets/brand/logo.png'
import toast, { Toaster } from 'react-hot-toast'
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Ensure username and password are provided before sending the request
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter both username and password')
      return
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`

      const response = await axios.post(apiUrl, credentials)

      // Assuming the token is returned in response.data.token
      const { token } = response.data

      // Store the token and navigate on success
      if (token) {
        // Store the JWT token in a cookie
        Cookies.set('crdntl', JSON.stringify(credentials));
        const cookieOptions = {
          secure: false, // Only allow cookies over HTTPS , so turn true
          // sameSite: 'Strict', // Strictly same-site cookie
        }

        if (rememberMe) {
          cookieOptions.expires = 30 // Expires in 30 days
        }

        Cookies.set('authToken', token, cookieOptions)
        navigate('/dashboard')

      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Invalid credentials')
    }
  }
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="loginContainer bg-white">
        <div className="row" style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
          <div className="d-none d-lg-block col-md-6 p-0">
            <div className="video-container">
              <video autoPlay muted loop className="w-100 overflow-hidden">
                <source src="login-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>


          <div className="pt-4 col-12 col-md-6 d-flex justify-content-center position-relative">
            <div
              className="card border-2 shadow-lg"
              style={{
                maxWidth: '500px',
                borderRadius: '15px',
                maxHeight: '93vh',
                backgroundColor: '#f7f6e7',
                width: '100%',  // Ensures the card doesn't overflow on smaller screens
              }}
            >
              <div className="card-body d-flex flex-column h-100 p-4">
                <div className="text-center mt-3 mb-4">
                  <img
                    src="CR-LOGO.png"
                    alt="Logo"
                    width="150px"
                    className="loginLogo"
                  />
                  <h2 className="slogan mt-3 text-muted">
                   <strong>Navigating Towards a Secured Future</strong> 
                  </h2>
                </div>
                <h2 className="card-title text-center mb-3" style={{ fontWeight: 'bold', color: '#333' }}>
                  Welcome Back
                </h2>
                <p className="text-center text-secondary">
                  <strong>Please enter your details</strong>
                </p>
                <form onSubmit={handleLogin}>

                  <div className="mb-4">
                    <label htmlFor="username" className="form-label text-black username-label">
                      <strong><b>UserName</b></strong>
                    </label>
                    <div className="input-group" style={{ borderRadius: '10px', border: '1px solid orange' }}>
                      <span className="input-group-text" id="basic-addon1"><FaUserAlt/></span>
                      <input
                        type="text"
                        className="form-control form-control-lg username-input"
                        id="username"
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required

                      />
                    </div>
                  </div>


                  <div className="mb-4">
                    <label htmlFor="password" className="form-label text-black password-label">
                      <strong><b>Password</b></strong>
                    </label>
                    <div className="input-group" style={{ borderRadius: '10px', border: '1px solid orange' }}>
                      <span className="input-group-text" id="basic-addon1"><RiLockPasswordFill /></span>
                      <input
                        type="password"
                        className="form-control form-control-lg password-input"
                        id="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4 form-check d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="form-check-input remember-checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label ms-2 remember-label" htmlFor="remember" style={{ fontSize: '0.9rem' }}>
                      Remember for 30 days
                    </label>
                  </div>


                  <button
                    type="submit"
                    className="btn btn-lg w-100 fw-bold hover-button"
                  >
                    Log In
                  </button>

                </form>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  )
}

export default Login
