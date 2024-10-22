import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie'
import './login.css'
import Logo from '../../../assets/brand/logo.png'
import toast, { Toaster } from 'react-hot-toast'

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
          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div className="card border-0 ">
              <div className="card-body d-flex flex-column  h-100">
                <div className="text-center mt-5 mb-3">
                  <img src="CR-LOGO.png" alt="Logo" width="200px" className="loginLogo" />
                  <h2 className="slogan mt-3">Navigating Towards a Secured Future.</h2>
                </div>
                <h2 className="card-title mb-0">Welcome back</h2>
                <p className="text-light-emphasis mt-0">Please enter your details</p>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Enter Username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Enter your password"
                      value={credentials.password}
                      onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      onc
                      className="form-check-input"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember for 30 days
                    </label>
                  </div>
                  <button
                    type="submit"
                    className="btn w-100 text-white fw-bold mb-3"
                    style={{ background: 'orange' }}
                  >
                    Log In
                  </button>
                </form>
              </div>
            </div>

            {/* <form className=" border border-2 p-5 rounded-3 text-dark" onSubmit={handleLogin}>
              <h1 className='text-dark'>Login</h1>
              <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Username
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    👤
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Password
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text" id="basic-addon1">
                    🔑
                  </span>
                  <input
                    type="Password"
                    className="form-control"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form> */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
