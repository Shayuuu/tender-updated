import { useState } from 'react'
import './Login.css'

function Login() {
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    console.log('Login attempted with:', { loginId, password })
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    console.log('Register attempted with:', registerData)
    setIsModalOpen(false)
  }

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="login-homepage">
      <div className="login-content">
        <h1 className="login-title">Tender System</h1>
        <div className="login-card">
          <h2 className="login-subtitle">Login</h2>
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="loginId">Login ID</label>
              <input
                type="text"
                id="loginId"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter your Login ID"
                className="form-input"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
              />
            </div>
            <button type="submit" className="form-action-btn">
              Login
            </button>
          </form>
          <div className="register-link">
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsModalOpen(true)} className="register-link-btn">
                Register
              </button>
            </p>
          </div>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="modal-close-btn" onClick={closeModal}>×</button>
              <h2 className="modal-title">Register</h2>
              <form onSubmit={handleRegisterSubmit} className="modal-form">
                <div className="modal-row">
                  <div className="modal-field">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={registerData.username}
                      onChange={handleRegisterChange}
                      placeholder="Enter your username"
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-field">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="Enter your email"
                      className="modal-input"
                      required
                    />
                  </div>
                </div>
                <div className="modal-row">
                  <div className="modal-field">
                    <label htmlFor="reg-password">Password</label>
                    <input
                      type="password"
                      id="reg-password"
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Enter your password"
                      className="modal-input"
                      required
                    />
                  </div>
                  <div className="modal-field">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirm your password"
                      className="modal-input"
                      required
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="modal-action-btn">
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login