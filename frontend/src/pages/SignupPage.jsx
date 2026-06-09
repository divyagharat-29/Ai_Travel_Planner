import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../services/authService'
import '../styles/pages/SignupPage.css'

function SignupPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const data = await registerUser({ firstName, lastName, email, password })
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
    <div className="signup-page">

      <div className="signup-left-panel">
        <div className="signup-brand">
          <div className="signup-brand-icon">✈</div>
          <span className="signup-brand-name">Wandr</span>
        </div>
        <div>
          <h1 className="signup-left-title">Plan group trips<br />without the chaos</h1>
          <p className="signup-left-sub">Invite friends, vote on activities, split expenses — all powered by AI.</p>
          <ul className="signup-feature-list">
            <li className="signup-feature-item">✦ AI-generated itineraries</li>
            <li className="signup-feature-item">✦ Real-time group collaboration</li>
            <li className="signup-feature-item">✦ Automatic expense splitting</li>
            <li className="signup-feature-item">✦ Interactive trip maps</li>
          </ul>
        </div>
        <p className="signup-left-footer">© 2025 Wandr. All rights reserved.</p>
      </div>

      <div className="signup-right-panel">
        <div className="signup-form-box">
          <h2 className="signup-title">Create your account</h2>
          <p className="signup-subtitle">Start planning your first group trip today</p>

          <form onSubmit={handleSignup}>
            <div className="signup-name-row">
              <div className="signup-field">
                <label className="signup-label">FIRST NAME</label>
                <input
                  className="signup-input"
                  type="text"
                  placeholder="Divya"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="signup-field">
                <label className="signup-label">LAST NAME</label>
                <input
                  className="signup-input"
                  type="text"
                  placeholder="Shah"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="signup-field">
              <label className="signup-label">EMAIL ADDRESS</label>
              <input
                className="signup-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="signup-field">
              <label className="signup-label">PASSWORD</label>
              <input
                className="signup-input"
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="signup-field">
              <label className="signup-label">CONFIRM PASSWORD</label>
              <input
                className="signup-input"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" className="signup-btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="signup-divider">
            <div className="signup-divider-line"></div>
            <span className="signup-divider-text">or continue with</span>
            <div className="signup-divider-line"></div>
          </div>

          <button className="signup-btn-google">G &nbsp; Google</button>

          <p className="signup-switch-text">
            Already have an account?{' '}
            <span className="signup-link" onClick={() => navigate('/')}>Sign in</span>
          </p>
        </div>
      </div>

    </div>
  )
}

export default SignupPage