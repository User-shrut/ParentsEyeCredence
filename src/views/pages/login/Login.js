import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'
import axios from 'axios'
import loginImg from '../../../assets/loginImg.png'
import Cookies from 'js-cookie';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    // Ensure username and password are provided before sending the request
    if (!credentials.username || !credentials.password) {
      alert('Please enter both username and password')
      return
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/auth/login`

      const response = await axios.post(apiUrl, credentials);

      // Assuming the token is returned in response.data.token
      const { token } = response.data

      // Store the token and navigate on success
      if (token) {
        // Store the JWT token in a cookie
        Cookies.set('authToken',token, {
          secure: true, // Only allow cookies over HTTPS
          sameSite: 'Strict', // Strictly same-site cookie
        })
        navigate('/dashboard')
        alert('successfully logged in')
      } else {
        alert(response.data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Invalid credentials')
    }
  }
  return (
    <>
      <div className="loginContainer">
        <div className="row" style={{ height: '98vh', width: '100%' }}>
          <div className="col-12 col-md-6">
            <img src={loginImg} alt="" height="100%" width="100%" />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            <form className="w-50 border border-2 p-5 rounded-3" onSubmit={handleLogin}>
              <h1>Login</h1>
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
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
