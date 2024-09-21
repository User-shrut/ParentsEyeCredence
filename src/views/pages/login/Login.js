import React, { useState } from 'react'
import { Link, useNavigate, useNavigation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import axios from 'axios';
import loginImg from '../../../assets/loginImg.png'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleUserInput = (e) => {
    setUsername(e.target.value)
  }
  const handlePasswordInput = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    console.log(username)
    console.log(password)

    e.preventDefault()

    try {
      const res = await axios.post(`${process.env.VITE_APP_API}/api/auth/login`, {
        username,
        password,
      })

      const token = res.data.token
      localStorage.setItem('authToken', token)
      alert('login successfull')
      navigate('/dashboard')
    } catch (error) {
      alert('Invalid credentials')
      navigate('/dashboard')
    }
  }
  return (
    <>
      <div className="loginContainer">
        <div className="row" style={{ height: '98vh', width: '100%' }}>
          <div className="col-12 col-md-6">
            <img src={loginImg} alt="" height='100%' width="100%" />
          </div>
          <div className="col-12 col-md-6 d-flex justify-content-center align-items-center">
            <form className='w-50 border border-2 p-5 rounded-3'>
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
                  />
                </div>
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">
                  Check me out
                </label>
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
