import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import '../styles/pages/LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await loginUser({ email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-left-panel">
        <div className="login-brand">
          <div className="login-brand-icon">✈</div>
          <span className="login-brand-name">Wandr</span>
        </div>
        <div>
          <h1 className="login-left-title">Plan group trips<br />without the chaos</h1>
          <p className="login-left-sub">Invite friends, vote on activities, split expenses — all powered by AI.</p>
          <ul className="login-feature-list">
            <li className="login-feature-item">✦ AI-generated itineraries</li>
            <li className="login-feature-item">✦ Real-time group collaboration</li>
            <li className="login-feature-item">✦ Automatic expense splitting</li>
            <li className="login-feature-item">✦ Interactive trip maps</li>
          </ul>
        </div>
        <p className="login-left-footer">© 2025 Wandr. All rights reserved.</p>
      </div>

      <div className="login-right-panel">
        <div className="login-form-box">
          <h2 className="login-title">Welcome back</h2>
          <p className="login-subtitle">Sign in to continue planning your trips</p>

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-label">EMAIL ADDRESS</label>
              <input
                className="login-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="login-field">
              <label className="login-label">PASSWORD</label>
              <input
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <p className="login-forgot">Forgot password?</p>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="login-divider">
            <div className="login-divider-line"></div>
            <span className="login-divider-text">or continue with</span>
            <div className="login-divider-line"></div>
          </div>

          <button className="login-btn-google">G &nbsp; Google</button>

          <p className="login-switch-text">
            Don't have an account?{' '}
            <span className="login-link" onClick={() => navigate('/signup')}>Create one</span>
          </p>
        </div>
      </div>

    </div>
  )
}

export default LoginPage